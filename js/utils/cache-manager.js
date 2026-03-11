/**
 * 数学修仙传 - 缓存管理模块
 * 提供统一的数据缓存机制，优化性能
 */

import { GAME_CONFIG } from '../config.js';

class CacheManager {
    constructor() {
        this.caches = new Map();
        this.defaultTTL = 5 * 60 * 1000;
        this.maxSize = 100;
    }

    createCache(name, options = {}) {
        const cache = {
            data: new Map(),
            ttl: options.ttl || this.defaultTTL,
            maxSize: options.maxSize || this.maxSize,
            accessOrder: [],
            hits: 0,
            misses: 0
        };
        this.caches.set(name, cache);
        return cache;
    }

    get(cacheName, key) {
        const cache = this.caches.get(cacheName);
        if (!cache) return null;

        const entry = cache.data.get(key);
        if (!entry) {
            cache.misses++;
            return null;
        }

        if (Date.now() - entry.timestamp > cache.ttl) {
            cache.data.delete(key);
            cache.accessOrder = cache.accessOrder.filter(k => k !== key);
            cache.misses++;
            return null;
        }

        cache.hits++;
        cache.accessOrder = cache.accessOrder.filter(k => k !== key);
        cache.accessOrder.push(key);
        
        return entry.value;
    }

    set(cacheName, key, value, customTTL) {
        let cache = this.caches.get(cacheName);
        if (!cache) {
            cache = this.createCache(cacheName);
        }

        if (cache.data.size >= cache.maxSize && !cache.data.has(key)) {
            const oldestKey = cache.accessOrder.shift();
            if (oldestKey) {
                cache.data.delete(oldestKey);
            }
        }

        cache.data.set(key, {
            value,
            timestamp: Date.now(),
            ttl: customTTL || cache.ttl
        });
        cache.accessOrder.push(key);
    }

    has(cacheName, key) {
        return this.get(cacheName, key) !== null;
    }

    delete(cacheName, key) {
        const cache = this.caches.get(cacheName);
        if (!cache) return false;

        cache.data.delete(key);
        cache.accessOrder = cache.accessOrder.filter(k => k !== key);
        return true;
    }

    clear(cacheName) {
        const cache = this.caches.get(cacheName);
        if (!cache) return;

        cache.data.clear();
        cache.accessOrder = [];
        cache.hits = 0;
        cache.misses = 0;
    }

    clearAll() {
        this.caches.forEach(cache => {
            cache.data.clear();
            cache.accessOrder = [];
        });
    }

    getStats(cacheName) {
        const cache = this.caches.get(cacheName);
        if (!cache) return null;

        const total = cache.hits + cache.misses;
        return {
            size: cache.data.size,
            maxSize: cache.maxSize,
            hits: cache.hits,
            misses: cache.misses,
            hitRate: total > 0 ? (cache.hits / total * 100).toFixed(2) + '%' : '0%'
        };
    }

    getAllStats() {
        const stats = {};
        this.caches.forEach((_, name) => {
            stats[name] = this.getStats(name);
        });
        return stats;
    }
}

const cacheManager = new CacheManager();

cacheManager.createCache('quizBank', { ttl: 10 * 60 * 1000, maxSize: 50 });
cacheManager.createCache('recommendations', { ttl: 5 * 60 * 1000, maxSize: 20 });
cacheManager.createCache('accuracy', { ttl: 2 * 60 * 1000, maxSize: 30 });
cacheManager.createCache('rendered', { ttl: 1 * 60 * 1000, maxSize: 100 });

function cachedFunction(cacheName, keyGenerator, fn) {
    return function(...args) {
        const key = typeof keyGenerator === 'function' ? keyGenerator(...args) : keyGenerator;
        
        const cached = cacheManager.get(cacheName, key);
        if (cached !== null) {
            return cached;
        }
        
        const result = fn.apply(this, args);
        
        if (result instanceof Promise) {
            return result.then(value => {
                cacheManager.set(cacheName, key, value);
                return value;
            });
        }
        
        cacheManager.set(cacheName, key, result);
        return result;
    };
}

function memoize(fn, options = {}) {
    const cache = new Map();
    const ttl = options.ttl || 5 * 60 * 1000;
    
    return function(...args) {
        const key = JSON.stringify(args);
        const entry = cache.get(key);
        
        if (entry && Date.now() - entry.timestamp < ttl) {
            return entry.value;
        }
        
        const result = fn.apply(this, args);
        cache.set(key, { value: result, timestamp: Date.now() });
        
        if (cache.size > (options.maxSize || 100)) {
            const firstKey = cache.keys().next().value;
            cache.delete(firstKey);
        }
        
        return result;
    };
}

const quizFilterCache = memoize(
    (quizBank, levelId) => quizBank.filter(q => q.level === levelId),
    { ttl: 10 * 60 * 1000, maxSize: 20 }
);

const accuracyCalculator = memoize(
    (history, levelId) => {
        const filtered = history.filter(h => h.levelId === levelId);
        if (filtered.length === 0) return { accuracy: 0, total: 0, correct: 0 };
        const correct = filtered.filter(h => h.isCorrect).length;
        return {
            accuracy: (correct / filtered.length * 100).toFixed(1),
            total: filtered.length,
            correct
        };
    },
    { ttl: 2 * 60 * 1000, maxSize: 30 }
);

const scoreCalculator = memoize(
    (mathematician, userState) => {
        let score = 0;
        if (userState.unlockedLevels?.includes(mathematician.relatedLevel)) score += 30;
        if (userState.achievements?.some(a => a === mathematician.id)) score += 20;
        score += Math.min(50, (userState.totalChallenges || 0) * 0.5);
        return score;
    },
    { ttl: 5 * 60 * 1000, maxSize: 50 }
);

function invalidateCache(cacheName, pattern) {
    const cache = cacheManager.caches.get(cacheName);
    if (!cache) return;

    if (pattern instanceof RegExp) {
        for (const key of cache.data.keys()) {
            if (pattern.test(key)) {
                cache.data.delete(key);
                cache.accessOrder = cache.accessOrder.filter(k => k !== key);
            }
        }
    } else {
        cacheManager.delete(cacheName, pattern);
    }
}

function invalidateAllCaches() {
    cacheManager.clearAll();
}

export {
    CacheManager,
    cacheManager,
    cachedFunction,
    memoize,
    quizFilterCache,
    accuracyCalculator,
    scoreCalculator,
    invalidateCache,
    invalidateAllCaches
};

export default cacheManager;

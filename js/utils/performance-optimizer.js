/**
 * 核心性能优化模块
 * 提供懒加载、虚拟滚动、缓存管理、性能监控等功能
 */

class PerformanceOptimizer {
    constructor() {
        this.observerRegistry = new Map();
        this.cacheStore = new Map();
        this.metrics = {
            fps: 60,
            memoryUsage: 0,
            loadTime: 0,
            interactionLatency: []
        };
        this._initPerformanceObserver();
    }

    _initPerformanceObserver() {
        if (typeof PerformanceObserver !== 'undefined') {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.entryType === 'measure') {
                            this.metrics.interactionLatency.push({
                                name: entry.name,
                                duration: entry.duration,
                                timestamp: entry.startTime
                            });
                        }
                    }
                });
                observer.observe({ entryTypes: ['measure'] });
            } catch (e) {
                console.warn('PerformanceObserver not supported');
            }
        }
    }

    measurePerformance(name, fn) {
        const startMark = `${name}-start`;
        const endMark = `${name}-end`;
        
        performance.mark(startMark);
        const result = fn();
        performance.mark(endMark);
        performance.measure(name, startMark, endMark);
        
        return result;
    }

    async measurePerformanceAsync(name, fn) {
        const startMark = `${name}-start`;
        const endMark = `${name}-end`;
        
        performance.mark(startMark);
        const result = await fn();
        performance.mark(endMark);
        performance.measure(name, startMark, endMark);
        
        return result;
    }

    getMetrics() {
        const metrics = { ...this.metrics };
        
        if (performance.memory) {
            metrics.memoryUsage = {
                usedJSHeapSize: performance.memory.usedJSHeapSize,
                totalJSHeapSize: performance.memory.totalJSHeapSize,
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
            };
        }
        
        metrics.loadTime = performance.timing 
            ? performance.timing.loadEventEnd - performance.timing.navigationStart 
            : 0;
        
        return metrics;
    }

    lazyLoad(selector, options = {}) {
        const {
            rootMargin = '50px',
            threshold = 0.1,
            onIntersect = () => {},
            once = true
        } = options;

        if (!('IntersectionObserver' in window)) {
            document.querySelectorAll(selector).forEach(el => onIntersect(el));
            return null;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    onIntersect(entry.target);
                    if (once) {
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, { rootMargin, threshold });

        document.querySelectorAll(selector).forEach(el => observer.observe(el));
        
        const observerId = `lazy-${Date.now()}`;
        this.observerRegistry.set(observerId, observer);
        
        return observerId;
    }

    destroyObserver(observerId) {
        const observer = this.observerRegistry.get(observerId);
        if (observer) {
            observer.disconnect();
            this.observerRegistry.delete(observerId);
        }
    }

    destroyAllObservers() {
        this.observerRegistry.forEach(observer => observer.disconnect());
        this.observerRegistry.clear();
    }
}

class VirtualScrollManager {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            itemHeight: options.itemHeight || 50,
            bufferSize: options.bufferSize || 5,
            renderItem: options.renderItem || ((item) => document.createElement('div')),
            ...options
        };
        this.items = [];
        this.visibleRange = { start: 0, end: 0 };
        this.scrollTop = 0;
        this._init();
    }

    _init() {
        this.wrapper = document.createElement('div');
        this.wrapper.style.cssText = 'overflow-y: auto; height: 100%;';
        
        this.content = document.createElement('div');
        this.content.style.cssText = 'position: relative;';
        
        this.wrapper.appendChild(this.content);
        this.container.appendChild(this.wrapper);
        
        this.wrapper.addEventListener('scroll', this._handleScroll.bind(this));
        
        if (typeof ResizeObserver !== 'undefined') {
            this.resizeObserver = new ResizeObserver(() => this._update());
            this.resizeObserver.observe(this.wrapper);
        }
    }

    setItems(items) {
        this.items = items;
        this.content.style.height = `${items.length * this.options.itemHeight}px`;
        this._update();
    }

    _handleScroll() {
        this.scrollTop = this.wrapper.scrollTop;
        this._update();
    }

    _update() {
        const containerHeight = this.wrapper.clientHeight;
        const itemHeight = this.options.itemHeight;
        const bufferSize = this.options.bufferSize;
        
        const start = Math.max(0, Math.floor(this.scrollTop / itemHeight) - bufferSize);
        const end = Math.min(
            this.items.length,
            Math.ceil((this.scrollTop + containerHeight) / itemHeight) + bufferSize
        );
        
        if (start !== this.visibleRange.start || end !== this.visibleRange.end) {
            this.visibleRange = { start, end };
            this._render();
        }
    }

    _render() {
        const fragment = document.createDocumentFragment();
        const { start, end } = this.visibleRange;
        
        for (let i = start; i < end; i++) {
            const item = this.items[i];
            if (item) {
                const element = this.options.renderItem(item, i);
                element.style.position = 'absolute';
                element.style.top = `${i * this.options.itemHeight}px`;
                element.style.width = '100%';
                element.style.height = `${this.options.itemHeight}px`;
                fragment.appendChild(element);
            }
        }
        
        this.content.innerHTML = '';
        this.content.appendChild(fragment);
    }

    scrollToIndex(index) {
        this.wrapper.scrollTop = index * this.options.itemHeight;
    }

    destroy() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        this.wrapper.removeEventListener('scroll', this._handleScroll.bind(this));
    }
}

class SmartCache {
    constructor(options = {}) {
        this.maxSize = options.maxSize || 100;
        this.ttl = options.ttl || 5 * 60 * 1000;
        this.cache = new Map();
        this.accessOrder = [];
    }

    set(key, value, customTtl) {
        if (this.cache.size >= this.maxSize) {
            const oldestKey = this.accessOrder.shift();
            if (oldestKey) {
                this.cache.delete(oldestKey);
            }
        }
        
        this.cache.set(key, {
            value,
            timestamp: Date.now(),
            ttl: customTtl || this.ttl
        });
        
        this.accessOrder.push(key);
    }

    get(key) {
        const entry = this.cache.get(key);
        
        if (!entry) return null;
        
        if (Date.now() - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            this.accessOrder = this.accessOrder.filter(k => k !== key);
            return null;
        }
        
        this.accessOrder = this.accessOrder.filter(k => k !== key);
        this.accessOrder.push(key);
        
        return entry.value;
    }

    has(key) {
        return this.get(key) !== null;
    }

    delete(key) {
        this.cache.delete(key);
        this.accessOrder = this.accessOrder.filter(k => k !== key);
    }

    clear() {
        this.cache.clear();
        this.accessOrder = [];
    }

    getStats() {
        let validCount = 0;
        let expiredCount = 0;
        
        this.cache.forEach((entry) => {
            if (Date.now() - entry.timestamp > entry.ttl) {
                expiredCount++;
            } else {
                validCount++;
            }
        });
        
        return {
            total: this.cache.size,
            valid: validCount,
            expired: expiredCount,
            hitRate: this.hitCount / (this.hitCount + this.missCount) || 0
        };
    }
}

class RequestBatcher {
    constructor(options = {}) {
        this.batchWindow = options.batchWindow || 100;
        this.maxBatchSize = options.maxBatchSize || 10;
        this.pendingRequests = new Map();
        this.timeoutId = null;
    }

    add(key, requestFn) {
        return new Promise((resolve, reject) => {
            if (!this.pendingRequests.has(key)) {
                this.pendingRequests.set(key, {
                    requests: [],
                    requestFn
                });
            }
            
            this.pendingRequests.get(key).requests.push({ resolve, reject });
            
            if (this.pendingRequests.get(key).requests.length >= this.maxBatchSize) {
                this._processBatch(key);
            } else {
                this._scheduleBatch();
            }
        });
    }

    _scheduleBatch() {
        if (this.timeoutId) return;
        
        this.timeoutId = setTimeout(() => {
            this._processAllBatches();
            this.timeoutId = null;
        }, this.batchWindow);
    }

    async _processBatch(key) {
        const batch = this.pendingRequests.get(key);
        if (!batch) return;
        
        this.pendingRequests.delete(key);
        
        try {
            const results = await batch.requestFn();
            batch.requests.forEach((req, i) => {
                req.resolve(results[i]);
            });
        } catch (error) {
            batch.requests.forEach(req => {
                req.reject(error);
            });
        }
    }

    _processAllBatches() {
        this.pendingRequests.forEach((_, key) => this._processBatch(key));
    }
}

class ImageOptimizer {
    constructor() {
        this.loadedImages = new Set();
        this.pendingImages = new Map();
    }

    preloadImage(src, options = {}) {
        if (this.loadedImages.has(src)) {
            return Promise.resolve(src);
        }
        
        if (this.pendingImages.has(src)) {
            return this.pendingImages.get(src);
        }
        
        const promise = new Promise((resolve, reject) => {
            const img = new Image();
            
            img.onload = () => {
                this.loadedImages.add(src);
                this.pendingImages.delete(src);
                resolve(src);
            };
            
            img.onerror = () => {
                this.pendingImages.delete(src);
                reject(new Error(`Failed to load image: ${src}`));
            };
            
            if (options.sizes) {
                img.sizes = options.sizes;
            }
            if (options.srcset) {
                img.srcset = options.srcset;
            }
            
            img.src = src;
        });
        
        this.pendingImages.set(src, promise);
        return promise;
    }

    preloadImages(sources, options = {}) {
        return Promise.all(sources.map(src => this.preloadImage(src, options)));
    }

    isLoaded(src) {
        return this.loadedImages.has(src);
    }
}

const performanceOptimizer = new PerformanceOptimizer();
const smartCache = new SmartCache();
const requestBatcher = new RequestBatcher();
const imageOptimizer = new ImageOptimizer();

export {
    PerformanceOptimizer,
    VirtualScrollManager,
    SmartCache,
    RequestBatcher,
    ImageOptimizer,
    performanceOptimizer,
    smartCache,
    requestBatcher,
    imageOptimizer
};

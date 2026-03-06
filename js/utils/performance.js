/**
 * 数学修仙传 - 性能优化模块
 * 提供性能监控、资源优化、渲染优化等功能
 */

import { storage } from './helpers.js';

/**
 * 性能监控器
 */
export class PerformanceMonitor {
    constructor() {
        this.metrics = {
            fps: 0,
            frameCount: 0,
            lastTime: performance.now(),
            loadTime: 0,
            resourceSize: 0
        };
        this.history = [];
        this.maxHistory = 60; // 保留 60 帧数据
    }

    /**
     * 开始监控 FPS
     */
    startFPSMonitor() {
        const measure = () => {
            this.metrics.frameCount++;
            const currentTime = performance.now();
            const elapsed = currentTime - this.metrics.lastTime;

            if (elapsed >= 1000) {
                this.metrics.fps = Math.round((this.metrics.frameCount * 1000) / elapsed);
                this.metrics.frameCount = 0;
                this.metrics.lastTime = currentTime;

                // 记录历史数据
                this.history.push({
                    time: currentTime,
                    fps: this.metrics.fps
                });

                if (this.history.length > this.maxHistory) {
                    this.history.shift();
                }

                // 如果 FPS 过低，发出警告
                if (this.metrics.fps < 30) {
                    console.warn(`⚠️ FPS 过低：${this.metrics.fps}`);
                }
            }

            requestAnimationFrame(measure);
        };

        requestAnimationFrame(measure);
    }

    /**
     * 记录页面加载时间
     */
    recordLoadTime() {
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            this.metrics.loadTime = timing.loadEventEnd - timing.navigationStart;
            console.log(`📊 页面加载时间：${this.metrics.loadTime}ms`);
        }
    }

    /**
     * 获取平均 FPS
     * @returns {number} 平均 FPS
     */
    getAverageFPS() {
        if (this.history.length === 0) return this.metrics.fps;
        const sum = this.history.reduce((acc, curr) => acc + curr.fps, 0);
        return Math.round(sum / this.history.length);
    }

    /**
     * 获取性能报告
     * @returns {Object} 性能报告
     */
    getReport() {
        return {
            currentFPS: this.metrics.fps,
            averageFPS: this.getAverageFPS(),
            loadTime: this.metrics.loadTime,
            memoryUsage: this.getMemoryUsage(),
            resourceSize: this.metrics.resourceSize
        };
    }

    /**
     * 获取内存使用情况 (仅 Chrome 支持)
     * @returns {Object} 内存使用情况
     */
    getMemoryUsage() {
        if (performance.memory) {
            return {
                usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1048576),
                totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1048576),
                jsHeapSizeLimit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
            };
        }
        return null;
    }
}

/**
 * 资源加载优化器
 */
export class ResourceOptimizer {
    constructor() {
        this.loadedResources = new Set();
        this.loadingPromises = new Map();
    }

    /**
     * 懒加载脚本
     * @param {string} src - 脚本路径
     * @returns {Promise} 加载完成 Promise
     */
    loadScript(src) {
        if (this.loadedResources.has(src)) {
            return Promise.resolve();
        }

        if (this.loadingPromises.has(src)) {
            return this.loadingPromises.get(src);
        }

        const promise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = () => {
                this.loadedResources.add(src);
                this.loadingPromises.delete(src);
                resolve();
            };
            script.onerror = () => {
                this.loadingPromises.delete(src);
                reject(new Error(`Failed to load script: ${src}`));
            };
            document.head.appendChild(script);
        });

        this.loadingPromises.set(src, promise);
        return promise;
    }

    /**
     * 懒加载样式
     * @param {string} href - 样式路径
     * @returns {Promise} 加载完成 Promise
     */
    loadStyle(href) {
        if (this.loadedResources.has(href)) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = () => {
                this.loadedResources.add(href);
                resolve();
            };
            link.onerror = () => reject(new Error(`Failed to load style: ${href}`));
            document.head.appendChild(link);
        });
    }

    /**
     * 预加载资源
     * @param {Array<string>} resources - 资源列表
     */
    preloadResources(resources) {
        resources.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = this.getResourceType(src);
            link.href = src;
            document.head.appendChild(link);
        });
    }

    /**
     * 获取资源类型
     * @param {string} src - 资源路径
     * @returns {string} 资源类型
     */
    getResourceType(src) {
        if (src.endsWith('.js')) return 'script';
        if (src.endsWith('.css')) return 'style';
        if (/\.(jpg|jpeg|png|gif|webp|svg)$/.test(src)) return 'image';
        if (src.endsWith('.woff2')) return 'font';
        return 'fetch';
    }

    /**
     * 清理未使用的资源
     */
    cleanupUnusedResources() {
        // 清理长时间未使用的脚本和样式
        const unusedScripts = document.querySelectorAll('script[src]:not([data-keep])');
        const unusedStyles = document.querySelectorAll('link[rel="stylesheet"]:not([data-keep])');

        console.log(`清理 ${unusedScripts.length} 个未使用脚本，${unusedStyles.length} 个未使用样式`);
    }
}

/**
 * 渲染优化器
 */
export class RenderOptimizer {
    constructor() {
        this.rafId = null;
        this.pendingUpdates = new Map();
        this.batchSize = 10;
    }

    /**
     * 批量更新 DOM - 使用 requestAnimationFrame
     * @param {Function} updateFn - 更新函数
     */
    batchUpdate(updateFn) {
        if (this.rafId) {
            this.pendingUpdates.set('update', updateFn);
            return;
        }

        this.rafId = requestAnimationFrame(() => {
            try {
                updateFn();
                this.pendingUpdates.forEach(fn => fn());
            } finally {
                this.rafId = null;
                this.pendingUpdates.clear();
            }
        });
    }

    /**
     * 虚拟滚动优化 - 只渲染可见区域
     * @param {HTMLElement} container - 容器元素
     * @param {Array} items - 数据项
     * @param {Function} renderItem - 渲染函数
     * @param {number} itemHeight - 每项高度
     */
    setupVirtualScroll(container, items, renderItem, itemHeight) {
        const totalHeight = items.length * itemHeight;
        container.style.height = `${totalHeight}px`;
        container.style.overflowY = 'auto';
        container.style.position = 'relative';

        let visibleItems = [];
        let containerEl = null;

        const render = () => {
            const scrollTop = container.scrollTop;
            const viewportHeight = container.clientHeight;

            const startIndex = Math.floor(scrollTop / itemHeight);
            const endIndex = Math.min(
                items.length,
                Math.ceil((scrollTop + viewportHeight) / itemHeight)
            );

            const newVisibleItems = items.slice(startIndex, endIndex);

            // 如果数据没变化，跳过渲染
            if (this.arraysEqual(visibleItems, newVisibleItems)) return;
            visibleItems = newVisibleItems;

            // 创建或更新容器
            if (!containerEl) {
                containerEl = document.createElement('div');
                containerEl.style.position = 'absolute';
                containerEl.style.top = '0';
                containerEl.style.left = '0';
                containerEl.style.right = '0';
                container.appendChild(containerEl);
            }

            // 更新位置和高度
            containerEl.style.transform = `translateY(${startIndex * itemHeight}px)`;
            containerEl.style.height = `${visibleItems.length * itemHeight}px`;

            // 批量更新内容
            this.batchUpdate(() => {
                containerEl.innerHTML = '';
                visibleItems.forEach((item, index) => {
                    containerEl.appendChild(renderItem(item, startIndex + index));
                });
            });
        };

        container.addEventListener('scroll', this.debounce(render, 16));
        render();

        return { destroy: () => container.removeEventListener('scroll', render) };
    }

    /**
     * 防抖辅助函数
     */
    debounce(fn, delay) {
        let timer = null;
        return function(...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    /**
     * 数组相等性检查
     */
    arraysEqual(a, b) {
        if (a.length !== b.length) return false;
        return a.every((item, index) => item === b[index]);
    }

    /**
     * 使用 DocumentFragment 批量插入
     * @param {HTMLElement} container - 容器
     * @param {Array<HTMLElement>} elements - 元素列表
     */
    batchInsert(container, elements) {
        const fragment = document.createDocumentFragment();
        elements.forEach(el => fragment.appendChild(el));
        container.appendChild(fragment);
    }
}

/**
 * 缓存管理器
 */
export class CacheManager {
    constructor(prefix = 'math_cache_') {
        this.prefix = prefix;
        this.maxSize = 50; // 最多缓存 50 项
        this.maxAge = 30 * 60 * 1000; // 默认 30 分钟过期
    }

    /**
     * 设置缓存
     * @param {string} key - 键
     * @param {any} value - 值
     * @param {number} [maxAge] - 过期时间 (毫秒)
     */
    set(key, value, maxAge = this.maxAge) {
        try {
            const item = {
                value,
                timestamp: Date.now(),
                maxAge
            };
            storage.set(this.prefix + key, item);
            this.cleanup();
        } catch (error) {
            console.error('Cache set error:', error);
        }
    }

    /**
     * 获取缓存
     * @param {string} key - 键
     * @param {any} [defaultValue] - 默认值
     * @returns {any} 缓存值
     */
    get(key, defaultValue = null) {
        try {
            const item = storage.get(this.prefix + key);
            if (!item) return defaultValue;

            const age = Date.now() - item.timestamp;
            if (age > item.maxAge) {
                this.remove(key);
                return defaultValue;
            }

            return item.value;
        } catch (error) {
            console.error('Cache get error:', error);
            return defaultValue;
        }
    }

    /**
     * 删除缓存
     * @param {string} key - 键
     */
    remove(key) {
        storage.remove(this.prefix + key);
    }

    /**
     * 清空缓存
     */
    clear() {
        const keys = Object.keys(localStorage).filter(k => k.startsWith(this.prefix));
        keys.forEach(k => storage.remove(k));
    }

    /**
     * 清理过期缓存
     */
    cleanup() {
        const keys = Object.keys(localStorage).filter(k => k.startsWith(this.prefix));
        const now = Date.now();

        keys.forEach(key => {
            try {
                const item = storage.get(key);
                if (item && (now - item.timestamp) > item.maxAge) {
                    storage.remove(key);
                }
            } catch (error) {
                storage.remove(key);
            }
        });

        // 如果缓存数量超过限制，删除最旧的
        if (keys.length > this.maxSize) {
            const sorted = keys
                .map(k => ({ key: k, time: storage.get(k)?.timestamp || 0 }))
                .sort((a, b) => a.time - b.time);

            for (let i = 0; i < sorted.length - this.maxSize; i++) {
                storage.remove(sorted[i].key);
            }
        }
    }

    /**
     * 获取缓存统计
     * @returns {Object} 统计信息
     */
    getStats() {
        const keys = Object.keys(localStorage).filter(k => k.startsWith(this.prefix));
        const totalSize = keys.length;
        const validKeys = keys.filter(k => {
            const item = storage.get(k);
            return item && (Date.now() - item.timestamp) <= item.maxAge;
        });

        return {
            total: totalSize,
            valid: validKeys.length,
            expired: totalSize - validKeys.length
        };
    }
}

// 创建全局实例
export const perfMonitor = new PerformanceMonitor();
export const resourceOptimizer = new ResourceOptimizer();
export const renderOptimizer = new RenderOptimizer();
export const cacheManager = new CacheManager();

console.log('✅ 性能优化模块已初始化');

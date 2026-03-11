/**
 * 离线支持模块
 * 提供 Service Worker 注册、离线缓存、数据同步等功能
 */

class OfflineSupportManager {
    constructor() {
        this.isOnline = navigator.onLine;
        this.pendingSync = [];
        this.cacheVersion = 'v10.1';
        this.criticalResources = [
            '/',
            '/index.html',
            '/css/styles.css',
            '/js/data.js',
            '/js/config.js',
            '/js/modules/state.js',
            '/js/modules/renderer.js',
            '/js/modules/challenge.js',
            '/js/modules/ui.js',
            '/js/modules/canvas.js',
            '/js/modules/effects.js',
            '/js/modules/gamification.js',
            '/js/utils/helpers.js',
            '/js/utils/event-bus.js',
            '/js/utils/performance-optimizer.js',
            '/js/utils/learning-analyzer.js'
        ];
        this._init();
    }

    _init() {
        this._registerServiceWorker();
        this._setupNetworkListeners();
        this._setupSyncManager();
    }

    async _registerServiceWorker() {
        if (!('serviceWorker' in navigator)) {
            console.warn('Service Worker not supported');
            return;
        }

        try {
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });
            
            console.log('Service Worker registered:', registration.scope);
            
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        this._notifyUpdate();
                    }
                });
            });
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }

    _setupNetworkListeners() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this._syncPendingData();
            this._dispatchNetworkEvent('online');
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this._dispatchNetworkEvent('offline');
        });
    }

    _setupSyncManager() {
        if ('sync' in navigator.serviceWorker) {
            navigator.serviceWorker.ready.then(registration => {
                return registration.sync.register('sync-data');
            }).catch(err => {
                console.warn('Background sync not supported:', err);
            });
        }
    }

    _dispatchNetworkEvent(status) {
        window.dispatchEvent(new CustomEvent('network-change', {
            detail: { isOnline: status === 'online' }
        }));
    }

    _notifyUpdate() {
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="update-content">
                <span>🎉 新版本可用</span>
                <button onclick="location.reload()">立即更新</button>
                <button onclick="this.parentElement.parentElement.remove()">稍后</button>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #1e293b, #0f172a);
            border: 2px solid #f59e0b;
            border-radius: 12px;
            padding: 16px 24px;
            z-index: 10000;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(notification);
    }

    async _syncPendingData() {
        if (this.pendingSync.length === 0) return;

        const dataToSync = [...this.pendingSync];
        this.pendingSync = [];

        for (const data of dataToSync) {
            try {
                await this._syncData(data);
            } catch (error) {
                console.warn('Sync failed, re-queuing:', error);
                this.pendingSync.push(data);
            }
        }
    }

    async _syncData(data) {
        if ('sync' in navigator.serviceWorker) {
            const channel = new MessageChannel();
            navigator.serviceWorker.controller.postMessage({
                type: 'SYNC_DATA',
                data
            }, [channel.port2]);
        }
    }

    queueForSync(data) {
        this.pendingSync.push({
            ...data,
            timestamp: Date.now()
        });
        this._savePendingSync();
    }

    _savePendingSync() {
        try {
            localStorage.setItem('math_pending_sync', JSON.stringify(this.pendingSync));
        } catch (e) {
            console.warn('Failed to save pending sync:', e);
        }
    }

    _loadPendingSync() {
        try {
            const saved = localStorage.getItem('math_pending_sync');
            if (saved) {
                this.pendingSync = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Failed to load pending sync:', e);
        }
    }

    async cacheResources() {
        if (!('caches' in window)) {
            console.warn('Cache API not supported');
            return;
        }

        try {
            const cache = await caches.open(`math-god-${this.cacheVersion}`);
            
            for (const resource of this.criticalResources) {
                try {
                    await cache.add(resource);
                } catch (e) {
                    console.warn(`Failed to cache ${resource}:`, e);
                }
            }
            
            console.log('Resources cached successfully');
        } catch (error) {
            console.error('Failed to cache resources:', error);
        }
    }

    async clearOldCaches() {
        if (!('caches' in window)) return;

        const cacheNames = await caches.keys();
        await Promise.all(
            cacheNames
                .filter(name => !name.includes(this.cacheVersion))
                .map(name => caches.delete(name))
        );
    }

    getStatus() {
        return {
            isOnline: this.isOnline,
            pendingSyncCount: this.pendingSync.length,
            serviceWorkerSupported: 'serviceWorker' in navigator,
            cacheSupported: 'caches' in window,
            backgroundSyncSupported: 'sync' in (navigator.serviceWorker || {})
        };
    }
}

class DataPersistenceManager {
    constructor() {
        this.storageQuota = null;
        this.usageEstimate = null;
        this._checkStorageQuota();
    }

    async _checkStorageQuota() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            try {
                const estimate = await navigator.storage.estimate();
                this.storageQuota = estimate.quota;
                this.usageEstimate = estimate.usage;
            } catch (e) {
                console.warn('Failed to get storage estimate:', e);
            }
        }
    }

    async saveData(key, data, options = {}) {
        const {
            useIndexedDB = false,
            expireIn = null
        } = options;

        const payload = {
            data,
            timestamp: Date.now(),
            expireIn
        };

        if (useIndexedDB) {
            return this._saveToIndexedDB(key, payload);
        }

        try {
            localStorage.setItem(key, JSON.stringify(payload));
            return true;
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                await this._cleanupOldData();
                try {
                    localStorage.setItem(key, JSON.stringify(payload));
                    return true;
                } catch (retryError) {
                    console.error('Storage quota exceeded after cleanup:', retryError);
                    return false;
                }
            }
            console.error('Failed to save data:', e);
            return false;
        }
    }

    async loadData(key, options = {}) {
        const { useIndexedDB = false } = options;

        if (useIndexedDB) {
            return this._loadFromIndexedDB(key);
        }

        try {
            const saved = localStorage.getItem(key);
            if (!saved) return null;

            const payload = JSON.parse(saved);
            
            if (payload.expireIn && Date.now() - payload.timestamp > payload.expireIn) {
                localStorage.removeItem(key);
                return null;
            }

            return payload.data;
        } catch (e) {
            console.error('Failed to load data:', e);
            return null;
        }
    }

    async _saveToIndexedDB(key, payload) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('MathGodDB', 1);
            
            request.onerror = () => reject(request.error);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('data')) {
                    db.createObjectStore('data', { keyPath: 'key' });
                }
            };
            
            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction(['data'], 'readwrite');
                const store = transaction.objectStore('data');
                
                store.put({ key, ...payload });
                
                transaction.oncomplete = () => resolve(true);
                transaction.onerror = () => reject(transaction.error);
            };
        });
    }

    async _loadFromIndexedDB(key) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('MathGodDB', 1);
            
            request.onerror = () => reject(request.error);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('data')) {
                    db.createObjectStore('data', { keyPath: 'key' });
                }
            };
            
            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction(['data'], 'readonly');
                const store = transaction.objectStore('data');
                const getRequest = store.get(key);
                
                getRequest.onsuccess = () => {
                    const result = getRequest.result;
                    if (!result) {
                        resolve(null);
                        return;
                    }
                    
                    if (result.expireIn && Date.now() - result.timestamp > result.expireIn) {
                        store.delete(key);
                        resolve(null);
                        return;
                    }
                    
                    resolve(result.data);
                };
                
                getRequest.onerror = () => reject(getRequest.error);
            };
        });
    }

    async _cleanupOldData() {
        const keys = Object.keys(localStorage);
        const mathKeys = keys.filter(k => k.startsWith('math_'));
        
        const keyStats = [];
        for (const key of mathKeys) {
            try {
                const data = JSON.parse(localStorage.getItem(key));
                keyStats.push({
                    key,
                    timestamp: data.timestamp || 0,
                    size: localStorage.getItem(key).length
                });
            } catch (e) {
                keyStats.push({ key, timestamp: 0, size: 0 });
            }
        }
        
        keyStats.sort((a, b) => a.timestamp - b.timestamp);
        
        const toRemove = keyStats.slice(0, Math.ceil(keyStats.length * 0.3));
        for (const item of toRemove) {
            localStorage.removeItem(item.key);
        }
    }

    getStorageInfo() {
        return {
            quota: this.storageQuota,
            usage: this.usageEstimate,
            available: this.storageQuota ? this.storageQuota - this.usageEstimate : null,
            usagePercent: this.storageQuota && this.usageEstimate
                ? ((this.usageEstimate / this.storageQuota) * 100).toFixed(2)
                : null
        };
    }
}

class NetworkAwareLoader {
    constructor() {
        this.connectionInfo = this._getConnectionInfo();
        this._setupConnectionListener();
    }

    _getConnectionInfo() {
        if ('connection' in navigator) {
            const conn = navigator.connection;
            return {
                effectiveType: conn.effectiveType,
                downlink: conn.downlink,
                rtt: conn.rtt,
                saveData: conn.saveData
            };
        }
        return { effectiveType: '4g', downlink: 10, rtt: 50, saveData: false };
    }

    _setupConnectionListener() {
        if ('connection' in navigator) {
            navigator.connection.addEventListener('change', () => {
                this.connectionInfo = this._getConnectionInfo();
                this._dispatchConnectionChange();
            });
        }
    }

    _dispatchConnectionChange() {
        window.dispatchEvent(new CustomEvent('connection-change', {
            detail: this.connectionInfo
        }));
    }

    shouldLoadHighQuality() {
        return this.connectionInfo.effectiveType === '4g' && !this.connectionInfo.saveData;
    }

    getOptimalImageQuality() {
        if (this.connectionInfo.saveData) return 'low';
        if (this.connectionInfo.effectiveType === '4g') return 'high';
        if (this.connectionInfo.effectiveType === '3g') return 'medium';
        return 'low';
    }

    getOptimalCacheStrategy() {
        if (this.connectionInfo.saveData || this.connectionInfo.effectiveType === '2g') {
            return 'aggressive';
        }
        if (this.connectionInfo.effectiveType === '3g') {
            return 'balanced';
        }
        return 'minimal';
    }
}

const offlineSupport = new OfflineSupportManager();
const dataPersistence = new DataPersistenceManager();
const networkLoader = new NetworkAwareLoader();

offlineSupport._loadPendingSync();

export {
    OfflineSupportManager,
    DataPersistenceManager,
    NetworkAwareLoader,
    offlineSupport,
    dataPersistence,
    networkLoader
};

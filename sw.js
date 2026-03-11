/**
 * Service Worker for 数学修仙传
 * 提供离线缓存、后台同步、推送通知等功能
 */

const CACHE_VERSION = 'v10.1';
const CACHE_NAME = `math-god-${CACHE_VERSION}`;

const STATIC_ASSETS = [
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
    '/js/modules/gameplay.js',
    '/js/modules/games.js',
    '/js/utils/helpers.js',
    '/js/utils/event-bus.js',
    '/js/utils/index.js',
    '/js/utils/performance-optimizer.js',
    '/js/utils/learning-analyzer.js',
    '/js/utils/offline-support.js'
];

const EXTERNAL_ASSETS = [
    'https://cdn.tailwindcss.com/3.4.1',
    'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700;900&family=Ma+Shan+Zheng&display=swap'
];

self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('[SW] Static assets cached');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[SW] Failed to cache static assets:', error);
            })
    );
});

self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => name !== CACHE_NAME && name.startsWith('math-god-'))
                        .map((name) => {
                            console.log('[SW] Deleting old cache:', name);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => {
                console.log('[SW] Old caches cleared');
                return self.clients.claim();
            })
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    if (request.method !== 'GET') {
        return;
    }
    
    if (url.origin !== location.origin) {
        event.respondWith(handleExternalRequest(request));
        return;
    }
    
    event.respondWith(handleLocalRequest(request));
});

async function handleLocalRequest(request) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
        fetchAndCache(request, cache);
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('[SW] Network request failed:', error);
        
        return new Response('Offline - Resource not available', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}

async function handleExternalRequest(request) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('[SW] External request failed:', error);
        
        return new Response('Offline - External resource not available', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

async function fetchAndCache(request, cache) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            cache.put(request, networkResponse);
        }
    } catch (error) {
        // Network failed, cached version will be used
    }
}

self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync triggered:', event.tag);
    
    if (event.tag === 'sync-data') {
        event.waitUntil(syncPendingData());
    }
});

async function syncPendingData() {
    try {
        const clients = await self.clients.matchAll();
        
        for (const client of clients) {
            client.postMessage({
                type: 'SYNC_COMPLETE',
                timestamp: Date.now()
            });
        }
    } catch (error) {
        console.error('[SW] Sync failed:', error);
    }
}

self.addEventListener('message', (event) => {
    console.log('[SW] Message received:', event.data);
    
    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data.type === 'CACHE_RESOURCES') {
        event.waitUntil(cacheAdditionalResources(event.data.resources));
    }
    
    if (event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(caches.delete(CACHE_NAME));
    }
});

async function cacheAdditionalResources(resources) {
    const cache = await caches.open(CACHE_NAME);
    
    for (const resource of resources) {
        try {
            await cache.add(resource);
        } catch (error) {
            console.error('[SW] Failed to cache resource:', resource, error);
        }
    }
}

self.addEventListener('push', (event) => {
    console.log('[SW] Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : '您有新的学习任务！',
        icon: '/icons/icon-192.png',
        badge: '/icons/badge-72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            { action: 'open', title: '打开' },
            { action: 'close', title: '关闭' }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('数学修仙传', options)
    );
});

self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked:', event.action);
    
    event.notification.close();
    
    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            clients.matchAll({ type: 'window' })
                .then((clientList) => {
                    for (const client of clientList) {
                        if (client.url === '/' && 'focus' in client) {
                            return client.focus();
                        }
                    }
                    if (clients.openWindow) {
                        return clients.openWindow('/');
                    }
                })
        );
    }
});

console.log('[SW] Service Worker loaded');

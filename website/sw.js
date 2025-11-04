/**
 * Service Worker for PWA
 * 提供离线缓存和推送通知功能
 */

const CACHE_NAME = 'medical-aesthetics-v1.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/main.js',
    '/js/ai.js',
    '/js/design.js',
    'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0',
    'https://docs.bccsw.cn/logo.png',
    'https://docs.bccsw.cn/favicon.png'
];

// 安装 Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('缓存已打开');
                return cache.addAll(urlsToCache);
            })
    );
});

// 拦截网络请求
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // 如果缓存中有响应，则返回缓存的版本
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

// 更新 Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('删除旧缓存:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// 推送通知
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : '您有新的消息',
        icon: '/favicon.png',
        badge: '/favicon.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: '查看',
                icon: '/favicon.png'
            },
            {
                action: 'close',
                title: '关闭',
                icon: '/favicon.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('医美咨询师实战技巧', options)
    );
});

// 通知点击事件
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'explore') {
        // 打开应用
        event.waitUntil(
            clients.openWindow('/')
        );
    } else if (event.action === 'close') {
        // 关闭通知
        event.notification.close();
    } else {
        // 默认行为
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

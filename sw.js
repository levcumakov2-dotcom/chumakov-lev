// sw.js - Service Worker для оффлайн работы
const CACHE_NAME = 'fmgroup-v2';

self.addEventListener('install', function(event) {
    console.log('Service Worker установлен');
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    console.log('Service Worker активирован');
    // Очищаем старые кэши
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Удаляем старый кэш:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {
    // Пропускаем внешние запросы и favicon
    if (!event.request.url.startsWith(self.location.origin) || 
        event.request.url.includes('favicon.ico') ||
        event.request.url.includes('chrome-extension')) {
        return;
    }
    
    event.respondWith(
        fetch(event.request).catch(function() {
            console.log('Оффлайн режим для:', event.request.url);
            return new Response('Оффлайн режим', {
                status: 200,
                headers: {'Content-Type': 'text/html'}
            });
        })
    );
});
// В текущей версии кэширование не настроено
// Рекомендую добавить кэширование основных файлов:

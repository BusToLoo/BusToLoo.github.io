const CACHE_NAME = 'bustoloo-cache-v5'; // ФИНАЛЬНАЯ ВЕРСИЯ
const urlsToCache = [
    '/',
    '/index.html', 
    '/manifest.json', 
    '/icon-192.png', 
    '/icon-512.png', 
    '/service-worker.js' 
];

// Установка: кэширование статических файлов
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Активация: удаление старых кэшей
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Получение: Сеть, с возвратом к Кэшу (Network Falling Back to Cache)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        // Если сеть недоступна, пытаемся взять из кэша
        return caches.match(event.request);
      })
  );
});
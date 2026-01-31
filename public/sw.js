// Service Worker para PWA
const CACHE_NAME = 'nexus-v1';
const urlsToCache = [
    '/',
    '/manifest.json',
    '/icon-192x192.png',
    '/icon-512x512.png',
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Cache abierto');
                return cache.addAll(urlsToCache);
            })
    );
    self.skipWaiting();
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Eliminando cache antiguo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Estrategia: Network First, fallback to Cache
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Si la respuesta es válida, clonarla y guardarla en cache
                if (response && response.status === 200) {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return response;
            })
            .catch(() => {
                // Si falla la red, intentar obtener desde cache
                return caches.match(event.request);
            })
    );
});

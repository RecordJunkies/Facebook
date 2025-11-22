const CACHE_NAME = 'record-junkies-v1';
const urlsToCache = [
    '/',
    '/styles.css',
    '/app.js',
    'https://www.recordjunkies.co.uk' // Cache key pages
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
            .catch(() => caches.match('/')) // Fallback to home
    );
});

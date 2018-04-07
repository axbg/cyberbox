/** An empty service worker! */
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open('the-magic-cache').then(function(cache) {
            return cache.addAll([
                '/',
                '/index.html',
                '/dashboard.html',
                '/img/blocuri.jpg',
                '/img/icon.ico',
                '/img/logo.png',
            ]);
        })
    );
});

self.addEventListener('push', function(event) {
    event.waitUntil(
        self.registration.showNotification('Got Push?', {
            body: 'Push Message received'
        }));
});
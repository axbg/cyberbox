self.addEventListener('fetch', event => {
    if (event.request.url.includes("upload") || event.request.url.includes("download") || event.request.url.includes("welcome")) {
        // passthrough
    } else if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
        event.respondWith(
            fetch(event.request).catch(error => {
                return caches.match("/offline.html");
            })
        );
    } else {
        event.respondWith(caches.match(event.request)
            .then(function (response) {
                return response || fetch(event.request);
            })
        );
    }
});

self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open('cb-cache').then(function (cache) {
            return cache.addAll([
                '/offline.html',
                '/sw.js',
                '/img/background.jpg',
                '/img/icon.ico',
                '/img/logo.png',
                '/img/icons/512.png',
                '/img/icons/192.png',
                '/css/animate.css',
                '/css/modal.css',
                '/css/structure.css',
                '/css/style.css',
                '/css/sidenav.css'
            ]);
        })
    );
});

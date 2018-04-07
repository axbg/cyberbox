/** An empty service worker! */
self.addEventListener('fetch', event => {
    // request.mode = navigate isn't supported in all browsers
    // so include a check for Accept: text/html header.
    if(event.request.url.includes("files/download")){
        return fetch(event.request.url);
    }
    else if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
        event.respondWith(
            fetch(event.request.url).catch(error => {
                // Return the offline page
                return caches.match("/offline.html");
            })
        );
    }
    else{
        // Respond with everything else if we can
        event.respondWith(caches.match(event.request)
            .then(function (response) {
                return response || fetch(event.request);
            })
        );
    }
});

self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open('the-magic-cache').then(function(cache) {
            return cache.addAll([
                '/',
                '/index.html',
                '/offline.html',
                '/dashboard.html',
                '/sw.js',
                '/img/blocuri.jpg',
                '/img/icon.ico',
                '/img/logo.png',
                '/css/animate.css',
                '/css/modal.css',
                '/css/structure.css',
                '/css/style.css',
                '/css/sidenav.css',
            ]);
        })
    );
});

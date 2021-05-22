self.addEventListener('fetch', event => {
    if(!event.request.url.includes("api")) {
        event.respondWith(
            caches.match(event.request)
                .then(function (response) {
                    return response || fetch(event.request);
                })
                .catch(function () {
                    return caches.match('/offline.html');
                }),
        );
    }
});

self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open('cb-cache').then(function (cache) {
            return cache.addAll([
                '/offline.html',
                '/dashboard.html',
                '/sw.js',
                '/img/background.jpg',
                '/img/icon.ico',
                '/img/logo.png',
                '/img/icons/48.png',
                '/img/icons/72.png',
                '/img/icons/96.png',
                '/img/icons/144.png',
                '/img/icons/192.png',
                '/img/icons/512.png',
                '/img/icons/apple_120.png',
                '/img/icons/apple_152.png',
                '/img/icons/apple_167.png',
                '/img/icons/apple_180.png',
                '/css/animate.css',
                '/css/modal.css',
                '/css/structure.css',
                '/css/style.css',
                '/css/sidenav.css',
                '/css/lib/css/toastr.min.css',
                '/css/lib/css/fa.min.css',
                '/css/lib/fonts/fontawesome-webfont.woff2',
                '/js/content.js',
                '/js/notes.js',
                '/js/permissions.js',
                '/js/reminders.js',
                '/js/settings.js',
                '/js/structure.js',
                '/js/lib/axios.min.js',
                '/js/lib/jquery.min.js',
                '/js/lib/toastr.min.js'
            ]);
        })
    );
});

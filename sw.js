var CACHE = ‘earlytube-v1’;
var FILES = [
‘/’,
‘/index.html’,
‘/about.html’,
‘/contact.html’,
‘/icon.png’,
‘/manifest.json’
];

self.addEventListener(‘install’, function(e) {
e.waitUntil(
caches.open(CACHE).then(function(cache) {
return cache.addAll(FILES);
})
);
});

self.addEventListener(‘activate’, function(e) {
e.waitUntil(
caches.keys().then(function(keys) {
return Promise.all(
keys.filter(function(k) { return k !== CACHE; })
.map(function(k) { return caches.delete(k); })
);
})
);
});

self.addEventListener(‘fetch’, function(e) {
// Don’t cache Firebase, Google APIs, YouTube, or CSV
var url = e.request.url;
if (url.includes(‘firebaseapp’) || url.includes(‘googleapis’) ||
url.includes(‘youtube’) || url.includes(‘googletagmanager’) ||
url.includes(‘gstatic’)) {
return;
}
e.respondWith(
caches.match(e.request).then(function(cached) {
return cached || fetch(e.request).then(function(response) {
return caches.open(CACHE).then(function(cache) {
cache.put(e.request, response.clone());
return response;
});
});
})
);
});

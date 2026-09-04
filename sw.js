const CACHE_NAME = 'zs-mart-v11.0';
const STATIC_ASSETS = [
  './',
  './index.html',
  './app.js?v=11.0',
  './style.css?v=11.0',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './react.production.min.js',
  './react-dom.production.min.js',
  './images/zs-mart-logo.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Always fetch fresh network first for dynamic app bundle
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

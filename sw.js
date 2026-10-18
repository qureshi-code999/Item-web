// ZS Mart Service Worker - High-Performance Intelligent Caching
const CACHE_VERSION = 'v1792337708012';
const CACHE_NAME = 'zs-mart-' + CACHE_VERSION;

const CORE_ASSETS = [
  './',
  './index.html',
  './app.js',
  './products.json',
  './react.production.min.js',
  './react-dom.production.min.js',
  './languages/en.js',
  './languages/ur.js',
  './languages/ro.js',
  './languages/hi.js',
  './style.css',
  './tailwind.local.css',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './images/zs-mart-logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Cache core assets safely without letting 1 failure block installation
      return Promise.allSettled(
        CORE_ASSETS.map((url) => cache.add(url).catch((err) => console.warn('[SW] Precache skip:', url, err)))
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && !key.startsWith('zs-images-cache')) {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // 1. Bypass Service Worker entirely for Supabase, Cloud Relays, and API endpoints
  if (
    url.hostname.includes('supabase.co') ||
    url.pathname.startsWith('/api/') ||
    url.protocol.startsWith('chrome-extension')
  ) {
    return;
  }

  // 2. Navigation & Core App Bundle (index.html, app.js, products.json) -> Network-First with Cache Fallback
  // Guarantees customers get fresh prices, inventory, and logic updates instantly online.
  const isNavigation = req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html');
  const isCoreScript = url.pathname.endsWith('app.js') || url.pathname.endsWith('products.json');

  if (isNavigation || isCoreScript) {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone)).catch(() => {});
          }
          return networkRes;
        })
        .catch(() => {
          return caches.match(req).then((cached) => {
            if (cached) return cached;
            if (isNavigation) return caches.match('./index.html').then(r => r || new Response('Offline', { status: 503 }));
            return new Response('', { status: 504, statusText: 'Offline' });
          });
        })
    );
    return;
  }

  // 3. Static Media Assets (Product images, icons, fonts, CSS) -> Cache-First with Network Fallback
  const isStaticAsset = (
    url.pathname.match(/\.(png|jpe?g|webp|svg|gif|ico|woff2?|ttf|css)$/i) ||
    url.hostname.includes('jsdelivr.net') ||
    url.hostname.includes('github.io')
  );

  if (isStaticAsset) {
    event.respondWith(
      caches.match(req).then((cachedRes) => {
        if (cachedRes) {
          return cachedRes;
        }
        return fetch(req).then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone)).catch(() => {});
          }
          return networkRes;
        }).catch(() => new Response('', { status: 504, statusText: 'Offline' }));
      })
    );
    return;
  }

  // Default: Network with Cache Fallback
  event.respondWith(
    fetch(req).catch(() => caches.match(req).then(r => r || new Response('', { status: 504, statusText: 'Offline' })))
  );
});

const CACHE = 'lfda-v6';
const ASSETS = [
  '/lfda-vidrios/',
  '/lfda-vidrios/index.html',
  '/lfda-vidrios/manifest.json',
  '/lfda-vidrios/icon.svg',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Firebase y APIs: solo red
  if (e.request.url.includes('firebase') || 
      e.request.url.includes('googleapis') ||
      e.request.url.includes('gstatic')) {
    return;
  }
  // HTML: red primero, cache como fallback
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match('/lfda-vidrios/index.html'))
    );
    return;
  }
  // Resto: cache primero
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

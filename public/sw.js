// MedCheck service worker: lets the website open and show claims without internet.
//
// Pages: try the network first (so updates show up), fall back to the saved copy.
// Scripts, styles and images: show the saved copy right away and refresh it in the background.
// Never touches other sites (Supabase, PubMed) or /api.
//
// To force every phone to drop old copies after a big change, bump CACHE_VERSION.
const CACHE_VERSION = 'medcheck-v1';
const APP_SHELL = ['/', '/manifest.webmanifest', '/icon-192.png', '/icon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((saved) => saved || caches.match('/')))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((saved) => {
      const fresh = fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => saved);
      return saved || fresh;
    })
  );
});

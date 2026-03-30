/**
 * Service Worker for Location Journal PWA
 *
 * Strategy:
 *  - App Shell (JS/CSS/HTML) → Cache-first (fast loads after first visit)
 *  - API / dynamic requests  → Network-first with cache fallback (fresh data when online)
 *  - Offline fallback        → Serves cached index.html for navigation requests
 */

const CACHE_NAME = 'location-journal-v1';

const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
];

// ── Install: pre-cache the app shell ──────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// ── Activate: clean up old caches ────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch: serve from cache, fall back to network ────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET and cross-origin requests
  if (request.method !== 'GET') return;
  if (!request.url.startsWith(self.location.origin) &&
      !request.url.includes('nominatim.openstreetmap.org')) return;

  // Nominatim (geocoding) → network-first
  if (request.url.includes('nominatim.openstreetmap.org')) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(request, clone));
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // App shell assets → cache-first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then((res) => {
        // Cache successful responses for JS/CSS/images
        if (res.ok && (
          request.destination === 'script' ||
          request.destination === 'style' ||
          request.destination === 'image' ||
          request.destination === 'document'
        )) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(request, clone));
        }
        return res;
      }).catch(() => {
        // Offline fallback: serve index.html for navigation requests
        if (request.destination === 'document') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

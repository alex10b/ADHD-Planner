// Minimal service worker to satisfy PWA install requirements.
// This does not implement full offline caching yet.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', () => {
  // Network-only strategy for now; no caching logic.
});


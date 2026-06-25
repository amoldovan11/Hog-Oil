/* =========================================================
   HOG OIL service worker
   Network-first: every request tries the live network first so a normal
   refresh always pulls the latest deploy. Falls back to the cache only
   when the network is unavailable (basic offline support).
   ========================================================= */

const CACHE = "hogoil-cache-v1";

// Activate immediately on install — don't wait for old tabs to close.
self.addEventListener("install", function () {
  self.skipWaiting();
});

// Clean up any old caches and take control of open pages right away.
self.addEventListener("activate", function (event) {
  event.waitUntil((async function () {
    const keys = await caches.keys();
    await Promise.all(keys.map(function (k) {
      return k === CACHE ? Promise.resolve() : caches.delete(k);
    }));
    await self.clients.claim();
  })());
});

// Network-first for same-origin GETs; cache is just an offline fallback.
self.addEventListener("fetch", function (event) {
  const req = event.request;
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== self.location.origin) return; // let fonts etc. pass through

  event.respondWith((async function () {
    try {
      // `no-store` skips the browser HTTP cache so we always hit the network.
      const fresh = await fetch(req, { cache: "no-store" });
      if (fresh && fresh.ok) {
        const cache = await caches.open(CACHE);
        cache.put(req, fresh.clone());
      }
      return fresh;
    } catch (err) {
      const cached = await caches.match(req);
      return cached || new Response("Offline", { status: 503, statusText: "Offline" });
    }
  })());
});

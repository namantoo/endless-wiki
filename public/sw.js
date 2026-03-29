// ─── Wheels Service Worker ────────────────────────────────────────────────────
//
// A service worker is a script that runs in a separate browser thread — it has
// no access to the DOM but can intercept every network request the page makes.
//
// Strategy used here:
//   API routes (/api/*)       → always hit the network (articles must be fresh)
//   Everything else           → cache-first: serve from cache, update in background
//
// This means:
//   - The app shell (HTML, JS, CSS) loads instantly on repeat visits
//   - Wikipedia article fetches are always live
//   - If the user goes offline, they still see the shell and any cached pages

const CACHE_NAME = "wheels-v1";

// Files to pre-cache on install — the minimum needed to show the app shell
const PRECACHE_URLS = ["/"];

// ─── Install ─────────────────────────────────────────────────────────────────
// Fires once when this SW version is first downloaded.
// We pre-cache the root page so the shell is available offline immediately.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  // Don't wait for old SW to stop — take over immediately
  self.skipWaiting();
});

// ─── Activate ────────────────────────────────────────────────────────────────
// Fires when this SW becomes the active controller.
// Delete old caches from previous versions (e.g. "wheels-v0") so they
// don't consume storage indefinitely.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  // Take control of all open tabs immediately (not just new ones)
  self.clients.claim();
});

// ─── Fetch ───────────────────────────────────────────────────────────────────
// Fires for every network request made by the page.
// This is where the caching strategy is applied.
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Only handle same-origin requests (not Google Fonts, Wikipedia CDN, etc.)
  if (url.origin !== self.location.origin) return;

  // API routes must always be fresh — skip the cache entirely
  // (Articles, facts, and OG images should never be served stale)
  if (url.pathname.startsWith("/api/")) return;

  // For everything else: try cache first, fall back to network, then cache the result.
  // This makes the app shell load instantly on repeat visits.
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        // We have a cached copy — return it immediately,
        // then fetch a fresh version in the background (stale-while-revalidate)
        fetch(event.request)
          .then((fresh) => {
            if (fresh.ok) {
              caches.open(CACHE_NAME).then((c) => c.put(event.request, fresh));
            }
          })
          .catch(() => {});
        return cached;
      }

      // Not in cache — fetch from network and cache the result
      return fetch(event.request).then((response) => {
        if (response.ok) {
          const clone = response.clone(); // responses can only be read once
          caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
        }
        return response;
      });
    })
  );
});

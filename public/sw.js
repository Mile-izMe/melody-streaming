const CACHE_PREFIX = "melody-stream-cache-v1";
const CACHEABLE_PATTERNS = [
  /\/api\/songs\/stream\/[^/]+\/master\.m3u8/,
  /\/api\/songs\/stream\/[^/]+\/[^/]+\/playlist\.m3u8/,
  /\/api\/songs\/stream\/[^/]+\/[^/]+\/seg_\d+\.ts/,
];

// Cache audio segment when fetch
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const isCacheable = CACHEABLE_PATTERNS.some((p) => p.test(url.pathname));

  if (!isCacheable) return;

  event.respondWith(
    caches.open(CACHE_PREFIX).then(async (cache) => {
      // Try cache first
      const cached = await cache.match(event.request);
      if (cached) return cached;

      try {
        const response = await fetch(event.request);
        // Clone cause response can be read only 1
        if (response.ok) {
          cache.put(event.request, response.clone());
        }
        return response;
      } catch {
        return new Response("Offline", { status: 503 });
      }
    }),
  );
});

// Delete old caches when activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) =>
                key.startsWith("melody-stream-cache-") && key !== CACHE_PREFIX,
            )
            .map((key) => caches.delete(key)),
        ),
      ),
  );
});

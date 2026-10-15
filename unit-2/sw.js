const C = "u2-v1";
self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.open(C).then(async c => {
    const isPage = e.request.mode === "navigate" || e.request.url.endsWith(".html");
    if (isPage) { try { const r = await fetch(e.request); if (r.ok) c.put(e.request, r.clone()); return r; } catch (err) { return (await c.match(e.request, { ignoreSearch: true })) || (await c.match("index.html")) || Response.error(); } }
    const hit = await c.match(e.request, { ignoreSearch: true });
    if (hit) return hit;
    try { const r = await fetch(e.request); if (r.ok && new URL(e.request.url).origin === location.origin) c.put(e.request, r.clone()); return r; }
    catch (err) { return (await c.match("index.html")) || Response.error(); }
  }));
});

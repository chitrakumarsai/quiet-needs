/* cacheName and assets are inserted by build-offline.mjs. */
self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(
    assets.map(path => new Request(new URL(path, self.location.origin), {
      cache: 'reload', credentials: 'omit', redirect: 'error',
    })),
  )));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith('quietneeds-shell-') && name !== cacheName)
      .map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  const workspace = /^\/(?:app\.html|card|events(?:\/new)?|join)\/?$/.test(url.pathname);
  if (request.mode === 'navigate' && (workspace || url.pathname === '/' || url.pathname === '/index.html')) {
    event.respondWith((async () => {
      try {
        const response = await fetch(request, { cache: 'no-store' });
        if (response.status < 500) return response;
      } catch { /* Reload from the installed shell when the network is unavailable. */ }
      return (await (await caches.open(cacheName)).match(workspace ? '/app.html' : '/index.html')) ?? Response.error();
    })());
  } else if (!url.search && url.pathname !== '/index.html' && assets.includes(url.pathname)) {
    event.respondWith((async () => (await (await caches.open(cacheName)).match(url.pathname)) ?? fetch(request))());
  }
});

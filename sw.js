/* Service Worker —— network-first 策略
   每次启动 PWA 先尝试网络，拿到就是最新；
   网络失败（离线）才用上次缓存。 */

const CACHE = 'ml-course-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // 跨域资源（KaTeX / Prism CDN）走浏览器默认缓存，不接管
  if (url.origin !== self.location.origin) return;

  e.respondWith(
    fetch(e.request)
      .then(resp => {
        if (resp && resp.ok) {
          const copy = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return resp;
      })
      .catch(() => caches.match(e.request))
  );
});

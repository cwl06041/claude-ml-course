/* Service Worker —— network-first，并强制绕过 HTTP cache。
   关键：iOS Safari 对 PWA 缓存非常激进（WebKit Bug 199110），
   所以同源请求一律 cache:'no-store' 直接走网络，离线时回退到我们自己的 cache。 */

const CACHE = 'ml-course-v2';

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
  if (url.origin !== self.location.origin) return;

  const fresh = new Request(e.request, { cache: 'no-store' });
  e.respondWith(
    fetch(fresh)
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

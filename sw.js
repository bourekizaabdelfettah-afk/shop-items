const CACHE_NAME = 'shop-list-v1';
const ASSETS = ['./', './index.html', './manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // لا نتدخل إلا في ملفات التطبيق نفسه؛ طلبات Supabase تمر مباشرة للشبكة
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});

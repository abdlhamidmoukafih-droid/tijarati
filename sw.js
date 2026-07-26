const CACHE = 'tijarati-v5';
const FILES = [
  './',
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap'
];

// تثبيت — حفظ الملفات فالكاش
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES).catch(()=>{}))
  );
});

// تفعيل — امسح الكاش القديم
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — جرب الإنترنت أولاً، إلا لا رجع من الكاش
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

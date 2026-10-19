// Hundred Deep offline cache. The game page is fetched fresh when online, so updates arrive on the next launch.
const C='hd-123174e19e',FILES=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/icon-180.png','icons/icon-32.png','icons/maskable-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
 if(r.mode==='navigate'||r.url.endsWith('index.html')){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put('index.html',cp));return res}).catch(()=>caches.match('index.html')))}
 else e.respondWith(caches.match(r).then(m=>m||fetch(r)))});

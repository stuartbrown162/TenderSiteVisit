// Offline cache for Site Visit Recorder. Bump VERSION when index.html changes.
const VERSION='svr-v1';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
const PDF=['https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js','https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(async c=>{await c.addAll(CORE);try{await c.addAll(PDF)}catch(_){}}).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 const mine=u.origin===location.origin, pdf=PDF.includes(r.url);if(!mine&&!pdf)return;
 // Serve from cache straight away; refresh the cache in the background when online
 e.respondWith(caches.open(VERSION).then(async c=>{const hit=await c.match(r,{ignoreSearch:true});
  const net=fetch(r).then(res=>{if(res&&res.ok)c.put(r,res.clone());return res}).catch(()=>null);
  if(hit){e.waitUntil(net);return hit}const res=await net;return res||(r.mode==='navigate'?c.match('./index.html'):Response.error())}))});

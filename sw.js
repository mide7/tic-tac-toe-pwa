const staticCacheName = "site-static-v2";
const dynamicCacheName = "site-dynamic-v2";
const assets = ["/","/index.html","/manifest.json","/style.css","/index.js","/app.js","/fallback.html"]

self.addEventListener("install",event=>{
    // console.log("sw installed.");
    event.waitUntil(
        caches.open(staticCacheName).then(cache=>{
            cache.addAll(assets)
            console.log("caching assets..")
        })
    )
})

self.addEventListener("activate", event=>{
    // console.log("sw activated")
    event.waitUntil(
        caches.keys().then(keys=>{
            console.log(keys)
            return Promise.all(keys
                    .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                    .map(key => caches.delete(key))
                )
        })
    )
})

self.addEventListener("fetch", event=>{
    // console.log("fetch events", event)
    event.respondWith(
        caches.match(event.request).then(cacheRes=>{
            return cacheRes || fetch(event.request).then(fetchRes => {
                console.log("my fetch res: ",fetchRes)
                return caches.open(dynamicCacheName).then(cache => {
                    fetchRes && cache.put(event.request.url,fetchRes.clone())
                    return fetchRes;
                })
            })
        }).catch(() => {
            console.log("caught an error")
            if (event.request.url.indexOf(".html") > -1){
                return caches.match("/fallback.html")
            }
        })
    )
})
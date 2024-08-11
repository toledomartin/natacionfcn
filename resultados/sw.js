const currentCache = "cache_v1";

// listado de archivos para guardar en cache
const urlsToCache = [
  "./index.html",
  "./styles.css",
];

//durante la fase de instalación, generalmente se almacena en caché los activos estáticos
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(currentCache).then(async (cache) => {
      return await cache
        .addAll(urlsToCache)
    })
  );

  self.skipWaiting();
});



self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(cacheNames => Promise.all(
      cacheNames
        .filter(cacheName => cacheName !== currentCache)
        .map(cacheName => caches.delete(cacheName))
    ))
  );
});


//se ejecuta cuando se hace una peticion de recursos
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        // El recurso está en caché, verifica la marca de tiempo
        return fetch(event.request).then(async response => {
          const lastModifiedHeader = response.headers.get('last-modified');
          if (lastModifiedHeader) {
            const serverLastModified = new Date(lastModifiedHeader);
            const cachedLastModified = new Date(cachedResponse.headers.get('last-modified'));

            // Comprueba si el recurso en caché está desactualizado
            if (serverLastModified > cachedLastModified) {
              // console.log("Se actualizo el recurso en cache");
              await caches.open(currentCache).then(cache => {
                cache.put(event.request, response.clone());
              });
              return response;
            }
          }
          return cachedResponse;
        });
      }

      // El recurso no está en caché, realiza la solicitud al servidor
      return fetch(event.request);
    })
  );
});


/*
al ejecutarse el evento push por una notificacion recibida desde el servidor mostrara la notificacion
y enviara un mensaje a la pagina principal (index) con la accion que debe realizar
*/
self.addEventListener("push", async (e) => {
  const push = e.data.json();
  let resultado = "";
  resultado = push.message;

  //Mostrar notificacion push
  self.registration.showNotification(push.title, {
    body: resultado,
    icon: "./images/favicon/apple-touch-icon.png",
    badge: "./images/favicon/favicon.ico",
    data: push,
    actions: push.action.button,
  });
});





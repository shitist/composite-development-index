const CACHE_NAME = "cdi-v1.1-numerals-20260923a";
const APP_SHELL = [
  "./",
  "./index.html",
  "./css/styles.css?v=20260922a",
  "./css/refinement.css?v=20260923a",
  "./assets/fonts/inter-variable.woff2",
  "./js/app.js?v=20260922b",
  "./js/country-motion.js?v=20260922b",
  "./js/calculator.js?v=20260921b",
  "./js/data.js?v=20260921b",
  "./js/locale.js?v=20260921c",
  "./data/processed/global-cdi-coverage.json",
  "./data/processed/nonrenewable-resource-rents-2017-2021.json",
  "./manifest.webmanifest",
  "./manifest.en.webmanifest",
  "./assets/cdi-mark.svg",
  "./assets/cdi-192.png",
  "./assets/cdi-512.png",
  "./assets/fonts/ibm-plex-sans-latin-400-normal.woff2",
  "./assets/fonts/ibm-plex-sans-latin-500-normal.woff2",
  "./assets/fonts/ibm-plex-sans-latin-600-normal.woff2",
  "./assets/fonts/ibm-plex-sans-latin-700-normal.woff2"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || !event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200 && response.type === "basic") {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => {
        if (cached) return cached;
        if (event.request.mode === "navigate") return caches.match("./index.html");
        return new Response("Offline", { status: 503, statusText: "Offline" });
      }))
  );
});

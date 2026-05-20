const CACHE_NAME = "secret-shell-v4";
const CORE_ASSETS = [
  "/",
  "/dashboard",
  "/manifest.webmanifest",
  "/logo.png",
  "/logo-mark.png",
  "/secret-icon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("/dashboard")),
    );
    return;
  }

  if (requestUrl.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then((response) => {
        if (response.ok) {
          const responseClone = response.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(event.request, responseClone));
        }

        return response;
      });
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url ?? "/dashboard";

  event.waitUntil(
    self.clients
      .matchAll({ includeUncontrolled: true, type: "window" })
      .then((clients) => {
        const visibleClient = clients.find((client) =>
          client.url.includes(self.location.origin),
        );

        if (visibleClient) {
          visibleClient.focus();
          return visibleClient.navigate(targetUrl);
        }

        return self.clients.openWindow(targetUrl);
      }),
  );
});

"use client";

import { useEffect } from "react";

export function RegisterServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) =>
          registrations.forEach((registration) => registration.unregister()),
        )
        .catch(() => {
          // Development remains usable even if the browser blocks SW cleanup.
        });
      return;
    }

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // PWA support is optional; the app remains fully usable without it.
    });
  }, []);

  return null;
}

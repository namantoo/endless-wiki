"use client";

// Registers the service worker once on first mount.
// This is a client component with no UI — it just runs the side effect.
//
// Why a separate component instead of doing this in layout.tsx?
// layout.tsx is a Server Component — it can't run browser APIs.
// By isolating this into a "use client" component, we keep layout.tsx clean.

import { useEffect } from "react";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    // Service workers are only available over HTTPS (or localhost for dev).
    // The 'in' check is the standard feature detection pattern.
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js", {
        // 'scope' controls which pages the SW can intercept.
        // "/" = the whole site (default).
        scope: "/",
      })
      .then((registration) => {
        // registration.scope tells you what paths this SW controls
        console.log("[SW] registered, scope:", registration.scope);
      })
      .catch((err) => {
        // Non-fatal — app still works, just without caching
        console.warn("[SW] registration failed:", err);
      });
  }, []);

  // No UI — this component is purely a side-effect runner
  return null;
}

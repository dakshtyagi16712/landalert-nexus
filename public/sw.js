/**
 * LandAlert-Nexus PWA Service Worker
 * (SIH26001 - Northeast India Landslide Early Warning)
 *
 * Implements:
 * 1. Deterministic App Shell precaching (HTML, JS bundles, CSS, fonts, icons)
 * 2. Reliable offline reload and navigation fallback for field observations
 * 3. Tile caching for OpenStreetMap tiles (CacheFirst)
 * 4. GeoJSON & offline package caching for monitored zones (NetworkFirst)
 * 5. Strict offline data semantics: NO fabricated weather, ML, or alerts
 */

const CACHE_NAME = "landalert-pwa-vb1e2e51278";
const MAP_CACHE = "landalert-tiles-v1";
const DATA_CACHE = "landalert-data-v1";

const PRECACHE_ASSETS = [
  "/",
  "/alerts",
  "/apple-touch-icon.png",
  "/assets/ConsoleShell-C2jv8jhy.js",
  "/assets/FieldObservationDialog-CcQnJTUr.js",
  "/assets/MapCanvas-W1sIjdfx.js",
  "/assets/RiskBits-DsT2caLu.js",
  "/assets/RiskMap-CalB6Loj.js",
  "/assets/RiskMap-vh-t_kPv.css",
  "/assets/alerts-CoDHSsiy.js",
  "/assets/alerts-DzFSxC9O.js",
  "/assets/atkinson-hyperlegible-latin-400-normal-BbWidj28.woff",
  "/assets/atkinson-hyperlegible-latin-400-normal-BrHNak5F.woff2",
  "/assets/atkinson-hyperlegible-latin-ext-400-normal-Bbz-b3yf.woff",
  "/assets/atkinson-hyperlegible-latin-ext-400-normal-DRk46D-x.woff2",
  "/assets/auth-domains-DS34dsqC.js",
  "/assets/client-D2HHhMwr.js",
  "/assets/dist-Dhrj-3P3.js",
  "/assets/geo-translations-Df2VNEtI.js",
  "/assets/index-c5Lc6c5O.js",
  "/assets/lock-DRCxS8gL.js",
  "/assets/observations-DzFSxC9O.js",
  "/assets/offline-media-store-BuzdrYhz.js",
  "/assets/queryOptions-BIFxg3nk.js",
  "/assets/risk-CkQ7Hukn.js",
  "/assets/rolldown-runtime-hePW80VL.js",
  "/assets/route-CDY9Qrxi.js",
  "/assets/routes-DbyB746s.js",
  "/assets/routes-DzFSxC9O.js",
  "/assets/styles-CFW8y9N6.css",
  "/assets/useNavigate-BiJuHLMZ.js",
  "/assets/web-dZP68vr3.js",
  "/assets/zones._id-DUH3DFir.js",
  "/assets/zones._id-DzFSxC9O.js",
  "/emblem-of-india.svg",
  "/favicon.ico",
  "/favicon.svg",
  "/himalaya-hero-trans.png",
  "/himalaya-hero.png",
  "/icon-192.png",
  "/icon-512.png",
  "/manifest.json",
  "/observations",
  "/offline-shell.html",
  "/robots.txt"
];

const APP_SHELL_URLS = PRECACHE_ASSETS;

// 1. INSTALL: Precache assets and app shell HTML
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log(`[SW] Precaching ${PRECACHE_ASSETS.length} application shell assets...`);
      // Precache all assets safely (continue even if an individual asset fails)
      await Promise.all(
        PRECACHE_ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn(`[SW] Precache failed for ${url}:`, err);
          }),
        ),
      );

      // Precache root navigation HTML shell under both relative and absolute keys
      try {
        const rootRes = await fetch("/", { cache: "reload", credentials: "same-origin" });
        if (rootRes && rootRes.ok) {
          await cache.put("/", rootRes.clone());
          await cache.put(self.location.origin + "/", rootRes.clone());
          console.log("[SW] Root application shell (/) successfully cached on install.");
        }
      } catch (err) {
        console.warn("[SW] Could not fetch root shell during install:", err);
      }
    }),
  );
  self.skipWaiting();
});

// 2. ACTIVATE: Purge stale versions and take immediate client control
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (![CACHE_NAME, MAP_CACHE, DATA_CACHE].includes(key)) {
            console.log("[SW] Removing outdated cache:", key);
            return caches.delete(key);
          }
        }),
      );
    }),
  );
  self.clients.claim();
});

// 3. FETCH: Smart caching strategy matching offline semantics
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== "GET") return;

  // A. OpenStreetMap tiles -> CacheFirst
  if (url.hostname.includes("tile.openstreetmap.org")) {
    event.respondWith(
      caches.open(MAP_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          return fetch(request)
            .then((networkResponse) => {
              if (networkResponse.status === 200) {
                cache.put(request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => {
              return new Response("", { status: 504, statusText: "Tile offline" });
            });
        });
      }),
    );
    return;
  }

  // B. Zone GeoJSON & Offline Bundle -> NetworkFirst with Stored Fallback
  if (url.pathname.includes("/api/gis/zones.geojson") || url.pathname.includes("/api/sync/package")) {
    event.respondWith(
      caches.open(DATA_CACHE).then((cache) => {
        return fetch(request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(async () => {
            const cached = await cache.match(request);
            if (cached) {
              const headers = new Headers(cached.headers);
              headers.set("X-LandAlert-Cached", "true");
              headers.set("X-LandAlert-Cache-Time", new Date().toISOString());
              return new Response(cached.body, {
                status: 200,
                statusText: "OK (Offline Cache)",
                headers,
              });
            }
            return new Response(
              JSON.stringify({
                error: "UNAVAILABLE_OFFLINE",
                message: "No cached geographic zone data available offline",
              }),
              { status: 503, headers: { "Content-Type": "application/json" } },
            );
          });
      }),
    );
    return;
  }

  // C. Live/server-dependent data endpoints -> Network-only (never fabricate offline)
  if (
    url.pathname.startsWith("/api/weather") ||
    url.pathname.startsWith("/api/ml/") ||
    url.pathname.startsWith("/api/satellite/") ||
    url.pathname.startsWith("/api/sensors/") ||
    url.pathname.startsWith("/api/alerts/") ||
    url.pathname.startsWith("/api/recompute")
  ) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({
            error: "UNAVAILABLE_OFFLINE",
            message: "Live telemetry and server-dependent computation are unavailable offline.",
          }),
          { status: 503, headers: { "Content-Type": "application/json" } },
        );
      }),
    );
    return;
  }

  // D. Navigation / HTML requests -> NetworkFirst, falling back to cached shell
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, copy);
              // Ensure root shell remains fresh under all URL variations
              if (url.pathname === "/" || url.pathname === "") {
                cache.put("/", networkResponse.clone());
                cache.put(self.location.origin + "/", networkResponse.clone());
              }
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          // 1. Try exact requested route
          const cachedRoute = await cache.match(request);
          if (cachedRoute) return cachedRoute;

          // 2. Try URL pathname
          const cachedPath = await cache.match(url.pathname);
          if (cachedPath) return cachedPath;

          // 3. Try root application shell (relative, absolute, or any cache)
          const rootShell =
            (await cache.match("/")) ||
            (await cache.match(self.location.origin + "/")) ||
            (await caches.match("/"));
          if (rootShell) return rootShell;

          // 4. Try dedicated standalone offline shell fallback
          const offlineShell =
            (await cache.match("/offline-shell.html")) ||
            (await cache.match(self.location.origin + "/offline-shell.html")) ||
            (await caches.match("/offline-shell.html"));
          if (offlineShell) return offlineShell;

          // 5. Check any available cache for this request
          const anyPage = await caches.match(request);
          if (anyPage) return anyPage;

          // 6. Last resort: Return complete standalone HTML document
          return new Response(
            `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>LandAlert-Nexus — Offline Mode</title><style>body{margin:0;background:#090d16;color:#e2e8f0;font-family:system-ui,sans-serif;padding:2rem;text-align:center}.box{max-width:520px;margin:3rem auto;background:#131a2b;padding:2rem;border-radius:8px;border:1px solid #1e293b}h1{font-size:1.4rem;color:#f8fafc}p{color:#94a3b8;font-size:0.9rem}button{background:#2563eb;color:#fff;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;font-weight:600;margin-top:1rem}</style></head><body><div class="box"><h1>LandAlert-Nexus — Offline Mode</h1><p>The application is operating in offline mode. Please reload once internet is restored, or use saved field capabilities.</p><button onclick="location.reload()">Retry Connection</button></div></body></html>`,
            {
              status: 200,
              headers: { "Content-Type": "text/html; charset=utf-8" },
            },
          );
        }),
    );
    return;
  }

  // E. Static Assets (JS bundles, CSS, Fonts, Images) -> CacheFirst with Stale-While-Revalidate
  if (
    url.pathname.startsWith("/assets/") ||
    url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|ico|woff2|woff|json|webp)$/) ||
    url.hostname.includes("fonts.googleapis.com") ||
    url.hostname.includes("fonts.gstatic.com")
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) {
          // Asynchronously update in background if online
          fetch(request)
            .then((fresh) => {
              if (fresh && fresh.status === 200) {
                cache.put(request, fresh);
              }
            })
            .catch(() => {});
          return cached;
        }

        return fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => cached || new Response("", { status: 504, statusText: "Asset unavailable offline" }));
      }),
    );
    return;
  }
});

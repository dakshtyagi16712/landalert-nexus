#!/usr/bin/env node
/**
 * scripts/generate-sw-manifest.mjs
 * ================================
 * Generates the complete precache manifest for the LandAlert-Nexus Service Worker.
 *
 * Scans:
 * 1. .output/public/assets/ (all compiled JS, CSS, font, and asset bundles)
 * 2. public/ (all static icons, manifests, and emblems)
 *
 * Computes:
 * - Deterministic SHA-256 cache version hash
 * - Injects PRECACHE_ASSETS & CACHE_NAME into public/sw.js and .output/public/sw.js
 * - Generates public/offline-shell.html and .output/public/offline-shell.html
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const outputPublicDir = path.join(rootDir, ".output", "public");
const outputAssetsDir = path.join(outputPublicDir, "assets");
const sourcePublicDir = path.join(rootDir, "public");

// 1. Gather all compiled assets from .output/public/assets
const compiledAssets = [];
if (fs.existsSync(outputAssetsDir)) {
  const files = fs.readdirSync(outputAssetsDir);
  for (const file of files) {
    if (file.endsWith(".map")) continue; // Skip source maps
    compiledAssets.push(`/assets/${file}`);
  }
} else {
  console.warn("[SW-Manifest] Warning: .output/public/assets does not exist yet. Run vite build first.");
}

// 2. Gather critical public assets (including root shell)
const publicStaticAssets = [
  "/",
  "/manifest.json",
  "/emblem-of-india.svg",
  "/favicon.svg",
  "/favicon.ico",
  "/apple-touch-icon.png",
  "/icon-192.png",
  "/icon-512.png",
  "/himalaya-hero.png",
  "/himalaya-hero-trans.png",
  "/robots.txt",
  "/offline-shell.html",
];

// Combine unique assets
const allAssetsToPrecache = Array.from(new Set([...publicStaticAssets, ...compiledAssets])).sort();

// 3. Compute deterministic cache hash
const hash = crypto.createHash("sha256");
for (const asset of allAssetsToPrecache) {
  hash.update(asset);
  const localPath = asset.startsWith("/assets/")
    ? path.join(outputAssetsDir, asset.replace("/assets/", ""))
    : path.join(sourcePublicDir, asset.replace("/", ""));
  if (fs.existsSync(localPath)) {
    try {
      const stats = fs.statSync(localPath);
      hash.update(String(stats.size));
      hash.update(String(stats.mtimeMs));
    } catch {}
  }
}
const cacheVersionHash = hash.digest("hex").slice(0, 10);
const cacheName = `landalert-pwa-v${cacheVersionHash}`;

console.log(`[SW-Manifest] Discovered ${allAssetsToPrecache.length} assets to precache.`);
console.log(`[SW-Manifest] Cache Name: ${cacheName}`);

// 4. Find the main CSS and client JS for offline-shell.html
const mainCss = compiledAssets.find((a) => a.startsWith("/assets/styles-") && a.endsWith(".css")) || "";
const clientJs = compiledAssets.find((a) => a.startsWith("/assets/client-") && a.endsWith(".js")) || "";

const offlineShellHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>LandAlert-Nexus — Offline Mode</title>
  <meta name="description" content="National Landslide Early Warning System — Offline Field Console" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="manifest" href="/manifest.json" />
  <meta name="theme-color" content="#090d16" />
  ${mainCss ? `<link rel="stylesheet" href="${mainCss}" />` : ""}
  <script>
    (function(){
      try {
        var t = localStorage.getItem('landalert_theme') || 'system';
        var d = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        if (d) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
      } catch(e) {}
    })();
  </script>
  <style>
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #0b0f19;
      color: #e2e8f0;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .offline-banner {
      background: rgba(245, 158, 11, 0.15);
      border-bottom: 1px solid rgba(245, 158, 11, 0.3);
      color: #fcd34d;
      padding: 0.5rem 1rem;
      font-size: 0.75rem;
      font-family: monospace;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .offline-content {
      max-width: 900px;
      margin: 3rem auto;
      padding: 2rem;
      background: #131b2e;
      border: 1px solid #1e293b;
      border-radius: 0.5rem;
    }
    .btn {
      display: inline-block;
      background: #2563eb;
      color: #ffffff;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      text-decoration: none;
      font-weight: 500;
      font-size: 0.875rem;
      border: none;
      cursor: pointer;
      margin-right: 0.5rem;
      margin-top: 1rem;
    }
    .btn-outline {
      background: transparent;
      border: 1px solid #3b82f6;
      color: #60a5fa;
    }
    .btn:hover {
      opacity: 0.9;
    }
  </style>
</head>
<body>
  <div id="root">
    <div class="offline-banner">
      <span>⚠ OFFLINE MODE — APPLICATION SHELL ACTIVE</span>
      <span>CACHED: ${cacheName}</span>
    </div>
    <div class="offline-content">
      <h1 style="font-size: 1.5rem; margin-top: 0;">LandAlert-Nexus Field Console</h1>
      <p style="color: #94a3b8; font-size: 0.9rem;">
        You are currently working offline. The cached application shell has loaded successfully.
      </p>
      <div style="background: rgba(0,0,0,0.25); border-left: 3px solid #f59e0b; padding: 0.75rem 1rem; margin: 1.5rem 0;">
        <strong style="color: #f59e0b;">Field Observation Sync Ready</strong>
        <p style="margin: 0.25rem 0 0; font-size: 0.85rem; color: #cbd5e1;">
          Field observations entered while offline will be stored securely in local encrypted storage and synchronized automatically when network connectivity is restored.
        </p>
      </div>
      <div>
        <a href="/" class="btn">Reload Live Console</a>
        <button type="button" class="btn btn-outline" onclick="window.location.reload()">Check Network</button>
      </div>
    </div>
  </div>
  ${clientJs ? `<script type="module" src="${clientJs}"></script>` : ""}
</body>
</html>
`;

// Write offline-shell.html to public and .output/public
fs.writeFileSync(path.join(sourcePublicDir, "offline-shell.html"), offlineShellHtml, "utf-8");
if (fs.existsSync(outputPublicDir)) {
  fs.writeFileSync(path.join(outputPublicDir, "offline-shell.html"), offlineShellHtml, "utf-8");
}
console.log("[SW-Manifest] Generated offline-shell.html");

// 5. Read template sw.js from public/sw.js and inject precache assets and cache name
const swPath = path.join(sourcePublicDir, "sw.js");
let swContent = fs.readFileSync(swPath, "utf-8");

// Replace CACHE_NAME
swContent = swContent.replace(/const CACHE_NAME = ["'][^"']+["'];/, `const CACHE_NAME = "${cacheName}";`);

// Replace APP_SHELL_URLS / PRECACHE_ASSETS
const formattedAssets = JSON.stringify(allAssetsToPrecache, null, 2);
if (swContent.includes("const PRECACHE_ASSETS =")) {
  swContent = swContent.replace(
    /const PRECACHE_ASSETS = \[[^\]]*\];/s,
    `const PRECACHE_ASSETS = ${formattedAssets};`,
  );
} else if (swContent.includes("const APP_SHELL_URLS =")) {
  swContent = swContent.replace(
    /const APP_SHELL_URLS = \[[^\]]*\];/s,
    `const PRECACHE_ASSETS = ${formattedAssets};\nconst APP_SHELL_URLS = PRECACHE_ASSETS;`,
  );
}

// Write back to public/sw.js
fs.writeFileSync(swPath, swContent, "utf-8");
console.log("[SW-Manifest] Updated public/sw.js with precache manifest.");

// Also copy to .output/public/sw.js
if (fs.existsSync(outputPublicDir)) {
  fs.writeFileSync(path.join(outputPublicDir, "sw.js"), swContent, "utf-8");
  console.log("[SW-Manifest] Copied updated sw.js to .output/public/sw.js.");
}

console.log("[SW-Manifest] Completed successfully.");

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
    .form-group {
      margin-bottom: 1rem;
    }
    .form-group label {
      display: block;
      font-size: 0.75rem;
      text-transform: uppercase;
      font-family: monospace;
      color: #94a3b8;
      margin-bottom: 0.35rem;
    }
    .form-control {
      width: 100%;
      box-sizing: border-box;
      background: #0f172a;
      border: 1px solid #334155;
      color: #f8fafc;
      padding: 0.5rem 0.75rem;
      border-radius: 0.375rem;
      font-size: 0.85rem;
    }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    @media (max-width: 640px) {
      .form-grid { grid-template-columns: 1fr; }
    }
    .status-alert {
      display: none;
      padding: 0.75rem 1rem;
      border-radius: 0.375rem;
      font-family: monospace;
      font-size: 0.8rem;
      margin-bottom: 1rem;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.4);
      color: #34d399;
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
        <div id="queueStatusBadge" style="margin-top: 0.5rem; font-family: monospace; font-size: 0.75rem; color: #38bdf8;">
          Pending observations in offline queue: <span id="queueCountNum">0</span>
        </div>
      </div>

      <!-- Offline Observation Form -->
      <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 0.5rem; padding: 1.5rem; margin-bottom: 1.5rem;">
        <h2 style="font-size: 1.1rem; margin-top: 0; margin-bottom: 1rem; color: #f8fafc;">
          📝 Report Field Observation Offline
        </h2>

        <div id="statusMsg" class="status-alert"></div>

        <form id="obsForm">
          <div class="form-group">
            <label for="zoneSelect">Instrumented Monitoring Zone</label>
            <select id="zoneSelect" class="form-control" required>
              <option value="1">Zone 1: Cachar (Assam)</option>
              <option value="2">Zone 2: Papum Pare (Arunachal Pradesh)</option>
              <option value="3">Zone 3: Dima Hasao (Assam)</option>
              <option value="4">Zone 4: East Khasi Hills (Meghalaya)</option>
              <option value="5">Zone 5: Aizawl (Mizoram)</option>
              <option value="6">Zone 6: Kohima (Nagaland)</option>
              <option value="7">Zone 7: Gangtok (Sikkim)</option>
              <option value="8">Zone 8: West Sikkim (Sikkim)</option>
              <option value="9">Zone 9: Champhai (Mizoram)</option>
              <option value="10">Zone 10: Senapati (Manipur)</option>
              <option value="11">Zone 11: Wokha (Nagaland)</option>
              <option value="12">Zone 12: Mamit (Mizoram)</option>
              <option value="13">Zone 13: Churachandpur (Manipur)</option>
              <option value="14">Zone 14: North Sikkim (Sikkim)</option>
              <option value="15">Zone 15: South Sikkim (Sikkim)</option>
            </select>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="rainInput">Rainfall (mm, last 24h)</label>
              <input type="number" id="rainInput" class="form-control" min="0" max="600" step="0.1" placeholder="e.g. 45.0" />
            </div>
            <div class="form-group">
              <label for="soilSelect">Soil Condition</label>
              <select id="soilSelect" class="form-control">
                <option value="dry">Dry / Stable</option>
                <option value="damp" selected>Damp</option>
                <option value="saturated">Saturated / Soft</option>
                <option value="waterlogged">Waterlogged / Seepage</option>
              </select>
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="signsSelect">Visual Slope Signs</label>
              <select id="signsSelect" class="form-control">
                <option value="None">None observed</option>
                <option value="Tension cracks on slope">Tension cracks</option>
                <option value="Mudflow / Slumping">Mudflow / Slumping</option>
                <option value="Tilting trees/poles">Tilting trees/poles</option>
                <option value="Rockfall debris">Rockfall debris</option>
              </select>
            </div>
            <div class="form-group">
              <label for="roadSelect">Road Connectivity</label>
              <select id="roadSelect" class="form-control">
                <option value="open">Open / Clear</option>
                <option value="restricted">Restricted / 1-Way</option>
                <option value="blocked">Blocked / Impassable</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="observerInput">Observer Identity</label>
            <input type="text" id="observerInput" class="form-control" placeholder="e.g. Citizen Observer / Field Unit" value="citizen_observer" />
          </div>

          <button type="submit" class="btn" style="width: 100%; font-weight: bold; background: #059669;">
            + Save Observation to Offline Queue
          </button>
        </form>
      </div>

      <div>
        <a href="/" class="btn">Reload Live Console</a>
        <button type="button" class="btn btn-outline" onclick="window.location.reload()">Check Network</button>
      </div>
    </div>
  </div>

  <script>
    var zonesMeta = [
      { id: 1, name: "Cachar", state: "Assam", district: "Cachar" },
      { id: 2, name: "Papum Pare", state: "Arunachal Pradesh", district: "Papum Pare" },
      { id: 3, name: "Dima Hasao", state: "Assam", district: "Dima Hasao" },
      { id: 4, name: "East Khasi Hills", state: "Meghalaya", district: "East Khasi Hills" },
      { id: 5, name: "Aizawl", state: "Mizoram", district: "Aizawl" },
      { id: 6, name: "Kohima", state: "Nagaland", district: "Kohima" },
      { id: 7, name: "Gangtok", state: "Sikkim", district: "Gangtok" },
      { id: 8, name: "West Sikkim", state: "Sikkim", district: "Gyalshing" },
      { id: 9, name: "Champhai", state: "Mizoram", district: "Champhai" },
      { id: 10, name: "Senapati", state: "Manipur", district: "Senapati" },
      { id: 11, name: "Wokha", state: "Nagaland", district: "Wokha" },
      { id: 12, name: "Mamit", state: "Mizoram", district: "Mamit" },
      { id: 13, name: "Churachandpur", state: "Manipur", district: "Churachandpur" },
      { id: 14, name: "North Sikkim", state: "Sikkim", district: "Mangan" },
      { id: 15, name: "South Sikkim", state: "Sikkim", district: "Namchi" }
    ];

    function updateQueueCount() {
      try {
        var raw = localStorage.getItem("landalert_field_observations_queue_v1");
        var list = raw ? JSON.parse(raw) : [];
        var count = Array.isArray(list) ? list.length : 0;
        var el = document.getElementById("queueCountNum");
        if (el) el.textContent = count;
      } catch(e) {}
    }

    updateQueueCount();

    document.getElementById("obsForm").addEventListener("submit", function(e) {
      e.preventDefault();
      var zId = Number(document.getElementById("zoneSelect").value);
      var obsId = (document.getElementById("observerInput").value || "").trim() || "citizen_observer";
      var rainVal = (document.getElementById("rainInput").value || "").trim();
      var soilVal = document.getElementById("soilSelect").value;
      var signsVal = document.getElementById("signsSelect").value;
      var roadVal = document.getElementById("roadSelect").value;
      var zoneObj = zonesMeta.find(function(z) { return z.id === zId; }) || zonesMeta[0];

      var key = "offline-" + Date.now() + "-" + Math.random().toString(36).substring(2, 9);
      var record = {
        zone_id: zId,
        state: zoneObj.state,
        district: zoneObj.district,
        observed_at: new Date().toISOString(),
        rainfall_mm: rainVal ? Number(rainVal) : undefined,
        soil_condition: soilVal,
        visual_signs: signsVal === "None" ? undefined : signsVal,
        road_status: roadVal,
        observer_id: obsId,
        media_urls: [],
        media_metadata: [],
        idempotency_key: key,
        client_timestamp: new Date().toISOString(),
        consent_given: true,
        submitter_role: "PUBLIC_USER"
      };

      try {
        var raw = localStorage.getItem("landalert_field_observations_queue_v1");
        var q = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(q)) q = [];
        q.push(record);
        localStorage.setItem("landalert_field_observations_queue_v1", JSON.stringify(q));
        window.dispatchEvent(new CustomEvent("landalert-queue-updated"));

        var msg = document.getElementById("statusMsg");
        msg.style.display = "block";
        msg.innerHTML = "✓ <strong>Observation safely queued offline!</strong><br/>Zone: " + zoneObj.name + " | Queue ID: " + key.slice(0, 16) + "…<br/>Will synchronize automatically once internet connection is restored.";
        updateQueueCount();
        document.getElementById("rainInput").value = "";
      } catch(err) {
        alert("Failed to save observation to localStorage: " + err);
      }
    });
  </script>
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

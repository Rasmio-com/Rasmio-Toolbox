"use client";

import { useEffect, useState } from "react";

interface Feature {
  label: string;
  ok: boolean;
}

function detect(): Feature[] {
  const w = window as typeof window & {
    WebGL2RenderingContext?: unknown;
    SharedArrayBuffer?: unknown;
    Worker?: unknown;
    WebAssembly?: unknown;
    indexedDB?: unknown;
    Notification?: unknown;
  };
  const nav = navigator as Navigator & { gpu?: unknown };

  let webgl = false;
  let webgl2 = false;
  try {
    const c = document.createElement("canvas");
    webgl = !!(c.getContext("webgl") || c.getContext("experimental-webgl"));
    webgl2 = !!c.getContext("webgl2");
  } catch {
    /* ignore */
  }

  let ls = false;
  try {
    ls = typeof localStorage !== "undefined";
  } catch {
    /* ignore */
  }

  return [
    { label: "WebGL", ok: webgl },
    { label: "WebGL2", ok: webgl2 },
    { label: "WebGPU", ok: "gpu" in nav && !!nav.gpu },
    { label: "WebRTC", ok: "RTCPeerConnection" in w },
    { label: "Service Worker", ok: "serviceWorker" in navigator },
    { label: "WebAssembly", ok: typeof w.WebAssembly === "object" },
    { label: "IndexedDB", ok: !!w.indexedDB },
    { label: "Clipboard API", ok: "clipboard" in navigator },
    { label: "Notifications", ok: "Notification" in w },
    { label: "Geolocation", ok: "geolocation" in navigator },
    { label: "WebSocket", ok: "WebSocket" in w },
    { label: "SharedArrayBuffer", ok: typeof w.SharedArrayBuffer === "function" },
    { label: "Web Workers", ok: typeof w.Worker === "function" },
    { label: "localStorage", ok: ls },
    { label: "WebRTC Data Channel", ok: "RTCDataChannel" in w },
    { label: "Speech Synthesis", ok: "speechSynthesis" in w },
    { label: "Battery API", ok: "getBattery" in navigator },
    { label: "Vibration", ok: "vibrate" in navigator },
    { label: "Bluetooth", ok: "bluetooth" in navigator },
    { label: "WebUSB", ok: "usb" in navigator },
    { label: "Credentials API", ok: "credentials" in navigator },
    { label: "Payment Request", ok: "PaymentRequest" in w },
  ];
}

export default function FeatureDetectorTool() {
  const [features, setFeatures] = useState<Feature[] | null>(null);
  useEffect(() => setFeatures(detect()), []);

  if (!features) return null;

  const supported = features.filter((f) => f.ok).length;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        پشتیبانی از {supported.toLocaleString("fa-IR")} قابلیت از{" "}
        {features.length.toLocaleString("fa-IR")} مورد در این مرورگر.
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.label}
            className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
              f.ok
                ? "border-success/30 bg-success/10 text-success"
                : "border-border bg-surface-2 text-muted"
            }`}
          >
            <span dir="ltr">{f.label}</span>
            <span className="font-bold">{f.ok ? "✓" : "✗"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

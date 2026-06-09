"use client";

import { useEffect, useState } from "react";
import { CopyButton, Panel } from "@/components/tool/kit";

interface Info {
  ua: string;
  rows: { label: string; value: string }[];
  caps: { label: string; ok: boolean }[];
}

function detect(): Info {
  const ua = navigator.userAgent;
  let browser = "نامشخص";
  const m =
    ua.match(/(Firefox|Edg|OPR|Chrome|Safari)\/([\d.]+)/) ?? [];
  if (m[1]) {
    const name =
      m[1] === "Edg" ? "Edge" : m[1] === "OPR" ? "Opera" : m[1];
    browser = `${name} ${m[2]?.split(".")[0] ?? ""}`;
  }
  let os = "نامشخص";
  if (/Windows NT 10/.test(ua)) os = "Windows 10/11";
  else if (/Windows/.test(ua)) os = "Windows";
  else if (/Android/.test(ua)) os = "Android";
  else if (/iPhone|iPad|iPod/.test(ua)) os = "iOS";
  else if (/Mac OS X/.test(ua)) os = "macOS";
  else if (/Linux/.test(ua)) os = "Linux";

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    hardwareConcurrency?: number;
  };

  let webgl = false;
  try {
    const c = document.createElement("canvas");
    webgl = !!(c.getContext("webgl") || c.getContext("experimental-webgl"));
  } catch {
    /* ignore */
  }

  return {
    ua,
    rows: [
      { label: "مرورگر", value: browser },
      { label: "سیستم‌عامل", value: os },
      { label: "پلتفرم", value: nav.platform || "—" },
      { label: "زبان", value: nav.language || "—" },
      { label: "هسته‌های CPU", value: String(nav.hardwareConcurrency ?? "—") },
      { label: "حافظه (GB)", value: String(nav.deviceMemory ?? "—") },
      { label: "وضوح صفحه", value: `${screen.width} × ${screen.height}` },
      { label: "اندازه پنجره", value: `${innerWidth} × ${innerHeight}` },
      { label: "نسبت پیکسل", value: String(devicePixelRatio) },
    ],
    caps: [
      { label: "کوکی", ok: navigator.cookieEnabled },
      { label: "LocalStorage", ok: typeof localStorage !== "undefined" },
      { label: "Service Worker", ok: "serviceWorker" in navigator },
      { label: "WebGL", ok: webgl },
      { label: "لمسی", ok: "ontouchstart" in window || navigator.maxTouchPoints > 0 },
      { label: "آنلاین", ok: navigator.onLine },
    ],
  };
}

export default function UserAgentTool() {
  const [info, setInfo] = useState<Info | null>(null);
  useEffect(() => setInfo(detect()), []);

  if (!info) return null;

  return (
    <div className="space-y-4">
      <Panel title="User-Agent خام" actions={<CopyButton value={info.ua} />}>
        <code dir="ltr" className="block break-all font-mono text-sm text-fg">
          {info.ua}
        </code>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="اطلاعات">
          <div className="space-y-1.5">
            {info.rows.map((r) => (
              <div key={r.label} className="flex items-center justify-between text-sm">
                <span className="text-muted">{r.label}</span>
                <code dir="ltr" className="text-fg">
                  {r.value}
                </code>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="قابلیت‌ها">
          <div className="grid grid-cols-2 gap-2">
            {info.caps.map((c) => (
              <div
                key={c.label}
                className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
                  c.ok
                    ? "border-success/30 bg-success/10 text-success"
                    : "border-border bg-surface-2 text-muted"
                }`}
              >
                <span>{c.label}</span>
                <span>{c.ok ? "✓" : "✗"}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

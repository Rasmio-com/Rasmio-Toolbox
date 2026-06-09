"use client";

import { useMemo, useState } from "react";
import { CopyButton, ErrorNote, Field, Stat, TextInput } from "@/components/tool/kit";
import { toAsciiDigits } from "@/lib/utils";

function parseIPv4(s: string): number | null {
  const parts = s.split(".");
  if (parts.length !== 4) return null;
  let v = 0;
  for (const p of parts) {
    if (!/^\d{1,3}$/.test(p)) return null;
    const n = Number(p);
    if (n > 255) return null;
    v = v * 256 + n;
  }
  return v >>> 0;
}

function toIPv4(n: number): string {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
}

export default function Ipv4SubnetTool() {
  const [ip, setIp] = useState<string>("");
  const [prefix, setPrefix] = useState<string>("24");

  const { rows, stats, err } = useMemo(() => {
    const ipStr = toAsciiDigits(ip.trim());
    let host = ipStr;
    let pfx = toAsciiDigits(prefix.trim());
    if (ipStr.includes("/")) {
      const [a, b] = ipStr.split("/");
      host = a;
      pfx = toAsciiDigits(b.trim());
    }
    if (!host) return { rows: [], stats: [], err: "" };
    const addr = parseIPv4(host);
    if (addr === null) return { rows: [], stats: [], err: "آدرس IPv4 نامعتبر است." };
    const p = Number(pfx);
    if (!/^\d{1,2}$/.test(pfx) || p < 0 || p > 32)
      return { rows: [], stats: [], err: "پیشوند (prefix) باید عددی بین ۰ تا ۳۲ باشد." };

    const mask = p === 0 ? 0 : (0xffffffff << (32 - p)) >>> 0;
    const wildcard = (~mask) >>> 0;
    const network = (addr & mask) >>> 0;
    const broadcast = (network | wildcard) >>> 0;
    const total = Math.pow(2, 32 - p);
    const usable = p >= 31 ? (p === 32 ? 1 : 2) : total - 2;
    const firstHost = p >= 31 ? network : (network + 1) >>> 0;
    const lastHost = p >= 31 ? broadcast : (broadcast - 1) >>> 0;

    return {
      rows: [
        { label: "آدرس شبکه", value: `${toIPv4(network)}/${p}` },
        { label: "آدرس Broadcast", value: toIPv4(broadcast) },
        { label: "اولین میزبان قابل‌استفاده", value: toIPv4(firstHost) },
        { label: "آخرین میزبان قابل‌استفاده", value: toIPv4(lastHost) },
        { label: "ماسک زیرشبکه", value: toIPv4(mask) },
        { label: "ماسک Wildcard", value: toIPv4(wildcard) },
        { label: "IP به‌صورت عدد ۳۲ بیتی", value: String(addr) },
      ],
      stats: [
        { label: "کل آدرس‌ها", value: total.toLocaleString("en-US") },
        { label: "میزبان‌های قابل‌استفاده", value: usable.toLocaleString("en-US") },
        { label: "پیشوند", value: `/${p}` },
      ],
      err: "",
    };
  }, [ip, prefix]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <Field label="آدرس IP یا CIDR" hint="مثلاً 192.168.1.10/24">
          <TextInput
            mono
            dir="ltr"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="192.168.1.10 یا 192.168.1.10/24"
          />
        </Field>
        <Field label="پیشوند" className="sm:w-28">
          <TextInput
            mono
            dir="ltr"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            placeholder="24"
          />
        </Field>
      </div>
      {err && <ErrorNote>{err}</ErrorNote>}
      {stats.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <Stat key={s.label} label={s.label} value={s.value} />
          ))}
        </div>
      )}
      {rows.length > 0 && (
        <div className="space-y-2">
          {rows.map((r) => (
            <div
              key={r.label}
              className="flex items-center gap-3 rounded-xl border border-border bg-bg-soft px-3 py-2.5"
            >
              <span className="w-56 shrink-0 text-xs text-saffron">{r.label}</span>
              <code dir="ltr" className="min-w-0 flex-1 truncate font-mono text-sm text-fg">
                {r.value}
              </code>
              <CopyButton value={r.value} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

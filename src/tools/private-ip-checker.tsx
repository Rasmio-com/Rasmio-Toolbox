"use client";

import { useMemo, useState } from "react";
import { Globe, Lock, Server } from "lucide-react";
import { ErrorNote, Field, TextInput } from "@/components/tool/kit";
import { toAsciiDigits } from "@/lib/utils";

function parseIPv4(s: string): number[] | null {
  const parts = s.split(".");
  if (parts.length !== 4) return null;
  const out: number[] = [];
  for (const p of parts) {
    if (!/^\d{1,3}$/.test(p)) return null;
    const n = Number(p);
    if (n > 255) return null;
    out.push(n);
  }
  return out;
}

function classifyV4(o: number[]): { kind: string; scope: string } {
  const [a, b] = o;
  if (a === 10) return { kind: "خصوصی (RFC1918)", scope: "private" };
  if (a === 172 && b >= 16 && b <= 31) return { kind: "خصوصی (RFC1918)", scope: "private" };
  if (a === 192 && b === 168) return { kind: "خصوصی (RFC1918)", scope: "private" };
  if (a === 127) return { kind: "حلقهٔ بازگشتی (Loopback)", scope: "loopback" };
  if (a === 169 && b === 254) return { kind: "Link-local (APIPA)", scope: "link-local" };
  if (a >= 224 && a <= 239) return { kind: "Multicast", scope: "multicast" };
  if (a === 100 && b >= 64 && b <= 127) return { kind: "CGNAT خصوصی (RFC6598)", scope: "private" };
  if (a === 0) return { kind: "رزرو‌شده (this network)", scope: "reserved" };
  if (a >= 240) return { kind: "رزرو‌شده (Experimental)", scope: "reserved" };
  return { kind: "عمومی (Public)", scope: "public" };
}

function parseIPv6Groups(s: string): number[] | null {
  if (s.indexOf("::") !== s.lastIndexOf("::")) return null;
  const dbl = s.includes("::");
  let head: string[] = [];
  let tail: string[] = [];
  if (dbl) {
    const [h, t] = s.split("::");
    head = h ? h.split(":") : [];
    tail = t ? t.split(":") : [];
  } else {
    head = s.split(":");
  }
  const valid = (g: string) => /^[0-9a-fA-F]{1,4}$/.test(g);
  if (!head.every(valid) || !tail.every(valid)) return null;
  const hv = head.map((g) => parseInt(g, 16));
  const tv = tail.map((g) => parseInt(g, 16));
  if (dbl) {
    if (hv.length + tv.length > 7) return null;
    return [...hv, ...new Array(8 - hv.length - tv.length).fill(0), ...tv];
  }
  return hv.length === 8 ? hv : null;
}

function classifyV6(g: number[]): { kind: string; scope: string } {
  const first = g[0];
  if (g.every((x, i) => (i < 7 ? x === 0 : x === 1))) return { kind: "حلقهٔ بازگشتی (::1)", scope: "loopback" };
  if (g.every((x) => x === 0)) return { kind: "نامشخص (::)", scope: "reserved" };
  if ((first & 0xffc0) === 0xfe80) return { kind: "Link-local (fe80::/10)", scope: "link-local" };
  if ((first & 0xfe00) === 0xfc00) return { kind: "خصوصی (Unique Local، fc00::/7)", scope: "private" };
  if ((first & 0xff00) === 0xff00) return { kind: "Multicast (ff00::/8)", scope: "multicast" };
  if ((first & 0xe000) === 0x2000) return { kind: "عمومی (Global Unicast)", scope: "public" };
  return { kind: "رزرو‌شده / سایر", scope: "reserved" };
}

const STYLE: Record<string, { cls: string; icon: typeof Globe }> = {
  public: { cls: "border-success/40 bg-success/10 text-success", icon: Globe },
  private: { cls: "border-saffron/40 bg-saffron/10 text-saffron", icon: Lock },
  loopback: { cls: "border-turquoise-dim bg-turquoise/10 text-turquoise", icon: Server },
  "link-local": { cls: "border-turquoise-dim bg-turquoise/10 text-turquoise", icon: Server },
  multicast: { cls: "border-turquoise-dim bg-turquoise/10 text-turquoise", icon: Server },
  reserved: { cls: "border-border bg-bg-soft text-muted", icon: Server },
};

export default function PrivateIpCheckerTool() {
  const [input, setInput] = useState<string>("");

  const res = useMemo(() => {
    const s = toAsciiDigits(input.trim());
    if (!s) return null;
    const v4 = parseIPv4(s);
    if (v4) return { version: "IPv4", ...classifyV4(v4), err: "" };
    const v6 = parseIPv6Groups(s);
    if (v6) return { version: "IPv6", ...classifyV6(v6), err: "" };
    return { err: "آدرس IPv4 یا IPv6 معتبر نیست.", version: "", kind: "", scope: "" };
  }, [input]);

  return (
    <div className="space-y-4">
      <Field label="آدرس IP">
        <TextInput
          mono
          dir="ltr"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="10.0.0.5 یا fe80::1"
        />
      </Field>
      {res?.err && <ErrorNote>{res.err}</ErrorNote>}
      {res && !res.err && res.scope && (
        <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${STYLE[res.scope].cls}`}>
          {(() => {
            const Icon = STYLE[res.scope].icon;
            return <Icon className="size-5 shrink-0" />;
          })()}
          <div>
            <div className="font-semibold">{res.kind}</div>
            <div className="text-sm text-muted">نسخه: {res.version}</div>
          </div>
        </div>
      )}
      {!res && (
        <p className="text-sm text-muted">آدرس را وارد کنید تا خصوصی یا عمومی بودن آن مشخص شود.</p>
      )}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { ErrorNote, Field, Panel, Segmented, TextArea } from "@/components/tool/kit";

type Mode = "set" | "cookie";

const ATTR_FA: Record<string, string> = {
  Domain: "دامنه‌ای که کوکی برای آن ارسال می‌شود.",
  Path: "مسیری که کوکی در آن معتبر است.",
  Expires: "تاریخ انقضای کوکی (پس از آن حذف می‌شود).",
  "Max-Age": "طول عمر کوکی بر حسب ثانیه.",
  Secure: "فقط روی اتصال HTTPS ارسال می‌شود.",
  HttpOnly: "از دسترس JavaScript خارج است (ضد XSS).",
  SameSite: "سیاست ارسال در درخواست‌های میان‌سایتی (Lax/Strict/None).",
  Priority: "اولویت نگه‌داری کوکی توسط مرورگر.",
  Partitioned: "کوکی پارتیشن‌بندی‌شده بر اساس سایت بالادست.",
};

type Parsed = { name: string; value: string; attrs: [string, string][] };

function parseSetCookie(line: string): Parsed | null {
  const parts = line.split(";").map((p) => p.trim()).filter(Boolean);
  if (!parts.length) return null;
  const eq = parts[0].indexOf("=");
  if (eq === -1) return null;
  const name = parts[0].slice(0, eq).trim();
  const value = parts[0].slice(eq + 1).trim();
  const attrs: [string, string][] = [];
  for (const p of parts.slice(1)) {
    const i = p.indexOf("=");
    if (i === -1) attrs.push([normAttr(p), "✓"]);
    else attrs.push([normAttr(p.slice(0, i)), p.slice(i + 1).trim()]);
  }
  return { name, value, attrs };
}

function normAttr(a: string): string {
  const key = a.trim().toLowerCase();
  const map: Record<string, string> = {
    domain: "Domain",
    path: "Path",
    expires: "Expires",
    "max-age": "Max-Age",
    secure: "Secure",
    httponly: "HttpOnly",
    samesite: "SameSite",
    priority: "Priority",
    partitioned: "Partitioned",
  };
  return map[key] ?? a.trim();
}

export default function CookieParserTool() {
  const [mode, setMode] = useState<Mode>("set");
  const [input, setInput] = useState("");

  const { items, err } = useMemo(() => {
    const raw = input.trim();
    if (!raw) return { items: [] as Parsed[], err: "" };
    try {
      if (mode === "set") {
        // One Set-Cookie per non-empty line.
        const lines = raw.split(/\r?\n/).map((l) => l.replace(/^set-cookie:\s*/i, "").trim()).filter(Boolean);
        const parsed = lines.map(parseSetCookie).filter((p): p is Parsed => !!p);
        if (!parsed.length) return { items: [], err: "هیچ کوکی معتبری یافت نشد." };
        return { items: parsed, err: "" };
      }
      // Cookie header: many name=value pairs separated by ;
      const clean = raw.replace(/^cookie:\s*/i, "");
      const pairs = clean.split(/;/).map((p) => p.trim()).filter(Boolean);
      const parsed: Parsed[] = [];
      for (const p of pairs) {
        const i = p.indexOf("=");
        if (i === -1) continue;
        parsed.push({ name: p.slice(0, i).trim(), value: p.slice(i + 1).trim(), attrs: [] });
      }
      if (!parsed.length) return { items: [], err: "هیچ جفت نام=مقداری یافت نشد." };
      return { items: parsed, err: "" };
    } catch {
      return { items: [], err: "ورودی نامعتبر است." };
    }
  }, [input, mode]);

  return (
    <div className="space-y-4">
      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: "set", label: "هدر Set-Cookie" },
          { value: "cookie", label: "هدر Cookie" },
        ]}
      />
      <Field label={mode === "set" ? "هدر Set-Cookie (هر خط یک کوکی)" : "هدر Cookie"}>
        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === "set"
              ? "id=a3fWa; Expires=Wed, 21 Oct 2025 07:28:00 GMT; Secure; HttpOnly; SameSite=Lax"
              : "id=a3fWa; theme=dark; lang=fa"
          }
          className="min-h-28"
        />
      </Field>

      {err && <ErrorNote>{err}</ErrorNote>}

      {items.map((c, idx) => (
        <Panel key={idx} title={<span dir="ltr">{c.name}</span>}>
          <div className="space-y-1.5 text-sm">
            <div className="flex items-center gap-3" dir="ltr">
              <span className="w-24 shrink-0 font-mono text-xs text-saffron">Value</span>
              <code className="min-w-0 flex-1 break-all text-fg">{c.value || "—"}</code>
            </div>
            {c.attrs.map(([k, v], i) => (
              <div key={i} className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                <span dir="ltr" className="w-24 shrink-0 font-mono text-xs text-saffron">{k}</span>
                <code dir="ltr" className="text-fg">{v}</code>
                {ATTR_FA[k] && <span className="text-xs text-muted">— {ATTR_FA[k]}</span>}
              </div>
            ))}
          </div>
        </Panel>
      ))}
    </div>
  );
}

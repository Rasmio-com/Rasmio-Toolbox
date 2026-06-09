"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Field, Grid2, Select, TextArea } from "@/components/tool/kit";

type Kind =
  | "Email" | "URL" | "Domain" | "IPv4" | "IPv6" | "MAC"
  | "UUID" | "Hex Color" | "Base64" | "JSON" | "Slug" | "Phone";

const KINDS: Kind[] = [
  "Email", "URL", "Domain", "IPv4", "IPv6", "MAC",
  "UUID", "Hex Color", "Base64", "JSON", "Slug", "Phone",
];

type Res = { ok: boolean; detail: string };

function ipv4(s: string): boolean {
  const p = s.split(".");
  if (p.length !== 4) return false;
  return p.every((x) => /^\d{1,3}$/.test(x) && (x.length === 1 || x[0] !== "0") && +x <= 255);
}

function ipv6(s: string): boolean {
  if (s.indexOf("::") !== s.lastIndexOf("::")) return false;
  const dbl = s.includes("::");
  let g = s.split(":");
  if (dbl) {
    g = g.filter((x, i) => !(x === "" && i !== 0 && i !== g.length - 1));
    if (g[0] === "") g = g.slice(1);
    if (g[g.length - 1] === "") g = g.slice(0, -1);
  }
  let n = 0;
  for (let i = 0; i < g.length; i++) {
    const x = g[i];
    if (x.includes(".")) {
      if (i !== g.length - 1 || !ipv4(x)) return false;
      n += 2; continue;
    }
    if (!/^[0-9a-fA-F]{1,4}$/.test(x)) return false;
    n += 1;
  }
  return dbl ? n <= 7 : n === 8;
}

function check(kind: Kind, raw: string): Res {
  const v = raw.trim();
  switch (kind) {
    case "Email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
        ? { ok: true, detail: "قالب آدرس ایمیل معتبر است." }
        : { ok: false, detail: "باید به شکل name@example.com باشد." };
    case "URL":
      try { new URL(v); return { ok: true, detail: `پروتکل: ${new URL(v).protocol.replace(":", "")}` }; }
      catch { return { ok: false, detail: "نشانی معتبر نیست (پروتکل را هم بنویسید، مثلاً https://)." }; }
    case "Domain":
      return /^(?=.{1,253}$)(?!-)[a-zA-Z0-9-]{1,63}(?<!-)(\.(?!-)[a-zA-Z0-9-]{1,63}(?<!-))+$/.test(v)
        ? { ok: true, detail: "نام دامنهٔ معتبر." }
        : { ok: false, detail: "نام دامنه معتبر نیست، مثلاً example.com." };
    case "IPv4":
      return ipv4(v) ? { ok: true, detail: "آدرس IPv4 معتبر (۳۲ بیت)." } : { ok: false, detail: "چهار عدد ۰ تا ۲۵۵ جداشده با نقطه لازم است." };
    case "IPv6":
      return ipv6(v) ? { ok: true, detail: "آدرس IPv6 معتبر (۱۲۸ بیت)." } : { ok: false, detail: "قالب IPv6 معتبر نیست." };
    case "MAC":
      return /^([0-9A-Fa-f]{2}([:-])){5}[0-9A-Fa-f]{2}$|^[0-9A-Fa-f]{4}(\.[0-9A-Fa-f]{4}){2}$/.test(v)
        ? { ok: true, detail: "آدرس MAC معتبر (۴۸ بیت)." }
        : { ok: false, detail: "مثلاً 00:1A:2B:3C:4D:5E." };
    case "UUID":
      return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(v)
        ? { ok: true, detail: `نسخهٔ UUID: ${v[14]}` }
        : { ok: false, detail: "قالب UUID نسخهٔ ۱ تا ۵ معتبر نیست." };
    case "Hex Color":
      return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(v)
        ? { ok: true, detail: "رنگ Hex معتبر (۳، ۴، ۶ یا ۸ رقمی)." }
        : { ok: false, detail: "مثلاً ‎#1e90ff یا ‎#fff." };
    case "Base64":
      if (!/^[A-Za-z0-9+/]+={0,2}$/.test(v) || v.length % 4 !== 0)
        return { ok: false, detail: "طول باید مضرب ۴ و فقط نویسه‌های Base64 باشد." };
      try { atob(v); return { ok: true, detail: "رشتهٔ Base64 معتبر و قابل رمزگشایی است." }; }
      catch { return { ok: false, detail: "رمزگشایی Base64 ناموفق بود." }; }
    case "JSON":
      try { JSON.parse(v); return { ok: true, detail: `نوع ریشه: ${Array.isArray(JSON.parse(v)) ? "array" : typeof JSON.parse(v)}` }; }
      catch (e) { return { ok: false, detail: e instanceof Error ? e.message : "JSON نامعتبر." }; }
    case "Slug":
      return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v)
        ? { ok: true, detail: "Slug معتبر (حروف کوچک، ارقام و خط تیره)." }
        : { ok: false, detail: "فقط حروف کوچک، ارقام و خط تیرهٔ میانی مجاز است." };
    case "Phone": {
      const digits = v.replace(/[\s().-]/g, "");
      return /^\+?\d{7,15}$/.test(digits)
        ? { ok: true, detail: "شمارهٔ تلفن در قالب بین‌المللی E.164 معتبر است." }
        : { ok: false, detail: "۷ تا ۱۵ رقم، در صورت نیاز با + ابتدای آن." };
    }
  }
}

export default function ValidatorSuiteTool() {
  const [kind, setKind] = useState<Kind>("Email");
  const [input, setInput] = useState("");

  const res = useMemo(() => (input.trim() ? check(kind, input) : null), [kind, input]);

  return (
    <div className="space-y-4">
      <Grid2>
        <Field label="نوع داده">
          <Select value={kind} onChange={(e) => setKind(e.target.value as Kind)}>
            {KINDS.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </Select>
        </Field>
        <Field label="ورودی">
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="مقدار را برای اعتبارسنجی وارد کنید"
            className="min-h-24"
          />
        </Field>
      </Grid2>

      {res && (
        <div
          className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
            res.ok ? "border-success/40 bg-success/10 text-success" : "border-danger/40 bg-danger/10 text-danger"
          }`}
        >
          {res.ok ? <CheckCircle2 className="size-5 shrink-0" /> : <XCircle className="size-5 shrink-0" />}
          <div>
            <div className="font-semibold">{res.ok ? "معتبر" : "نامعتبر"} · {kind}</div>
            <div dir="auto" className="text-sm text-muted">{res.detail}</div>
          </div>
        </div>
      )}
      {!res && <p className="text-sm text-muted">یک نوع را انتخاب و مقداری وارد کنید.</p>}
    </div>
  );
}

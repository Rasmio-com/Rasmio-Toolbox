"use client";

import { useMemo, useState } from "react";
import { Field, Output, Panel, Segmented, TextInput, Toggle } from "@/components/tool/kit";
import { toAsciiDigits } from "@/lib/utils";

const DESCRIPTIONS: Record<string, string> = {
  "no-cache": "پاسخ کش می‌شود اما پیش از استفاده باید با سرور اعتبارسنجی شود.",
  "no-store": "هیچ نسخه‌ای نباید ذخیره شود (نه مرورگر، نه واسط).",
  public: "پاسخ توسط هر کشی (از جمله CDN و پروکسی) قابل ذخیره است.",
  private: "فقط مرورگر کاربر می‌تواند کش کند، نه کش‌های مشترک.",
  "must-revalidate": "پس از منقضی‌شدن، استفادهٔ مجدد بدون اعتبارسنجی ممنوع است.",
  "proxy-revalidate": "مانند must-revalidate اما فقط برای کش‌های مشترک.",
  immutable: "محتوا تا زمان انقضا تغییر نمی‌کند؛ نیازی به اعتبارسنجی مجدد نیست.",
  "no-transform": "واسط‌ها اجازهٔ تغییر محتوا (مثلاً فشرده‌سازی) را ندارند.",
};

function describeDirective(token: string): string {
  const [name, val] = token.split("=");
  const n = name.trim().toLowerCase();
  if (n === "max-age") return `حداکثر مدت تازگی پاسخ ${val ?? "?"} ثانیه است.`;
  if (n === "s-maxage") return `برای کش‌های مشترک، مدت تازگی ${val ?? "?"} ثانیه است.`;
  if (n === "stale-while-revalidate") return `تا ${val ?? "?"} ثانیه می‌توان از نسخهٔ کهنه هنگام اعتبارسنجی استفاده کرد.`;
  if (n === "max-stale") return `پذیرش پاسخ کهنه تا ${val ?? "?"} ثانیه.`;
  if (n === "min-fresh") return `پاسخ باید حداقل ${val ?? "?"} ثانیه دیگر تازه بماند.`;
  return DESCRIPTIONS[n] ?? "دایرکتیو ناشناخته.";
}

export default function CacheControlTool() {
  const [mode, setMode] = useState<"build" | "parse">("build");

  // build state
  const [maxAge, setMaxAge] = useState("");
  const [sMaxAge, setSMaxAge] = useState("");
  const [visibility, setVisibility] = useState<"none" | "public" | "private">("none");
  const [noCache, setNoCache] = useState(false);
  const [noStore, setNoStore] = useState(false);
  const [mustReval, setMustReval] = useState(false);
  const [immutable, setImmutable] = useState(false);

  // parse state
  const [input, setInput] = useState("");

  const built = useMemo(() => {
    if (mode !== "build") return "";
    const d: string[] = [];
    if (visibility !== "none") d.push(visibility);
    if (noStore) d.push("no-store");
    if (noCache) d.push("no-cache");
    const ma = toAsciiDigits(maxAge).trim();
    if (ma && /^\d+$/.test(ma)) d.push(`max-age=${ma}`);
    const sma = toAsciiDigits(sMaxAge).trim();
    if (sma && /^\d+$/.test(sma)) d.push(`s-maxage=${sma}`);
    if (mustReval) d.push("must-revalidate");
    if (immutable) d.push("immutable");
    return d.length ? "Cache-Control: " + d.join(", ") : "";
  }, [mode, visibility, noStore, noCache, maxAge, sMaxAge, mustReval, immutable]);

  const parsed = useMemo(() => {
    if (mode !== "parse" || !input.trim()) return [];
    const raw = input.replace(/^\s*Cache-Control:\s*/i, "").trim();
    return raw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => ({ token: t, desc: describeDirective(t) }));
  }, [mode, input]);

  return (
    <div className="space-y-4">
      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: "build", label: "ساخت" },
          { value: "parse", label: "تجزیه" },
        ]}
      />

      {mode === "build" ? (
        <>
          <Field label="دیدپذیری">
            <Segmented
              value={visibility}
              onChange={setVisibility}
              options={[
                { value: "none", label: "—" },
                { value: "public", label: "public" },
                { value: "private", label: "private" },
              ]}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="max-age (ثانیه)">
              <TextInput mono dir="ltr" value={maxAge} onChange={(e) => setMaxAge(e.target.value)} placeholder="3600" />
            </Field>
            <Field label="s-maxage (ثانیه)">
              <TextInput mono dir="ltr" value={sMaxAge} onChange={(e) => setSMaxAge(e.target.value)} placeholder="86400" />
            </Field>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <Toggle checked={noCache} onChange={setNoCache} label="no-cache" />
            <Toggle checked={noStore} onChange={setNoStore} label="no-store" />
            <Toggle checked={mustReval} onChange={setMustReval} label="must-revalidate" />
            <Toggle checked={immutable} onChange={setImmutable} label="immutable" />
          </div>
          <Output label="هدر Cache-Control" value={built} />
        </>
      ) : (
        <>
          <Field label="مقدار Cache-Control" hint="با یا بدون پیشوند هدر">
            <TextInput
              mono dir="ltr"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="public, max-age=3600, must-revalidate"
            />
          </Field>
          {parsed.length > 0 && (
            <Panel title="توضیح دایرکتیوها">
              <ul className="space-y-2 text-sm">
                {parsed.map((p, i) => (
                  <li key={i}>
                    <code dir="ltr" className="font-semibold text-turquoise">{p.token}</code>
                    <span className="mx-1 text-faint">—</span>
                    <span className="text-fg">{p.desc}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </>
      )}
    </div>
  );
}

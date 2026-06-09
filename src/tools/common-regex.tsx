"use client";

import { useMemo, useState } from "react";
import { CopyButton, Field, Panel, TextArea, TextInput } from "@/components/tool/kit";
import { cn } from "@/lib/utils";

type Pat = { id: string; fa: string; pattern: string; flags: string; sample: string };

const PATTERNS: Pat[] = [
  { id: "email", fa: "ایمیل", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", flags: "g", sample: "user.name@example.com" },
  { id: "url", fa: "آدرس وب (URL)", pattern: "https?:\\/\\/[^\\s/$.?#].[^\\s]*", flags: "gi", sample: "https://rasm.io/path?x=1" },
  { id: "ipv4", fa: "IPv4", pattern: "\\b(?:(?:25[0-5]|2[0-4]\\d|1?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1?\\d?\\d)\\b", flags: "g", sample: "192.168.1.1" },
  { id: "date", fa: "تاریخ (YYYY-MM-DD)", pattern: "\\b\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])\\b", flags: "g", sample: "2026-06-06" },
  { id: "time", fa: "زمان (HH:MM یا HH:MM:SS)", pattern: "\\b([01]?\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d)?\\b", flags: "g", sample: "14:30:00" },
  { id: "phone-ir", fa: "موبایل ایران", pattern: "\\b(?:\\+98|0)?9\\d{9}\\b", flags: "g", sample: "09123456789" },
  { id: "hex-color", fa: "رنگ Hex", pattern: "#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\\b", flags: "g", sample: "#2dd4bf" },
  { id: "slug", fa: "اسلاگ (slug)", pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$", flags: "", sample: "my-cool-post-1" },
  { id: "uuid", fa: "UUID", pattern: "\\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}\\b", flags: "g", sample: "550e8400-e29b-41d4-a716-446655440000" },
  { id: "ipv6", fa: "IPv6 (ساده)", pattern: "\\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\\b", flags: "g", sample: "2001:0db8:85a3:0000:0000:8a2e:0370:7334" },
  { id: "creditcard", fa: "شماره کارت (۱۶ رقمی)", pattern: "\\b(?:\\d[ -]?){16}\\b", flags: "g", sample: "1234 5678 9012 3456" },
  { id: "username", fa: "نام کاربری", pattern: "^[a-zA-Z0-9_]{3,20}$", flags: "", sample: "rasm_user" },
];

export default function CommonRegexTool() {
  const [selId, setSelId] = useState<string>(PATTERNS[0].id);
  const [test, setTest] = useState("");

  const sel = useMemo(() => PATTERNS.find((p) => p.id === selId) ?? PATTERNS[0], [selId]);

  const result = useMemo(() => {
    const text = test || sel.sample;
    try {
      const re = new RegExp(sel.pattern, sel.flags.includes("g") ? sel.flags : sel.flags + "g");
      const matches = [...text.matchAll(re)].map((m) => m[0]);
      return { matches, err: "" };
    } catch (e) {
      return { matches: [], err: (e as Error).message };
    }
  }, [sel, test]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {PATTERNS.map((p) => (
          <div
            key={p.id}
            onClick={() => setSelId(p.id)}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors",
              p.id === selId
                ? "border-turquoise-dim bg-turquoise/10"
                : "border-border bg-bg-soft hover:border-turquoise-dim",
            )}
          >
            <span className="w-32 shrink-0 text-sm text-fg">{p.fa}</span>
            <code dir="ltr" className="min-w-0 flex-1 truncate font-mono text-xs text-muted" title={p.pattern}>
              /{p.pattern}/{p.flags}
            </code>
            <div onClick={(e) => e.stopPropagation()}>
              <CopyButton value={p.pattern} />
            </div>
          </div>
        ))}
      </div>

      <Panel title={`آزمایش الگو: ${sel.fa}`}>
        <Field label="متن آزمایشی" hint={`نمونه: ${sel.sample}`}>
          <TextInput
            mono
            dir="ltr"
            value={test}
            onChange={(e) => setTest(e.target.value)}
            placeholder={sel.sample}
          />
        </Field>
        <div className="mt-3">
          {result.err ? (
            <p className="text-sm text-danger">{result.err}</p>
          ) : result.matches.length > 0 ? (
            <div className="space-y-1.5">
              <p className="text-xs text-muted">
                {result.matches.length.toLocaleString("fa-IR")} تطبیق در «{test ? "متن شما" : "نمونه"}»
              </p>
              <TextArea readOnly dir="ltr" value={result.matches.join("\n")} className="min-h-24" />
            </div>
          ) : (
            <p className="text-sm text-faint">بدون تطبیق.</p>
          )}
        </div>
      </Panel>
    </div>
  );
}

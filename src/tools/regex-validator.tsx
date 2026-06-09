"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { ErrorNote, Field, Panel, Stat, TextInput } from "@/components/tool/kit";

const FLAG_NAMES: Record<string, string> = {
  g: "سراسری (global)",
  i: "بی‌توجه به بزرگی/کوچکی (ignoreCase)",
  m: "چندخطی (multiline)",
  s: "نقطه شامل خط جدید (dotAll)",
  u: "یونیکد (unicode)",
  y: "چسبان (sticky)",
  d: "اندیس‌ها (hasIndices)",
};

// Parse a /pattern/flags literal, or treat the whole string as a pattern.
function split(input: string): { source: string; flags: string } {
  const m = /^\/((?:\\.|[^/\\])*)\/([a-z]*)$/.exec(input);
  if (m) return { source: m[1], flags: m[2] };
  return { source: input, flags: "" };
}

export default function RegexValidatorTool() {
  const [input, setInput] = useState("");

  const result = useMemo(() => {
    if (!input.trim()) return null;
    const { source, flags } = split(input);

    // Validate flags first for a clearer message (RegExp throws on bad/dup flags too).
    const seen = new Set<string>();
    for (const f of flags) {
      if (!(f in FLAG_NAMES)) return { ok: false, source, flags, error: `پرچم ناشناخته: «${f}».` };
      if (seen.has(f)) return { ok: false, source, flags, error: `پرچم تکراری: «${f}».` };
      seen.add(f);
    }

    try {
      const re = new RegExp(source, flags);
      return { ok: true, source, flags, re };
    } catch (e) {
      return { ok: false, source, flags, error: e instanceof Error ? e.message : "الگوی نامعتبر است." };
    }
  }, [input]);

  return (
    <div className="space-y-4">
      <Field label="الگوی Regex" hint="می‌توانید قالب ‎/pattern/flags‎ هم بدهید">
        <TextInput
          mono
          dir="ltr"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="^\d{3}-\d{4}$  یا  /foo.*bar/gi"
        />
      </Field>

      {result && (
        <>
          <div
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
              result.ok ? "border-success/40 bg-success/10 text-success" : "border-danger/40 bg-danger/10 text-danger"
            }`}
          >
            {result.ok ? <CheckCircle2 className="size-5 shrink-0" /> : <XCircle className="size-5 shrink-0" />}
            <div className="font-semibold">
              {result.ok ? "الگوی معتبر — با موفقیت کامپایل شد" : "الگوی نامعتبر"}
            </div>
          </div>

          {!result.ok && <ErrorNote>{result.error}</ErrorNote>}

          {result.ok && (
            <Panel title="جزئیات">
              <div className="grid grid-cols-2 gap-3">
                <Stat label="منبع (source)" value={<code dir="ltr" className="text-sm break-all">{result.re?.source}</code>} />
                <Stat label="تعداد پرچم‌ها" value={result.flags.length} />
              </div>
              {result.flags ? (
                <ul className="mt-3 space-y-1 text-sm text-muted">
                  {[...result.flags].map((f) => (
                    <li key={f}>
                      <code dir="ltr">{f}</code> — {FLAG_NAMES[f]}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-xs text-faint">هیچ پرچمی تعیین نشده است.</p>
              )}
            </Panel>
          )}
        </>
      )}

      {!result && <p className="text-sm text-muted">یک الگوی عبارت باقاعده وارد کنید تا اعتبارسنجی شود.</p>}
    </div>
  );
}

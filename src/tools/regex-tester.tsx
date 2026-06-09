"use client";

import { useMemo, useState } from "react";
import {
  ErrorNote,
  Field,
  Output,
  Panel,
  Segmented,
  TextArea,
  TextInput,
} from "@/components/tool/kit";
import { cn } from "@/lib/utils";

const FLAGS: { f: string; en: string; fa: string }[] = [
  { f: "g", en: "global", fa: "سراسری" },
  { f: "i", en: "ignore case", fa: "بی‌توجه به بزرگی/کوچکی" },
  { f: "m", en: "multiline", fa: "چندخطی" },
  { f: "s", en: "dotAll", fa: "نقطه شامل خط جدید" },
  { f: "u", en: "unicode", fa: "یونیکد" },
  { f: "y", en: "sticky", fa: "چسبان" },
];

export default function RegexTesterTool() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [test, setTest] = useState("");
  const [view, setView] = useState<"highlight" | "matches">("highlight");
  const [replacement, setReplacement] = useState("");

  const toggleFlag = (f: string) =>
    setFlags((cur) => (cur.includes(f) ? cur.replace(f, "") : cur + f));

  const { error, matches, parts, matchList, replaced } = useMemo(() => {
    const empty = {
      error: "",
      matches: [] as RegExpMatchArray[],
      parts: [] as { t: string; hit: boolean }[],
      matchList: "",
      replaced: "",
    };
    if (!pattern) return empty;
    let re: RegExp;
    try {
      re = new RegExp(pattern, flags);
    } catch (e) {
      return { ...empty, error: (e as Error).message };
    }
    const ms: RegExpMatchArray[] = [];
    if (flags.includes("g")) {
      for (const m of test.matchAll(re)) ms.push(m);
    } else {
      const m = re.exec(test);
      if (m) ms.push(m);
    }
    const parts: { t: string; hit: boolean }[] = [];
    let last = 0;
    for (const m of ms) {
      const start = m.index ?? 0;
      if (start > last) parts.push({ t: test.slice(last, start), hit: false });
      parts.push({ t: m[0], hit: true });
      last = start + m[0].length;
      if (m[0].length === 0) last++;
    }
    if (last < test.length) parts.push({ t: test.slice(last), hit: false });

    let replaced = "";
    try {
      replaced = test.replace(re, replacement);
    } catch {
      replaced = "";
    }
    return {
      error: "",
      matches: ms,
      parts,
      matchList: ms.map((m) => m[0]).join("\n"),
      replaced,
    };
  }, [pattern, flags, test, replacement]);

  return (
    <div className="space-y-4">
      <Field label="الگوی Regex">
        <div className="flex items-center gap-2">
          <span className="font-mono text-lg text-faint">/</span>
          <TextInput
            mono
            dir="ltr"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="\b\w+@\w+\.\w+\b"
          />
          <span className="font-mono text-lg text-faint">/{flags}</span>
        </div>
      </Field>

      {/* Flags with visible labels */}
      <div className="flex flex-wrap gap-2">
        {FLAGS.map(({ f, en, fa }) => (
          <button
            key={f}
            onClick={() => toggleFlag(f)}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors",
              flags.includes(f)
                ? "border-turquoise-dim bg-turquoise/15 text-turquoise"
                : "border-border bg-surface-2 text-muted hover:text-fg",
            )}
          >
            <span className="font-mono text-base font-bold">{f}</span>
            <span className="text-xs">
              {fa} <span className="text-faint">· {en}</span>
            </span>
          </button>
        ))}
      </div>

      <Field label="متن آزمایشی">
        <TextArea
          value={test}
          onChange={(e) => setTest(e.target.value)}
          placeholder="متنی که می‌خواهید الگو روی آن آزمایش شود…"
          className="min-h-32"
        />
      </Field>

      {error && <ErrorNote>{error}</ErrorNote>}

      {!error && pattern && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-muted">
              {matches.length.toLocaleString("fa-IR")} تطبیق یافت شد
            </span>
            <Segmented
              value={view}
              onChange={setView}
              options={[
                { value: "highlight", label: "هایلایت" },
                { value: "matches", label: "فقط موارد یافت‌شده" },
              ]}
            />
          </div>

          {view === "highlight" ? (
            <Panel title="پیش‌نمایش">
              <div
                dir="ltr"
                className="max-h-60 overflow-auto whitespace-pre-wrap break-words font-mono text-sm leading-relaxed"
              >
                {parts.length ? (
                  parts.map((p, i) =>
                    p.hit ? (
                      <mark key={i} className="rounded bg-turquoise/30 text-fg">
                        {p.t}
                      </mark>
                    ) : (
                      <span key={i} className="text-muted">
                        {p.t}
                      </span>
                    ),
                  )
                ) : (
                  <span className="text-faint">بدون تطبیق</span>
                )}
              </div>
            </Panel>
          ) : (
            <Output
              label="موارد یافت‌شده (هر کدام در یک خط)"
              value={matchList}
              placeholder="موردی یافت نشد"
            />
          )}

          {matches.length > 0 && matches[0].length > 1 && (
            <Panel title="گروه‌های اولین تطبیق">
              <div className="space-y-1 font-mono text-sm" dir="ltr">
                {matches[0].slice(1).map((g, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="w-10 shrink-0 text-saffron">${i + 1}</span>
                    <span className="text-fg">{g ?? "—"}</span>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {/* Replace */}
          <Field
            label="جایگزینی موارد یافت‌شده با"
            hint="پشتیبانی از $1، $2 و $&"
          >
            <TextInput
              mono
              dir="ltr"
              value={replacement}
              onChange={(e) => setReplacement(e.target.value)}
              placeholder="متن جایگزین (خالی = حذف موارد)"
            />
          </Field>
          <Output label="نتیجه‌ی جایگزینی" value={replaced} />
        </>
      )}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { ErrorNote, Field, Grid2, Output, Segmented, TextInput } from "@/components/tool/kit";

type Mode = "build" | "parse";

const FIELDS: { key: string; label: string }[] = [
  { key: "utm_source", label: "Source (منبع)" },
  { key: "utm_medium", label: "Medium (رسانه)" },
  { key: "utm_campaign", label: "Campaign (کمپین)" },
  { key: "utm_term", label: "Term (کلیدواژه)" },
  { key: "utm_content", label: "Content (محتوا)" },
];

export default function UtmBuilderTool() {
  const [mode, setMode] = useState<Mode>("build");
  const [baseUrl, setBaseUrl] = useState("");
  const [vals, setVals] = useState<Record<string, string>>({});
  const [parseInput, setParseInput] = useState("");

  const built = useMemo(() => {
    if (!baseUrl.trim()) return { out: "", err: "" };
    try {
      const u = new URL(baseUrl.trim());
      for (const f of FIELDS) {
        const v = (vals[f.key] ?? "").trim();
        if (v) u.searchParams.set(f.key, v);
        else u.searchParams.delete(f.key);
      }
      return { out: u.toString(), err: "" };
    } catch {
      return { out: "", err: "آدرس پایه نامعتبر است (مثلاً https:// را اضافه کنید)." };
    }
  }, [baseUrl, vals]);

  const parsed = useMemo(() => {
    if (!parseInput.trim()) return { rows: [] as [string, string][], err: "" };
    try {
      const u = new URL(parseInput.trim());
      const rows = FIELDS.map((f) => [f.key, u.searchParams.get(f.key) ?? "—"] as [string, string]);
      return { rows, err: "" };
    } catch {
      return { rows: [], err: "آدرس نامعتبر است." };
    }
  }, [parseInput]);

  return (
    <div className="space-y-4">
      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: "build", label: "ساخت لینک" },
          { value: "parse", label: "استخراج UTM" },
        ]}
      />

      {mode === "build" ? (
        <>
          <Field label="آدرس پایه">
            <TextInput
              mono
              dir="ltr"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://example.com/landing"
            />
          </Field>
          <Grid2>
            {FIELDS.map((f) => (
              <Field key={f.key} label={f.label}>
                <TextInput
                  mono
                  dir="ltr"
                  value={vals[f.key] ?? ""}
                  onChange={(e) => setVals((v) => ({ ...v, [f.key]: e.target.value }))}
                  placeholder={f.key}
                />
              </Field>
            ))}
          </Grid2>
          {built.err && <ErrorNote>{built.err}</ErrorNote>}
          <Output label="لینک نهایی" value={built.out} />
        </>
      ) : (
        <>
          <Field label="آدرس دارای UTM">
            <TextInput
              mono
              dir="ltr"
              value={parseInput}
              onChange={(e) => setParseInput(e.target.value)}
              placeholder="https://example.com/?utm_source=google&utm_medium=cpc"
            />
          </Field>
          {parsed.err && <ErrorNote>{parsed.err}</ErrorNote>}
          {parsed.rows.length > 0 && (
            <div className="space-y-1.5">
              {parsed.rows.map(([k, v]) => (
                <div key={k} className="flex items-center gap-3 text-sm" dir="ltr">
                  <code className="w-32 shrink-0 text-turquoise">{k}</code>
                  <code className="min-w-0 flex-1 break-all text-fg">{v}</code>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

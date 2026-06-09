"use client";

import { useMemo, useState } from "react";
import { ErrorNote, Field, Grid2, Output, Segmented, TextArea } from "@/components/tool/kit";

export default function NdjsonTool() {
  const [mode, setMode] = useState<"toArray" | "toNdjson">("toArray");
  const [input, setInput] = useState("");

  const { out, bad, err } = useMemo(() => {
    if (!input.trim()) return { out: "", bad: [] as number[], err: "" };
    try {
      if (mode === "toArray") {
        const lines = input.split(/\r?\n/);
        const arr: unknown[] = [];
        const badLines: number[] = [];
        lines.forEach((line, i) => {
          if (!line.trim()) return; // skip blank lines
          try {
            arr.push(JSON.parse(line));
          } catch {
            badLines.push(i + 1);
          }
        });
        return { out: JSON.stringify(arr, null, 2), bad: badLines, err: "" };
      }
      // JSON array → NDJSON (one compact object per line)
      const data = JSON.parse(input);
      if (!Array.isArray(data)) throw new Error("ورودی باید یک آرایه JSON باشد");
      return { out: data.map((x) => JSON.stringify(x)).join("\n"), bad: [], err: "" };
    } catch (e) {
      return { out: "", bad: [], err: `ورودی نامعتبر: ${(e as Error).message}` };
    }
  }, [input, mode]);

  return (
    <div className="space-y-4">
      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: "toArray", label: "NDJSON → آرایه" },
          { value: "toNdjson", label: "آرایه → NDJSON" },
        ]}
      />
      <Grid2>
        <Field label={mode === "toArray" ? "NDJSON ورودی" : "آرایه JSON ورودی"}>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            dir="ltr"
            placeholder={mode === "toArray" ? '{"a":1}\n{"a":2}' : '[{"a":1},{"a":2}]'}
            className="min-h-72"
          />
        </Field>
        <Output
          label="خروجی"
          value={out}
          className="min-h-72"
          download={{ filename: mode === "toArray" ? "out.json" : "out.ndjson" }}
        />
      </Grid2>
      {err && <ErrorNote>{err}</ErrorNote>}
      {!err && bad.length > 0 && (
        <ErrorNote>خطوط نامعتبر (نادیده گرفته شدند): {bad.join("، ")}</ErrorNote>
      )}
    </div>
  );
}

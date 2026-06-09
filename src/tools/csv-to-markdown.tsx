"use client";

import { useMemo, useState } from "react";
import { ErrorNote, Field, Grid2, Output, Select, TextArea, Toggle } from "@/components/tool/kit";

function parseCSV(text: string, delim: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cur += '"';
          i++;
        } else inQ = false;
      } else cur += c;
    } else if (c === '"') inQ = true;
    else if (c === delim) {
      row.push(cur);
      cur = "";
    } else if (c === "\n") {
      row.push(cur);
      rows.push(row);
      row = [];
      cur = "";
    } else if (c !== "\r") cur += c;
  }
  if (cur !== "" || row.length) {
    row.push(cur);
    rows.push(row);
  }
  return rows.filter((r) => r.length > 1 || r[0] !== "");
}

const DELIMS: Record<string, string> = { ",": "،(کاما)", ";": "؛(سمی‌کالن)", "\t": "Tab", "|": "| (پایپ)" };

const esc = (s: string) => s.replace(/\|/g, "\\|").replace(/\n/g, " ");

export default function CsvToMarkdownTool() {
  const [input, setInput] = useState("");
  const [delim, setDelim] = useState(",");
  const [firstHeader, setFirstHeader] = useState(true);

  const { out, err } = useMemo(() => {
    if (!input.trim()) return { out: "", err: "" };
    try {
      const rows = parseCSV(input, delim);
      if (!rows.length) return { out: "", err: "" };
      const cols = Math.max(...rows.map((r) => r.length));
      const pad = (r: string[]) => Array.from({ length: cols }, (_, i) => esc(r[i] ?? ""));
      const header = firstHeader ? pad(rows[0]) : Array.from({ length: cols }, (_, i) => `ستون ${i + 1}`);
      const body = firstHeader ? rows.slice(1) : rows;
      const lines = [
        `| ${header.join(" | ")} |`,
        `| ${header.map(() => "---").join(" | ")} |`,
        ...body.map((r) => `| ${pad(r).join(" | ")} |`),
      ];
      return { out: lines.join("\n"), err: "" };
    } catch (e) {
      return { out: "", err: `CSV نامعتبر: ${(e as Error).message}` };
    }
  }, [input, delim, firstHeader]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm text-muted">
          جداکننده
          <Select value={delim} onChange={(e) => setDelim(e.target.value)} className="w-36">
            {Object.entries(DELIMS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>
        </label>
        <Toggle checked={firstHeader} onChange={setFirstHeader} label="ردیف اول سرستون است" />
      </div>

      <Grid2>
        <Field label="CSV ورودی">
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={"name,age\nAli,30\nSara,25"}
            dir="ltr"
            className="min-h-64"
          />
        </Field>
        <Output label="جدول Markdown" value={out} className="min-h-64" download={out ? { filename: "table.md" } : undefined} />
      </Grid2>

      {err && <ErrorNote>{err}</ErrorNote>}
    </div>
  );
}

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

const DELIMS: Record<string, string> = { ",": "،(کاما)", ";": "؛(سمی‌کالن)", "\t": "Tab" };

const escHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export default function CsvToHtmlTool() {
  const [input, setInput] = useState("");
  const [delim, setDelim] = useState(",");
  const [firstHeader, setFirstHeader] = useState(true);

  const { out, err } = useMemo(() => {
    if (!input.trim()) return { out: "", err: "" };
    try {
      const rows = parseCSV(input, delim);
      if (!rows.length) return { out: "", err: "" };
      const body = firstHeader ? rows.slice(1) : rows;
      const lines: string[] = ["<table>"];
      if (firstHeader) {
        lines.push("  <thead>");
        lines.push(`    <tr>${rows[0].map((c) => `<th>${escHtml(c)}</th>`).join("")}</tr>`);
        lines.push("  </thead>");
      }
      lines.push("  <tbody>");
      for (const r of body) {
        lines.push(`    <tr>${r.map((c) => `<td>${escHtml(c)}</td>`).join("")}</tr>`);
      }
      lines.push("  </tbody>");
      lines.push("</table>");
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
        <Output label="جدول HTML" value={out} className="min-h-64" download={out ? { filename: "table.html" } : undefined} />
      </Grid2>

      {err && <ErrorNote>{err}</ErrorNote>}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { ErrorNote, Field, Grid2, Output, Select, TextArea } from "@/components/tool/kit";

const DELIMS: Record<string, string> = { ",": "،(کاما)", ";": "؛(سمی‌کالن)", "\t": "Tab" };

function splitRow(line: string): string[] {
  let s = line.trim();
  if (s.startsWith("|")) s = s.slice(1);
  if (s.endsWith("|")) s = s.slice(0, -1);
  const cells: string[] = [];
  let cur = "";
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === "\\" && s[i + 1] === "|") {
      cur += "|";
      i++;
    } else if (c === "|") {
      cells.push(cur.trim());
      cur = "";
    } else cur += c;
  }
  cells.push(cur.trim());
  return cells;
}

const isSep = (line: string) => /^\s*\|?[\s:|-]+\|?\s*$/.test(line) && line.includes("-");

export default function MarkdownTableCsvTool() {
  const [input, setInput] = useState("");
  const [delim, setDelim] = useState(",");

  const { out, err } = useMemo(() => {
    if (!input.trim()) return { out: "", err: "" };
    try {
      const lines = input.split(/\r?\n/).filter((l) => l.trim().includes("|"));
      if (!lines.length) return { out: "", err: "جدول Markdown معتبری یافت نشد." };
      const rows = lines.filter((l) => !isSep(l)).map(splitRow);
      if (!rows.length) return { out: "", err: "جدول Markdown معتبری یافت نشد." };
      const esc = (v: string) => {
        const needs = v.includes('"') || v.includes("\n") || v.includes("\r") || v.includes(delim);
        return needs ? `"${v.replace(/"/g, '""')}"` : v;
      };
      return { out: rows.map((r) => r.map(esc).join(delim)).join("\n"), err: "" };
    } catch (e) {
      return { out: "", err: `خطا: ${(e as Error).message}` };
    }
  }, [input, delim]);

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 text-sm text-muted">
        جداکننده خروجی
        <Select value={delim} onChange={(e) => setDelim(e.target.value)} className="w-36">
          {Object.entries(DELIMS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </Select>
      </label>

      <Grid2>
        <Field label="جدول Markdown">
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={"| name | age |\n| --- | --- |\n| Ali | 30 |"}
            dir="ltr"
            className="min-h-64"
          />
        </Field>
        <Output label="CSV خروجی" value={out} className="min-h-64" download={out ? { filename: "table.csv" } : undefined} />
      </Grid2>

      {err && <ErrorNote>{err}</ErrorNote>}
    </div>
  );
}

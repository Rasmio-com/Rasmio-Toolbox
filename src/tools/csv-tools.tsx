"use client";

import { useMemo, useState } from "react";
import {
  ErrorNote,
  Field,
  Grid2,
  Output,
  Segmented,
  Select,
  TextArea,
  TextInput,
  Toggle,
} from "@/components/tool/kit";

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

function toCSV(rows: string[][], delim: string): string {
  const esc = (v: string) => {
    const needs = v.includes('"') || v.includes("\n") || v.includes("\r") || v.includes(delim);
    return needs ? `"${v.replace(/"/g, '""')}"` : v;
  };
  return rows.map((r) => r.map(esc).join(delim)).join("\n");
}

const DELIMS: Record<string, string> = { ",": "،(کاما)", ";": "؛(سمی‌کالن)", "\t": "Tab" };
type Op = "sort" | "dedupe" | "transpose" | "filter";

export default function CsvToolsTool() {
  const [input, setInput] = useState("");
  const [delim, setDelim] = useState(",");
  const [op, setOp] = useState<Op>("sort");
  const [hasHeader, setHasHeader] = useState(true);
  const [sortCol, setSortCol] = useState(0);
  const [desc, setDesc] = useState(false);
  const [numeric, setNumeric] = useState(false);
  const [filterText, setFilterText] = useState("");

  const rows = useMemo(() => {
    if (!input.trim()) return [];
    try {
      return parseCSV(input, delim);
    } catch {
      return [];
    }
  }, [input, delim]);

  const header = hasHeader && rows.length ? rows[0] : [];

  const { out, err } = useMemo(() => {
    if (!input.trim()) return { out: "", err: "" };
    if (!rows.length) return { out: "", err: "CSV نامعتبر است." };
    const head = hasHeader ? rows[0] : null;
    const body = hasHeader ? rows.slice(1) : rows;
    let result: string[][];
    try {
      if (op === "sort") {
        const sorted = [...body].sort((a, b) => {
          const x = a[sortCol] ?? "";
          const y = b[sortCol] ?? "";
          const cmp = numeric
            ? (parseFloat(x) || 0) - (parseFloat(y) || 0)
            : x.localeCompare(y, undefined, { numeric: true });
          return desc ? -cmp : cmp;
        });
        result = head ? [head, ...sorted] : sorted;
      } else if (op === "dedupe") {
        const seen = new Set<string>();
        const uniq = body.filter((r) => {
          const key = r.join("");
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        result = head ? [head, ...uniq] : uniq;
      } else if (op === "transpose") {
        const cols = Math.max(...rows.map((r) => r.length));
        result = Array.from({ length: cols }, (_, c) => rows.map((r) => r[c] ?? ""));
      } else {
        const q = filterText.toLowerCase();
        const matched = q
          ? body.filter((r) => r.some((c) => c.toLowerCase().includes(q)))
          : body;
        result = head ? [head, ...matched] : matched;
      }
      return { out: toCSV(result, delim), err: "" };
    } catch (e) {
      return { out: "", err: `خطا: ${(e as Error).message}` };
    }
  }, [input, rows, op, hasHeader, sortCol, desc, numeric, filterText, delim]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm text-muted">
          جداکننده
          <Select value={delim} onChange={(e) => setDelim(e.target.value)} className="w-32">
            {Object.entries(DELIMS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>
        </label>
        <Toggle checked={hasHeader} onChange={setHasHeader} label="ردیف اول سرستون" />
      </div>

      <Segmented
        value={op}
        onChange={setOp}
        options={[
          { value: "sort", label: "مرتب‌سازی" },
          { value: "dedupe", label: "حذف تکراری" },
          { value: "transpose", label: "ترانهاده" },
          { value: "filter", label: "فیلتر" },
        ]}
      />

      {op === "sort" && (
        <div className="flex flex-wrap items-end gap-3">
          <Field label="ستون" className="min-w-40">
            <Select value={String(sortCol)} onChange={(e) => setSortCol(Number(e.target.value))}>
              {(header.length ? header : Array.from({ length: rows[0]?.length ?? 1 })).map((h, i) => (
                <option key={i} value={i}>
                  {hasHeader && header[i] ? header[i] : `ستون ${i + 1}`}
                </option>
              ))}
            </Select>
          </Field>
          <Segmented
            value={desc ? "desc" : "asc"}
            onChange={(v) => setDesc(v === "desc")}
            options={[
              { value: "asc", label: "صعودی" },
              { value: "desc", label: "نزولی" },
            ]}
          />
          <Toggle checked={numeric} onChange={setNumeric} label="عددی" />
        </div>
      )}

      {op === "filter" && (
        <Field label="متن جستجو در ردیف‌ها">
          <TextInput
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="ردیف‌های شامل این متن نگه داشته می‌شوند"
            dir="auto"
          />
        </Field>
      )}

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
        <Output label="CSV خروجی" value={out} className="min-h-64" download={out ? { filename: "result.csv" } : undefined} />
      </Grid2>

      {err && <ErrorNote>{err}</ErrorNote>}
    </div>
  );
}

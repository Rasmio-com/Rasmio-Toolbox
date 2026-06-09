"use client";

import { useMemo, useState } from "react";
import {
  ErrorNote,
  Field,
  Grid2,
  Output,
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

const DELIMS: Record<string, string> = { ",": "،(کاما)", ";": "؛(سمی‌کالن)", "\t": "Tab" };
const isNum = (s: string) => s.trim() !== "" && /^-?\d+(\.\d+)?$/.test(s.trim());

const quoteIdent = (s: string) => `\`${s.replace(/`/g, "``")}\``;

export default function SqlInsertGeneratorTool() {
  const [input, setInput] = useState("");
  const [delim, setDelim] = useState(",");
  const [table, setTable] = useState("my_table");
  const [emptyNull, setEmptyNull] = useState(true);
  const [multiRow, setMultiRow] = useState(false);

  const { out, err } = useMemo(() => {
    if (!input.trim()) return { out: "", err: "" };
    if (!table.trim()) return { out: "", err: "نام جدول را وارد کنید." };
    try {
      const rows = parseCSV(input, delim);
      if (rows.length < 2) return { out: "", err: "CSV باید سرستون و حداقل یک ردیف داده داشته باشد." };
      const [head, ...body] = rows;
      const cols = head.map(quoteIdent).join(", ");
      const fmt = (v: string) => {
        if (v.trim() === "") return emptyNull ? "NULL" : "''";
        if (isNum(v)) return v.trim();
        return `'${v.replace(/'/g, "''")}'`;
      };
      const tbl = quoteIdent(table.trim());
      if (multiRow) {
        const values = body.map((r) => `  (${head.map((_, i) => fmt(r[i] ?? "")).join(", ")})`);
        return { out: `INSERT INTO ${tbl} (${cols}) VALUES\n${values.join(",\n")};`, err: "" };
      }
      const lines = body.map(
        (r) => `INSERT INTO ${tbl} (${cols}) VALUES (${head.map((_, i) => fmt(r[i] ?? "")).join(", ")});`,
      );
      return { out: lines.join("\n"), err: "" };
    } catch (e) {
      return { out: "", err: `خطا: ${(e as Error).message}` };
    }
  }, [input, delim, table, emptyNull, multiRow]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <Field label="نام جدول" className="min-w-44 flex-1">
          <TextInput value={table} onChange={(e) => setTable(e.target.value)} dir="ltr" mono placeholder="users" />
        </Field>
        <Field label="جداکننده" className="w-32">
          <Select value={delim} onChange={(e) => setDelim(e.target.value)}>
            {Object.entries(DELIMS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Toggle checked={emptyNull} onChange={setEmptyNull} label="مقدار خالی = NULL" />
        <Toggle checked={multiRow} onChange={setMultiRow} label="یک دستور چندردیفی" />
      </div>

      <Grid2>
        <Field label="CSV ورودی (با سرستون)">
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={"id,name,age\n1,Ali,30\n2,Sara,"}
            dir="ltr"
            className="min-h-64"
          />
        </Field>
        <Output label="دستورهای SQL" value={out} className="min-h-64" download={out ? { filename: "insert.sql" } : undefined} />
      </Grid2>

      {err && <ErrorNote>{err}</ErrorNote>}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { ErrorNote, Field, TextArea, TextInput } from "@/components/tool/kit";

type LogRow = Record<string, unknown>;

function parseLogs(input: string): { rows: LogRow[]; err: string } {
  const text = input.trim();
  if (!text) return { rows: [], err: "" };
  // Try JSON array first.
  if (text.startsWith("[")) {
    try {
      const arr = JSON.parse(text);
      if (Array.isArray(arr)) return { rows: arr as LogRow[], err: "" };
      return { rows: [], err: "ورودی یک آرایه JSON نیست." };
    } catch {
      return { rows: [], err: "آرایه JSON نامعتبر است." };
    }
  }
  // Otherwise treat as NDJSON (one object per line).
  const rows: LogRow[] = [];
  let bad = 0;
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (!t) continue;
    try {
      rows.push(JSON.parse(t));
    } catch {
      bad++;
    }
  }
  if (!rows.length) return { rows: [], err: "هیچ خط JSON معتبری یافت نشد." };
  return { rows, err: bad ? `${bad} خط نامعتبر نادیده گرفته شد.` : "" };
}

function levelOf(row: LogRow): string {
  const raw = (row.level ?? row.lvl ?? row.severity ?? row.loglevel) as unknown;
  return String(raw ?? "").toLowerCase();
}

function levelClass(level: string): string {
  if (/(error|err|fatal|crit)/.test(level)) return "border-danger/30 bg-danger/10";
  if (/(warn)/.test(level)) return "border-saffron/30 bg-saffron/10";
  if (/(info)/.test(level)) return "border-turquoise-dim/40 bg-turquoise/5";
  if (/(debug|trace)/.test(level)) return "border-border bg-surface-2";
  return "border-border bg-bg-soft";
}

function cellText(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

export default function JsonLogViewerTool() {
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("");

  const { rows, err } = useMemo(() => parseLogs(input), [input]);

  const columns = useMemo(() => {
    const seen: string[] = [];
    for (const r of rows) {
      if (r && typeof r === "object") {
        for (const k of Object.keys(r)) if (!seen.includes(k)) seen.push(k);
      }
      if (seen.length > 12) break;
    }
    return seen.slice(0, 12);
  }, [rows]);

  const filtered = useMemo(() => {
    const f = filter.trim().toLowerCase();
    if (!f) return rows;
    return rows.filter((r) => JSON.stringify(r).toLowerCase().includes(f));
  }, [rows, filter]);

  return (
    <div className="space-y-4">
      <Field label="لاگ JSON (آرایه JSON یا NDJSON — هر خط یک شیء)">
        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={'{"level":"error","msg":"db down","ts":"2023-10-10T13:55:36Z"}\n{"level":"info","msg":"started"}'}
          className="min-h-36"
        />
      </Field>

      {err && rows.length === 0 && <ErrorNote>{err}</ErrorNote>}

      {rows.length > 0 && (
        <>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <Field label="فیلتر متنی" className="w-full sm:w-72">
              <TextInput
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="مثلاً error یا نام فیلد"
              />
            </Field>
            <p className="text-xs text-muted">
              نمایش {filtered.length} از {rows.length} رکورد
              {err ? ` — ${err}` : ""}
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border" dir="ltr">
            <table className="w-full text-left text-xs">
              <thead className="bg-bg-soft text-muted">
                <tr>
                  {columns.map((c) => (
                    <th key={c} className="whitespace-nowrap px-3 py-2 font-medium">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-mono">
                {filtered.map((r, i) => (
                  <tr key={i} className={`border-t border-border align-top ${levelClass(levelOf(r))}`}>
                    {columns.map((c) => (
                      <td key={c} className="max-w-[20rem] truncate px-3 py-1.5 text-fg" title={cellText(r[c])}>
                        {cellText(r[c]) || "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

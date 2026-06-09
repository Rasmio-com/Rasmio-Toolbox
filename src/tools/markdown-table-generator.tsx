"use client";

import { useMemo, useState } from "react";
import { Field, Output, Select, TextInput } from "@/components/tool/kit";
import { toAsciiDigits } from "@/lib/utils";

type Align = "left" | "center" | "right";

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const sepFor = (a: Align) => (a === "center" ? ":---:" : a === "right" ? "---:" : "---");
const escCell = (s: string) => s.replace(/\|/g, "\\|").replace(/\n/g, " ");

export default function MarkdownTableGeneratorTool() {
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(2);
  const [aligns, setAligns] = useState<Align[]>(["left", "left", "left"]);
  const [cells, setCells] = useState<Record<string, string>>({});

  const getAlign = (c: number): Align => aligns[c] ?? "left";
  const setAlign = (c: number, a: Align) =>
    setAligns((prev) => {
      const next = [...prev];
      while (next.length <= c) next.push("left");
      next[c] = a;
      return next;
    });

  const resize = (rawC: number, rawR: number) => {
    const c = clamp(Number(toAsciiDigits(String(rawC))) || 1, 1, 12);
    const r = clamp(Number(toAsciiDigits(String(rawR))) || 1, 1, 30);
    setCols(c);
    setRows(r);
  };

  const out = useMemo(() => {
    const headerCells = Array.from({ length: cols }, (_, c) => escCell(cells[`h${c}`] ?? "") || `ستون ${c + 1}`);
    const lines = [
      `| ${headerCells.join(" | ")} |`,
      `| ${Array.from({ length: cols }, (_, c) => sepFor(getAlign(c))).join(" | ")} |`,
    ];
    for (let r = 0; r < rows; r++) {
      const rowCells = Array.from({ length: cols }, (_, c) => escCell(cells[`${r}-${c}`] ?? ""));
      lines.push(`| ${rowCells.join(" | ")} |`);
    }
    return lines.join("\n");
  }, [cols, rows, cells, aligns]);

  const cellInput = (key: string, placeholder: string) => (
    <input
      value={cells[key] ?? ""}
      onChange={(e) => setCells((p) => ({ ...p, [key]: e.target.value }))}
      placeholder={placeholder}
      dir="auto"
      spellCheck={false}
      className="field field-mono min-w-28 px-2 py-1 text-sm"
    />
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <Field label="ستون‌ها (۱ تا ۱۲)" className="w-32">
          <TextInput
            type="number"
            min={1}
            max={12}
            value={cols}
            onChange={(e) => resize(Number(e.target.value), rows)}
            dir="ltr"
          />
        </Field>
        <Field label="ردیف‌ها (۱ تا ۳۰)" className="w-32">
          <TextInput
            type="number"
            min={1}
            max={30}
            value={rows}
            onChange={(e) => resize(cols, Number(e.target.value))}
            dir="ltr"
          />
        </Field>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-bg-soft p-3">
        <table className="border-separate border-spacing-1">
          <thead>
            <tr>
              {Array.from({ length: cols }, (_, c) => (
                <th key={c} className="space-y-1 text-start">
                  {cellInput(`h${c}`, `سرستون ${c + 1}`)}
                  <Select
                    value={getAlign(c)}
                    onChange={(e) => setAlign(c, e.target.value as Align)}
                    className="w-full py-1 text-xs"
                  >
                    <option value="left">چپ</option>
                    <option value="center">وسط</option>
                    <option value="right">راست</option>
                  </Select>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }, (_, r) => (
              <tr key={r}>
                {Array.from({ length: cols }, (_, c) => (
                  <td key={c}>{cellInput(`${r}-${c}`, "")}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Output label="جدول Markdown" value={out} download={{ filename: "table.md" }} />
    </div>
  );
}

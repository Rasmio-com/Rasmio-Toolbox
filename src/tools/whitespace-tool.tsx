"use client";

import { useMemo, useState } from "react";
import { Field, Grid2, Output, Select, TextArea, Toggle } from "@/components/tool/kit";

type TabMode = "none" | "t2s" | "s2t";
type Eol = "keep" | "lf" | "crlf";

export default function WhitespaceTool() {
  const [text, setText] = useState("");
  const [tabMode, setTabMode] = useState<TabMode>("none");
  const [size, setSize] = useState("4");
  const [eol, setEol] = useState<Eol>("keep");
  const [trimEnd, setTrimEnd] = useState(false);
  const [collapseBlank, setCollapseBlank] = useState(false);

  const out = useMemo(() => {
    let s = text;
    const w = Math.max(1, Number(size) || 1);
    if (tabMode === "t2s") s = s.replace(/\t/g, " ".repeat(w));
    else if (tabMode === "s2t") s = s.replace(/ {1,}/g, (m) => "\t".repeat(Math.floor(m.length / w)) + " ".repeat(m.length % w));
    // Normalize to LF first for line-based ops
    s = s.replace(/\r\n|\r/g, "\n");
    if (trimEnd) s = s.replace(/[ \t]+$/gm, "");
    if (collapseBlank) s = s.replace(/\n{3,}/g, "\n\n");
    if (eol === "crlf") s = s.replace(/\n/g, "\r\n");
    return s;
  }, [text, tabMode, size, eol, trimEnd, collapseBlank]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-xl border border-border bg-surface/40 px-4 py-3">
        <label className="flex items-center gap-2 text-sm text-muted">
          تب و فاصله
          <Select value={tabMode} onChange={(e) => setTabMode(e.target.value as TabMode)} className="w-36">
            <option value="none">بدون تغییر</option>
            <option value="t2s">تب ← فاصله</option>
            <option value="s2t">فاصله ← تب</option>
          </Select>
        </label>
        <label className="flex items-center gap-2 text-sm text-muted">
          اندازه
          <Select value={size} onChange={(e) => setSize(e.target.value)} className="w-20">
            <option value="2">۲</option>
            <option value="4">۴</option>
            <option value="8">۸</option>
          </Select>
        </label>
        <label className="flex items-center gap-2 text-sm text-muted">
          پایان خط
          <Select value={eol} onChange={(e) => setEol(e.target.value as Eol)} className="w-28">
            <option value="keep">بدون تغییر</option>
            <option value="lf">LF</option>
            <option value="crlf">CRLF</option>
          </Select>
        </label>
        <Toggle checked={trimEnd} onChange={setTrimEnd} label="حذف فاصله‌ی انتهای خط" />
        <Toggle checked={collapseBlank} onChange={setCollapseBlank} label="ادغام خطوط خالی" />
      </div>
      <Grid2>
        <Field label="ورودی">
          <TextArea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="متن خود را این‌جا بچسبانید…"
            className="min-h-56"
          />
        </Field>
        <Output label="خروجی" value={out} className="min-h-56" />
      </Grid2>
    </div>
  );
}

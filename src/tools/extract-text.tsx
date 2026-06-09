"use client";

import { useMemo, useState } from "react";
import { Field, Grid2, Output, Select, TextArea, Toggle } from "@/components/tool/kit";

const PATTERNS: Record<string, { label: string; re: RegExp }> = {
  email: { label: "ایمیل", re: /[\w.+-]+@[\w-]+\.[\w.-]+/g },
  url: { label: "آدرس (URL)", re: /\bhttps?:\/\/[^\s<>"')]+/gi },
  ip: { label: "آدرس IP", re: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g },
  domain: { label: "دامنه", re: /\b(?:[a-z0-9-]+\.)+[a-z]{2,}\b/gi },
  number: { label: "عدد", re: /-?\d+(?:\.\d+)?/g },
  hashtag: { label: "هشتگ", re: /#[\p{L}\d_]+/gu },
};

export default function ExtractTextTool() {
  const [text, setText] = useState("");
  const [type, setType] = useState("email");
  const [unique, setUnique] = useState(true);

  const { out, count } = useMemo(() => {
    if (!text) return { out: "", count: 0 };
    const matches = text.match(PATTERNS[type].re) ?? [];
    const list = unique ? Array.from(new Set(matches)) : matches;
    return { out: list.join("\n"), count: list.length };
  }, [text, type, unique]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-muted">
          استخراج
          <Select value={type} onChange={(e) => setType(e.target.value)} className="w-40">
            {Object.entries(PATTERNS).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </Select>
        </label>
        <Toggle checked={unique} onChange={setUnique} label="حذف موارد تکراری" />
        {text && (
          <span className="text-sm text-muted">
            {count.toLocaleString("fa-IR")} مورد یافت شد
          </span>
        )}
      </div>
      <Grid2>
        <Field label="متن ورودی">
          <TextArea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="متن حاوی ایمیل، لینک، عدد و…"
            className="min-h-52"
          />
        </Field>
        <Output label="نتایج" value={out} className="min-h-52" />
      </Grid2>
    </div>
  );
}

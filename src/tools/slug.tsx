"use client";

import { useMemo, useState } from "react";
import { Field, Output, Segmented, TextArea, Toggle } from "@/components/tool/kit";

function slugify(s: string, sep: string, lower: boolean, keepFa: boolean): string {
  let t = s.normalize("NFKC").trim();
  if (lower) t = t.toLowerCase();
  t = t.replace(/[\s\-_]+/g, " ");
  const cls = keepFa ? "a-z0-9\\u0600-\\u06FF" : "a-z0-9";
  t = t.replace(new RegExp(`[^${cls} ]`, "gi"), "");
  return t.trim().replace(/\s+/g, sep);
}

export default function SlugTool() {
  const [text, setText] = useState("");
  const [sep, setSep] = useState("-");
  const [lower, setLower] = useState(true);
  const [keepFa, setKeepFa] = useState(true);

  const out = useMemo(
    () => slugify(text, sep, lower, keepFa),
    [text, sep, lower, keepFa],
  );

  return (
    <div className="space-y-4">
      <Field label="متن ورودی">
        <TextArea
          mono={false}
          dir="auto"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="مثلاً: راهنمای کامل Next.js در سال ۱۴۰۳"
          className="min-h-24"
        />
      </Field>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex items-center gap-2 text-sm text-muted">
          جداکننده
          <Segmented
            value={sep}
            onChange={setSep}
            options={[
              { value: "-", label: "خط تیره -" },
              { value: "_", label: "زیرخط _" },
            ]}
          />
        </div>
        <Toggle checked={lower} onChange={setLower} label="حروف کوچک" />
        <Toggle checked={keepFa} onChange={setKeepFa} label="حفظ حروف فارسی" />
      </div>
      <Output label="Slug" value={out} />
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import {
  Field,
  Grid2,
  Output,
  Segmented,
  TextArea,
  Toggle,
} from "@/components/tool/kit";

function encodeEntities(s: string, all: boolean): string {
  let out = s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
  if (all) out = out.replace(/[ -￿]/g, (c) => `&#${c.charCodeAt(0)};`);
  return out;
}

function decodeEntities(s: string): string {
  const el = document.createElement("textarea");
  el.innerHTML = s;
  return el.value;
}

export default function HtmlEntitiesTool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [all, setAll] = useState(false);

  const out = useMemo(() => {
    if (!input) return "";
    return mode === "encode" ? encodeEntities(input, all) : decodeEntities(input);
  }, [input, mode, all]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: "encode", label: "کدگذاری" },
            { value: "decode", label: "رمزگشایی" },
          ]}
        />
        {mode === "encode" && (
          <Toggle
            checked={all}
            onChange={setAll}
            label="کدگذاری همه‌ی کاراکترهای غیر اَسکی"
          />
        )}
      </div>
      <Grid2>
        <Field label="ورودی">
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='<div class="x">سلام & خداحافظ</div>'
          />
        </Field>
        <Output label="خروجی" value={out} />
      </Grid2>
    </div>
  );
}

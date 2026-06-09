"use client";

import { useMemo, useState } from "react";
import { CopyButton, DownloadButton, Field, Grid2, Stat, TextArea } from "@/components/tool/kit";
import { formatBytes } from "@/lib/utils";

function optimizeSvg(svg: string): string {
  return svg
    .replace(/<\?xml[\s\S]*?\?>/gi, "") // XML declaration
    .replace(/<!DOCTYPE[\s\S]*?>/gi, "") // DOCTYPE
    .replace(/<!--[\s\S]*?-->/g, "") // comments
    .replace(/<metadata[\s\S]*?<\/metadata>/gi, "") // metadata blocks
    .replace(/<\?[\s\S]*?\?>/g, "") // processing instructions
    .replace(/>\s+</g, "><") // whitespace between tags
    .replace(/\s{2,}/g, " ") // collapse runs of whitespace
    .replace(/\s+\/>/g, "/>") // tidy self-closing tags
    .trim();
}

const byteLen = (s: string) => new TextEncoder().encode(s).length;

export default function SvgOptimizerTool() {
  const [input, setInput] = useState("");

  const { out, before, after, saved } = useMemo(() => {
    if (!input.trim()) return { out: "", before: 0, after: 0, saved: 0 };
    const optimized = optimizeSvg(input);
    const b = byteLen(input);
    const a = byteLen(optimized);
    return { out: optimized, before: b, after: a, saved: b ? Math.round((1 - a / b) * 100) : 0 };
  }, [input]);

  return (
    <div className="space-y-4">
      <Grid2>
        <Field label="SVG ورودی">
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            dir="ltr"
            placeholder='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><!-- آیکن --><path d="M3 12h18"/></svg>'
            className="min-h-72"
          />
        </Field>
        <Field
          label="خروجی بهینه‌شده"
          hint={
            out && (
              <span className="flex items-center gap-2">
                <DownloadButton value={out} filename="optimized.svg" mime="image/svg+xml" />
                <CopyButton value={out} />
              </span>
            )
          }
        >
          <textarea
            readOnly
            dir="ltr"
            value={out}
            placeholder="خروجی اینجا نمایش داده می‌شود"
            className="field field-mono min-h-72 w-full resize-y leading-relaxed"
          />
        </Field>
      </Grid2>

      {input.trim() && (
        <>
          <div className="grid grid-cols-3 gap-3">
            <Stat label="حجم اولیه" value={formatBytes(before)} />
            <Stat label="حجم نهایی" value={formatBytes(after)} />
            <Stat label="کاهش" value={`${saved}%`} />
          </div>
          <Field label="پیش‌نمایش">
            <div className="flex min-h-32 items-center justify-center rounded-xl border border-border bg-bg-soft p-4 [&_svg]:max-h-48 [&_svg]:max-w-full">
              <div dangerouslySetInnerHTML={{ __html: out }} />
            </div>
          </Field>
        </>
      )}
    </div>
  );
}

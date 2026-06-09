"use client";

import { useMemo, useState } from "react";
import { marked } from "marked";
import { Field, Grid2, TextArea } from "@/components/tool/kit";

// Manual prose styling via arbitrary variants (no typography plugin available).
const PROSE =
  "text-fg leading-relaxed break-words " +
  "[&_h1]:mt-0 [&_h1]:mb-3 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-fg " +
  "[&_h2]:mt-5 [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-fg " +
  "[&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-fg " +
  "[&_p]:my-3 " +
  "[&_a]:text-turquoise [&_a]:underline " +
  "[&_strong]:font-bold [&_strong]:text-fg [&_em]:italic " +
  "[&_ul]:my-3 [&_ul]:list-disc [&_ul]:ps-6 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:ps-6 [&_li]:my-1 " +
  "[&_blockquote]:border-s-4 [&_blockquote]:border-turquoise-dim [&_blockquote]:ps-4 [&_blockquote]:text-muted [&_blockquote]:my-3 " +
  "[&_code]:rounded [&_code]:bg-surface-2 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:text-saffron " +
  "[&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-border [&_pre]:bg-bg-soft [&_pre]:p-3 " +
  "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-fg " +
  "[&_table]:my-3 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-border [&_th]:bg-surface-2 [&_th]:px-3 [&_th]:py-1.5 [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-1.5 " +
  "[&_hr]:my-5 [&_hr]:border-border [&_img]:max-w-full [&_img]:rounded-lg";

export default function MarkdownPreviewTool() {
  const [input, setInput] = useState("# سلام\n\nاین یک **پیش‌نمایش** زنده است.\n\n- مورد اول\n- مورد دوم\n\n```js\nconsole.log('Rasmio');\n```");

  const html = useMemo(() => {
    if (!input.trim()) return "";
    try {
      return marked(input, { async: false, gfm: true, breaks: true });
    } catch {
      return "";
    }
  }, [input]);

  return (
    <Grid2>
      <Field label="Markdown">
        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          dir="auto"
          className="min-h-96"
        />
      </Field>
      <Field label="پیش‌نمایش">
        <div
          dir="auto"
          className="min-h-96 overflow-auto rounded-xl border border-border bg-bg-soft p-4"
        >
          {html ? (
            <div className={PROSE} dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <p className="text-faint">پیش‌نمایش اینجا نمایش داده می‌شود</p>
          )}
        </div>
      </Field>
    </Grid2>
  );
}

"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Field, Grid2, TextInput } from "@/components/tool/kit";

const TITLE_MAX = 60;
const DESC_MAX = 160;

function Counter({ len, max }: { len: number; max: number }) {
  const over = len > max;
  return (
    <span className={cn("font-mono", over ? "text-danger" : "text-faint")}>
      {len}/{max}
    </span>
  );
}

export default function SerpPreviewTool() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [url, setUrl] = useState("");

  let crumb = url.trim();
  try {
    if (crumb) {
      const u = new URL(crumb);
      crumb = u.hostname + (u.pathname === "/" ? "" : u.pathname.replace(/\//g, " › "));
    }
  } catch {
    /* keep raw */
  }

  const warns = [
    title.length > TITLE_MAX ? `عنوان بیش از ${TITLE_MAX} نویسه است و ممکن است در گوگل بریده شود.` : "",
    desc.length > DESC_MAX ? `توضیحات بیش از ${DESC_MAX} نویسه است و ممکن است بریده شود.` : "",
  ].filter(Boolean);

  return (
    <div className="space-y-4">
      <Grid2>
        <Field label="عنوان" hint={<Counter len={title.length} max={TITLE_MAX} />}>
          <TextInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان صفحه" />
        </Field>
        <Field label="آدرس">
          <TextInput mono dir="ltr" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/page" />
        </Field>
      </Grid2>
      <Field label="توضیحات" hint={<Counter len={desc.length} max={DESC_MAX} />}>
        <TextInput value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="توضیح متا صفحه" />
      </Field>

      {warns.map((w, i) => (
        <p key={i} className="flex items-center gap-2 rounded-lg border border-saffron/30 bg-saffron/10 px-3 py-2 text-sm text-saffron">
          <AlertTriangle className="size-4 shrink-0" />
          {w}
        </p>
      ))}

      <Field label="پیش‌نمایش نتیجه گوگل">
        <div className="max-w-xl space-y-1 rounded-xl border border-border bg-surface p-4" dir="ltr">
          <div className="truncate text-xs text-muted">{crumb || "example.com"}</div>
          <div className="truncate text-lg text-[#1a0dab] dark:text-[#8ab4f8]">
            {title.trim() || "عنوان صفحه شما"}
          </div>
          <div className="line-clamp-2 text-sm text-fg/80">
            {desc.trim() || "توضیحات متای صفحه اینجا نمایش داده می‌شود."}
          </div>
        </div>
      </Field>
    </div>
  );
}

"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";
import { Field, Grid2, TextInput } from "@/components/tool/kit";

export default function OgPreviewTool() {
  const [f, setF] = useState<Record<string, string>>({});
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));

  let domain = (f.site ?? "").trim();
  if (!domain && f.url) {
    try {
      domain = new URL(f.url.trim()).hostname;
    } catch {
      domain = "";
    }
  }
  const img = (f.image ?? "").trim();

  return (
    <div className="space-y-4">
      <Grid2>
        <Field label="عنوان (title)">
          <TextInput value={f.title ?? ""} onChange={(e) => set("title", e.target.value)} placeholder="عنوان مطلب" />
        </Field>
        <Field label="نام سایت (site)">
          <TextInput mono dir="ltr" value={f.site ?? ""} onChange={(e) => set("site", e.target.value)} placeholder="example.com" />
        </Field>
        <Field label="توضیحات (description)" className="lg:col-span-2">
          <TextInput value={f.description ?? ""} onChange={(e) => set("description", e.target.value)} placeholder="توضیح کوتاه" />
        </Field>
        <Field label="آدرس تصویر (image)">
          <TextInput mono dir="ltr" value={f.image ?? ""} onChange={(e) => set("image", e.target.value)} placeholder="https://…/cover.jpg" />
        </Field>
        <Field label="آدرس (url)">
          <TextInput mono dir="ltr" value={f.url ?? ""} onChange={(e) => set("url", e.target.value)} placeholder="https://example.com/post" />
        </Field>
      </Grid2>

      <Field label="پیش‌نمایش کارت">
        <div className="max-w-md overflow-hidden rounded-xl border border-border bg-surface">
          <div className="flex aspect-[1.91/1] items-center justify-center bg-bg-soft text-faint">
            {img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={img}
                alt=""
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <ImageOff className="size-10" />
            )}
          </div>
          <div className="space-y-1 border-t border-border p-3" dir="auto">
            {domain && (
              <div dir="ltr" className="text-xs uppercase tracking-wide text-muted">
                {domain}
              </div>
            )}
            <div className="line-clamp-2 font-semibold text-fg">
              {f.title?.trim() || "عنوان مطلب"}
            </div>
            <div className="line-clamp-2 text-sm text-muted">
              {f.description?.trim() || "توضیحات اینجا نمایش داده می‌شود."}
            </div>
          </div>
        </div>
      </Field>
    </div>
  );
}

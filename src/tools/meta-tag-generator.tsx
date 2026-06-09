"use client";

import { useMemo, useState } from "react";
import { Field, Grid2, Output, Select, TextInput } from "@/components/tool/kit";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export default function MetaTagGeneratorTool() {
  const [f, setF] = useState<Record<string, string>>({});
  const [twitterCard, setTwitterCard] = useState("summary_large_image");
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));

  const out = useMemo(() => {
    const lines: string[] = [];
    const meta = (attr: string, key: string, val: string) => {
      const v = (val ?? "").trim();
      if (v) lines.push(`<meta ${attr}="${key}" content="${esc(v)}" />`);
    };
    if (f.title?.trim()) lines.push(`<title>${esc(f.title.trim())}</title>`);
    meta("name", "description", f.description ?? "");
    meta("name", "keywords", f.keywords ?? "");
    meta("name", "author", f.author ?? "");
    meta("property", "og:title", f.ogTitle || f.title || "");
    meta("property", "og:description", f.ogDescription || f.description || "");
    meta("property", "og:image", f.ogImage ?? "");
    meta("property", "og:url", f.ogUrl ?? "");
    if (lines.some((l) => l.includes("og:"))) lines.push(`<meta property="og:type" content="website" />`);
    meta("name", "twitter:card", twitterCard);
    meta("name", "twitter:title", f.ogTitle || f.title || "");
    meta("name", "twitter:description", f.ogDescription || f.description || "");
    meta("name", "twitter:image", f.ogImage ?? "");
    return lines.join("\n");
  }, [f, twitterCard]);

  return (
    <div className="space-y-4">
      <Grid2>
        <Field label="عنوان (title)">
          <TextInput value={f.title ?? ""} onChange={(e) => set("title", e.target.value)} placeholder="عنوان صفحه" />
        </Field>
        <Field label="نویسنده (author)">
          <TextInput value={f.author ?? ""} onChange={(e) => set("author", e.target.value)} placeholder="نام نویسنده" />
        </Field>
        <Field label="توضیحات (description)" className="lg:col-span-2">
          <TextInput value={f.description ?? ""} onChange={(e) => set("description", e.target.value)} placeholder="توضیح کوتاه صفحه" />
        </Field>
        <Field label="کلیدواژه‌ها (keywords)" className="lg:col-span-2" hint="با کاما جدا کنید">
          <TextInput value={f.keywords ?? ""} onChange={(e) => set("keywords", e.target.value)} placeholder="کلمه۱, کلمه۲" />
        </Field>
        <Field label="og:title">
          <TextInput value={f.ogTitle ?? ""} onChange={(e) => set("ogTitle", e.target.value)} placeholder="در نبود، از title استفاده می‌شود" />
        </Field>
        <Field label="og:description">
          <TextInput value={f.ogDescription ?? ""} onChange={(e) => set("ogDescription", e.target.value)} placeholder="در نبود، از description" />
        </Field>
        <Field label="og:image">
          <TextInput mono dir="ltr" value={f.ogImage ?? ""} onChange={(e) => set("ogImage", e.target.value)} placeholder="https://…/image.jpg" />
        </Field>
        <Field label="og:url">
          <TextInput mono dir="ltr" value={f.ogUrl ?? ""} onChange={(e) => set("ogUrl", e.target.value)} placeholder="https://example.com/page" />
        </Field>
        <Field label="twitter:card">
          <Select value={twitterCard} onChange={(e) => setTwitterCard(e.target.value)}>
            <option value="summary">summary</option>
            <option value="summary_large_image">summary_large_image</option>
            <option value="app">app</option>
            <option value="player">player</option>
          </Select>
        </Field>
      </Grid2>
      <Output label="تگ‌های متا" value={out} download={{ filename: "meta-tags.html" }} />
    </div>
  );
}

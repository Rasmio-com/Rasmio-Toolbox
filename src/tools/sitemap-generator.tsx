"use client";

import { useMemo, useState } from "react";
import { Field, Output, Select, TextArea, TextInput } from "@/components/tool/kit";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

export default function SitemapGeneratorTool() {
  const [urls, setUrls] = useState("");
  const [changefreq, setChangefreq] = useState("");
  const [priority, setPriority] = useState("");
  const [lastmod, setLastmod] = useState("");

  const out = useMemo(() => {
    const list = urls.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (!list.length) return "";
    const entries = list
      .map((u) => {
        const lines = [`  <url>`, `    <loc>${esc(u)}</loc>`];
        if (lastmod.trim()) lines.push(`    <lastmod>${esc(lastmod.trim())}</lastmod>`);
        if (changefreq) lines.push(`    <changefreq>${changefreq}</changefreq>`);
        if (priority) lines.push(`    <priority>${priority}</priority>`);
        lines.push(`  </url>`);
        return lines.join("\n");
      })
      .join("\n");
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`;
  }, [urls, changefreq, priority, lastmod]);

  return (
    <div className="space-y-4">
      <Field label="آدرس‌ها (هر خط یک URL)">
        <TextArea
          mono
          dir="ltr"
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          placeholder={"https://example.com/\nhttps://example.com/blog\nhttps://example.com/about"}
        />
      </Field>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="changefreq" hint="اختیاری">
          <Select value={changefreq} onChange={(e) => setChangefreq(e.target.value)}>
            <option value="">—</option>
            <option value="always">always</option>
            <option value="hourly">hourly</option>
            <option value="daily">daily</option>
            <option value="weekly">weekly</option>
            <option value="monthly">monthly</option>
            <option value="yearly">yearly</option>
            <option value="never">never</option>
          </Select>
        </Field>
        <Field label="priority" hint="اختیاری">
          <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="">—</option>
            {["1.0", "0.9", "0.8", "0.7", "0.6", "0.5", "0.4", "0.3", "0.2", "0.1"].map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </Select>
        </Field>
        <Field label="lastmod" hint="اختیاری">
          <TextInput mono dir="ltr" value={lastmod} onChange={(e) => setLastmod(e.target.value)} placeholder="2025-01-31" />
        </Field>
      </div>
      <Output label="sitemap.xml" value={out} download={{ filename: "sitemap.xml", mime: "application/xml" }} />
    </div>
  );
}

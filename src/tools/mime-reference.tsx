"use client";

import { useMemo, useState } from "react";
import { Field, TextInput } from "@/components/tool/kit";

type Mime = { type: string; ext: string; note: string };

const MIMES: Mime[] = [
  { type: "text/html", ext: ".html", note: "سند HTML" },
  { type: "text/css", ext: ".css", note: "شیوه‌نامهٔ CSS" },
  { type: "text/javascript", ext: ".js", note: "اسکریپت جاوااسکریپت" },
  { type: "text/plain", ext: ".txt", note: "متن ساده" },
  { type: "text/csv", ext: ".csv", note: "دادهٔ جداشده با ویرگول" },
  { type: "text/markdown", ext: ".md", note: "متن مارک‌داون" },
  { type: "text/calendar", ext: ".ics", note: "رویداد تقویم" },
  { type: "application/json", ext: ".json", note: "دادهٔ JSON" },
  { type: "application/ld+json", ext: ".jsonld", note: "JSON پیوندی" },
  { type: "application/xml", ext: ".xml", note: "سند XML" },
  { type: "application/yaml", ext: ".yaml", note: "دادهٔ YAML" },
  { type: "application/pdf", ext: ".pdf", note: "سند PDF" },
  { type: "application/zip", ext: ".zip", note: "آرشیو فشرده" },
  { type: "application/gzip", ext: ".gz", note: "فشردهٔ gzip" },
  { type: "application/x-tar", ext: ".tar", note: "آرشیو tar" },
  { type: "application/x-7z-compressed", ext: ".7z", note: "آرشیو 7-Zip" },
  { type: "application/octet-stream", ext: ".bin", note: "دادهٔ دودویی نامشخص" },
  { type: "application/wasm", ext: ".wasm", note: "وب‌اسمبلی" },
  { type: "application/javascript", ext: ".js", note: "جاوااسکریپت (قدیمی)" },
  { type: "application/x-www-form-urlencoded", ext: "—", note: "دادهٔ فرم URL-encoded" },
  { type: "multipart/form-data", ext: "—", note: "آپلود فایل در فرم" },
  { type: "application/msword", ext: ".doc", note: "ورد قدیمی" },
  { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", ext: ".docx", note: "سند ورد" },
  { type: "application/vnd.ms-excel", ext: ".xls", note: "اکسل قدیمی" },
  { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ext: ".xlsx", note: "صفحهٔ اکسل" },
  { type: "application/vnd.ms-powerpoint", ext: ".ppt", note: "پاورپوینت قدیمی" },
  { type: "application/vnd.openxmlformats-officedocument.presentationml.presentation", ext: ".pptx", note: "ارائهٔ پاورپوینت" },
  { type: "application/epub+zip", ext: ".epub", note: "کتاب الکترونیک" },
  { type: "image/png", ext: ".png", note: "تصویر PNG" },
  { type: "image/jpeg", ext: ".jpg", note: "تصویر JPEG" },
  { type: "image/gif", ext: ".gif", note: "تصویر متحرک GIF" },
  { type: "image/webp", ext: ".webp", note: "تصویر WebP" },
  { type: "image/avif", ext: ".avif", note: "تصویر AVIF" },
  { type: "image/svg+xml", ext: ".svg", note: "گرافیک برداری" },
  { type: "image/x-icon", ext: ".ico", note: "آیکن سایت" },
  { type: "image/tiff", ext: ".tiff", note: "تصویر TIFF" },
  { type: "audio/mpeg", ext: ".mp3", note: "صوت MP3" },
  { type: "audio/wav", ext: ".wav", note: "صوت WAV" },
  { type: "audio/ogg", ext: ".ogg", note: "صوت Ogg" },
  { type: "audio/webm", ext: ".weba", note: "صوت WebM" },
  { type: "video/mp4", ext: ".mp4", note: "ویدئو MP4" },
  { type: "video/webm", ext: ".webm", note: "ویدئو WebM" },
  { type: "video/quicktime", ext: ".mov", note: "ویدئو QuickTime" },
  { type: "video/x-matroska", ext: ".mkv", note: "ویدئو Matroska" },
  { type: "font/woff", ext: ".woff", note: "فونت وب" },
  { type: "font/woff2", ext: ".woff2", note: "فونت وب فشرده" },
  { type: "font/ttf", ext: ".ttf", note: "فونت TrueType" },
];

export default function MimeReferenceTool() {
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const raw = q.trim();
    const t = raw.toLowerCase().replace(/^\./, "");
    if (!t) return MIMES;
    return MIMES.filter(
      (m) => m.type.toLowerCase().includes(t) || m.ext.toLowerCase().includes(t) || m.note.includes(raw),
    );
  }, [q]);

  return (
    <div className="space-y-4">
      <Field label="جست‌وجو" hint="نوع MIME، پسوند یا توضیح">
        <TextInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="image  یا  .pdf  یا  ویدئو" />
      </Field>
      <div className="space-y-1.5">
        {list.map((m) => (
          <div key={m.type} className="flex items-center gap-3 rounded-lg border border-border bg-bg-soft px-3 py-2 text-sm">
            <code dir="ltr" className="w-16 shrink-0 font-semibold text-turquoise">{m.ext}</code>
            <code dir="ltr" className="min-w-0 flex-1 break-all text-fg">{m.type}</code>
            <span className="hidden shrink-0 text-xs text-muted sm:block">{m.note}</span>
          </div>
        ))}
        {list.length === 0 && <p className="py-8 text-center text-sm text-muted">نتیجه‌ای یافت نشد.</p>}
      </div>
    </div>
  );
}

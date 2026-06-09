"use client";

import { useMemo, useState } from "react";
import { Field, TextInput } from "@/components/tool/kit";

// ext -> mime. ~80 common types.
const MIME: Record<string, string> = {
  html: "text/html", htm: "text/html", css: "text/css", js: "text/javascript",
  mjs: "text/javascript", json: "application/json", jsonld: "application/ld+json",
  xml: "application/xml", csv: "text/csv", txt: "text/plain", md: "text/markdown",
  ics: "text/calendar", rtf: "application/rtf", pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  odt: "application/vnd.oasis.opendocument.text",
  ods: "application/vnd.oasis.opendocument.spreadsheet",
  zip: "application/zip", gz: "application/gzip", tar: "application/x-tar",
  rar: "application/vnd.rar", "7z": "application/x-7z-compressed",
  bz2: "application/x-bzip2", bin: "application/octet-stream",
  png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif",
  webp: "image/webp", svg: "image/svg+xml", bmp: "image/bmp", ico: "image/vnd.microsoft.icon",
  tif: "image/tiff", tiff: "image/tiff", avif: "image/avif", heic: "image/heic",
  mp3: "audio/mpeg", wav: "audio/wav", ogg: "audio/ogg", oga: "audio/ogg",
  weba: "audio/webm", aac: "audio/aac", flac: "audio/flac", mid: "audio/midi",
  m4a: "audio/mp4", opus: "audio/opus",
  mp4: "video/mp4", webm: "video/webm", ogv: "video/ogg", avi: "video/x-msvideo",
  mov: "video/quicktime", mkv: "video/x-matroska", mpeg: "video/mpeg",
  ts: "video/mp2t", "3gp": "video/3gpp", flv: "video/x-flv",
  ttf: "font/ttf", otf: "font/otf", woff: "font/woff", woff2: "font/woff2",
  eot: "application/vnd.ms-fontobject",
  wasm: "application/wasm", apk: "application/vnd.android.package-archive",
  jar: "application/java-archive", sh: "application/x-sh", php: "application/x-httpd-php",
  csh: "application/x-csh", epub: "application/epub+zip", azw: "application/vnd.amazon.ebook",
  abw: "application/x-abiword", arc: "application/x-freearc",
  bmp2: "image/bmp", yaml: "application/yaml", yml: "application/yaml",
  toml: "application/toml", form: "application/x-www-form-urlencoded",
};

const ALL = Object.entries(MIME);

export default function MimeLookupTool() {
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const t = q.trim().toLowerCase().replace(/^\./, "");
    if (!t) return ALL;
    return ALL.filter(([ext, mime]) => ext.includes(t) || mime.toLowerCase().includes(t));
  }, [q]);

  return (
    <div className="space-y-4">
      <Field label="جست‌وجو" hint="پسوند یا نوع MIME">
        <TextInput
          mono
          dir="ltr"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="png  یا  application/json"
        />
      </Field>
      <div className="space-y-1.5" dir="ltr">
        {list.map(([ext, mime]) => (
          <div
            key={ext}
            className="flex items-center gap-3 rounded-lg border border-border bg-bg-soft px-3 py-2 text-sm"
          >
            <code className="w-20 shrink-0 font-semibold text-turquoise">.{ext}</code>
            <code className="min-w-0 flex-1 break-all text-fg">{mime}</code>
          </div>
        ))}
        {list.length === 0 && (
          <p className="py-8 text-center text-sm text-muted" dir="rtl">
            نتیجه‌ای یافت نشد.
          </p>
        )}
      </div>
    </div>
  );
}

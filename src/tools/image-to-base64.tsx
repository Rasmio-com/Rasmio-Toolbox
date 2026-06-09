"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Button, ErrorNote, Output, Stat } from "@/components/tool/kit";
import { formatBytes } from "@/lib/utils";

export default function ImageToBase64Tool() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dataUri, setDataUri] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState("");

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setErr("");
    setName(f.name);
    const reader = new FileReader();
    reader.onload = () => setDataUri(String(reader.result));
    reader.onerror = () => setErr("خواندن فایل ناموفق بود.");
    reader.readAsDataURL(f);
  };

  const raw = dataUri.includes(",") ? dataUri.slice(dataUri.indexOf(",") + 1) : "";
  const byteSize = raw ? Math.floor((raw.replace(/=+$/, "").length * 3) / 4) : 0;

  return (
    <div className="space-y-4">
      <Button variant="secondary" onClick={() => fileRef.current?.click()}>
        <Upload className="size-4" />
        بارگذاری تصویر
      </Button>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
      {err && <ErrorNote>{err}</ErrorNote>}

      {dataUri && (
        <>
          <div className="flex flex-wrap items-center gap-4">
            <div className="rounded-2xl border border-border bg-bg-soft p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={dataUri} alt="پیش‌نمایش" className="max-h-40 rounded-lg object-contain" />
            </div>
            <Stat label="حجم تصویر" value={<span className="text-base">{formatBytes(byteSize)}</span>} />
          </div>

          <Output label="Data URI" value={dataUri} className="min-h-28" />
          <Output label="Base64 خام" value={raw} className="min-h-28" />
          <p className="text-xs text-muted">
            فایل: <span className="font-mono text-fg" dir="ltr">{name}</span>
          </p>
        </>
      )}
    </div>
  );
}

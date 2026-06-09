"use client";

import { useEffect, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Button, ErrorNote, Field, Select, Stat } from "@/components/tool/kit";
import { downloadFile, formatBytes } from "@/lib/utils";

type Fmt = "image/jpeg" | "image/webp";

export default function ImageCompressorTool() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [name, setName] = useState("");
  const [origSize, setOrigSize] = useState(0);
  const [quality, setQuality] = useState(70);
  const [fmt, setFmt] = useState<Fmt>("image/jpeg");
  const [outUrl, setOutUrl] = useState("");
  const [outSize, setOutSize] = useState(0);
  const [err, setErr] = useState("");

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setErr("");
    setName(f.name.replace(/\.[^.]+$/, ""));
    setOrigSize(f.size);
    const url = URL.createObjectURL(f);
    const image = new Image();
    image.onload = () => {
      setImg(image);
      URL.revokeObjectURL(url);
    };
    image.onerror = () => {
      setErr("بارگذاری تصویر ناموفق بود.");
      URL.revokeObjectURL(url);
    };
    image.src = url;
  };

  useEffect(() => {
    if (!img) return;
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);
    let live = true;
    canvas.toBlob(
      (b) => {
        if (!b || !live) return;
        setOutSize(b.size);
        setOutUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(b);
        });
      },
      fmt,
      quality / 100,
    );
    return () => {
      live = false;
    };
  }, [img, quality, fmt]);

  const download = () => {
    if (!outUrl) return;
    fetch(outUrl)
      .then((r) => r.blob())
      .then((b) => downloadFile(b, `${name || "compressed"}.${fmt === "image/jpeg" ? "jpg" : "webp"}`, fmt));
  };

  const saved = origSize && outSize ? Math.max(0, Math.round((1 - outSize / origSize) * 100)) : 0;

  return (
    <div className="space-y-4">
      <Button variant="secondary" onClick={() => fileRef.current?.click()}>
        <Upload className="size-4" />
        بارگذاری تصویر
      </Button>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
      {err && <ErrorNote>{err}</ErrorNote>}

      {img && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={`کیفیت: ${quality}%`}>
              <input
                type="range"
                min={1}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-turquoise"
              />
            </Field>
            <Field label="قالب">
              <Select value={fmt} onChange={(e) => setFmt(e.target.value as Fmt)}>
                <option value="image/jpeg">JPEG</option>
                <option value="image/webp">WebP</option>
              </Select>
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Stat label="حجم اصلی" value={<span className="text-base">{formatBytes(origSize)}</span>} />
            <Stat label="حجم جدید" value={<span className="text-base">{outSize ? formatBytes(outSize) : "—"}</span>} />
            <Stat label="کاهش حجم" value={`${saved}%`} />
          </div>

          {outUrl && (
            <div className="rounded-2xl border border-border bg-bg-soft p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={outUrl} alt="پیش‌نمایش" className="mx-auto max-h-72 rounded-lg object-contain" />
            </div>
          )}

          <Button variant="primary" onClick={download} disabled={!outUrl}>
            دانلود تصویر
          </Button>
        </>
      )}
    </div>
  );
}

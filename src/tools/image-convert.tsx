"use client";

import { useEffect, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Button, ErrorNote, Field, Select } from "@/components/tool/kit";
import { downloadFile, formatBytes } from "@/lib/utils";

type Fmt = "image/png" | "image/jpeg" | "image/webp";

const EXT: Record<Fmt, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

export default function ImageConvertTool() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [name, setName] = useState("");
  const [fmt, setFmt] = useState<Fmt>("image/png");
  const [outUrl, setOutUrl] = useState("");
  const [outSize, setOutSize] = useState(0);
  const [err, setErr] = useState("");

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setErr("");
    setName(f.name.replace(/\.[^.]+$/, ""));
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
    if (fmt === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
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
      0.92,
    );
    return () => {
      live = false;
    };
  }, [img, fmt]);

  const download = () => {
    if (!outUrl) return;
    fetch(outUrl)
      .then((r) => r.blob())
      .then((b) => downloadFile(b, `${name || "image"}.${EXT[fmt]}`, fmt));
  };

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
          <Field label="قالب مقصد" className="max-w-xs">
            <Select value={fmt} onChange={(e) => setFmt(e.target.value as Fmt)}>
              <option value="image/png">PNG</option>
              <option value="image/jpeg">JPEG</option>
              <option value="image/webp">WebP</option>
            </Select>
          </Field>

          {outUrl && (
            <div className="rounded-2xl border border-border bg-bg-soft p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={outUrl} alt="پیش‌نمایش" className="mx-auto max-h-72 rounded-lg object-contain" />
              {outSize > 0 && (
                <p className="mt-2 text-center text-xs text-muted">
                  حجم خروجی: <span dir="ltr">{formatBytes(outSize)}</span>
                </p>
              )}
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

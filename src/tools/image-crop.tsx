"use client";

import { useEffect, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Button, ErrorNote, Field, TextInput } from "@/components/tool/kit";
import { downloadFile } from "@/lib/utils";

export default function ImageCropTool() {
  const fileRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [name, setName] = useState("");
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [w, setW] = useState(0);
  const [h, setH] = useState(0);
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
      setX(0);
      setY(0);
      setW(image.naturalWidth);
      setH(image.naturalHeight);
      URL.revokeObjectURL(url);
    };
    image.onerror = () => {
      setErr("بارگذاری تصویر ناموفق بود.");
      URL.revokeObjectURL(url);
    };
    image.src = url;
  };

  useEffect(() => {
    const canvas = previewRef.current;
    if (!canvas || !img || w <= 0 || h <= 0) return;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
  }, [img, x, y, w, h]);

  const download = () => {
    const canvas = previewRef.current;
    if (!canvas || !img) return;
    canvas.toBlob((b) => b && downloadFile(b, `${name || "cropped"}.png`, "image/png"), "image/png");
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
          <p className="text-xs text-muted">
            ابعاد اصلی: <span dir="ltr">{img.naturalWidth}×{img.naturalHeight}</span> پیکسل
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Field label="X">
              <TextInput type="number" dir="ltr" value={x} onChange={(e) => setX(Number(e.target.value))} />
            </Field>
            <Field label="Y">
              <TextInput type="number" dir="ltr" value={y} onChange={(e) => setY(Number(e.target.value))} />
            </Field>
            <Field label="عرض">
              <TextInput type="number" dir="ltr" value={w} onChange={(e) => setW(Number(e.target.value))} />
            </Field>
            <Field label="ارتفاع">
              <TextInput type="number" dir="ltr" value={h} onChange={(e) => setH(Number(e.target.value))} />
            </Field>
          </div>

          <div className="rounded-2xl border border-border bg-bg-soft p-3">
            <canvas ref={previewRef} className="mx-auto max-h-72 max-w-full rounded-lg object-contain" />
          </div>

          <Button variant="primary" onClick={download}>
            دانلود ناحیه‌ی برش‌خورده
          </Button>
        </>
      )}
    </div>
  );
}

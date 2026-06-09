"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Button, ErrorNote, Field, Select, TextInput, Toggle } from "@/components/tool/kit";
import { downloadFile } from "@/lib/utils";

type Fmt = "image/png" | "image/jpeg";

export default function ImageResizerTool() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [name, setName] = useState("");
  const [w, setW] = useState(0);
  const [h, setH] = useState(0);
  const [ratio, setRatio] = useState(1);
  const [lock, setLock] = useState(true);
  const [fmt, setFmt] = useState<Fmt>("image/png");
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
      setW(image.naturalWidth);
      setH(image.naturalHeight);
      setRatio(image.naturalWidth / image.naturalHeight);
      URL.revokeObjectURL(url);
    };
    image.onerror = () => {
      setErr("بارگذاری تصویر ناموفق بود.");
      URL.revokeObjectURL(url);
    };
    image.src = url;
  };

  const setWidth = (v: number) => {
    setW(v);
    if (lock && ratio) setH(Math.round(v / ratio));
  };
  const setHeight = (v: number) => {
    setH(v);
    if (lock && ratio) setW(Math.round(v * ratio));
  };

  const download = () => {
    if (!img || w <= 0 || h <= 0) return;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0, w, h);
    canvas.toBlob(
      (b) => b && downloadFile(b, `${name || "resized"}.${fmt === "image/png" ? "png" : "jpg"}`, fmt),
      fmt,
      0.92,
    );
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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Field label="عرض (px)">
              <TextInput type="number" dir="ltr" value={w} onChange={(e) => setWidth(Number(e.target.value))} />
            </Field>
            <Field label="ارتفاع (px)">
              <TextInput type="number" dir="ltr" value={h} onChange={(e) => setHeight(Number(e.target.value))} />
            </Field>
            <Field label="قالب خروجی">
              <Select value={fmt} onChange={(e) => setFmt(e.target.value as Fmt)}>
                <option value="image/png">PNG</option>
                <option value="image/jpeg">JPEG</option>
              </Select>
            </Field>
          </div>
          <Toggle checked={lock} onChange={setLock} label="حفظ نسبت ابعاد" />

          <ImagePreview src={img.src} />

          <Button variant="primary" onClick={download}>
            دانلود تصویر
          </Button>
        </>
      )}
    </div>
  );
}

function ImagePreview({ src }: { src: string }) {
  return (
    <div className="rounded-2xl border border-border bg-bg-soft p-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="پیش‌نمایش" className="mx-auto max-h-72 rounded-lg object-contain" />
    </div>
  );
}

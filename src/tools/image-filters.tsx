"use client";

import { useEffect, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Button, ErrorNote, Field } from "@/components/tool/kit";
import { downloadFile } from "@/lib/utils";

export default function ImageFiltersTool() {
  const fileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [name, setName] = useState("");
  const [grayscale, setGrayscale] = useState(0);
  const [invert, setInvert] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [sepia, setSepia] = useState(0);
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

  const filter = `grayscale(${grayscale}%) invert(${invert}%) brightness(${brightness}%) contrast(${contrast}%) sepia(${sepia}%)`;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.filter = filter;
    ctx.drawImage(img, 0, 0);
    ctx.filter = "none";
  }, [img, filter]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    canvas.toBlob((b) => b && downloadFile(b, `${name || "filtered"}.png`, "image/png"), "image/png");
  };

  const sliders: [string, number, (v: number) => void, number][] = [
    ["خاکستری", grayscale, setGrayscale, 100],
    ["معکوس", invert, setInvert, 100],
    ["روشنایی", brightness, setBrightness, 200],
    ["کنتراست", contrast, setContrast, 200],
    ["سپیا", sepia, setSepia, 100],
  ];

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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {sliders.map(([label, val, set, max]) => (
              <Field key={label} label={`${label}: ${val}%`}>
                <input
                  type="range"
                  min={0}
                  max={max}
                  value={val}
                  onChange={(e) => set(Number(e.target.value))}
                  className="w-full accent-turquoise"
                />
              </Field>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-bg-soft p-3">
            <canvas ref={canvasRef} className="mx-auto max-h-72 max-w-full rounded-lg object-contain" />
          </div>

          <Button variant="primary" onClick={download}>
            دانلود تصویر
          </Button>
        </>
      )}
    </div>
  );
}

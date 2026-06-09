"use client";

import { useEffect, useRef, useState } from "react";
import { ScanLine, Shuffle, Upload } from "lucide-react";
import { Button, ErrorNote, Field, Toggle } from "@/components/tool/kit";
import { downloadFile } from "@/lib/utils";

// seeded PRNG so the grain stays fixed while you tune the other sliders
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const clamp = (v: number) => (v < 0 ? 0 : v > 255 ? 255 : v);

export default function ImageToScanTool() {
  const fileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [name, setName] = useState("");
  const [angle, setAngle] = useState(2);
  const [noise, setNoise] = useState(14);
  const [contrast, setContrast] = useState(108);
  const [gray, setGray] = useState(false);
  const [seed, setSeed] = useState(1234);
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
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const rad = (angle * Math.PI) / 180;
    const sin = Math.abs(Math.sin(rad));
    const cos = Math.abs(Math.cos(rad));
    const w = Math.ceil(iw * cos + ih * sin);
    const h = Math.ceil(iw * sin + ih * cos);
    canvas.width = w;
    canvas.height = h;
    // light "scanner bed" revealed by the tilt
    ctx.fillStyle = "#fafafa";
    ctx.fillRect(0, 0, w, h);
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(rad);
    ctx.filter = `grayscale(${gray ? 100 : 0}%) contrast(${contrast}%)`;
    ctx.drawImage(img, -iw / 2, -ih / 2);
    ctx.restore();
    ctx.filter = "none";
    if (noise > 0) {
      const frame = ctx.getImageData(0, 0, w, h);
      const px = frame.data;
      const rnd = mulberry32(seed);
      for (let i = 0; i < px.length; i += 4) {
        const n = (rnd() - 0.5) * 2 * noise; // monochrome grain on all channels
        px[i] = clamp(px[i] + n);
        px[i + 1] = clamp(px[i + 1] + n);
        px[i + 2] = clamp(px[i + 2] + n);
      }
      ctx.putImageData(frame, 0, 0);
    }
  }, [img, angle, noise, contrast, gray, seed]);

  const shuffle = () => {
    setAngle(Math.round((Math.random() * 8 - 4) * 10) / 10);
    setSeed((Math.random() * 1e9) | 0);
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    canvas.toBlob(
      (b) => b && downloadFile(b, `${name || "scan"}-scan.jpg`, "image/jpeg"),
      "image/jpeg",
      0.9,
    );
  };

  const sliders: [string, string, number, number, number, number, (v: number) => void][] = [
    ["چرخش", "°", angle, -8, 8, 0.5, setAngle],
    ["نویز", "", noise, 0, 50, 1, setNoise],
    ["کنتراست", "%", contrast, 80, 160, 1, setContrast],
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {sliders.map(([label, unit, val, min, max, step, set]) => (
              <Field key={label} label={`${label}: ${val}${unit}`}>
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={val}
                  onChange={(e) => set(Number(e.target.value))}
                  className="w-full accent-turquoise"
                />
              </Field>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Toggle checked={gray} onChange={setGray} label="سیاه‌وسفید" />
            <Button onClick={shuffle}>
              <Shuffle className="size-4" />
              نمونهٔ تصادفی
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-bg-soft p-3">
            <canvas ref={canvasRef} className="mx-auto max-h-72 max-w-full rounded-lg object-contain" />
          </div>

          <Button variant="primary" onClick={download}>
            <ScanLine className="size-4" />
            دانلود اسکن (JPEG)
          </Button>
        </>
      )}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { FlipHorizontal, FlipVertical, RotateCw, Upload } from "lucide-react";
import { Button, ErrorNote } from "@/components/tool/kit";
import { downloadFile } from "@/lib/utils";

export default function ImageRotateFlipTool() {
  const fileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [name, setName] = useState("");
  const [angle, setAngle] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [err, setErr] = useState("");

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setErr("");
    setName(f.name.replace(/\.[^.]+$/, ""));
    setAngle(0);
    setFlipH(false);
    setFlipV(false);
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
    const rotated = angle === 90 || angle === 270;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    canvas.width = rotated ? ih : iw;
    canvas.height = rotated ? iw : ih;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(img, -iw / 2, -ih / 2);
    ctx.restore();
  }, [img, angle, flipH, flipV]);

  const rotate = () => setAngle((a) => (a + 90) % 360);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    canvas.toBlob((b) => b && downloadFile(b, `${name || "image"}.png`, "image/png"), "image/png");
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
          <div className="flex flex-wrap gap-2">
            <Button onClick={rotate}>
              <RotateCw className="size-4" />
              چرخش ۹۰°
            </Button>
            <Button onClick={() => setAngle(180)}>چرخش ۱۸۰°</Button>
            <Button onClick={() => setAngle(270)}>چرخش ۲۷۰°</Button>
            <Button variant={flipH ? "primary" : "secondary"} onClick={() => setFlipH((v) => !v)}>
              <FlipHorizontal className="size-4" />
              آینه افقی
            </Button>
            <Button variant={flipV ? "primary" : "secondary"} onClick={() => setFlipV((v) => !v)}>
              <FlipVertical className="size-4" />
              آینه عمودی
            </Button>
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

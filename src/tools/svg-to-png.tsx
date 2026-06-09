"use client";

import { useState } from "react";
import { Button, ErrorNote, Field, Select, TextArea } from "@/components/tool/kit";
import { downloadFile } from "@/lib/utils";

const SAMPLE = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
  <circle cx="60" cy="60" r="50" fill="#2dd4c4" />
  <text x="60" y="68" font-size="28" text-anchor="middle" fill="#0a0f14">SVG</text>
</svg>`;

function svgSize(svg: string) {
  try {
    const doc = new DOMParser().parseFromString(svg, "image/svg+xml");
    const el = doc.documentElement;
    const w = parseFloat(el.getAttribute("width") || "");
    const h = parseFloat(el.getAttribute("height") || "");
    if (w > 0 && h > 0) return { w, h };
    const vb = (el.getAttribute("viewBox") || "").split(/[\s,]+/).map(Number);
    if (vb.length === 4 && vb[2] > 0 && vb[3] > 0) return { w: vb[2], h: vb[3] };
  } catch {
    /* ignore */
  }
  return { w: 512, h: 512 };
}

export default function SvgToPngTool() {
  const [svg, setSvg] = useState(SAMPLE);
  const [scale, setScale] = useState("2");
  const [pngUrl, setPngUrl] = useState("");
  const [err, setErr] = useState("");

  const render = () => {
    setErr("");
    setPngUrl("");
    if (!svg.trim()) return;
    const { w, h } = svgSize(svg);
    const factor = Number(scale);
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(w * factor));
      canvas.height = Math.max(1, Math.round(h * factor));
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setErr("ساخت Canvas ناموفق بود.");
        URL.revokeObjectURL(url);
        return;
      }
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      setPngUrl(canvas.toDataURL("image/png"));
      URL.revokeObjectURL(url);
    };
    image.onerror = () => {
      setErr("SVG نامعتبر است یا قابل رندر نیست.");
      URL.revokeObjectURL(url);
    };
    image.src = url;
  };

  const download = () => {
    if (pngUrl) downloadFile(dataUrlToBlob(pngUrl), "image.png", "image/png");
  };

  return (
    <div className="space-y-4">
      <Field label="کد SVG">
        <TextArea value={svg} onChange={(e) => setSvg(e.target.value)} placeholder="<svg ...>...</svg>" className="min-h-40" />
      </Field>
      <div className="flex flex-wrap items-end gap-3">
        <Field label="مقیاس" className="w-32">
          <Select value={scale} onChange={(e) => setScale(e.target.value)}>
            <option value="1">۱×</option>
            <option value="2">۲×</option>
            <option value="3">۳×</option>
            <option value="4">۴×</option>
          </Select>
        </Field>
        <Button variant="primary" onClick={render} disabled={!svg.trim()}>
          تبدیل به PNG
        </Button>
      </div>
      {err && <ErrorNote>{err}</ErrorNote>}

      {pngUrl && (
        <>
          <div className="rounded-2xl border border-border bg-bg-soft p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={pngUrl} alt="پیش‌نمایش PNG" className="mx-auto max-h-72 max-w-full rounded-lg object-contain" />
          </div>
          <Button variant="primary" onClick={download}>
            دانلود PNG
          </Button>
        </>
      )}
    </div>
  );
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [head, body] = dataUrl.split(",");
  const mime = head.match(/:(.*?);/)?.[1] || "image/png";
  const bin = atob(body);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new Blob([bytes], { type: mime });
}

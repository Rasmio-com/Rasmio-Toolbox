"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Button, ErrorNote, Field, Select, TextArea } from "@/components/tool/kit";
import { downloadFile } from "@/lib/utils";

type EC = "L" | "M" | "Q" | "H";

export default function QrCodeTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("https://rasmio.example");
  const [size, setSize] = useState(280);
  const [ec, setEc] = useState<EC>("M");
  const [dark, setDark] = useState("#0a0f14");
  const [light, setLight] = useState("#ffffff");
  const [err, setErr] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!text) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    QRCode.toCanvas(
      canvas,
      text,
      { width: size, margin: 2, errorCorrectionLevel: ec, color: { dark, light } },
      (e) => setErr(e ? "تولید QR ناموفق بود (متن خیلی طولانی است؟)." : ""),
    );
  }, [text, size, ec, dark, light]);

  const downloadPng = () => {
    const url = canvasRef.current?.toDataURL("image/png");
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcode.png";
    a.click();
  };

  const downloadSvg = async () => {
    const svg = await QRCode.toString(text, {
      type: "svg",
      margin: 2,
      errorCorrectionLevel: ec,
      color: { dark, light },
    });
    downloadFile(svg, "qrcode.svg", "image/svg+xml");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
      <div className="space-y-4">
        <Field label="متن یا آدرس">
          <TextArea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="متن، لینک، شماره تماس و…"
            className="min-h-28"
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label={`اندازه: ${size}px`}>
            <input
              type="range"
              min={128}
              max={512}
              step={8}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full accent-turquoise"
            />
          </Field>
          <Field label="سطح تصحیح خطا">
            <Select value={ec} onChange={(e) => setEc(e.target.value as EC)}>
              <option value="L">L — کم (۷٪)</option>
              <option value="M">M — متوسط (۱۵٪)</option>
              <option value="Q">Q — زیاد (۲۵٪)</option>
              <option value="H">H — بسیار زیاد (۳۰٪)</option>
            </Select>
          </Field>
          <Field label="رنگ نقش">
            <input
              type="color"
              value={dark}
              onChange={(e) => setDark(e.target.value)}
              className="h-11 w-full cursor-pointer rounded-lg border border-border bg-bg-soft p-1"
            />
          </Field>
          <Field label="رنگ پس‌زمینه">
            <input
              type="color"
              value={light}
              onChange={(e) => setLight(e.target.value)}
              className="h-11 w-full cursor-pointer rounded-lg border border-border bg-bg-soft p-1"
            />
          </Field>
        </div>
        {err && <ErrorNote>{err}</ErrorNote>}
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="rounded-2xl border border-border bg-white p-3">
          <canvas ref={canvasRef} />
        </div>
        <div className="flex gap-2">
          <Button onClick={downloadPng}>دانلود PNG</Button>
          <Button onClick={downloadSvg}>دانلود SVG</Button>
        </div>
      </div>
    </div>
  );
}

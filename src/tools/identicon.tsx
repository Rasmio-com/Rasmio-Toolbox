"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Field, TextInput } from "@/components/tool/kit";

const GRID = 5;
const CELL = 64; // px per cell
const PAD = CELL; // one-cell padding around the grid
const SIZE = GRID * CELL + PAD * 2;

export default function IdenticonTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("rasmio");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let cancel = false;

    (async () => {
      const value = text.trim();
      ctx.clearRect(0, 0, SIZE, SIZE);
      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(0, 0, SIZE, SIZE);
      if (!value) return;

      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
      if (cancel) return;
      const hash = new Uint8Array(buf);

      // Foreground color derived from the last bytes of the hash (HSL → vivid).
      const hue = (hash[hash.length - 1] * 360) / 256;
      const sat = 55 + (hash[hash.length - 2] % 30); // 55-84%
      const light = 45 + (hash[hash.length - 3] % 15); // 45-59%
      const fg = `hsl(${hue} ${sat}% ${light}%)`;

      ctx.fillStyle = fg;
      // 3 left columns decide the pattern; mirror to the right 2 columns.
      const half = Math.ceil(GRID / 2); // 3
      for (let col = 0; col < half; col++) {
        for (let row = 0; row < GRID; row++) {
          const idx = col * GRID + row;
          const on = (hash[idx] & 1) === 0; // even byte ⇒ filled
          if (!on) continue;
          const x = PAD + col * CELL;
          const y = PAD + row * CELL;
          ctx.fillRect(x, y, CELL, CELL);
          // mirror across the vertical axis
          const mirrorCol = GRID - 1 - col;
          if (mirrorCol !== col) {
            ctx.fillRect(PAD + mirrorCol * CELL, y, CELL, CELL);
          }
        }
      }
    })();

    return () => {
      cancel = true;
    };
  }, [text]);

  const downloadPng = () => {
    const url = canvasRef.current?.toDataURL("image/png");
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = `identicon-${text.trim() || "blank"}.png`;
    a.click();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
      <div className="space-y-4">
        <Field label="متن ورودی" hint="نام کاربری، ایمیل، شناسه و…">
          <TextInput
            dir="ltr"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="username یا email"
          />
        </Field>
        <p className="text-xs text-muted">
          از هش SHA-256 متن، یک الگوی متقارن ۵×۵ به‌صورت قطعی ساخته می‌شود؛ برای یک
          ورودی همیشه همان تصویر تولید می‌گردد.
        </p>
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="rounded-2xl border border-border bg-white p-3">
          <canvas
            ref={canvasRef}
            width={SIZE}
            height={SIZE}
            className="size-44 rounded-lg"
          />
        </div>
        <Button onClick={downloadPng}>دانلود PNG</Button>
      </div>
    </div>
  );
}

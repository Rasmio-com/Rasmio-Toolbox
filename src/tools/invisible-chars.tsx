"use client";

import { useMemo, useState } from "react";
import { Button, Field, Panel, TextArea } from "@/components/tool/kit";

const NAMES: Record<number, string> = {
  0x200b: "ZWSP — فاصله با عرض صفر",
  0x200c: "ZWNJ — نیم‌فاصله (بی‌چسب)",
  0x200d: "ZWJ — اتصال‌دهنده با عرض صفر",
  0x200e: "LRM — نشانگر چپ‌به‌راست",
  0x200f: "RLM — نشانگر راست‌به‌چپ",
  0x202a: "LRE — جاسازی چپ‌به‌راست",
  0x202b: "RLE — جاسازی راست‌به‌چپ",
  0x202c: "PDF — پایان جهت‌دهی",
  0x202d: "LRO — بازنویسی چپ‌به‌راست",
  0x202e: "RLO — بازنویسی راست‌به‌چپ",
  0x2060: "WJ — اتصال کلمه",
  0x2066: "LRI — جداسازی چپ‌به‌راست",
  0x2067: "RLI — جداسازی راست‌به‌چپ",
  0x2068: "FSI — جداسازی بر پایه‌ی محتوا",
  0x2069: "PDI — پایان جداسازی جهت",
  0xfeff: "BOM / ZWNBSP — علامت ترتیب بایت",
  0x00a0: "NBSP — فاصله‌ی بدون‌شکست",
  0x00ad: "SHY — خط‌تیره‌ی نرم",
  0x2061: "Function Application (نامرئی)",
  0x2062: "Invisible Times (نامرئی)",
  0x2063: "Invisible Separator (نامرئی)",
  0x2064: "Invisible Plus (نامرئی)",
  0x180e: "MVS — جداکننده‌ی واکه‌ی مغولی",
  0x061c: "ALM — نشانگر عربی",
  0x3000: "فاصله‌ی تمام‌پهنا (Ideographic Space)",
};

const INVISIBLE = new Set<number>([
  0x00a0, 0x00ad, 0x061c, 0x180e, 0x200b, 0x200c, 0x200d, 0x200e, 0x200f,
  0x202a, 0x202b, 0x202c, 0x202d, 0x202e, 0x2060, 0x2061, 0x2062, 0x2063,
  0x2064, 0x2066, 0x2067, 0x2068, 0x2069, 0x3000, 0xfeff,
]);

const hex = (cp: number) => "U+" + cp.toString(16).toUpperCase().padStart(4, "0");

export default function InvisibleCharsTool() {
  const [text, setText] = useState("");

  const found = useMemo(() => {
    const out: { pos: number; cp: number; name: string }[] = [];
    Array.from(text).forEach((ch, i) => {
      const cp = ch.codePointAt(0) ?? 0;
      if (!INVISIBLE.has(cp)) return;
      out.push({ pos: i, cp, name: NAMES[cp] ?? `کاراکتر نامرئی ${hex(cp)}` });
    });
    return out;
  }, [text]);

  const stripped = useMemo(
    () => Array.from(text).filter((ch) => !INVISIBLE.has(ch.codePointAt(0) ?? 0)).join(""),
    [text],
  );

  const fa = (n: number) => n.toLocaleString("fa-IR");

  return (
    <div className="space-y-4">
      <Field label="متن ورودی" hint="کاراکترهای نامرئی شناسایی می‌شوند">
        <TextArea
          mono={false}
          dir="auto"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="متنی که می‌خواهید بررسی شود را این‌جا بچسبانید…"
          className="min-h-40"
        />
      </Field>
      <div className="flex items-center gap-3">
        <Button variant="danger" disabled={found.length === 0} onClick={() => setText(stripped)}>
          حذف همه‌ی کاراکترهای نامرئی
        </Button>
        <span className="text-sm text-muted">
          {found.length === 0 ? "کاراکتر نامرئی‌ای یافت نشد." : `${fa(found.length)} مورد یافت شد`}
        </span>
      </div>
      {found.length > 0 && (
        <Panel title="فهرست کاراکترهای نامرئی">
          <div className="max-h-80 space-y-1 overflow-auto">
            {found.map((f, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-border bg-bg-soft px-3 py-2">
                <span className="w-16 shrink-0 text-end font-mono text-xs text-saffron">#{fa(f.pos)}</span>
                <span dir="ltr" className="w-20 shrink-0 font-mono text-xs text-turquoise">{hex(f.cp)}</span>
                <span className="min-w-0 truncate text-sm text-fg" title={f.name}>{f.name}</span>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}

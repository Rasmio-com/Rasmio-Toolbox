"use client";

import { useMemo, useState } from "react";
import { Field, TextInput } from "@/components/tool/kit";
import { toAsciiDigits } from "@/lib/utils";

// Control characters 0-31 + 127: abbrev + Persian description.
const CONTROL: Record<number, [string, string]> = {
  0: ["NUL", "تهی (null)"],
  1: ["SOH", "آغاز سرآیند"],
  2: ["STX", "آغاز متن"],
  3: ["ETX", "پایان متن"],
  4: ["EOT", "پایان انتقال"],
  5: ["ENQ", "پرس‌وجو"],
  6: ["ACK", "تأیید"],
  7: ["BEL", "زنگ (bell)"],
  8: ["BS", "بازگشت به عقب"],
  9: ["HT", "تب افقی"],
  10: ["LF", "خط جدید (line feed)"],
  11: ["VT", "تب عمودی"],
  12: ["FF", "صفحهٔ جدید"],
  13: ["CR", "بازگشت نورد (carriage return)"],
  14: ["SO", "خروج به‌بیرون"],
  15: ["SI", "ورود به‌داخل"],
  16: ["DLE", "گریز پیوند داده"],
  17: ["DC1", "کنترل دستگاه ۱ (XON)"],
  18: ["DC2", "کنترل دستگاه ۲"],
  19: ["DC3", "کنترل دستگاه ۳ (XOFF)"],
  20: ["DC4", "کنترل دستگاه ۴"],
  21: ["NAK", "عدم تأیید"],
  22: ["SYN", "همگام‌سازی"],
  23: ["ETB", "پایان بلوک انتقال"],
  24: ["CAN", "لغو"],
  25: ["EM", "پایان رسانه"],
  26: ["SUB", "جایگزین"],
  27: ["ESC", "گریز (escape)"],
  28: ["FS", "جداکنندهٔ فایل"],
  29: ["GS", "جداکنندهٔ گروه"],
  30: ["RS", "جداکنندهٔ رکورد"],
  31: ["US", "جداکنندهٔ واحد"],
  32: ["SP", "فاصله (space)"],
  127: ["DEL", "حذف (delete)"],
};

type Row = { dec: number; hex: string; oct: string; char: string; desc: string };

const ROWS: Row[] = Array.from({ length: 128 }, (_, dec) => {
  const ctrl = CONTROL[dec];
  return {
    dec,
    hex: dec.toString(16).toUpperCase().padStart(2, "0"),
    oct: dec.toString(8).padStart(3, "0"),
    char: ctrl ? ctrl[0] : String.fromCharCode(dec),
    desc: ctrl ? ctrl[1] : `کاراکتر قابل‌چاپ «${String.fromCharCode(dec)}»`,
  };
});

export default function AsciiTableTool() {
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const t = toAsciiDigits(q.trim()).toLowerCase();
    if (!t) return ROWS;
    return ROWS.filter(
      (r) =>
        String(r.dec) === t ||
        r.hex.toLowerCase() === t ||
        r.oct === t ||
        r.char.toLowerCase() === t ||
        r.char.toLowerCase().includes(t) ||
        r.desc.includes(q.trim()),
    );
  }, [q]);

  return (
    <div className="space-y-4">
      <Field label="جست‌وجو" hint="ده‌دهی، هگز، اکتال، کاراکتر یا توضیح">
        <TextInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="65  یا  41  یا  A" />
      </Field>
      <div className="overflow-x-auto rounded-xl border border-border" dir="ltr">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-xs text-muted">
            <tr>
              <th className="px-3 py-2 text-left">Dec</th>
              <th className="px-3 py-2 text-left">Hex</th>
              <th className="px-3 py-2 text-left">Oct</th>
              <th className="px-3 py-2 text-left">Char</th>
              <th className="px-3 py-2 text-right" dir="rtl">توضیح</th>
            </tr>
          </thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.dec} className="border-t border-border odd:bg-bg-soft/40">
                <td className="px-3 py-1.5 font-mono tabular-nums text-fg">{r.dec}</td>
                <td className="px-3 py-1.5 font-mono text-saffron">0x{r.hex}</td>
                <td className="px-3 py-1.5 font-mono text-muted">{r.oct}</td>
                <td className="px-3 py-1.5 font-mono font-semibold text-turquoise">{r.char}</td>
                <td className="px-3 py-1.5 text-right text-muted" dir="rtl">{r.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p className="py-8 text-center text-sm text-muted" dir="rtl">نتیجه‌ای یافت نشد.</p>}
      </div>
    </div>
  );
}

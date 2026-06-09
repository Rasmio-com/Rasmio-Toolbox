"use client";

import { useMemo, useState } from "react";
import { Field, TextInput } from "@/components/tool/kit";
import { copyText } from "@/lib/utils";

type Ent = { name: string; ch: string; desc: string };

const ENTITIES: Ent[] = [
  { name: "&amp;", ch: "&", desc: "علامت اند" },
  { name: "&lt;", ch: "<", desc: "کوچک‌تر" },
  { name: "&gt;", ch: ">", desc: "بزرگ‌تر" },
  { name: "&quot;", ch: '"', desc: "نقل‌قول دوتایی" },
  { name: "&apos;", ch: "'", desc: "نقل‌قول تکی" },
  { name: "&nbsp;", ch: " ", desc: "فاصلهٔ سخت (no-break space)" },
  { name: "&copy;", ch: "©", desc: "کپی‌رایت" },
  { name: "&reg;", ch: "®", desc: "علامت ثبت‌شده" },
  { name: "&trade;", ch: "™", desc: "علامت تجاری" },
  { name: "&euro;", ch: "€", desc: "یورو" },
  { name: "&pound;", ch: "£", desc: "پوند" },
  { name: "&yen;", ch: "¥", desc: "ین" },
  { name: "&cent;", ch: "¢", desc: "سنت" },
  { name: "&deg;", ch: "°", desc: "درجه" },
  { name: "&plusmn;", ch: "±", desc: "به‌علاوه منفی" },
  { name: "&times;", ch: "×", desc: "ضرب" },
  { name: "&divide;", ch: "÷", desc: "تقسیم" },
  { name: "&frac12;", ch: "½", desc: "یک‌دوم" },
  { name: "&frac14;", ch: "¼", desc: "یک‌چهارم" },
  { name: "&frac34;", ch: "¾", desc: "سه‌چهارم" },
  { name: "&sup2;", ch: "²", desc: "توان دو" },
  { name: "&sup3;", ch: "³", desc: "توان سه" },
  { name: "&micro;", ch: "µ", desc: "میکرو" },
  { name: "&para;", ch: "¶", desc: "نشان پاراگراف" },
  { name: "&sect;", ch: "§", desc: "نشان بخش" },
  { name: "&middot;", ch: "·", desc: "نقطهٔ میانی" },
  { name: "&bull;", ch: "•", desc: "گلوله" },
  { name: "&hellip;", ch: "…", desc: "سه‌نقطه" },
  { name: "&ndash;", ch: "–", desc: "خط تیرهٔ کوتاه" },
  { name: "&mdash;", ch: "—", desc: "خط تیرهٔ بلند" },
  { name: "&lsquo;", ch: "‘", desc: "نقل‌قول تکی چپ" },
  { name: "&rsquo;", ch: "’", desc: "نقل‌قول تکی راست" },
  { name: "&ldquo;", ch: "“", desc: "نقل‌قول دوتایی چپ" },
  { name: "&rdquo;", ch: "”", desc: "نقل‌قول دوتایی راست" },
  { name: "&laquo;", ch: "«", desc: "گیومه چپ" },
  { name: "&raquo;", ch: "»", desc: "گیومه راست" },
  { name: "&larr;", ch: "←", desc: "فلش چپ" },
  { name: "&uarr;", ch: "↑", desc: "فلش بالا" },
  { name: "&rarr;", ch: "→", desc: "فلش راست" },
  { name: "&darr;", ch: "↓", desc: "فلش پایین" },
  { name: "&harr;", ch: "↔", desc: "فلش دوطرفه" },
  { name: "&spades;", ch: "♠", desc: "پیک" },
  { name: "&clubs;", ch: "♣", desc: "گشنیز" },
  { name: "&hearts;", ch: "♥", desc: "دل" },
  { name: "&diams;", ch: "♦", desc: "خشت" },
  { name: "&dagger;", ch: "†", desc: "خنجر" },
  { name: "&Dagger;", ch: "‡", desc: "خنجر دوتایی" },
  { name: "&permil;", ch: "‰", desc: "در هزار" },
  { name: "&infin;", ch: "∞", desc: "بی‌نهایت" },
  { name: "&ne;", ch: "≠", desc: "نامساوی" },
  { name: "&le;", ch: "≤", desc: "کوچک‌تر مساوی" },
  { name: "&ge;", ch: "≥", desc: "بزرگ‌تر مساوی" },
  { name: "&radic;", ch: "√", desc: "رادیکال" },
  { name: "&sum;", ch: "∑", desc: "سیگما" },
  { name: "&pi;", ch: "π", desc: "پی" },
  { name: "&alpha;", ch: "α", desc: "آلفا" },
  { name: "&beta;", ch: "β", desc: "بتا" },
  { name: "&shy;", ch: "­", desc: "خط تیرهٔ نرم" },
  { name: "&zwnj;", ch: "‌", desc: "نیم‌فاصله (ZWNJ)" },
];

function code(ch: string): { dec: string; hex: string } {
  const cp = ch.codePointAt(0) ?? 0;
  return { dec: `&#${cp};`, hex: `&#x${cp.toString(16).toUpperCase()};` };
}

export default function HtmlEntitiesReferenceTool() {
  const [q, setQ] = useState("");
  const [copied, setCopied] = useState("");

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return ENTITIES;
    return ENTITIES.filter((e) => e.name.toLowerCase().includes(t) || e.ch === q.trim() || e.desc.includes(q.trim()));
  }, [q]);

  async function copy(v: string) {
    if (await copyText(v)) {
      setCopied(v);
      setTimeout(() => setCopied(""), 1200);
    }
  }

  return (
    <div className="space-y-4">
      <Field label="جست‌وجو" hint="نام موجودیت، کاراکتر یا توضیح">
        <TextInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="&amp;copy;  یا  کپی‌رایت" />
      </Field>
      <div className="grid gap-2 sm:grid-cols-2">
        {list.map((e) => {
          const c = code(e.ch);
          return (
            <div key={e.name} className="rounded-xl border border-border bg-bg-soft p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-2xl text-turquoise">{e.ch}</span>
                <span className="text-xs text-muted" dir="rtl">{e.desc}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5" dir="ltr">
                {[e.name, c.dec, c.hex].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => copy(v)}
                    className="rounded-md border border-border bg-surface-2 px-2 py-1 font-mono text-xs text-fg transition-colors hover:border-turquoise-dim"
                  >
                    {copied === v ? "کپی شد" : v}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {list.length === 0 && <p className="py-8 text-center text-sm text-muted">نتیجه‌ای یافت نشد.</p>}
    </div>
  );
}

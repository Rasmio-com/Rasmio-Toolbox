"use client";

import { useMemo, useState } from "react";
import { CopyButton, Field, Output, TextArea, TextInput } from "@/components/tool/kit";
import { toAsciiDigits } from "@/lib/utils";

const FA = "۰۱۲۳۴۵۶۷۸۹";
const AR = "٠١٢٣٤٥٦٧٨٩";

function mapDigits(s: string, target: "en" | "fa" | "ar"): string {
  const set = target === "fa" ? FA : target === "ar" ? AR : "0123456789";
  return s.replace(/[0-9۰-۹٠-٩]/g, (ch) => {
    let v: number;
    if (ch >= "0" && ch <= "9") v = ch.charCodeAt(0) - 48;
    else {
      const fi = FA.indexOf(ch);
      v = fi >= 0 ? fi : AR.indexOf(ch);
    }
    return set[v];
  });
}

/* ── Number → Persian words ──────────────────────────────── */
const ONES = ["", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه"];
const TEENS = [
  "ده", "یازده", "دوازده", "سیزده", "چهارده", "پانزده", "شانزده", "هفده",
  "هجده", "نوزده",
];
const TENS = ["", "", "بیست", "سی", "چهل", "پنجاه", "شصت", "هفتاد", "هشتاد", "نود"];
const HUNDREDS = [
  "", "صد", "دویست", "سیصد", "چهارصد", "پانصد", "ششصد", "هفتصد", "هشتصد", "نهصد",
];
const SCALES = ["", "هزار", "میلیون", "میلیارد", "بیلیون", "بیلیارد"];
const DEC_PLACES = ["", "دهم", "صدم", "هزارم", "ده‌هزارم", "صدهزارم", "میلیونیم"];

function threeToWords(n: number): string {
  const out: string[] = [];
  const h = Math.floor(n / 100);
  const rem = n % 100;
  if (h) out.push(HUNDREDS[h]);
  if (rem < 10 && rem > 0) out.push(ONES[rem]);
  else if (rem >= 10 && rem < 20) out.push(TEENS[rem - 10]);
  else if (rem >= 20) {
    const t = Math.floor(rem / 10);
    const o = rem % 10;
    out.push(o ? `${TENS[t]} و ${ONES[o]}` : TENS[t]);
  }
  return out.join(" و ");
}

function intToWords(digits: string): string {
  let n = digits.replace(/^0+/, "");
  if (!n) return "صفر";
  if (n.length > 18) return "عدد بسیار بزرگ است";
  const groups: string[] = [];
  for (let i = n.length; i > 0; i -= 3) groups.unshift(n.slice(Math.max(0, i - 3), i));
  const words: string[] = [];
  groups.forEach((g, idx) => {
    const val = parseInt(g, 10);
    if (val) {
      const scale = SCALES[groups.length - 1 - idx];
      words.push(threeToWords(val) + (scale ? ` ${scale}` : ""));
    }
  });
  return words.join(" و ") || "صفر";
}

function numToWords(input: string): string {
  let s = toAsciiDigits(input).trim().replace(/[,\s]/g, "");
  if (!s) return "";
  let neg = false;
  if (s.startsWith("-")) {
    neg = true;
    s = s.slice(1);
  }
  s = s.replace(/[^\d.]/g, "");
  if (!s || s === ".") return "";
  const [intPart, decPart] = s.split(".");
  let res = intToWords(intPart || "0");
  if (decPart && /[1-9]/.test(decPart) && decPart.length < DEC_PLACES.length) {
    res += ` ممیز ${intToWords(decPart)} ${DEC_PLACES[decPart.length]}`;
  }
  return (neg ? "منفی " : "") + res;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-bg-soft px-3 py-2.5">
      <span className="w-20 shrink-0 text-xs text-saffron">{label}</span>
      <code dir="ltr" className="min-w-0 flex-1 truncate font-mono text-fg">
        {value || "—"}
      </code>
      <CopyButton value={value} />
    </div>
  );
}

export default function PersianNumberTool() {
  const [text, setText] = useState("");
  const [num, setNum] = useState("");

  const digits = useMemo(
    () => ({
      en: mapDigits(text, "en"),
      fa: mapDigits(text, "fa"),
      ar: mapDigits(text, "ar"),
    }),
    [text],
  );

  const words = useMemo(() => numToWords(num), [num]);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Field label="متن یا عدد ورودی" hint="ارقام به‌صورت خودکار تبدیل می‌شوند">
          <TextArea
            mono={false}
            dir="auto"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="مثلاً: شماره ۱۴۰۳ یا 2024"
            className="min-h-24"
          />
        </Field>
        {text && (
          <div className="space-y-2">
            <Row label="انگلیسی" value={digits.en} />
            <Row label="فارسی" value={digits.fa} />
            <Row label="عربی" value={digits.ar} />
          </div>
        )}
      </div>

      <div className="space-y-3 rounded-2xl border border-border bg-surface/40 p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-fg">عدد به حروف فارسی</h3>
        <Field label="عدد">
          <TextInput
            dir="ltr"
            mono
            value={num}
            onChange={(e) => setNum(e.target.value)}
            placeholder="۱۲۳۴۵۶ یا 123456.78"
          />
        </Field>
        <Output label="به حروف" value={words} mono={false} placeholder="عدد را وارد کنید…" />
      </div>
    </div>
  );
}

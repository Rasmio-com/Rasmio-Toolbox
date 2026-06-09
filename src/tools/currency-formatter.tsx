"use client";

import { useMemo, useState } from "react";
import { CopyButton, ErrorNote, Field, Select, TextInput } from "@/components/tool/kit";
import { toAsciiDigits } from "@/lib/utils";

const CURRENCIES = ["USD", "EUR", "GBP", "IRR", "AED", "TRY", "JPY", "CNY", "RUB", "INR"];
const LOCALES = [
  { id: "fa-IR", label: "فارسی (ایران)" },
  { id: "en-US", label: "English (US)" },
  { id: "de-DE", label: "Deutsch" },
  { id: "ar-SA", label: "العربية" },
];

const num = (s: string) => Number(toAsciiDigits(s).trim());
const fa = (n: number) =>
  Number.isFinite(n) ? n.toLocaleString("fa-IR") : "—";

export default function CurrencyFormatterTool() {
  const [value, setValue] = useState("");
  const [currency, setCurrency] = useState("IRR");
  const [locale, setLocale] = useState("fa-IR");

  const formatted = useMemo(() => {
    const n = num(value);
    if (!value.trim()) return null;
    if (!Number.isFinite(n)) return { err: "عدد نامعتبر است." };
    try {
      const out = new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
      }).format(n);
      const decimal = new Intl.NumberFormat(locale).format(n);
      return { err: "", out, decimal };
    } catch {
      return { err: "قالب‌بندی با ورودی فعلی ممکن نیست." };
    }
  }, [value, currency, locale]);

  const rialToman = useMemo(() => {
    const n = num(value);
    if (!Number.isFinite(n)) return null;
    return { toman: fa(n / 10), rial: fa(n * 10) };
  }, [value]);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="مبلغ">
          <TextInput
            mono
            dir="ltr"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="1234567"
          />
        </Field>
        <Field label="واحد پول">
          <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="زبان نمایش">
          <Select value={locale} onChange={(e) => setLocale(e.target.value)}>
            {LOCALES.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      {formatted?.err && <ErrorNote>{formatted.err}</ErrorNote>}
      {formatted && !formatted.err && (
        <div className="space-y-2">
          <Row label="ارزی" value={formatted.out} />
          <Row label="عددی" value={formatted.decimal} />
        </div>
      )}

      {value.trim() && rialToman && (
        <div className="rounded-2xl border border-border bg-surface/70 p-4 sm:p-5">
          <h3 className="mb-3 text-sm font-semibold text-fg">تبدیل ریال و تومان</h3>
          <p className="mb-3 text-xs text-faint">هر ۱۰ ریال برابر با ۱ تومان است.</p>
          <div className="space-y-2">
            <Row label="معادل تومان" value={rialToman.toman} />
            <Row label="معادل ریال" value={rialToman.rial} />
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  const v = value ?? "";
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-bg-soft px-3 py-2.5">
      <span className="w-24 shrink-0 text-xs text-saffron">{label}</span>
      <code dir="ltr" className="min-w-0 flex-1 truncate font-mono text-base font-semibold text-fg">
        {v}
      </code>
      <CopyButton value={v} />
    </div>
  );
}

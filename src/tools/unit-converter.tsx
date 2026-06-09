"use client";

import { useMemo, useState } from "react";
import { CopyButton, Field, Select, TextInput } from "@/components/tool/kit";

type Unit = { id: string; label: string; factor: number };
type Cat = { id: string; label: string; units: Unit[] };

// Factors are relative to the category's base unit.
const CATS: Cat[] = [
  {
    id: "length",
    label: "طول",
    units: [
      { id: "mm", label: "میلی‌متر", factor: 0.001 },
      { id: "cm", label: "سانتی‌متر", factor: 0.01 },
      { id: "m", label: "متر", factor: 1 },
      { id: "km", label: "کیلومتر", factor: 1000 },
      { id: "in", label: "اینچ", factor: 0.0254 },
      { id: "ft", label: "فوت", factor: 0.3048 },
      { id: "yd", label: "یارد", factor: 0.9144 },
      { id: "mi", label: "مایل", factor: 1609.344 },
    ],
  },
  {
    id: "mass",
    label: "جرم / وزن",
    units: [
      { id: "mg", label: "میلی‌گرم", factor: 0.000001 },
      { id: "g", label: "گرم", factor: 0.001 },
      { id: "kg", label: "کیلوگرم", factor: 1 },
      { id: "t", label: "تن", factor: 1000 },
      { id: "oz", label: "اونس", factor: 0.0283495 },
      { id: "lb", label: "پوند", factor: 0.453592 },
    ],
  },
  {
    id: "area",
    label: "مساحت",
    units: [
      { id: "cm2", label: "سانتی‌متر مربع", factor: 0.0001 },
      { id: "m2", label: "متر مربع", factor: 1 },
      { id: "ha", label: "هکتار", factor: 10000 },
      { id: "km2", label: "کیلومتر مربع", factor: 1000000 },
      { id: "ft2", label: "فوت مربع", factor: 0.092903 },
      { id: "acre", label: "ایکر", factor: 4046.86 },
    ],
  },
  {
    id: "volume",
    label: "حجم",
    units: [
      { id: "ml", label: "میلی‌لیتر", factor: 0.001 },
      { id: "l", label: "لیتر", factor: 1 },
      { id: "m3", label: "متر مکعب", factor: 1000 },
      { id: "gal", label: "گالن (US)", factor: 3.78541 },
      { id: "qt", label: "کوارت (US)", factor: 0.946353 },
    ],
  },
  {
    id: "speed",
    label: "سرعت",
    units: [
      { id: "ms", label: "متر بر ثانیه", factor: 1 },
      { id: "kmh", label: "کیلومتر بر ساعت", factor: 0.277778 },
      { id: "mph", label: "مایل بر ساعت", factor: 0.44704 },
      { id: "kn", label: "گره (Knot)", factor: 0.514444 },
    ],
  },
  {
    id: "data",
    label: "حجم داده",
    units: [
      { id: "B", label: "بایت", factor: 1 },
      { id: "KB", label: "کیلوبایت (۱۰۰۰)", factor: 1000 },
      { id: "KiB", label: "کیبی‌بایت (۱۰۲۴)", factor: 1024 },
      { id: "MB", label: "مگابایت", factor: 1e6 },
      { id: "MiB", label: "مبی‌بایت", factor: 1024 ** 2 },
      { id: "GB", label: "گیگابایت", factor: 1e9 },
      { id: "GiB", label: "گیبی‌بایت", factor: 1024 ** 3 },
    ],
  },
  {
    id: "time",
    label: "زمان",
    units: [
      { id: "ms", label: "میلی‌ثانیه", factor: 0.001 },
      { id: "s", label: "ثانیه", factor: 1 },
      { id: "min", label: "دقیقه", factor: 60 },
      { id: "h", label: "ساعت", factor: 3600 },
      { id: "d", label: "روز", factor: 86400 },
      { id: "wk", label: "هفته", factor: 604800 },
    ],
  },
];

const TEMP = [
  { id: "c", label: "سلسیوس" },
  { id: "f", label: "فارنهایت" },
  { id: "k", label: "کلوین" },
];

function toC(v: number, from: string) {
  return from === "c" ? v : from === "f" ? ((v - 32) * 5) / 9 : v - 273.15;
}
function fromC(v: number, to: string) {
  return to === "c" ? v : to === "f" ? (v * 9) / 5 + 32 : v + 273.15;
}

const fmt = (n: number) =>
  Number.isFinite(n)
    ? parseFloat(n.toPrecision(8)).toLocaleString("en-US", { maximumFractionDigits: 8 })
    : "—";

export default function UnitConverterTool() {
  const [catId, setCatId] = useState("length");
  const [value, setValue] = useState("1");

  const isTemp = catId === "temperature";
  const cat = CATS.find((c) => c.id === catId);
  const [unit, setUnit] = useState("m");

  const num = parseFloat(value);
  const rows = useMemo(() => {
    if (!Number.isFinite(num)) return [];
    if (isTemp) {
      const c = toC(num, unit);
      return TEMP.map((t) => ({ label: t.label, value: fmt(fromC(c, t.id)) }));
    }
    const u = cat?.units.find((x) => x.id === unit) ?? cat?.units[0];
    if (!cat || !u) return [];
    const base = num * u.factor;
    return cat.units.map((t) => ({ label: t.label, value: fmt(base / t.factor) }));
  }, [num, unit, cat, isTemp]);

  const onCat = (id: string) => {
    setCatId(id);
    if (id === "temperature") setUnit("c");
    else setUnit(CATS.find((c) => c.id === id)!.units[0].id);
  };

  const unitOptions = isTemp ? TEMP : (cat?.units ?? []);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="دسته">
          <Select value={catId} onChange={(e) => onCat(e.target.value)}>
            {CATS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
            <option value="temperature">دما</option>
          </Select>
        </Field>
        <Field label="مقدار">
          <TextInput
            mono
            dir="ltr"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </Field>
        <Field label="واحد مبدأ">
          <Select value={unit} onChange={(e) => setUnit(e.target.value)}>
            {unitOptions.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="space-y-2">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-center gap-3 rounded-xl border border-border bg-bg-soft px-3 py-2.5"
          >
            <span className="w-40 shrink-0 text-sm text-muted">{r.label}</span>
            <code dir="ltr" className="min-w-0 flex-1 truncate font-mono text-sm text-fg">
              {r.value}
            </code>
            <CopyButton value={r.value} />
          </div>
        ))}
      </div>
    </div>
  );
}

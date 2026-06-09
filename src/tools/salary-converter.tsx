"use client";

import { useMemo, useState } from "react";
import { Field, Stat, TextInput } from "@/components/tool/kit";
import { toAsciiDigits } from "@/lib/utils";

type Basis = "hourly" | "monthly" | "annual";

const num = (s: string) => Number(toAsciiDigits(s).trim());
const money = (n: number) =>
  Number.isFinite(n) ? Math.round(n).toLocaleString("fa-IR") : "—";

export default function SalaryConverterTool() {
  const [amount, setAmount] = useState("");
  const [basis, setBasis] = useState<Basis>("monthly");
  const [hoursWeek, setHoursWeek] = useState("40");
  const [weeksYear, setWeeksYear] = useState("52");

  const result = useMemo(() => {
    const v = num(amount);
    const hw = num(hoursWeek);
    const wy = num(weeksYear);
    if (!Number.isFinite(v) || !(hw > 0) || !(wy > 0)) return null;
    const hoursYear = hw * wy;
    let annual: number;
    if (basis === "hourly") annual = v * hoursYear;
    else if (basis === "monthly") annual = v * 12;
    else annual = v;
    return {
      hourly: annual / hoursYear,
      monthly: annual / 12,
      annual,
    };
  }, [amount, basis, hoursWeek, weeksYear]);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="مبلغ">
          <TextInput
            mono
            dir="ltr"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="50000000"
          />
        </Field>
        <Field label="مبنای مبلغ">
          <div className="flex gap-1.5">
            {(
              [
                ["hourly", "ساعتی"],
                ["monthly", "ماهانه"],
                ["annual", "سالانه"],
              ] as [Basis, string][]
            ).map(([v, label]) => (
              <button
                key={v}
                type="button"
                onClick={() => setBasis(v)}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm transition-colors ${
                  basis === v
                    ? "border-turquoise-dim bg-turquoise/20 font-semibold text-fg"
                    : "border-border bg-surface-2 text-muted hover:text-fg"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="ساعت کار در هفته">
          <TextInput mono dir="ltr" type="number" value={hoursWeek} onChange={(e) => setHoursWeek(e.target.value)} />
        </Field>
        <Field label="هفته‌ی کاری در سال">
          <TextInput mono dir="ltr" type="number" value={weeksYear} onChange={(e) => setWeeksYear(e.target.value)} />
        </Field>
      </div>

      {result && (
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="دستمزد ساعتی" value={money(result.hourly)} />
          <Stat label="حقوق ماهانه" value={money(result.monthly)} />
          <Stat label="حقوق سالانه" value={money(result.annual)} />
        </div>
      )}
    </div>
  );
}

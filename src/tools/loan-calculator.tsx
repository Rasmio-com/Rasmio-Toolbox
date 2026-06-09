"use client";

import { useMemo, useState } from "react";
import { Field, Stat, TextInput } from "@/components/tool/kit";
import { toAsciiDigits } from "@/lib/utils";

const num = (s: string) => Number(toAsciiDigits(s).trim());
const money = (n: number) =>
  Number.isFinite(n) ? Math.round(n).toLocaleString("fa-IR") : "—";

export default function LoanCalculatorTool() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [months, setMonths] = useState("");

  const result = useMemo(() => {
    const p = num(principal);
    const annual = num(rate);
    const n = num(months);
    if (!(p > 0) || !(n > 0) || !Number.isFinite(annual)) return null;
    const i = annual / 100 / 12;
    const payment = i === 0 ? p / n : (p * i) / (1 - Math.pow(1 + i, -n));
    const total = payment * n;
    const interest = total - p;

    const rows: { k: number; pay: string; princ: string; int: string; bal: string }[] = [];
    let bal = p;
    const count = Math.min(n, 6);
    for (let k = 1; k <= count; k++) {
      const intPart = bal * i;
      const princPart = payment - intPart;
      bal -= princPart;
      rows.push({
        k,
        pay: money(payment),
        princ: money(princPart),
        int: money(intPart),
        bal: money(Math.max(0, bal)),
      });
    }
    return { payment, total, interest, rows };
  }, [principal, rate, months]);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="مبلغ وام (اصل)">
          <TextInput mono dir="ltr" type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} placeholder="100000000" />
        </Field>
        <Field label="نرخ سود سالانه (٪)">
          <TextInput mono dir="ltr" type="number" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="18" />
        </Field>
        <Field label="مدت (ماه)">
          <TextInput mono dir="ltr" type="number" value={months} onChange={(e) => setMonths(e.target.value)} placeholder="36" />
        </Field>
      </div>

      {result && (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat label="قسط ماهانه" value={money(result.payment)} />
            <Stat label="مجموع پرداختی" value={money(result.total)} />
            <Stat label="مجموع سود" value={money(result.interest)} />
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-bg-soft text-xs text-muted">
                <tr>
                  <th className="px-3 py-2 text-start font-medium">قسط</th>
                  <th className="px-3 py-2 text-start font-medium">مبلغ قسط</th>
                  <th className="px-3 py-2 text-start font-medium">اصل</th>
                  <th className="px-3 py-2 text-start font-medium">سود</th>
                  <th className="px-3 py-2 text-start font-medium">مانده</th>
                </tr>
              </thead>
              <tbody>
                {result.rows.map((r) => (
                  <tr key={r.k} className="border-t border-border">
                    <td className="px-3 py-2 text-muted">{r.k.toLocaleString("fa-IR")}</td>
                    <td className="px-3 py-2 font-mono tabular-nums">{r.pay}</td>
                    <td className="px-3 py-2 font-mono tabular-nums">{r.princ}</td>
                    <td className="px-3 py-2 font-mono tabular-nums">{r.int}</td>
                    <td className="px-3 py-2 font-mono tabular-nums">{r.bal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-faint">
            محاسبه بر پایه‌ی فرمول استهلاک با اقساط مساوی است و چند قسط نخست نمایش داده می‌شود.
          </p>
        </>
      )}
    </div>
  );
}

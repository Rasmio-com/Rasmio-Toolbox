"use client";

import { useMemo, useState } from "react";
import { Field, Segmented, Stat, TextInput } from "@/components/tool/kit";
import { toAsciiDigits } from "@/lib/utils";

type Tab = "compound" | "cagr" | "roi";

const num = (s: string) => Number(toAsciiDigits(s).trim());
const money = (n: number) =>
  Number.isFinite(n) ? Math.round(n).toLocaleString("fa-IR") : "—";
const pct = (n: number) =>
  Number.isFinite(n) ? `${n.toLocaleString("fa-IR", { maximumFractionDigits: 2 })}٪` : "—";

export default function InterestCalculatorTool() {
  const [tab, setTab] = useState<Tab>("compound");

  // compound
  const [p, setP] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [comp, setComp] = useState("12");

  // cagr
  const [begin, setBegin] = useState("");
  const [end, setEnd] = useState("");
  const [cYears, setCYears] = useState("");

  // roi
  const [gain, setGain] = useState("");
  const [cost, setCost] = useState("");

  const compound = useMemo(() => {
    const P = num(p);
    const r = num(rate) / 100;
    const t = num(years);
    const n = num(comp);
    if (!(P > 0) || !(t > 0) || !(n > 0) || !Number.isFinite(r)) return null;
    const amount = P * Math.pow(1 + r / n, n * t);
    return { amount, interest: amount - P };
  }, [p, rate, years, comp]);

  const cagr = useMemo(() => {
    const b = num(begin);
    const e = num(end);
    const t = num(cYears);
    if (!(b > 0) || !(e > 0) || !(t > 0)) return null;
    return (Math.pow(e / b, 1 / t) - 1) * 100;
  }, [begin, end, cYears]);

  const roi = useMemo(() => {
    const g = num(gain);
    const c = num(cost);
    if (!Number.isFinite(g) || !(c > 0)) return null;
    return (g / c) * 100;
  }, [gain, cost]);

  return (
    <div className="space-y-5">
      <Segmented
        value={tab}
        onChange={setTab}
        options={[
          { value: "compound", label: "سود مرکب" },
          { value: "cagr", label: "CAGR" },
          { value: "roi", label: "ROI" },
        ]}
      />

      {tab === "compound" && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="اصل سرمایه">
              <TextInput mono dir="ltr" type="number" value={p} onChange={(e) => setP(e.target.value)} placeholder="10000000" />
            </Field>
            <Field label="نرخ سالانه (٪)">
              <TextInput mono dir="ltr" type="number" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="20" />
            </Field>
            <Field label="مدت (سال)">
              <TextInput mono dir="ltr" type="number" value={years} onChange={(e) => setYears(e.target.value)} placeholder="5" />
            </Field>
            <Field label="دفعات در سال">
              <TextInput mono dir="ltr" type="number" value={comp} onChange={(e) => setComp(e.target.value)} placeholder="12" />
            </Field>
          </div>
          {compound && (
            <div className="grid gap-3 sm:grid-cols-2">
              <Stat label="ارزش نهایی" value={money(compound.amount)} />
              <Stat label="سود کسب‌شده" value={money(compound.interest)} />
            </div>
          )}
        </>
      )}

      {tab === "cagr" && (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="ارزش اولیه">
              <TextInput mono dir="ltr" type="number" value={begin} onChange={(e) => setBegin(e.target.value)} />
            </Field>
            <Field label="ارزش نهایی">
              <TextInput mono dir="ltr" type="number" value={end} onChange={(e) => setEnd(e.target.value)} />
            </Field>
            <Field label="تعداد سال">
              <TextInput mono dir="ltr" type="number" value={cYears} onChange={(e) => setCYears(e.target.value)} />
            </Field>
          </div>
          {cagr !== null && (
            <Stat label="نرخ رشد مرکب سالانه (CAGR)" value={pct(cagr)} />
          )}
        </>
      )}

      {tab === "roi" && (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="سود خالص (Gain)">
              <TextInput mono dir="ltr" type="number" value={gain} onChange={(e) => setGain(e.target.value)} />
            </Field>
            <Field label="هزینه‌ی سرمایه‌گذاری (Cost)">
              <TextInput mono dir="ltr" type="number" value={cost} onChange={(e) => setCost(e.target.value)} />
            </Field>
          </div>
          {roi !== null && <Stat label="بازده سرمایه‌گذاری (ROI)" value={pct(roi)} />}
        </>
      )}
    </div>
  );
}

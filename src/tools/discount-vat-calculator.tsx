"use client";

import { useMemo, useState } from "react";
import { Field, Grid2, Segmented, Stat, TextInput } from "@/components/tool/kit";
import { toAsciiDigits } from "@/lib/utils";

type Tab = "discount" | "margin" | "vat";

const num = (s: string) => Number(toAsciiDigits(s).trim());
const money = (n: number) =>
  Number.isFinite(n) ? Math.round(n * 100) / 100 : NaN;
const fa = (n: number) =>
  Number.isFinite(n) ? n.toLocaleString("fa-IR", { maximumFractionDigits: 2 }) : "—";
const pct = (n: number) =>
  Number.isFinite(n) ? `${fa(n)}٪` : "—";

export default function DiscountVatCalculatorTool() {
  const [tab, setTab] = useState<Tab>("discount");

  const [price, setPrice] = useState("");
  const [rate, setRate] = useState("");
  const [cost, setCost] = useState("");
  const [vatMode, setVatMode] = useState<"add" | "remove">("add");

  const discount = useMemo(() => {
    const p = num(price);
    const r = num(rate);
    if (!Number.isFinite(p) || !Number.isFinite(r)) return null;
    const off = (p * r) / 100;
    return { final: money(p - off), saved: money(off) };
  }, [price, rate]);

  const margin = useMemo(() => {
    const p = num(price); // selling price
    const c = num(cost);
    if (!(p > 0) || !Number.isFinite(c)) return null;
    const profit = p - c;
    return {
      profit: money(profit),
      margin: (profit / p) * 100,
      markup: c > 0 ? (profit / c) * 100 : NaN,
    };
  }, [price, cost]);

  const vat = useMemo(() => {
    const p = num(price);
    const r = num(rate);
    if (!Number.isFinite(p) || !Number.isFinite(r)) return null;
    if (vatMode === "add") {
      const tax = (p * r) / 100;
      return { net: money(p), tax: money(tax), gross: money(p + tax) };
    }
    const net = p / (1 + r / 100);
    return { net: money(net), tax: money(p - net), gross: money(p) };
  }, [price, rate, vatMode]);

  return (
    <div className="space-y-5">
      <Segmented
        value={tab}
        onChange={setTab}
        options={[
          { value: "discount", label: "تخفیف" },
          { value: "margin", label: "حاشیه/افزایش" },
          { value: "vat", label: "مالیات (VAT)" },
        ]}
      />

      {tab === "discount" && (
        <>
          <Grid2>
            <Field label="قیمت اولیه">
              <TextInput mono dir="ltr" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            </Field>
            <Field label="درصد تخفیف (٪)">
              <TextInput mono dir="ltr" type="number" value={rate} onChange={(e) => setRate(e.target.value)} />
            </Field>
          </Grid2>
          {discount && (
            <div className="grid gap-3 sm:grid-cols-2">
              <Stat label="قیمت نهایی" value={fa(discount.final)} />
              <Stat label="مبلغ تخفیف" value={fa(discount.saved)} />
            </div>
          )}
        </>
      )}

      {tab === "margin" && (
        <>
          <Grid2>
            <Field label="قیمت فروش">
              <TextInput mono dir="ltr" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            </Field>
            <Field label="بهای تمام‌شده">
              <TextInput mono dir="ltr" type="number" value={cost} onChange={(e) => setCost(e.target.value)} />
            </Field>
          </Grid2>
          {margin && (
            <div className="grid gap-3 sm:grid-cols-3">
              <Stat label="سود" value={fa(margin.profit)} />
              <Stat label="حاشیه سود (Margin)" value={pct(margin.margin)} />
              <Stat label="افزایش قیمت (Markup)" value={pct(margin.markup)} />
            </div>
          )}
        </>
      )}

      {tab === "vat" && (
        <>
          <Segmented
            value={vatMode}
            onChange={setVatMode}
            options={[
              { value: "add", label: "افزودن مالیات" },
              { value: "remove", label: "کسر مالیات" },
            ]}
          />
          <Grid2>
            <Field label={vatMode === "add" ? "مبلغ بدون مالیات" : "مبلغ با مالیات"}>
              <TextInput mono dir="ltr" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            </Field>
            <Field label="نرخ مالیات (٪)">
              <TextInput mono dir="ltr" type="number" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="9" />
            </Field>
          </Grid2>
          {vat && (
            <div className="grid gap-3 sm:grid-cols-3">
              <Stat label="مبلغ خالص" value={fa(vat.net)} />
              <Stat label="مالیات" value={fa(vat.tax)} />
              <Stat label="مبلغ کل" value={fa(vat.gross)} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

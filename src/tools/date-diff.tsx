"use client";

import { useMemo, useState } from "react";
import { Field, Grid2, Select, Stat, TextInput } from "@/components/tool/kit";
import { toAsciiDigits } from "@/lib/utils";

const fa = (n: number) =>
  Number.isFinite(n) ? n.toLocaleString("fa-IR", { maximumFractionDigits: 2 }) : "—";

export default function DateDiffTool() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");

  const [base, setBase] = useState("");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState<"days" | "months">("days");
  const [op, setOp] = useState<"add" | "sub">("add");

  const diff = useMemo(() => {
    if (!a || !b) return null;
    const da = new Date(a);
    const db = new Date(b);
    if (isNaN(da.getTime()) || isNaN(db.getTime())) return null;
    const ms = Math.abs(db.getTime() - da.getTime());
    const days = ms / 86400000;
    let months =
      (db.getFullYear() - da.getFullYear()) * 12 + (db.getMonth() - da.getMonth());
    if (db.getDate() < da.getDate()) months -= 1;
    months = Math.abs(months);
    return {
      days,
      weeks: days / 7,
      months,
      years: months / 12,
      hours: ms / 3600000,
    };
  }, [a, b]);

  const shifted = useMemo(() => {
    if (!base) return "";
    const n = Number(toAsciiDigits(amount));
    if (!Number.isFinite(n)) return "";
    const d = new Date(base);
    if (isNaN(d.getTime())) return "";
    const k = op === "sub" ? -n : n;
    if (unit === "days") d.setDate(d.getDate() + k);
    else d.setMonth(d.getMonth() + k);
    return new Intl.DateTimeFormat("fa-IR", {
      dateStyle: "full",
      timeStyle: d.getHours() || d.getMinutes() ? "short" : undefined,
    }).format(d);
  }, [base, amount, unit, op]);

  return (
    <div className="space-y-5">
      <Grid2>
        <Field label="تاریخ اول">
          <input
            type="datetime-local"
            value={a}
            onChange={(e) => setA(e.target.value)}
            className="field"
          />
        </Field>
        <Field label="تاریخ دوم">
          <input
            type="datetime-local"
            value={b}
            onChange={(e) => setB(e.target.value)}
            className="field"
          />
        </Field>
      </Grid2>

      {diff && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <Stat label="روز" value={fa(diff.days)} />
          <Stat label="هفته" value={fa(diff.weeks)} />
          <Stat label="ماه" value={fa(diff.months)} />
          <Stat label="سال" value={fa(diff.years)} />
          <Stat label="ساعت" value={fa(diff.hours)} />
        </div>
      )}

      <div className="rounded-2xl border border-border bg-surface/70 p-4 sm:p-5">
        <h3 className="mb-3 text-sm font-semibold text-fg">جمع و تفریق تاریخ</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="تاریخ مبنا">
            <input
              type="datetime-local"
              value={base}
              onChange={(e) => setBase(e.target.value)}
              className="field"
            />
          </Field>
          <Field label="عمل">
            <Select value={op} onChange={(e) => setOp(e.target.value as "add" | "sub")}>
              <option value="add">افزودن</option>
              <option value="sub">کم کردن</option>
            </Select>
          </Field>
          <Field label="مقدار">
            <TextInput
              mono
              dir="ltr"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="7"
            />
          </Field>
          <Field label="واحد">
            <Select value={unit} onChange={(e) => setUnit(e.target.value as "days" | "months")}>
              <option value="days">روز</option>
              <option value="months">ماه</option>
            </Select>
          </Field>
        </div>
        {shifted && (
          <p className="mt-4 rounded-xl border border-border bg-bg-soft px-3 py-2.5 text-sm text-fg">
            نتیجه: <span className="font-semibold text-turquoise">{shifted}</span>
          </p>
        )}
      </div>
    </div>
  );
}

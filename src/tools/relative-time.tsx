"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, CopyButton, ErrorNote, Field } from "@/components/tool/kit";

function relative(date: Date, now: number): string {
  const rtf = new Intl.RelativeTimeFormat("fa", { numeric: "auto" });
  const diff = (date.getTime() - now) / 1000;
  const units: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "second"],
    [3600, "minute"],
    [86400, "hour"],
    [604800, "day"],
    [2629800, "week"],
    [31557600, "month"],
    [Infinity, "year"],
  ];
  let prev = 1;
  for (const [limit, unit] of units) {
    if (Math.abs(diff) < limit) return rtf.format(Math.round(diff / prev), unit);
    prev = limit;
  }
  return rtf.format(Math.round(diff / 31557600), "year");
}

export default function RelativeTimeTool() {
  const [value, setValue] = useState("");
  const [now, setNow] = useState(0);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const result = useMemo(() => {
    if (!value || !now) return null;
    const d = new Date(value);
    if (isNaN(d.getTime())) return { err: "تاریخ نامعتبر است." };
    return {
      err: "",
      rel: relative(d, now),
      abs: new Intl.DateTimeFormat("fa-IR", { dateStyle: "full", timeStyle: "short" }).format(d),
    };
  }, [value, now]);

  const setOffset = (ms: number) => {
    const d = new Date(Date.now() + ms);
    const pad = (n: number) => String(n).padStart(2, "0");
    setValue(
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`,
    );
  };

  return (
    <div className="space-y-4">
      <Field label="تاریخ و زمان">
        <input
          type="datetime-local"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="field"
        />
      </Field>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => setOffset(-3 * 86400000)}>
          ۳ روز پیش
        </Button>
        <Button variant="secondary" onClick={() => setOffset(-3600000)}>
          یک ساعت پیش
        </Button>
        <Button variant="secondary" onClick={() => setOffset(86400000)}>
          فردا
        </Button>
        <Button variant="secondary" onClick={() => setOffset(7 * 86400000)}>
          هفته‌ی بعد
        </Button>
      </div>
      {result?.err && <ErrorNote>{result.err}</ErrorNote>}
      {result && !result.err && (
        <div className="space-y-3">
          <div className="rounded-2xl border border-border bg-bg-soft px-5 py-6 text-center">
            <div className="text-3xl font-bold text-turquoise">{result.rel}</div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-bg-soft px-3 py-2.5">
            <span className="w-24 shrink-0 text-xs text-saffron">تاریخ کامل</span>
            <span className="min-w-0 flex-1 truncate text-sm text-fg">{result.abs}</span>
            <CopyButton value={result.rel ?? ""} />
          </div>
        </div>
      )}
    </div>
  );
}

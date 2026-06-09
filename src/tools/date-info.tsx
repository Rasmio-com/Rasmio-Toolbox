"use client";

import { useMemo, useState } from "react";
import { Stat } from "@/components/tool/kit";

function isoWeek(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function dayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d.getTime() - start.getTime()) / 86400000);
}

export default function DateInfoTool() {
  const [value, setValue] = useState("");

  const info = useMemo(() => {
    if (!value) return null;
    const d = new Date(value);
    if (isNaN(d.getTime())) return null;
    const y = d.getFullYear();
    const leap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
    const weekday = new Intl.DateTimeFormat("fa-IR", { weekday: "long" }).format(d);
    const monthName = new Intl.DateTimeFormat("fa-IR", { month: "long" }).format(d);
    return {
      week: isoWeek(d),
      doy: dayOfYear(d),
      quarter: Math.floor(d.getMonth() / 3) + 1,
      weekday,
      monthName,
      leap,
    };
  }, [value]);

  return (
    <div className="space-y-4">
      <div className="max-w-xs">
        <label className="mb-1.5 block text-xs font-medium text-muted">تاریخ</label>
        <input
          type="date"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="field"
        />
      </div>
      {info && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <Stat label="نام روز هفته" value={info.weekday} />
            <Stat label="نام ماه" value={info.monthName} />
            <Stat label="هفته‌ی سال (ISO)" value={info.week.toLocaleString("fa-IR")} />
            <Stat label="روز سال" value={info.doy.toLocaleString("fa-IR")} />
            <Stat label="فصل (سه‌ماهه)" value={`Q${info.quarter}`} />
            <Stat label="سال کبیسه" value={info.leap ? "بله" : "خیر"} />
          </div>
          <p className="text-xs text-faint">
            شماره‌ی هفته بر اساس استاندارد ISO 8601 (هفته از دوشنبه آغاز می‌شود) و سال کبیسه بر
            پایه‌ی تقویم میلادی محاسبه شده است.
          </p>
        </>
      )}
    </div>
  );
}

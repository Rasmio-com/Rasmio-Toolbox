"use client";

import { useMemo, useState } from "react";
import { CopyButton, ErrorNote, Field, Grid2, Select } from "@/components/tool/kit";

const ZONES = [
  "UTC",
  "Asia/Tehran",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Karachi",
  "Asia/Baghdad",
  "Asia/Istanbul",
  "Asia/Shanghai",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Asia/Hong_Kong",
  "Asia/Seoul",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Moscow",
  "Europe/Madrid",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Sao_Paulo",
  "America/Toronto",
  "Australia/Sydney",
  "Pacific/Auckland",
];

// Offset (minutes) of a UTC instant in a given IANA zone.
function tzOffsetMinutes(date: Date, tz: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const p = Object.fromEntries(dtf.formatToParts(date).map((x) => [x.type, x.value]));
  const asUTC = Date.UTC(
    Number(p.year),
    Number(p.month) - 1,
    Number(p.day),
    Number(p.hour === "24" ? "0" : p.hour),
    Number(p.minute),
    Number(p.second),
  );
  return (asUTC - date.getTime()) / 60000;
}

export default function TimezoneConverterTool() {
  const [local, setLocal] = useState("");
  const [from, setFrom] = useState("Asia/Tehran");
  const [to, setTo] = useState("UTC");

  const result = useMemo(() => {
    if (!local) return null;
    // Interpret the wall-clock value as being in the `from` zone.
    const naive = new Date(local);
    if (isNaN(naive.getTime())) return { err: "تاریخ نامعتبر است." };
    // naive is parsed as local browser time; correct to the source zone.
    const guess = new Date(naive.getTime());
    const off = tzOffsetMinutes(guess, from);
    const utcMs = naive.getTime() - naive.getTimezoneOffset() * 60000 - off * 60000;
    const instant = new Date(utcMs);
    const fmt = (tz: string) =>
      new Intl.DateTimeFormat("fa-IR", {
        timeZone: tz,
        dateStyle: "full",
        timeStyle: "medium",
      }).format(instant);
    const offStr = (tz: string) => {
      const m = tzOffsetMinutes(instant, tz);
      const sign = m >= 0 ? "+" : "-";
      const a = Math.abs(m);
      return `UTC${sign}${String(Math.floor(a / 60)).padStart(2, "0")}:${String(a % 60).padStart(2, "0")}`;
    };
    return {
      err: "",
      src: fmt(from),
      dst: fmt(to),
      dstIso: instant.toISOString(),
      srcOff: offStr(from),
      dstOff: offStr(to),
    };
  }, [local, from, to]);

  return (
    <div className="space-y-4">
      <Field label="تاریخ و زمان مبدأ">
        <input
          type="datetime-local"
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          className="field"
        />
      </Field>
      <Grid2>
        <Field label="منطقه زمانی مبدأ">
          <Select value={from} onChange={(e) => setFrom(e.target.value)}>
            {ZONES.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="منطقه زمانی مقصد">
          <Select value={to} onChange={(e) => setTo(e.target.value)}>
            {ZONES.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </Select>
        </Field>
      </Grid2>
      {result?.err && <ErrorNote>{result.err}</ErrorNote>}
      {result && !result.err && (
        <div className="space-y-2">
          {[
            { label: `مبدأ (${result.srcOff})`, value: result.src ?? "" },
            { label: `مقصد (${result.dstOff})`, value: result.dst ?? "" },
            { label: "ISO 8601 (UTC)", value: result.dstIso ?? "" },
          ].map((r) => (
            <div
              key={r.label}
              className="flex items-center gap-3 rounded-xl border border-border bg-bg-soft px-3 py-2.5"
            >
              <span className="w-40 shrink-0 text-xs text-saffron">{r.label}</span>
              <code dir="ltr" className="min-w-0 flex-1 truncate font-mono text-sm text-fg">
                {r.value}
              </code>
              <CopyButton value={r.value} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

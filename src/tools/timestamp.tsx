"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, CopyButton, ErrorNote, Field, Panel, TextInput } from "@/components/tool/kit";

function relative(date: Date): string {
  const rtf = new Intl.RelativeTimeFormat("fa", { numeric: "auto" });
  const diff = (date.getTime() - Date.now()) / 1000;
  const units: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "second"],
    [3600, "minute"],
    [86400, "hour"],
    [2592000, "day"],
    [31536000, "month"],
    [Infinity, "year"],
  ];
  let prev = 1;
  for (const [limit, unit] of units) {
    if (Math.abs(diff) < limit) return rtf.format(Math.round(diff / prev), unit);
    prev = limit;
  }
  return rtf.format(Math.round(diff / 31536000), "year");
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-bg-soft px-3 py-2.5">
      <span className="w-28 shrink-0 text-xs text-saffron">{label}</span>
      <code dir="ltr" className="min-w-0 flex-1 truncate font-mono text-sm text-fg">
        {value}
      </code>
      <CopyButton value={value} />
    </div>
  );
}

export default function TimestampTool() {
  const [ts, setTs] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [now, setNow] = useState(0);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const parsed = useMemo(() => {
    const raw = ts.trim();
    if (!raw) return null;
    const n = Number(raw);
    if (!Number.isFinite(n)) return { error: "عدد نامعتبر است." };
    const ms = Math.abs(n) >= 1e12 ? n : n * 1000;
    const date = new Date(ms);
    if (isNaN(date.getTime())) return { error: "تاریخ نامعتبر است." };
    return {
      rows: [
        { label: "محلی", value: date.toLocaleString("fa-IR") },
        { label: "UTC", value: date.toUTCString() },
        { label: "ISO 8601", value: date.toISOString() },
        { label: "نسبی", value: relative(date) },
        { label: "ثانیه", value: String(Math.floor(ms / 1000)) },
        { label: "میلی‌ثانیه", value: String(ms) },
      ],
    };
  }, [ts]);

  const fromDate = useMemo(() => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return { s: Math.floor(d.getTime() / 1000), ms: d.getTime() };
  }, [dateStr]);

  return (
    <div className="space-y-5">
      <Panel
        title="زمان فعلی"
        actions={now ? <CopyButton value={String(Math.floor(now / 1000))} /> : null}
      >
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
          <span className="font-mono text-2xl font-bold text-turquoise tabular-nums">
            {now ? Math.floor(now / 1000) : "—"}
          </span>
          <span className="text-sm text-muted">
            {now ? new Date(now).toLocaleString("fa-IR") : ""}
          </span>
        </div>
      </Panel>

      <Field label="Timestamp ← تاریخ" hint="ثانیه یا میلی‌ثانیه">
        <div className="flex gap-2">
          <TextInput
            mono
            dir="ltr"
            value={ts}
            onChange={(e) => setTs(e.target.value)}
            placeholder="1700000000"
          />
          <Button onClick={() => setTs(String(Math.floor(Date.now() / 1000)))}>
            اکنون
          </Button>
        </div>
      </Field>

      {parsed?.error && <ErrorNote>{parsed.error}</ErrorNote>}
      {parsed?.rows && (
        <div className="space-y-2">
          {parsed.rows.map((r) => (
            <Row key={r.label} {...r} />
          ))}
        </div>
      )}

      <Field label="تاریخ ← Timestamp">
        <input
          type="datetime-local"
          value={dateStr}
          onChange={(e) => setDateStr(e.target.value)}
          className="field"
        />
      </Field>
      {fromDate && (
        <div className="space-y-2">
          <Row label="ثانیه" value={String(fromDate.s)} />
          <Row label="میلی‌ثانیه" value={String(fromDate.ms)} />
        </div>
      )}
    </div>
  );
}

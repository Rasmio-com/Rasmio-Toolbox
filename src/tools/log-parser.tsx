"use client";

import { useMemo, useState } from "react";
import { ErrorNote, Field, TextArea } from "@/components/tool/kit";

interface Row {
  ip: string;
  time: string;
  method: string;
  path: string;
  status: string;
  size: string;
  referer: string;
  ua: string;
}

// Common & Combined Log Format. Combined appends "referer" "user-agent".
const LOG_RE =
  /^(\S+)\s+\S+\s+\S+\s+\[([^\]]+)\]\s+"(\S+)\s+(.*?)\s+(\S+)"\s+(\d{3})\s+(\d+|-)(?:\s+"([^"]*)"\s+"([^"]*)")?/;

function statusColor(status: string): string {
  const c = Number(status);
  if (c >= 500) return "#f87171";
  if (c >= 400) return "#fb923c";
  if (c >= 300) return "#fbbf24";
  if (c >= 200) return "#34d399";
  return "#38bdf8";
}

export default function LogParserTool() {
  const [input, setInput] = useState("");

  const { rows, bad } = useMemo(() => {
    const lines = input.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const rows: Row[] = [];
    let bad = 0;
    for (const line of lines) {
      const m = LOG_RE.exec(line);
      if (!m) {
        bad++;
        continue;
      }
      rows.push({
        ip: m[1],
        time: m[2],
        method: m[3],
        path: m[4],
        status: m[6],
        size: m[7],
        referer: m[8] && m[8] !== "-" ? m[8] : "",
        ua: m[9] && m[9] !== "-" ? m[9] : "",
      });
    }
    return { rows, bad };
  }, [input]);

  return (
    <div className="space-y-4">
      <Field label="خطوط لاگ (Apache / Nginx — قالب Common یا Combined)">
        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            '127.0.0.1 - - [10/Oct/2023:13:55:36 +0330] "GET /index.html HTTP/1.1" 200 2326 "https://ref.example" "Mozilla/5.0"'
          }
          className="min-h-36"
        />
      </Field>

      {input.trim() && rows.length === 0 && (
        <ErrorNote>هیچ خط معتبری مطابق قالب Common/Combined یافت نشد.</ErrorNote>
      )}

      {rows.length > 0 && (
        <>
          <p className="text-xs text-muted">
            {rows.length} خط تجزیه شد{bad > 0 ? ` — ${bad} خط نامعتبر نادیده گرفته شد` : ""}.
          </p>
          <div className="overflow-x-auto rounded-xl border border-border" dir="ltr">
            <table className="w-full text-left text-xs">
              <thead className="bg-bg-soft text-muted">
                <tr>
                  {["IP", "Time", "Method", "Path", "Status", "Size", "Referer", "User-Agent"].map((h) => (
                    <th key={h} className="whitespace-nowrap px-3 py-2 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-mono">
                {rows.map((r, i) => (
                  <tr key={i} className="border-t border-border align-top">
                    <td className="whitespace-nowrap px-3 py-1.5 text-fg">{r.ip}</td>
                    <td className="whitespace-nowrap px-3 py-1.5 text-muted">{r.time}</td>
                    <td className="px-3 py-1.5 text-saffron">{r.method}</td>
                    <td className="max-w-[18rem] truncate px-3 py-1.5 text-fg" title={r.path}>{r.path}</td>
                    <td className="px-3 py-1.5 font-bold" style={{ color: statusColor(r.status) }}>{r.status}</td>
                    <td className="whitespace-nowrap px-3 py-1.5 text-muted">{r.size}</td>
                    <td className="max-w-[14rem] truncate px-3 py-1.5 text-muted" title={r.referer}>{r.referer || "—"}</td>
                    <td className="max-w-[16rem] truncate px-3 py-1.5 text-muted" title={r.ua}>{r.ua || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

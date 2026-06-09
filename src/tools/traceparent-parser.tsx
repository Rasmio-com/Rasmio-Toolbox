"use client";

import { useMemo, useState } from "react";
import { CopyButton, ErrorNote, Field, Panel, TextInput } from "@/components/tool/kit";

interface Parsed {
  version: string;
  traceId: string;
  parentId: string;
  flags: string;
  flagBits: number;
  sampled: boolean;
}

function parse(raw: string): { data: Parsed | null; err: string } {
  const v = raw.trim();
  if (!v) return { data: null, err: "" };
  const parts = v.split("-");
  if (parts.length !== 4)
    return { data: null, err: "traceparent باید دقیقاً چهار بخش جداشده با خط تیره باشد." };
  const [version, traceId, parentId, flags] = parts;
  if (!/^[0-9a-f]{2}$/i.test(version)) return { data: null, err: "بخش version باید ۲ رقم هگز باشد." };
  if (version.toLowerCase() === "ff") return { data: null, err: "version برابر ff نامعتبر است." };
  if (!/^[0-9a-f]{32}$/i.test(traceId)) return { data: null, err: "trace-id باید ۳۲ رقم هگز باشد." };
  if (/^0{32}$/.test(traceId)) return { data: null, err: "trace-id نمی‌تواند تماماً صفر باشد." };
  if (!/^[0-9a-f]{16}$/i.test(parentId)) return { data: null, err: "parent-id باید ۱۶ رقم هگز باشد." };
  if (/^0{16}$/.test(parentId)) return { data: null, err: "parent-id نمی‌تواند تماماً صفر باشد." };
  if (!/^[0-9a-f]{2}$/i.test(flags)) return { data: null, err: "بخش flags باید ۲ رقم هگز باشد." };
  const flagBits = parseInt(flags, 16);
  return {
    data: {
      version: version.toLowerCase(),
      traceId: traceId.toLowerCase(),
      parentId: parentId.toLowerCase(),
      flags: flags.toLowerCase(),
      flagBits,
      sampled: (flagBits & 0x01) === 0x01,
    },
    err: "",
  };
}

function Row({ label, value, desc }: { label: string; value: string; desc?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <span className="w-24 shrink-0 text-xs text-muted">{label}</span>
      <code dir="ltr" className="min-w-0 flex-1 break-all font-mono text-sm text-fg">{value}</code>
      <CopyButton value={value} />
      {desc && <p className="w-full text-xs text-muted">{desc}</p>}
    </div>
  );
}

export default function TraceparentParserTool() {
  const [input, setInput] = useState("");
  const { data, err } = useMemo(() => parse(input), [input]);

  return (
    <div className="space-y-4">
      <Field label="هدر traceparent" hint="version-traceid-parentid-flags">
        <TextInput
          dir="ltr"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01"
          mono
        />
      </Field>

      {err && <ErrorNote>{err}</ErrorNote>}

      {data && (
        <Panel title="اجزای traceparent">
          <div className="space-y-3">
            <Row label="version" value={data.version} desc="نسخه قالب traceparent (فعلاً 00)." />
            <Row label="trace-id" value={data.traceId} desc="شناسه سراسری کل ردیابی (۱۶ بایت)." />
            <Row label="parent-id" value={data.parentId} desc="شناسه span والد فراخوان‌کننده (۸ بایت)." />
            <Row
              label="trace-flags"
              value={`${data.flags} (0b${data.flagBits.toString(2).padStart(8, "0")})`}
              desc="پرچم‌های ۸ بیتی؛ بیت کم‌ارزش پرچم sampled است."
            />
            <div
              className={`rounded-lg border px-3 py-2 text-sm ${
                data.sampled
                  ? "border-success/30 bg-success/10 text-success"
                  : "border-border bg-surface-2 text-muted"
              }`}
            >
              {data.sampled
                ? "پرچم sampled روشن است (۰x۰۱): این ردیابی نمونه‌برداری و ثبت می‌شود."
                : "پرچم sampled خاموش است: ممکن است این ردیابی ثبت/ارسال نشود."}
            </div>
          </div>
        </Panel>
      )}
    </div>
  );
}

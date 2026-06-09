"use client";

import { useMemo, useState } from "react";
import { CopyButton, ErrorNote, Field, Select, Toggle } from "@/components/tool/kit";

type Sep = "colon" | "hyphen" | "dot" | "none";

/** Extract 12 hex digits from arbitrary MAC-ish input. */
function normalizeMac(input: string): string | null {
  const hex = input.replace(/[^0-9a-fA-F]/g, "");
  if (hex.length !== 12) return null;
  return hex.toLowerCase();
}

function format(hex: string, sep: Sep, upper: boolean): string {
  const h = upper ? hex.toUpperCase() : hex.toLowerCase();
  const pairs = h.match(/.{2}/g) ?? [];
  switch (sep) {
    case "colon":
      return pairs.join(":");
    case "hyphen":
      return pairs.join("-");
    case "none":
      return h;
    case "dot": {
      const quads = h.match(/.{4}/g) ?? [];
      return quads.join(".");
    }
  }
}

export default function MacFormatterTool() {
  const [input, setInput] = useState<string>("");
  const [sep, setSep] = useState<Sep>("colon");
  const [upper, setUpper] = useState<boolean>(false);

  const { out, hex, err } = useMemo(() => {
    if (!input.trim()) return { out: "", hex: "", err: "" };
    const norm = normalizeMac(input);
    if (!norm) return { out: "", hex: "", err: "آدرس MAC باید دقیقاً ۱۲ رقم هگزادسیمال داشته باشد." };
    return {
      out: format(norm, sep, upper),
      hex: (upper ? norm.toUpperCase() : norm),
      err: "",
    };
  }, [input, sep, upper]);

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-bg-soft px-3 py-2.5">
      <span className="w-32 shrink-0 text-xs text-saffron">{label}</span>
      <code dir="ltr" className="min-w-0 flex-1 truncate font-mono text-sm text-fg">
        {value}
      </code>
      <CopyButton value={value} />
    </div>
  );

  return (
    <div className="space-y-4">
      <Field label="آدرس MAC" hint="هر قالبی پذیرفته می‌شود">
        <input
          dir="ltr"
          spellCheck={false}
          autoComplete="off"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          placeholder="00:1A:2B:3C:4D:5E"
          className="field field-mono"
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <Field label="جداکننده">
          <Select value={sep} onChange={(e) => setSep(e.target.value as Sep)}>
            <option value="colon">دو‌نقطه ( : )</option>
            <option value="hyphen">خط تیره ( - )</option>
            <option value="dot">نقطه ( . ) — به‌سبک سیسکو</option>
            <option value="none">بدون جداکننده</option>
          </Select>
        </Field>
        <div className="pb-2">
          <Toggle checked={upper} onChange={setUpper} label="حروف بزرگ" />
        </div>
      </div>
      {err && <ErrorNote>{err}</ErrorNote>}
      {out && (
        <div className="space-y-2">
          <Row label="قالب‌بندی‌شده" value={out} />
          <Row label="هگز ۴۸ بیتی" value={hex} />
        </div>
      )}
    </div>
  );
}

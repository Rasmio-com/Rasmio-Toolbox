"use client";

import { useMemo, useState } from "react";
import { CopyButton, ErrorNote, Field, Segmented, TextInput } from "@/components/tool/kit";
import { toAsciiDigits } from "@/lib/utils";

type Mode = "ip" | "int" | "hex";

function parseIPv4(s: string): number | null {
  const parts = s.split(".");
  if (parts.length !== 4) return null;
  let v = 0;
  for (const p of parts) {
    if (!/^\d{1,3}$/.test(p)) return null;
    const n = Number(p);
    if (n > 255) return null;
    v = v * 256 + n;
  }
  return v >>> 0;
}

function toIPv4(n: number): string {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
}

export default function IpToIntTool() {
  const [mode, setMode] = useState<Mode>("ip");
  const [input, setInput] = useState<string>("");

  const { ip, int, hex, err } = useMemo(() => {
    const s = toAsciiDigits(input.trim());
    if (!s) return { ip: "", int: "", hex: "", err: "" };
    let n: number | null = null;
    if (mode === "ip") {
      n = parseIPv4(s);
      if (n === null) return { ip: "", int: "", hex: "", err: "آدرس IPv4 نامعتبر است." };
    } else if (mode === "int") {
      if (!/^\d+$/.test(s)) return { ip: "", int: "", hex: "", err: "عدد نامعتبر است." };
      const big = BigInt(s);
      if (big > 4294967295n) return { ip: "", int: "", hex: "", err: "عدد باید بین ۰ تا ۴۲۹۴۹۶۷۲۹۵ باشد." };
      n = Number(big);
    } else {
      const clean = s.replace(/^0x/i, "");
      if (!/^[0-9a-fA-F]+$/.test(clean)) return { ip: "", int: "", hex: "", err: "مقدار هگز نامعتبر است." };
      const big = BigInt("0x" + clean);
      if (big > 4294967295n) return { ip: "", int: "", hex: "", err: "مقدار باید حداکثر ۸ رقم هگز (۳۲ بیت) باشد." };
      n = Number(big);
    }
    return {
      ip: toIPv4(n),
      int: String(n >>> 0),
      hex: "0x" + (n >>> 0).toString(16).padStart(8, "0"),
      err: "",
    };
  }, [input, mode]);

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
      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: "ip", label: "از IPv4" },
          { value: "int", label: "از عدد" },
          { value: "hex", label: "از هگز" },
        ]}
      />
      <Field label="ورودی">
        <TextInput
          mono
          dir="ltr"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "ip" ? "192.168.1.1" : mode === "int" ? "3232235777" : "0xC0A80101"}
        />
      </Field>
      {err && <ErrorNote>{err}</ErrorNote>}
      {ip && (
        <div className="space-y-2">
          <Row label="IPv4" value={ip} />
          <Row label="عدد ۳۲ بیتی" value={int} />
          <Row label="هگز" value={hex} />
        </div>
      )}
    </div>
  );
}

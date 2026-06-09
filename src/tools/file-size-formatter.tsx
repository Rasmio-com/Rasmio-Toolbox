"use client";

import { useMemo, useState } from "react";
import { ErrorNote, Field, Segmented, Select, Stat, TextInput } from "@/components/tool/kit";
import { toAsciiDigits } from "@/lib/utils";

const DEC = ["B", "KB", "MB", "GB", "TB", "PB"];
const BIN = ["B", "KiB", "MiB", "GiB", "TiB", "PiB"];

function fmt(bytes: number, units: string[], base: number): string {
  if (bytes === 0) return `0 ${units[0]}`;
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(base)), units.length - 1);
  return `${parseFloat((bytes / Math.pow(base, i)).toFixed(3))} ${units[i]}`;
}

const UNIT_OPTS = [...DEC.slice(1), ...BIN.slice(1)];

export default function FileSizeFormatterTool() {
  const [mode, setMode] = useState<"b2h" | "h2b">("b2h");
  const [bytesIn, setBytesIn] = useState("");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("MB");

  const fromBytes = useMemo(() => {
    const n = Number(toAsciiDigits(bytesIn.trim().replace(/[\s,]/g, "")));
    if (!bytesIn.trim()) return { ok: true, dec: "", bin: "", err: "" };
    if (!Number.isFinite(n) || n < 0) return { ok: false, dec: "", bin: "", err: "عدد بایت نامعتبر است." };
    return { ok: true, dec: fmt(n, DEC, 1000), bin: fmt(n, BIN, 1024), err: "" };
  }, [bytesIn]);

  const toBytes = useMemo(() => {
    const n = Number(toAsciiDigits(amount.trim().replace(/[\s,]/g, "")));
    if (!amount.trim()) return { ok: true, bytes: "", err: "" };
    if (!Number.isFinite(n) || n < 0) return { ok: false, bytes: "", err: "مقدار نامعتبر است." };
    const di = DEC.indexOf(unit);
    const bi = BIN.indexOf(unit);
    const bytes = di >= 0 ? n * Math.pow(1000, di) : n * Math.pow(1024, bi);
    return { ok: true, bytes: Math.round(bytes).toLocaleString("en-US"), err: "" };
  }, [amount, unit]);

  return (
    <div className="space-y-4">
      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: "b2h", label: "بایت ← خوانا" },
          { value: "h2b", label: "خوانا ← بایت" },
        ]}
      />

      {mode === "b2h" ? (
        <>
          <Field label="تعداد بایت">
            <TextInput
              value={bytesIn}
              onChange={(e) => setBytesIn(e.target.value)}
              placeholder="1536000"
              dir="ltr"
              mono
            />
          </Field>
          {fromBytes.err ? (
            <ErrorNote>{fromBytes.err}</ErrorNote>
          ) : (
            fromBytes.dec && (
              <div className="grid grid-cols-2 gap-3">
                <Stat label="ده‌دهی (۱۰۰۰)" value={<span className="text-base">{fromBytes.dec}</span>} />
                <Stat label="دودویی (۱۰۲۴)" value={<span className="text-base">{fromBytes.bin}</span>} />
              </div>
            )
          )}
        </>
      ) : (
        <>
          <div className="flex items-end gap-3">
            <Field label="مقدار" className="flex-1">
              <TextInput
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1.5"
                dir="ltr"
                mono
              />
            </Field>
            <Field label="واحد" className="w-32">
              <Select value={unit} onChange={(e) => setUnit(e.target.value)}>
                {UNIT_OPTS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          {toBytes.err ? (
            <ErrorNote>{toBytes.err}</ErrorNote>
          ) : (
            toBytes.bytes && (
              <Stat label="بایت" value={<span className="text-base tabular-nums">{toBytes.bytes}</span>} />
            )
          )}
        </>
      )}
    </div>
  );
}

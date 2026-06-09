"use client";

import { useMemo, useState } from "react";
import {
  ErrorNote,
  Field,
  Grid2,
  Output,
  Segmented,
  TextArea,
  Toggle,
} from "@/components/tool/kit";

function textToHex(s: string, sep: boolean): string {
  const bytes = new TextEncoder().encode(s);
  const parts = Array.from(bytes, (b) => b.toString(16).padStart(2, "0"));
  return sep ? parts.join(" ") : parts.join("");
}

function hexToText(s: string): string {
  const clean = s.replace(/0x/gi, "").replace(/[^0-9a-f]/gi, "");
  if (clean.length % 2) throw new Error("odd length");
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < bytes.length; i++)
    bytes[i] = parseInt(clean.substr(i * 2, 2), 16);
  return new TextDecoder().decode(bytes);
}

export default function HexTextTool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [sep, setSep] = useState(true);

  const { out, err } = useMemo(() => {
    if (!input) return { out: "", err: "" };
    try {
      return {
        out: mode === "encode" ? textToHex(input, sep) : hexToText(input),
        err: "",
      };
    } catch {
      return { out: "", err: "Hex نامعتبر است (تعداد ارقام باید زوج باشد)." };
    }
  }, [input, mode, sep]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: "encode", label: "متن ← Hex" },
            { value: "decode", label: "Hex ← متن" },
          ]}
        />
        {mode === "encode" && (
          <Toggle checked={sep} onChange={setSep} label="جداکردن بایت‌ها با فاصله" />
        )}
      </div>
      <Grid2>
        <Field label="ورودی">
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "Hello" : "48 65 6c 6c 6f"}
          />
        </Field>
        <Output label="خروجی" value={out} />
      </Grid2>
      {err && <ErrorNote>{err}</ErrorNote>}
    </div>
  );
}

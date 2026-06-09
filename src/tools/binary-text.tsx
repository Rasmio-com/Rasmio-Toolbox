"use client";

import { useMemo, useState } from "react";
import { ErrorNote, Field, Grid2, Output, Segmented, TextArea } from "@/components/tool/kit";

function textToBinary(s: string): string {
  const bytes = new TextEncoder().encode(s);
  return Array.from(bytes, (b) => b.toString(2).padStart(8, "0")).join(" ");
}

function binaryToText(s: string): string {
  const groups = s.trim().split(/\s+/).filter(Boolean);
  const bytes = new Uint8Array(groups.length);
  for (let i = 0; i < groups.length; i++) {
    if (!/^[01]{1,8}$/.test(groups[i])) throw new Error("invalid");
    bytes[i] = parseInt(groups[i], 2);
  }
  return new TextDecoder().decode(bytes);
}

export default function BinaryTextTool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");

  const { out, err } = useMemo(() => {
    if (!input) return { out: "", err: "" };
    try {
      return {
        out: mode === "encode" ? textToBinary(input) : binaryToText(input),
        err: "",
      };
    } catch {
      return { out: "", err: "باینری نامعتبر است (فقط ۰ و ۱ در گروه‌های هشت‌بیتی)." };
    }
  }, [input, mode]);

  return (
    <div className="space-y-4">
      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: "encode", label: "متن ← باینری" },
          { value: "decode", label: "باینری ← متن" },
        ]}
      />
      <Grid2>
        <Field label="ورودی">
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "Hi" : "01001000 01101001"}
          />
        </Field>
        <Output label="خروجی" value={out} />
      </Grid2>
      {err && <ErrorNote>{err}</ErrorNote>}
    </div>
  );
}

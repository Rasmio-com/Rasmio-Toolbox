"use client";

import { useMemo, useState } from "react";
import { ErrorNote, Field, Grid2, Output, Segmented, TextArea } from "@/components/tool/kit";

function qpEncode(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let line = "";
  const lines: string[] = [];
  const push = (chunk: string) => {
    if (line.length + chunk.length > 75) {
      lines.push(line + "=");
      line = "";
    }
    line += chunk;
  };
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i];
    if (b === 13) continue;
    if (b === 10) {
      lines.push(line);
      line = "";
      continue;
    }
    if (b === 9 || b === 32) {
      const next = bytes[i + 1];
      if (next === 10 || next === undefined) {
        push("=" + b.toString(16).toUpperCase().padStart(2, "0"));
      } else {
        push(String.fromCharCode(b));
      }
    } else if (b >= 33 && b <= 126 && b !== 61) {
      push(String.fromCharCode(b));
    } else {
      push("=" + b.toString(16).toUpperCase().padStart(2, "0"));
    }
  }
  lines.push(line);
  return lines.join("\r\n");
}

function qpDecode(s: string): string {
  const joined = s.replace(/=\r?\n/g, "");
  const out: number[] = [];
  for (let i = 0; i < joined.length; i++) {
    const c = joined[i];
    if (c === "=") {
      const hex = joined.substr(i + 1, 2);
      if (!/^[0-9A-Fa-f]{2}$/.test(hex)) throw new Error("invalid");
      out.push(parseInt(hex, 16));
      i += 2;
    } else {
      out.push(c.charCodeAt(0));
    }
  }
  return new TextDecoder().decode(new Uint8Array(out));
}

export default function QuotedPrintableTool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");

  const { out, err } = useMemo(() => {
    if (!input) return { out: "", err: "" };
    try {
      return { out: mode === "encode" ? qpEncode(input) : qpDecode(input), err: "" };
    } catch {
      return { out: "", err: "ورودی Quoted-Printable نامعتبر است." };
    }
  }, [input, mode]);

  return (
    <div className="space-y-4">
      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: "encode", label: "کدگذاری" },
          { value: "decode", label: "رمزگشایی" },
        ]}
      />
      <Grid2>
        <Field label="ورودی">
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "Héllo" : "H=C3=A9llo"}
            dir="auto"
          />
        </Field>
        <Output label="خروجی" value={out} />
      </Grid2>
      {err && <ErrorNote>{err}</ErrorNote>}
    </div>
  );
}

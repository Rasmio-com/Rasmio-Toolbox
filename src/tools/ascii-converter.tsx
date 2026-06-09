"use client";

import { useMemo, useState } from "react";
import { ErrorNote, Field, Output, Segmented, TextArea } from "@/components/tool/kit";

function charLabel(code: number): string {
  if (code === 32) return "(فاصله)";
  if (code === 9) return "\\t";
  if (code === 10) return "\\n";
  if (code === 13) return "\\r";
  if (code < 32 || code === 127) return "(کنترل)";
  return String.fromCharCode(code);
}

export default function AsciiConverterTool() {
  const [mode, setMode] = useState<"toCodes" | "toText">("toCodes");
  const [input, setInput] = useState("");

  const rows = useMemo(() => {
    if (mode !== "toCodes" || !input) return [];
    return Array.from(input).flatMap((ch) =>
      Array.from(new TextEncoder().encode(ch)).map((code) => ({
        char: charLabel(code),
        dec: code,
        hex: code.toString(16).padStart(2, "0").toUpperCase(),
        bin: code.toString(2).padStart(8, "0"),
      })),
    );
  }, [input, mode]);

  const { text, err } = useMemo(() => {
    if (mode !== "toText" || !input) return { text: "", err: "" };
    try {
      const codes = input
        .trim()
        .split(/[\s,]+/)
        .filter(Boolean)
        .map((tok) => {
          const n = /^0x/i.test(tok) ? parseInt(tok, 16) : parseInt(tok, 10);
          if (!Number.isFinite(n) || n < 0 || n > 0x10ffff) throw new Error("bad");
          return n;
        });
      return { text: codes.map((c) => String.fromCodePoint(c)).join(""), err: "" };
    } catch {
      return { text: "", err: "کدها نامعتبرند (اعداد اعشاری یا 0x جداشده با فاصله/کاما)." };
    }
  }, [input, mode]);

  return (
    <div className="space-y-4">
      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: "toCodes", label: "متن ← کدها" },
          { value: "toText", label: "کدها ← متن" },
        ]}
      />
      <Field label="ورودی">
        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "toCodes" ? "ABC" : "65 66 67"}
          className="min-h-28"
        />
      </Field>

      {mode === "toCodes" && rows.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-border" dir="ltr">
          <table className="w-full text-sm">
            <thead className="bg-bg-soft text-xs text-muted">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Char</th>
                <th className="px-3 py-2 text-left font-medium">Dec</th>
                <th className="px-3 py-2 text-left font-medium">Hex</th>
                <th className="px-3 py-2 text-left font-medium">Binary</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {rows.map((r, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-3 py-1.5">{r.char}</td>
                  <td className="px-3 py-1.5 text-turquoise">{r.dec}</td>
                  <td className="px-3 py-1.5">0x{r.hex}</td>
                  <td className="px-3 py-1.5">{r.bin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {mode === "toText" && <Output label="متن" value={text} />}
      {err && <ErrorNote>{err}</ErrorNote>}
    </div>
  );
}

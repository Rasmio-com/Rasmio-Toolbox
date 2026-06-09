"use client";

import { useMemo, useState } from "react";
import { Field, TextArea } from "@/components/tool/kit";

export default function UnicodeInspectorTool() {
  const [input, setInput] = useState("");

  const rows = useMemo(() => {
    if (!input) return [];
    return Array.from(input).map((ch) => {
      const cp = ch.codePointAt(0)!;
      const utf8 = Array.from(new TextEncoder().encode(ch), (b) =>
        b.toString(16).padStart(2, "0").toUpperCase(),
      ).join(" ");
      return {
        char: ch === " " ? "(فاصله)" : ch,
        hex: "U+" + cp.toString(16).toUpperCase().padStart(4, "0"),
        dec: cp,
        utf8,
      };
    });
  }, [input]);

  return (
    <div className="space-y-4">
      <Field label="متن">
        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="سلام 👋 A"
          dir="auto"
          className="min-h-28"
        />
      </Field>

      {rows.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-border" dir="ltr">
          <table className="w-full text-sm">
            <thead className="bg-bg-soft text-xs text-muted">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Char</th>
                <th className="px-3 py-2 text-left font-medium">Code Point</th>
                <th className="px-3 py-2 text-left font-medium">Decimal</th>
                <th className="px-3 py-2 text-left font-medium">UTF-8 (hex)</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {rows.map((r, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-3 py-1.5 text-lg">{r.char}</td>
                  <td className="px-3 py-1.5 text-turquoise">{r.hex}</td>
                  <td className="px-3 py-1.5">{r.dec}</td>
                  <td className="px-3 py-1.5">{r.utf8}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

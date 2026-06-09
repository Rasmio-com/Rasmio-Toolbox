"use client";

import { useMemo, useState } from "react";
import { Field, Grid2, Output, Segmented, TextArea, TextInput } from "@/components/tool/kit";

type Mode = "wrap" | "unwrap";

function wrapLine(line: string, width: number): string {
  if (line.trim() === "") return line;
  const words = line.split(/(\s+)/);
  const out: string[] = [];
  let cur = "";
  for (const w of words) {
    if (cur === "") {
      cur = w.trimStart();
    } else if (Array.from(cur + w).length <= width) {
      cur += w;
    } else {
      out.push(cur.trimEnd());
      cur = w.trimStart();
    }
  }
  if (cur.trim() !== "" || out.length === 0) out.push(cur.trimEnd());
  return out.join("\n");
}

export default function TextWrapTool() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<Mode>("wrap");
  const [cols, setCols] = useState("80");

  const out = useMemo(() => {
    if (!text) return "";
    if (mode === "wrap") {
      const width = Math.max(1, Number(cols) || 1);
      return text
        .split(/\r\n|\r|\n/)
        .map((l) => wrapLine(l, width))
        .join("\n");
    }
    // unwrap: join consecutive non-empty lines into single paragraphs
    return text
      .replace(/\r\n|\r/g, "\n")
      .split(/\n{2,}/)
      .map((p) =>
        p
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean)
          .join(" "),
      )
      .join("\n\n");
  }, [text, mode, cols]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: "wrap", label: "شکستن خط" },
            { value: "unwrap", label: "چسباندن خطوط" },
          ]}
        />
        {mode === "wrap" && (
          <label className="flex items-center gap-2 text-sm text-muted">
            عرض (ستون)
            <TextInput
              type="number"
              min={1}
              value={cols}
              onChange={(e) => setCols(e.target.value)}
              className="w-24"
            />
          </label>
        )}
      </div>
      <Grid2>
        <Field label="ورودی">
          <TextArea
            mono={false}
            dir="auto"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="متن خود را این‌جا بنویسید…"
            className="min-h-56"
          />
        </Field>
        <Output label="خروجی" value={out} mono={false} className="min-h-56" />
      </Grid2>
    </div>
  );
}

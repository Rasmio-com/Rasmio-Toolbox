"use client";

import { useMemo, useState } from "react";
import { Field, Grid2, Output, Segmented, TextArea } from "@/components/tool/kit";

type Mode = "chars" | "words" | "lines";

export default function ReverseTextTool() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<Mode>("chars");

  const out = useMemo(() => {
    if (!text) return "";
    if (mode === "chars") return Array.from(text).reverse().join("");
    if (mode === "lines") return text.split(/\r\n|\r|\n/).reverse().join("\n");
    // words: reverse word order per line, keep lines in place
    return text
      .split(/\r\n|\r|\n/)
      .map((line) => line.split(/(\s+)/).reverse().join(""))
      .join("\n");
  }, [text, mode]);

  return (
    <div className="space-y-4">
      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: "chars", label: "کاراکتر" },
          { value: "words", label: "کلمه" },
          { value: "lines", label: "خط" },
        ]}
      />
      <Grid2>
        <Field label="ورودی">
          <TextArea
            mono={false}
            dir="auto"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="متن خود را این‌جا بنویسید…"
            className="min-h-44"
          />
        </Field>
        <Output label="خروجی" value={out} mono={false} className="min-h-44" />
      </Grid2>
    </div>
  );
}

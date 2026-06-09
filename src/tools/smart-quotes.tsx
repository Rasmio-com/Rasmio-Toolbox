"use client";

import { useMemo, useState } from "react";
import { Field, Grid2, Output, Segmented, TextArea } from "@/components/tool/kit";

type Dir = "smart" | "straight";

function toSmart(s: string): string {
  return s
    .replace(/---/g, "—") // em dash
    .replace(/--/g, "–") // en dash
    .replace(/(^|[\s([{<])"/g, "$1“") // opening "
    .replace(/"/g, "”") // closing "
    .replace(/(^|[\s([{<])'/g, "$1‘") // opening '
    .replace(/'/g, "’"); // closing ' / apostrophe
}

function toStraight(s: string): string {
  return s
    .replace(/[“”«»]/g, '"')
    .replace(/[‘’‚‹›]/g, "'")
    .replace(/—/g, "---")
    .replace(/–/g, "--");
}

export default function SmartQuotesTool() {
  const [text, setText] = useState("");
  const [dir, setDir] = useState<Dir>("smart");

  const out = useMemo(() => {
    if (!text) return "";
    return dir === "smart" ? toSmart(text) : toStraight(text);
  }, [text, dir]);

  return (
    <div className="space-y-4">
      <Segmented
        value={dir}
        onChange={setDir}
        options={[
          { value: "smart", label: "ساده ← هوشمند" },
          { value: "straight", label: "هوشمند ← ساده" },
        ]}
      />
      <Grid2>
        <Field label="ورودی">
          <TextArea
            mono={false}
            dir="auto"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={dir === "smart" ? `He said "hello" -- nicely.` : `He said “hello” — nicely.`}
            className="min-h-44"
          />
        </Field>
        <Output label="خروجی" value={out} mono={false} className="min-h-44" />
      </Grid2>
    </div>
  );
}

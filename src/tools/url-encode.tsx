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

export default function UrlEncodeTool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [component, setComponent] = useState(true);

  const { out, err } = useMemo(() => {
    if (!input) return { out: "", err: "" };
    try {
      if (mode === "encode") {
        return {
          out: component ? encodeURIComponent(input) : encodeURI(input),
          err: "",
        };
      }
      return {
        out: component ? decodeURIComponent(input) : decodeURI(input),
        err: "",
      };
    } catch {
      return { out: "", err: "ورودی نامعتبر است." };
    }
  }, [input, mode, component]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: "encode", label: "کدگذاری" },
            { value: "decode", label: "رمزگشایی" },
          ]}
        />
        <Toggle
          checked={component}
          onChange={setComponent}
          label="حالت Component (پارامتر)"
        />
      </div>
      <Grid2>
        <Field label="ورودی">
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="https://example.com/?q=سلام دنیا"
          />
        </Field>
        <Output label="خروجی" value={out} />
      </Grid2>
      {err && <ErrorNote>{err}</ErrorNote>}
    </div>
  );
}

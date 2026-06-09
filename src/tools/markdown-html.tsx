"use client";

import { useMemo, useState } from "react";
import { marked } from "marked";
import TurndownService from "turndown";
import { ErrorNote, Field, Grid2, Output, Segmented, TextArea } from "@/components/tool/kit";

export default function MarkdownHtmlTool() {
  const [mode, setMode] = useState<"m2h" | "h2m">("m2h");
  const [input, setInput] = useState("");

  const { out, err } = useMemo(() => {
    if (!input.trim()) return { out: "", err: "" };
    try {
      if (mode === "m2h") {
        // async:false guarantees a synchronous string return.
        return { out: marked(input, { async: false, gfm: true }), err: "" };
      }
      const td = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced" });
      return { out: td.turndown(input), err: "" };
    } catch (e) {
      return { out: "", err: `خطا در تبدیل: ${(e as Error).message}` };
    }
  }, [input, mode]);

  return (
    <div className="space-y-4">
      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: "m2h", label: "Markdown → HTML" },
          { value: "h2m", label: "HTML → Markdown" },
        ]}
      />
      <Grid2>
        <Field label={mode === "m2h" ? "Markdown ورودی" : "HTML ورودی"}>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            dir={mode === "m2h" ? "auto" : "ltr"}
            placeholder={mode === "m2h" ? "# عنوان\n\nمتن **پررنگ**" : "<h1>عنوان</h1><p>متن</p>"}
            className="min-h-72"
          />
        </Field>
        <Output
          label="خروجی"
          value={out}
          className="min-h-72"
          download={{ filename: mode === "m2h" ? "out.html" : "out.md" }}
        />
      </Grid2>
      {err && <ErrorNote>{err}</ErrorNote>}
    </div>
  );
}

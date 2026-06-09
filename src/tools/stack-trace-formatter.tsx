"use client";

import { useMemo, useState } from "react";
import { Field, Grid2, Output, TextArea } from "@/components/tool/kit";

/** Normalize a JS / Java / Python stack trace into clean, aligned frames. */
function formatTrace(input: string): string {
  const lines = input
    .split("\n")
    .map((l) => l.replace(/\r$/, "").replace(/\s+$/, ""))
    .filter((l) => l.trim().length > 0);

  const out: string[] = [];
  for (const raw of lines) {
    const line = raw.trim();

    // JS frame: "at func (file:line:col)" or "at file:line:col"
    const js = /^at\s+(.*)$/.exec(line);
    if (js) {
      out.push("    at " + js[1].trim());
      continue;
    }
    // Java frame: "at pkg.Class.method(File.java:42)"
    const java = /^at\s+[\w.$]+\([\w.]+:\d+\)$/.test(line);
    if (java) {
      out.push("    " + line);
      continue;
    }
    // Python frame: 'File "x.py", line 10, in func'
    const py = /^File\s+"(.+?)",\s*line\s+(\d+)(?:,\s*in\s+(.+))?$/.exec(line);
    if (py) {
      const fn = py[3] ? ` in ${py[3]}` : "";
      out.push(`    File "${py[1]}", line ${py[2]}${fn}`);
      continue;
    }
    // "Caused by" / "...N more" markers
    if (/^(Caused by:|\.\.\.\s*\d+\s*more)/i.test(line)) {
      out.push(line);
      continue;
    }
    // Otherwise treat as an error header / message line.
    out.push(line);
  }
  return out.join("\n");
}

export default function StackTraceFormatterTool() {
  const [input, setInput] = useState("");
  const out = useMemo(() => (input.trim() ? formatTrace(input) : ""), [input]);

  return (
    <div className="space-y-4">
      <Grid2>
        <Field label="Stack Trace خام" hint="JS / Java / Python">
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={"TypeError: x is undefined\n   at foo (app.js:12:5)\n at bar ( app.js:3:1 )"}
            className="min-h-64"
          />
        </Field>
        <Output
          label="قالب‌بندی‌شده"
          value={out}
          className="min-h-64"
          download={{ filename: "stacktrace.txt" }}
        />
      </Grid2>
    </div>
  );
}

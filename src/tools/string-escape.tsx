"use client";

import { useMemo, useState } from "react";
import {
  ErrorNote,
  Field,
  Grid2,
  Output,
  Segmented,
  Select,
  TextArea,
} from "@/components/tool/kit";

type Target = "xml" | "json" | "js" | "css" | "sql" | "shell" | "markdown" | "regexp";

const TARGETS: { value: Target; label: string }[] = [
  { value: "xml", label: "XML" },
  { value: "json", label: "JSON" },
  { value: "js", label: "JavaScript" },
  { value: "css", label: "CSS" },
  { value: "sql", label: "SQL" },
  { value: "shell", label: "Shell" },
  { value: "markdown", label: "Markdown" },
  { value: "regexp", label: "RegExp" },
];

function escapeStr(s: string, t: Target): string {
  switch (t) {
    case "xml":
      return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
    case "json":
      return JSON.stringify(s).slice(1, -1);
    case "js":
      return s
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/`/g, "\\`")
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/\t/g, "\\t");
    case "css":
      return s.replace(/[^a-zA-Z0-9_-]/g, (c) => {
        const cp = c.codePointAt(0)!;
        return "\\" + cp.toString(16) + " ";
      });
    case "sql":
      return s.replace(/'/g, "''");
    case "shell":
      return "'" + s.replace(/'/g, "'\\''") + "'";
    case "markdown":
      return s.replace(/([\\`*_{}[\]()#+\-.!>|~])/g, "\\$1");
    case "regexp":
      return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}

function unescapeStr(s: string, t: Target): string {
  switch (t) {
    case "xml":
      return s
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&amp;/g, "&");
    case "json":
      return JSON.parse('"' + s + '"');
    case "js":
      return s
        .replace(/\\n/g, "\n")
        .replace(/\\r/g, "\r")
        .replace(/\\t/g, "\t")
        .replace(/\\`/g, "`")
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'")
        .replace(/\\\\/g, "\\");
    case "css":
      return s.replace(/\\([0-9a-fA-F]{1,6}) ?/g, (_, h) =>
        String.fromCodePoint(parseInt(h, 16)),
      );
    case "sql":
      return s.replace(/''/g, "'");
    case "shell":
      return s.replace(/^'|'$/g, "").replace(/'\\''/g, "'");
    case "markdown":
    case "regexp":
      return s.replace(/\\(.)/g, "$1");
  }
}

export default function StringEscapeTool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [target, setTarget] = useState<Target>("json");
  const [input, setInput] = useState("");

  const { out, err } = useMemo(() => {
    if (!input) return { out: "", err: "" };
    try {
      return {
        out: mode === "encode" ? escapeStr(input, target) : unescapeStr(input, target),
        err: "",
      };
    } catch {
      return { out: "", err: "ورودی برای رمزگشایی نامعتبر است." };
    }
  }, [input, mode, target]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: "encode", label: "فرار (Escape)" },
            { value: "decode", label: "بازگردانی (Unescape)" },
          ]}
        />
        <Field label="هدف">
          <Select
            value={target}
            onChange={(e) => setTarget(e.target.value as Target)}
          >
            {TARGETS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Grid2>
        <Field label="ورودی">
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Hello "World"`}
          />
        </Field>
        <Output label="خروجی" value={out} />
      </Grid2>
      {err && <ErrorNote>{err}</ErrorNote>}
    </div>
  );
}

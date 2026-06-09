"use client";

import { useMemo, useState } from "react";
import { ErrorNote, Field, Grid2, Output, Select, TextArea } from "@/components/tool/kit";

type Format = "ini" | "env" | "properties";

// strip a wrapping pair of matching quotes
function unquote(v: string): string {
  const t = v.trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'")))
    return t.slice(1, -1);
  return t;
}

function parseIni(text: string): Record<string, unknown> {
  const root: Record<string, unknown> = {};
  let section: Record<string, unknown> = root;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith(";") || line.startsWith("#")) continue;
    const sec = line.match(/^\[(.+)\]$/);
    if (sec) {
      section = {};
      root[sec[1].trim()] = section;
      continue;
    }
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    section[line.slice(0, eq).trim()] = unquote(line.slice(eq + 1));
  }
  return root;
}

function parseEnv(text: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const raw of text.split(/\r?\n/)) {
    let line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    if (line.startsWith("export ")) line = line.slice(7).trim();
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    out[line.slice(0, eq).trim()] = unquote(line.slice(eq + 1));
  }
  return out;
}

function parseProperties(text: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#") || line.startsWith("!")) continue;
    const m = line.match(/^([^=:]+)[=:](.*)$/);
    if (!m) continue;
    out[m[1].trim()] = m[2].trim();
  }
  return out;
}

export default function ConfigParserTool() {
  const [format, setFormat] = useState<Format>("ini");
  const [input, setInput] = useState("");

  const { out, err } = useMemo(() => {
    if (!input.trim()) return { out: "", err: "" };
    try {
      const parsed =
        format === "ini" ? parseIni(input) : format === "env" ? parseEnv(input) : parseProperties(input);
      return { out: JSON.stringify(parsed, null, 2), err: "" };
    } catch (e) {
      return { out: "", err: `خطا در تجزیه: ${(e as Error).message}` };
    }
  }, [input, format]);

  const placeholder =
    format === "ini"
      ? "[database]\nhost = localhost\nport = 5432"
      : format === "env"
        ? "PORT=3000\nDEBUG=true"
        : "app.name = Rasmio\napp.version = 1.0";

  return (
    <div className="space-y-4">
      <Field label="فرمت ورودی" className="max-w-xs">
        <Select value={format} onChange={(e) => setFormat(e.target.value as Format)}>
          <option value="ini">INI</option>
          <option value="env">.env</option>
          <option value="properties">.properties</option>
        </Select>
      </Field>
      <Grid2>
        <Field label="تنظیمات ورودی">
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            dir="ltr"
            placeholder={placeholder}
            className="min-h-72"
          />
        </Field>
        <Output label="JSON" value={out} className="min-h-72" download={{ filename: "config.json", mime: "application/json" }} />
      </Grid2>
      {err && <ErrorNote>{err}</ErrorNote>}
    </div>
  );
}

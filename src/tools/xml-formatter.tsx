"use client";

import { useMemo, useState } from "react";
import { ErrorNote, Field, Grid2, Output, Segmented, TextArea } from "@/components/tool/kit";

// Pretty-print serialized XML by re-indenting on tag boundaries.
function prettyXml(xml: string, indentUnit = "  "): string {
  // Put every tag on its own line, then walk and indent.
  const normalized = xml.replace(/>\s*</g, "><").replace(/></g, ">\n<");
  let depth = 0;
  const out: string[] = [];
  for (const raw of normalized.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const isClose = /^<\//.test(line);
    const isSelfClose = /\/>$/.test(line) || /^<\?/.test(line) || /^<!/.test(line);
    const isOpen = /^<[^/!?]/.test(line) && !isSelfClose;
    // A line like <tag>text</tag> opens and closes on itself.
    const opensAndCloses = isOpen && /<\/[^>]+>$/.test(line);
    if (isClose) depth = Math.max(0, depth - 1);
    out.push(indentUnit.repeat(depth) + line);
    if (isOpen && !opensAndCloses) depth++;
  }
  return out.join("\n");
}

function minifyXml(xml: string): string {
  return xml.replace(/>\s+</g, "><").trim();
}

function checkError(xml: string): string {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const errNode = doc.querySelector("parsererror");
  if (errNode) return errNode.textContent?.replace(/\s+/g, " ").trim() || "XML نامعتبر است";
  return "";
}

export default function XmlFormatterTool() {
  const [mode, setMode] = useState<"pretty" | "minify">("pretty");
  const [input, setInput] = useState("");

  const { out, err } = useMemo(() => {
    if (!input.trim()) return { out: "", err: "" };
    const parseErr = checkError(input);
    if (parseErr) return { out: "", err: `خطای تجزیه XML: ${parseErr}` };
    try {
      return { out: mode === "pretty" ? prettyXml(input) : minifyXml(input), err: "" };
    } catch (e) {
      return { out: "", err: (e as Error).message };
    }
  }, [input, mode]);

  return (
    <div className="space-y-4">
      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: "pretty", label: "زیباسازی" },
          { value: "minify", label: "فشرده‌سازی" },
        ]}
      />
      <Grid2>
        <Field label="XML ورودی">
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            dir="ltr"
            placeholder="<root><item id='1'>متن</item></root>"
            className="min-h-72"
          />
        </Field>
        <Output label="خروجی" value={out} className="min-h-72" download={{ filename: "out.xml", mime: "application/xml" }} />
      </Grid2>
      {err && <ErrorNote>{err}</ErrorNote>}
    </div>
  );
}

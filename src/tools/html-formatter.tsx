"use client";

import { useMemo, useState } from "react";
import { Field, Grid2, Output, Segmented, TextArea } from "@/components/tool/kit";

const VOID_TAGS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr",
]);
// Tags whose text content should not be reflowed.
const INLINE_RAW = new Set(["pre", "textarea", "script", "style"]);

// Tokenize HTML into tags and text runs, then indent by nesting depth.
function prettyHtml(html: string, unit = "  "): string {
  const tokens = html.match(/<[^>]+>|[^<]+/g) || [];
  let depth = 0;
  const out: string[] = [];
  let rawDepth = 0; // inside pre/script/style — emit verbatim
  for (const tok of tokens) {
    const isTag = tok.startsWith("<");
    if (!isTag) {
      const text = tok.replace(/\s+/g, " ").trim();
      if (text) out.push(unit.repeat(depth) + text);
      continue;
    }
    const isComment = tok.startsWith("<!--");
    const isDecl = tok.startsWith("<!") || tok.startsWith("<?");
    const isClose = /^<\//.test(tok);
    const nameMatch = tok.match(/^<\/?\s*([a-zA-Z0-9-]+)/);
    const name = nameMatch ? nameMatch[1].toLowerCase() : "";
    const isSelfClose = /\/>\s*$/.test(tok) || VOID_TAGS.has(name) || isComment || isDecl;

    if (rawDepth > 0) {
      // Inside pre/script/style: emit verbatim until the matching close tag.
      if (isClose && INLINE_RAW.has(name)) {
        rawDepth--;
        depth = Math.max(0, depth - 1);
        out.push(unit.repeat(depth) + tok);
      } else {
        out.push(tok);
      }
      continue;
    }
    if (isClose) {
      depth = Math.max(0, depth - 1);
      out.push(unit.repeat(depth) + tok);
    } else {
      out.push(unit.repeat(depth) + tok);
      if (!isSelfClose) {
        depth++;
        if (INLINE_RAW.has(name)) rawDepth++;
      }
    }
  }
  return out.join("\n");
}

function minifyHtml(html: string): string {
  return html.replace(/>\s+</g, "><").replace(/\s{2,}/g, " ").trim();
}

export default function HtmlFormatterTool() {
  const [mode, setMode] = useState<"pretty" | "minify">("pretty");
  const [input, setInput] = useState("");

  const out = useMemo(() => {
    if (!input.trim()) return "";
    return mode === "pretty" ? prettyHtml(input) : minifyHtml(input);
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
        <Field label="HTML ورودی">
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            dir="ltr"
            placeholder="<div><p>سلام</p><a href='#'>پیوند</a></div>"
            className="min-h-72"
          />
        </Field>
        <Output label="خروجی" value={out} className="min-h-72" download={{ filename: "out.html", mime: "text/html" }} />
      </Grid2>
    </div>
  );
}

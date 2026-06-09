"use client";

import { useMemo, useState } from "react";
import { ErrorNote, Field, Grid2, Output, TextArea, TextInput } from "@/components/tool/kit";

type Interfaces = Map<string, string>;

function pascal(name: string): string {
  const s = name.replace(/[^a-zA-Z0-9]+/g, " ").trim();
  if (!s) return "Item";
  return s
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

function singular(name: string): string {
  if (/ies$/.test(name)) return name.replace(/ies$/, "y");
  if (/ses$/.test(name)) return name.replace(/es$/, "");
  if (/s$/.test(name)) return name.replace(/s$/, "");
  return name + "Item";
}

function isSafeKey(k: string): boolean {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k);
}

// best-effort type for a single value; collects nested interfaces
function typeOf(value: unknown, name: string, ifs: Interfaces): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return arrayType(value, name, ifs);
  switch (typeof value) {
    case "string":
      return "string";
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    case "object":
      return objectType(value as Record<string, unknown>, name, ifs);
    default:
      return "any";
  }
}

function arrayType(arr: unknown[], name: string, ifs: Interfaces): string {
  if (arr.length === 0) return "unknown[]";
  const elemName = singular(name);
  const parts = new Set<string>();
  for (const item of arr) parts.add(typeOf(item, elemName, ifs));
  const union = [...parts].sort().join(" | ");
  return parts.size > 1 ? `(${union})[]` : `${union}[]`;
}

function objectType(obj: Record<string, unknown>, name: string, ifs: Interfaces): string {
  const typeName = pascal(name);
  const lines: string[] = [];
  for (const [key, val] of Object.entries(obj)) {
    // best-effort optional inference: JSON can't hold undefined, so treat an
    // explicit null value as an optional/nullable field hint.
    const optional = val === null;
    const t = typeOf(val, key, ifs);
    const safe = isSafeKey(key) ? key : JSON.stringify(key);
    lines.push(`  ${safe}${optional ? "?" : ""}: ${t};`);
  }
  const body = lines.join("\n") || "  [key: string]: unknown;";
  // Reuse an identical interface; otherwise allocate a numbered name.
  let finalName = typeName;
  let i = 2;
  while (ifs.has(finalName) && ifs.get(finalName) !== body) finalName = `${typeName}${i++}`;
  ifs.set(finalName, body);
  return finalName;
}

export default function JsonToTypescriptTool() {
  const [input, setInput] = useState("");
  const [root, setRoot] = useState("Root");

  const { out, err } = useMemo(() => {
    if (!input.trim()) return { out: "", err: "" };
    try {
      const data = JSON.parse(input);
      const ifs: Interfaces = new Map();
      const rootName = pascal(root || "Root");
      const t = typeOf(data, rootName, ifs);
      // Emit interfaces (root-first reads better) then a root alias if the
      // top-level value wasn't itself an object.
      const blocks = [...ifs.entries()]
        .reverse()
        .map(([n, body]) => `export interface ${n} {\n${body}\n}`);
      if (!ifs.has(rootName)) blocks.unshift(`export type ${rootName} = ${t};`);
      return { out: blocks.join("\n\n"), err: "" };
    } catch (e) {
      return { out: "", err: `JSON نامعتبر: ${(e as Error).message}` };
    }
  }, [input, root]);

  return (
    <div className="space-y-4">
      <Field label="نام نوع ریشه" className="max-w-xs">
        <TextInput value={root} onChange={(e) => setRoot(e.target.value)} dir="ltr" placeholder="Root" />
      </Field>
      <Grid2>
        <Field label="JSON ورودی">
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            dir="ltr"
            placeholder='{"id":1,"name":"Ali","tags":["a","b"],"meta":{"active":true}}'
            className="min-h-72"
          />
        </Field>
        <Output
          label="TypeScript"
          value={out}
          className="min-h-72"
          download={{ filename: "types.ts", mime: "text/typescript" }}
        />
      </Grid2>
      {err && <ErrorNote>{err}</ErrorNote>}
    </div>
  );
}

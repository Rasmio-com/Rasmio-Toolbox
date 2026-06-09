"use client";

import { useMemo, useState } from "react";
import { ErrorNote, Field, Output, Stat, TextArea, TextInput } from "@/components/tool/kit";

type Step = { type: "key"; key: string } | { type: "index"; index: number } | { type: "wildcard" };

// Tokenize a small JSONPath subset: $, .key, ['key'], [index], [*], .*
function parsePath(path: string): Step[] {
  const p = path.trim();
  if (!p) throw new Error("مسیر خالی است");
  if (p[0] !== "$") throw new Error("مسیر باید با $ شروع شود");
  const steps: Step[] = [];
  let i = 1;
  while (i < p.length) {
    const c = p[i];
    if (c === ".") {
      i++;
      if (p[i] === "*") {
        steps.push({ type: "wildcard" });
        i++;
        continue;
      }
      // Dot-segment: read until the next delimiter (.[ ]) — allows Unicode keys.
      let key = "";
      while (i < p.length && !".[]".includes(p[i])) key += p[i++];
      if (!key) throw new Error("کلید نامعتبر پس از نقطه");
      steps.push({ type: "key", key });
    } else if (c === "[") {
      const end = p.indexOf("]", i);
      if (end === -1) throw new Error("] بسته‌نشده");
      const inner = p.slice(i + 1, end).trim();
      if (inner === "*") steps.push({ type: "wildcard" });
      else if (/^-?\d+$/.test(inner)) steps.push({ type: "index", index: Number(inner) });
      else if (/^["'].*["']$/.test(inner)) steps.push({ type: "key", key: inner.slice(1, -1) });
      else throw new Error(`اندیس نامعتبر: ${inner}`);
      i = end + 1;
    } else {
      throw new Error(`کاراکتر نامعتبر در مسیر: «${c}»`);
    }
  }
  return steps;
}

function evaluate(root: unknown, steps: Step[]): unknown[] {
  let current: unknown[] = [root];
  for (const step of steps) {
    const next: unknown[] = [];
    for (const node of current) {
      if (node == null) continue;
      if (step.type === "key") {
        if (typeof node === "object" && !Array.isArray(node) && step.key in (node as object))
          next.push((node as Record<string, unknown>)[step.key]);
      } else if (step.type === "index") {
        if (Array.isArray(node)) {
          const idx = step.index < 0 ? node.length + step.index : step.index;
          if (idx >= 0 && idx < node.length) next.push(node[idx]);
        }
      } else {
        if (Array.isArray(node)) next.push(...node);
        else if (typeof node === "object") next.push(...Object.values(node as object));
      }
    }
    current = next;
  }
  return current;
}

export default function JsonPathTool() {
  const [input, setInput] = useState("");
  const [path, setPath] = useState("$");

  const { out, count, err } = useMemo(() => {
    if (!input.trim()) return { out: "", count: 0, err: "" };
    let data: unknown;
    try {
      data = JSON.parse(input);
    } catch (e) {
      return { out: "", count: 0, err: `JSON نامعتبر: ${(e as Error).message}` };
    }
    try {
      const steps = parsePath(path);
      const matches = evaluate(data, steps);
      return { out: JSON.stringify(matches, null, 2), count: matches.length, err: "" };
    } catch (e) {
      return { out: "", count: 0, err: `مسیر نامعتبر: ${(e as Error).message}` };
    }
  }, [input, path]);

  return (
    <div className="space-y-4">
      <Field label="JSON ورودی">
        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          dir="ltr"
          placeholder='{"store":{"books":[{"title":"الف"},{"title":"ب"}]}}'
          className="min-h-44"
        />
      </Field>
      <Field label="مسیر JSONPath" hint="$، .key، [index]، [*]">
        <TextInput value={path} onChange={(e) => setPath(e.target.value)} dir="ltr" placeholder="$.store.books[*].title" />
      </Field>
      {err ? (
        <ErrorNote>{err}</ErrorNote>
      ) : (
        <>
          <Stat label="تعداد نتایج" value={count} />
          <Output label="نتایج" value={out} className="min-h-44" />
        </>
      )}
    </div>
  );
}

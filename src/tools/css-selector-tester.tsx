"use client";

import { useMemo, useState } from "react";
import { ErrorNote, Field, Stat, TextArea, TextInput } from "@/components/tool/kit";

export default function CssSelectorTesterTool() {
  const [html, setHtml] = useState("");
  const [selector, setSelector] = useState("");

  const { matches, err } = useMemo(() => {
    if (!html.trim() || !selector.trim()) return { matches: [] as string[], err: "" };
    const doc = new DOMParser().parseFromString(html, "text/html");
    try {
      const found = Array.from(doc.querySelectorAll(selector));
      return { matches: found.map((el) => el.outerHTML), err: "" };
    } catch (e) {
      return { matches: [], err: `سلکتور نامعتبر: ${(e as Error).message}` };
    }
  }, [html, selector]);

  return (
    <div className="space-y-4">
      <Field label="HTML">
        <TextArea
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          dir="ltr"
          placeholder='<ul><li class="a">۱</li><li class="a b">۲</li></ul>'
          className="min-h-44"
        />
      </Field>
      <Field label="سلکتور CSS">
        <TextInput value={selector} onChange={(e) => setSelector(e.target.value)} dir="ltr" placeholder="li.a" />
      </Field>
      {err && <ErrorNote>{err}</ErrorNote>}
      {!err && html.trim() && selector.trim() && (
        <>
          <Stat label="تعداد تطبیق" value={matches.length} />
          {matches.length > 0 && (
            <Field label="عناصر تطبیق‌یافته">
              <ul className="space-y-2">
                {matches.map((m, i) => (
                  <li
                    key={i}
                    dir="ltr"
                    className="overflow-x-auto rounded-lg border border-border bg-bg-soft px-3 py-2 font-mono text-xs text-fg"
                  >
                    {m}
                  </li>
                ))}
              </ul>
            </Field>
          )}
        </>
      )}
    </div>
  );
}

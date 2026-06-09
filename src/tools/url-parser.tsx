"use client";

import { useMemo, useState } from "react";
import { CopyButton, ErrorNote, Field, Panel, TextInput } from "@/components/tool/kit";

export default function UrlParserTool() {
  const [input, setInput] = useState("");

  const result = useMemo(() => {
    if (!input.trim()) return null;
    try {
      const u = new URL(input.trim());
      const parts = [
        { label: "Protocol", value: u.protocol },
        { label: "Host", value: u.host },
        { label: "Hostname", value: u.hostname },
        { label: "Port", value: u.port || "—" },
        { label: "Pathname", value: u.pathname },
        { label: "Hash", value: u.hash || "—" },
        { label: "Origin", value: u.origin },
      ];
      const params = Array.from(u.searchParams.entries());
      return { parts, params };
    } catch {
      return { error: "آدرس نامعتبر است (پروتکل مانند https:// را فراموش نکنید)." };
    }
  }, [input]);

  return (
    <div className="space-y-4">
      <Field label="آدرس (URL)">
        <TextInput
          mono
          dir="ltr"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="https://example.com:8080/path?a=1&b=2#section"
        />
      </Field>

      {result?.error && <ErrorNote>{result.error}</ErrorNote>}

      {result && !result.error && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="اجزای آدرس">
            <div className="space-y-1.5">
              {result.parts!.map((p) => (
                <div key={p.label} className="flex items-center gap-3 text-sm">
                  <span className="w-20 shrink-0 font-mono text-xs text-saffron">
                    {p.label}
                  </span>
                  <code dir="ltr" className="min-w-0 flex-1 truncate text-fg">
                    {p.value}
                  </code>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title={`پارامترهای کوئری (${result.params!.length})`}>
            {result.params!.length ? (
              <div className="space-y-1.5">
                {result.params!.map(([k, v], i) => (
                  <div key={i} className="flex items-center gap-2 text-sm" dir="ltr">
                    <code className="shrink-0 text-turquoise">{k}</code>
                    <span className="text-faint">=</span>
                    <code className="min-w-0 flex-1 truncate text-fg">{v}</code>
                    <CopyButton value={v} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">پارامتری وجود ندارد.</p>
            )}
          </Panel>
        </div>
      )}
    </div>
  );
}

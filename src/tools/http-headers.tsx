"use client";

import { useState, useTransition } from "react";
import { Send } from "lucide-react";
import { Button, CopyButton, ErrorNote, Field, Panel, TextInput } from "@/components/tool/kit";
import { inspectUrl, type InspectResult } from "@/app/actions/http-inspect";

export default function HttpHeadersTool() {
  const [url, setUrl] = useState("");
  const [res, setRes] = useState<InspectResult | null>(null);
  const [pending, startTransition] = useTransition();

  const run = () => {
    if (!url.trim()) return;
    startTransition(async () => {
      setRes(await inspectUrl(url));
    });
  };

  const headerText = res?.headers
    ?.map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  return (
    <div className="space-y-4">
      <Field label="آدرس (URL)">
        <div className="flex gap-2">
          <TextInput
            mono
            dir="ltr"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run()}
            placeholder="https://example.com"
          />
          <Button variant="primary" onClick={run} disabled={pending} className="gap-1.5">
            <Send className="size-4" />
            {pending ? "در حال بررسی…" : "بررسی"}
          </Button>
        </div>
      </Field>

      {res?.error && <ErrorNote>{res.error}</ErrorNote>}

      {res?.ok && (
        <>
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-bg-soft px-4 py-3">
            <span
              className={`rounded-lg border px-2.5 py-1 font-mono text-sm font-bold ${
                res.status! < 400
                  ? "border-success/40 text-success"
                  : "border-danger/40 text-danger"
              }`}
            >
              {res.status} {res.statusText}
            </span>
            <code dir="ltr" className="min-w-0 flex-1 truncate text-sm text-muted">
              {res.finalUrl}
            </code>
          </div>

          <Panel
            title={`هدرهای پاسخ (${res.headers?.length ?? 0})`}
            actions={headerText ? <CopyButton value={headerText} /> : null}
          >
            <div className="space-y-1.5" dir="ltr">
              {res.headers?.map(([k, v], i) => (
                <div key={i} className="flex gap-2 text-sm">
                  <code className="shrink-0 font-semibold text-turquoise">{k}:</code>
                  <code className="min-w-0 flex-1 break-all text-fg">{v}</code>
                </div>
              ))}
            </div>
          </Panel>
        </>
      )}
    </div>
  );
}

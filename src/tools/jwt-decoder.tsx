"use client";

import { useMemo, useState } from "react";
import { ErrorNote, Field, Output, Panel, TextArea } from "@/components/tool/kit";

function b64urlDecode(s: string): string {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function pretty(json: string): string {
  return JSON.stringify(JSON.parse(json), null, 2);
}

function timeNote(payload: Record<string, unknown>): string[] {
  const notes: string[] = [];
  const fmt = (n: number) => new Date(n * 1000).toLocaleString("fa-IR");
  if (typeof payload.iat === "number") notes.push(`صدور (iat): ${fmt(payload.iat)}`);
  if (typeof payload.nbf === "number")
    notes.push(`معتبر از (nbf): ${fmt(payload.nbf)}`);
  if (typeof payload.exp === "number") {
    const expired = payload.exp * 1000 < Date.now();
    notes.push(
      `انقضا (exp): ${fmt(payload.exp)} ${expired ? "— منقضی شده ⚠" : "— معتبر ✓"}`,
    );
  }
  return notes;
}

export default function JwtDecoderTool() {
  const [token, setToken] = useState("");

  const result = useMemo(() => {
    const t = token.trim();
    if (!t) return null;
    const parts = t.split(".");
    if (parts.length < 2)
      return { error: "این یک JWT معتبر نیست (باید حداقل دو بخش جداشده با نقطه باشد)." };
    try {
      const header = pretty(b64urlDecode(parts[0]));
      const payloadRaw = b64urlDecode(parts[1]);
      const payload = pretty(payloadRaw);
      const notes = timeNote(JSON.parse(payloadRaw));
      return { header, payload, signature: parts[2] ?? "", notes };
    } catch {
      return { error: "رمزگشایی ناموفق بود؛ ساختار توکن را بررسی کنید." };
    }
  }, [token]);

  return (
    <div className="space-y-4">
      <Field label="توکن JWT">
        <TextArea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0In0.signature"
          className="min-h-28"
        />
      </Field>

      {result?.error && <ErrorNote>{result.error}</ErrorNote>}

      {result && !result.error && (
        <>
          {result.notes && result.notes.length > 0 && (
            <Panel title="زمان‌ها">
              <ul className="space-y-1 text-sm text-muted">
                {result.notes.map((n, i) => (
                  <li key={i}>• {n}</li>
                ))}
              </ul>
            </Panel>
          )}
          <div className="grid gap-4 lg:grid-cols-2">
            <Output label="Header" value={result.header ?? ""} />
            <Output label="Payload" value={result.payload ?? ""} />
          </div>
          <Field
            label="امضا (Signature)"
            hint="بدون کلید قابل راستی‌آزمایی نیست"
          >
            <TextArea
              readOnly
              value={result.signature ?? ""}
              className="min-h-16"
            />
          </Field>
        </>
      )}
    </div>
  );
}

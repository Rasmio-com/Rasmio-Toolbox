"use client";

import { useMemo, useState } from "react";
import { Field, TextArea } from "@/components/tool/kit";

interface Pattern {
  type: string;
  re: RegExp;
}

const PATTERNS: Pattern[] = [
  { type: "AWS Access Key", re: /\bAKIA[0-9A-Z]{16}\b/g },
  { type: "Google API Key", re: /\bAIza[0-9A-Za-z\-_]{35}\b/g },
  { type: "JWT", re: /\beyJ[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\b/g },
  {
    type: "PEM Private Key",
    re: /-----BEGIN (?:RSA |EC |OPENSSH |DSA |PGP )?PRIVATE KEY-----/g,
  },
  { type: "Slack Token", re: /\bxox[baprs]-[0-9A-Za-z-]{10,}\b/g },
  { type: "Hex Token (≥32)", re: /\b[0-9a-fA-F]{32,}\b/g },
  { type: "Base64 Token (≥40)", re: /\b[A-Za-z0-9+/]{40,}={0,2}\b/g },
];

function mask(value: string): string {
  const v = value.replace(/\s+/g, " ").trim();
  if (v.length <= 12) return v[0] + "•".repeat(Math.max(1, v.length - 2)) + v[v.length - 1];
  return `${v.slice(0, 6)}…${v.slice(-4)} (${v.length})`;
}

interface Finding {
  type: string;
  masked: string;
  key: string;
}

export default function SecretScannerTool() {
  const [text, setText] = useState("");

  const findings = useMemo(() => {
    if (!text) return [];
    const out: Finding[] = [];
    const seen = new Set<string>();
    for (const { type, re } of PATTERNS) {
      re.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = re.exec(text)) !== null) {
        const dedup = `${type}:${m[0]}`;
        if (seen.has(dedup)) continue;
        seen.add(dedup);
        out.push({ type, masked: mask(m[0]), key: dedup });
      }
    }
    return out;
  }, [text]);

  return (
    <div className="space-y-4">
      <Field label="متن برای اسکن" hint="هیچ داده‌ای از مرورگر شما خارج نمی‌شود">
        <TextArea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="کد، پیکربندی یا لاگ را اینجا بچسبانید…"
        />
      </Field>
      {text &&
        (findings.length === 0 ? (
          <p className="rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
            هیچ راز مشکوکی یافت نشد.
          </p>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-muted">
              {findings.length.toLocaleString("fa-IR")} مورد مشکوک یافت شد:
            </p>
            {findings.map((f) => (
              <div
                key={f.key}
                className="flex items-center justify-between gap-3 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2"
              >
                <span className="shrink-0 text-xs font-semibold text-danger">{f.type}</span>
                <code dir="ltr" className="truncate text-xs text-fg">
                  {f.masked}
                </code>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}

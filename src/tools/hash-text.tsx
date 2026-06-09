"use client";

import { useEffect, useState } from "react";
import { CopyButton, Field, TextArea } from "@/components/tool/kit";
import { md5 } from "@/lib/hash/md5";

const ALGOS: [string, "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512" | null][] = [
  ["MD5", null],
  ["SHA-1", "SHA-1"],
  ["SHA-256", "SHA-256"],
  ["SHA-384", "SHA-384"],
  ["SHA-512", "SHA-512"],
];

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

export default function HashTextTool() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<{ algo: string; value: string }[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!input) {
        setHashes([]);
        return;
      }
      const bytes = new TextEncoder().encode(input);
      const results = await Promise.all(
        ALGOS.map(async ([name, id]) => {
          if (id === null) return { algo: name, value: md5(bytes) };
          const buf = await crypto.subtle.digest(id, bytes);
          return { algo: name, value: toHex(buf) };
        }),
      );
      if (!cancelled) setHashes(results);
    })();
    return () => {
      cancelled = true;
    };
  }, [input]);

  return (
    <div className="space-y-4">
      <Field label="متن ورودی">
        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="متنی برای هش کردن وارد کنید…"
          className="min-h-28"
        />
      </Field>

      <div className="space-y-2">
        {hashes.map(({ algo, value }) => (
          <div
            key={algo}
            className="flex items-center gap-3 rounded-xl border border-border bg-bg-soft px-3 py-2.5"
          >
            <span className="w-20 shrink-0 font-mono text-xs font-semibold text-saffron">
              {algo}
            </span>
            <code
              dir="ltr"
              className="min-w-0 flex-1 truncate font-mono text-sm text-fg"
            >
              {value}
            </code>
            <CopyButton value={value} />
          </div>
        ))}
        {!input && (
          <p className="rounded-xl border border-dashed border-border bg-surface/30 px-4 py-8 text-center text-sm text-muted">
            هش‌ها (MD5، SHA-1، SHA-256، SHA-384، SHA-512) این‌جا نمایش داده می‌شوند.
          </p>
        )}
      </div>
    </div>
  );
}

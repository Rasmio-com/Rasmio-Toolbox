"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Button, CopyButton, ErrorNote, Stat } from "@/components/tool/kit";
import { formatBytes } from "@/lib/utils";

const ALGOS = ["SHA-1", "SHA-256", "SHA-512"] as const;

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

export default function FileHashTool() {
  const [name, setName] = useState("");
  const [size, setSize] = useState(0);
  const [hashes, setHashes] = useState<{ algo: string; value: string }[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr("");
    setName(file.name);
    setSize(file.size);
    setHashes([]);
    setBusy(true);
    try {
      const buf = await file.arrayBuffer();
      const results = await Promise.all(
        ALGOS.map(async (algo) => ({ algo, value: toHex(await crypto.subtle.digest(algo, buf)) })),
      );
      setHashes(results);
    } catch {
      setErr("محاسبه هش ناموفق بود.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary" onClick={() => fileRef.current?.click()}>
          <Upload className="size-4" />
          انتخاب فایل
        </Button>
        <input ref={fileRef} type="file" hidden onChange={onFile} />
        {name && (
          <span className="text-sm text-muted">
            <span className="font-mono text-fg" dir="ltr">
              {name}
            </span>
          </span>
        )}
      </div>

      {err && <ErrorNote>{err}</ErrorNote>}
      {busy && <p className="text-sm text-muted">در حال محاسبه…</p>}

      {!!size && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Stat label="حجم فایل" value={<span className="text-base">{formatBytes(size)}</span>} />
          <Stat label="بایت" value={<span className="text-base tabular-nums">{size}</span>} />
        </div>
      )}

      {hashes.length > 0 && (
        <div className="space-y-2">
          {hashes.map(({ algo, value }) => (
            <div
              key={algo}
              className="flex items-center gap-3 rounded-xl border border-border bg-bg-soft px-3 py-2.5"
            >
              <span className="w-20 shrink-0 font-mono text-xs font-semibold text-saffron">
                {algo}
              </span>
              <code dir="ltr" className="min-w-0 flex-1 truncate font-mono text-sm text-fg">
                {value}
              </code>
              <CopyButton value={value} />
            </div>
          ))}
        </div>
      )}

      {!name && !busy && (
        <p className="rounded-xl border border-dashed border-border bg-surface/30 px-4 py-8 text-center text-sm text-muted">
          فایلی را برای محاسبه هش‌های SHA-1، SHA-256 و SHA-512 انتخاب کنید.
        </p>
      )}
    </div>
  );
}

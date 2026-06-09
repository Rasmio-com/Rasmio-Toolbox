"use client";

import { useMemo, useState } from "react";
import { deflateSync, gunzipSync, gzipSync, inflateSync, strFromU8, strToU8 } from "fflate";
import { ErrorNote, Field, Output, Segmented, Select, Stat, TextArea } from "@/components/tool/kit";

function bytesToBase64(bytes: Uint8Array): string {
  let bin = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  return btoa(bin);
}

function base64ToBytes(s: string): Uint8Array {
  const raw = atob(s.trim().replace(/\s+/g, ""));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

export default function GzipTool() {
  const [mode, setMode] = useState<"compress" | "decompress">("compress");
  const [algo, setAlgo] = useState<"gzip" | "deflate">("gzip");
  const [input, setInput] = useState("");

  const { out, err, inSize, outSize } = useMemo(() => {
    if (!input.trim()) return { out: "", err: "", inSize: 0, outSize: 0 };
    try {
      if (mode === "compress") {
        const data = strToU8(input);
        const compressed = algo === "gzip" ? gzipSync(data) : deflateSync(data);
        return { out: bytesToBase64(compressed), err: "", inSize: data.length, outSize: compressed.length };
      }
      const bytes = base64ToBytes(input);
      const result = algo === "gzip" ? gunzipSync(bytes) : inflateSync(bytes);
      return { out: strFromU8(result), err: "", inSize: bytes.length, outSize: result.length };
    } catch (e) {
      return { out: "", err: `عملیات ناموفق بود: ${(e as Error).message}`, inSize: 0, outSize: 0 };
    }
  }, [input, mode, algo]);

  const ratio =
    mode === "compress" && inSize > 0 ? `${((1 - outSize / inSize) * 100).toFixed(1)}٪` : "—";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: "compress", label: "فشرده‌سازی" },
            { value: "decompress", label: "بازگشایی" },
          ]}
        />
        <label className="flex items-center gap-2 text-sm text-muted">
          الگوریتم
          <Select
            value={algo}
            onChange={(e) => setAlgo(e.target.value as "gzip" | "deflate")}
            className="w-32"
          >
            <option value="gzip">Gzip</option>
            <option value="deflate">Deflate</option>
          </Select>
        </label>
      </div>

      <Field label={mode === "compress" ? "متن ورودی" : "Base64 ورودی"}>
        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          dir="ltr"
          placeholder={mode === "compress" ? "متن برای فشرده‌سازی…" : "H4sIA…"}
          className="min-h-32"
        />
      </Field>

      {err && <ErrorNote>{err}</ErrorNote>}

      {!err && !!inSize && (
        <div className="grid grid-cols-3 gap-3">
          <Stat label="ورودی (بایت)" value={<span className="text-base tabular-nums">{inSize}</span>} />
          <Stat label="خروجی (بایت)" value={<span className="text-base tabular-nums">{outSize}</span>} />
          <Stat label="کاهش حجم" value={<span className="text-base">{ratio}</span>} />
        </div>
      )}

      <Output
        label={mode === "compress" ? "Base64 خروجی" : "متن خروجی"}
        value={out}
        download={out ? { filename: mode === "compress" ? "compressed.txt" : "decompressed.txt" } : undefined}
      />
    </div>
  );
}

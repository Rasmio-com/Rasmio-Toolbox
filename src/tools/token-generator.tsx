"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button, Field, Output, Select, TextInput } from "@/components/tool/kit";

type Format = "hex" | "base64url";

function toHex(bytes: Uint8Array): string {
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export default function TokenGeneratorTool() {
  const [format, setFormat] = useState<Format>("hex");
  const [byteLen, setByteLen] = useState(32);
  const [count, setCount] = useState(5);
  const [list, setList] = useState<string[]>([]);

  const gen = useCallback(() => {
    const len = Math.min(Math.max(byteLen, 1), 256);
    const n = Math.min(Math.max(count, 1), 500);
    setList(
      Array.from({ length: n }, () => {
        const bytes = new Uint8Array(len);
        crypto.getRandomValues(bytes);
        return format === "hex" ? toHex(bytes) : toBase64Url(bytes);
      }),
    );
  }, [format, byteLen, count]);

  useEffect(() => {
    gen();
  }, [gen]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
        <Field label="قالب خروجی" className="w-40">
          <Select value={format} onChange={(e) => setFormat(e.target.value as Format)}>
            <option value="hex">Hex</option>
            <option value="base64url">Base64URL</option>
          </Select>
        </Field>
        <Field label="تعداد بایت" hint="۱ تا ۲۵۶" className="w-32">
          <TextInput
            type="number"
            min={1}
            max={256}
            dir="ltr"
            value={byteLen}
            onChange={(e) => setByteLen(Number(e.target.value) || 1)}
          />
        </Field>
        <Field label="تعداد" hint="۱ تا ۵۰۰" className="w-32">
          <TextInput
            type="number"
            min={1}
            max={500}
            dir="ltr"
            value={count}
            onChange={(e) => setCount(Number(e.target.value) || 1)}
          />
        </Field>
        <Button variant="primary" onClick={gen} className="gap-1.5">
          <RefreshCw className="size-4" />
          تولید مجدد
        </Button>
      </div>
      <p className="text-xs text-muted">
        توکن‌ها با crypto.getRandomValues و آنتروپی واقعی تولید می‌شوند؛ {byteLen}
        {" "}بایت معادل {byteLen * 8} بیت آنتروپی است.
      </p>
      <Output
        label={`توکن (${list.length})`}
        value={list.join("\n")}
        className="min-h-56"
        download={{ filename: "tokens.txt" }}
      />
    </div>
  );
}

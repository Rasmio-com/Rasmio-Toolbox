"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button, Field, Output, TextInput } from "@/components/tool/kit";

// Crockford Base32 (no I, L, O, U)
const ENC = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

/** Encode the 48-bit timestamp (ms) as 10 Crockford Base32 chars. */
function encodeTime(ms: number): string {
  let out = "";
  for (let i = 0; i < 10; i++) {
    const mod = ms % 32;
    out = ENC[mod] + out;
    ms = (ms - mod) / 32;
  }
  return out;
}

/** Encode 80 bits (16 chars) of randomness using crypto.getRandomValues. */
function encodeRandom(): string {
  const bytes = new Uint8Array(10); // 80 bits
  crypto.getRandomValues(bytes);
  // Read the 80 bits as 16 groups of 5 bits, MSB first.
  let out = "";
  let bitBuf = 0;
  let bitCount = 0;
  for (let i = 0; i < bytes.length; i++) {
    bitBuf = (bitBuf << 8) | bytes[i];
    bitCount += 8;
    while (bitCount >= 5) {
      bitCount -= 5;
      out += ENC[(bitBuf >>> bitCount) & 31];
    }
  }
  return out;
}

function ulid(): string {
  return encodeTime(Date.now()) + encodeRandom();
}

export default function UlidTool() {
  const [count, setCount] = useState(5);
  const [list, setList] = useState<string[]>([]);

  const gen = useCallback(() => {
    const n = Math.min(Math.max(count, 1), 500);
    setList(Array.from({ length: n }, () => ulid()));
  }, [count]);

  useEffect(() => {
    gen();
  }, [gen]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
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
        هر ULID شامل ۴۸ بیت زمان (۱۰ نویسه) و ۸۰ بیت تصادفی (۱۶ نویسه) با کدگذاری
        Crockford Base32 است و بر اساس زمان مرتب‌پذیر می‌باشد.
      </p>
      <Output
        label={`ULID (${list.length})`}
        value={list.join("\n")}
        className="min-h-56"
        download={{ filename: "ulids.txt" }}
      />
    </div>
  );
}

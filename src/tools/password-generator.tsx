"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button, CopyButton, Field, Toggle } from "@/components/tool/kit";

const SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>?",
};
const AMBIGUOUS = /[Il1O0o]/g;

function randInt(max: number): number {
  const arr = new Uint32Array(1);
  const limit = Math.floor(0xffffffff / max) * max;
  let x: number;
  do {
    crypto.getRandomValues(arr);
    x = arr[0];
  } while (x >= limit);
  return x % max;
}

export default function PasswordGeneratorTool() {
  const [length, setLength] = useState(16);
  const [lower, setLower] = useState(true);
  const [upper, setUpper] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [noAmbiguous, setNoAmbiguous] = useState(false);
  const [pw, setPw] = useState("");

  const gen = useCallback(() => {
    let pool =
      (lower ? SETS.lower : "") +
      (upper ? SETS.upper : "") +
      (digits ? SETS.digits : "") +
      (symbols ? SETS.symbols : "");
    if (noAmbiguous) pool = pool.replace(AMBIGUOUS, "");
    if (!pool) {
      setPw("");
      return;
    }
    let out = "";
    for (let i = 0; i < length; i++) out += pool[randInt(pool.length)];
    setPw(out);
  }, [length, lower, upper, digits, symbols, noAmbiguous]);

  useEffect(() => {
    gen();
  }, [gen]);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-bg-soft p-4">
        <code dir="ltr" className="min-w-0 flex-1 break-all font-mono text-lg text-fg">
          {pw || "—"}
        </code>
        <CopyButton value={pw} />
        <Button variant="primary" onClick={gen} aria-label="تولید مجدد">
          <RefreshCw className="size-4" />
        </Button>
      </div>

      <Field label={`طول: ${length}`}>
        <input
          type="range"
          min={4}
          max={64}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full accent-turquoise"
        />
      </Field>

      <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
        <Toggle checked={lower} onChange={setLower} label="حروف کوچک (a-z)" />
        <Toggle checked={upper} onChange={setUpper} label="حروف بزرگ (A-Z)" />
        <Toggle checked={digits} onChange={setDigits} label="ارقام (0-9)" />
        <Toggle checked={symbols} onChange={setSymbols} label="نمادها (!@#)" />
        <Toggle checked={noAmbiguous} onChange={setNoAmbiguous} label="حذف مبهم‌ها" />
      </div>
    </div>
  );
}

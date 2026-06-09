"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button, ErrorNote, Field, Output, TextInput, Toggle } from "@/components/tool/kit";

const SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>?",
};

/** Unbiased random integer in [0, max) using crypto. */
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

export default function RandomStringTool() {
  const [length, setLength] = useState(24);
  const [count, setCount] = useState(5);
  const [lower, setLower] = useState(true);
  const [upper, setUpper] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const [list, setList] = useState<string[]>([]);
  const [err, setErr] = useState("");

  const gen = useCallback(() => {
    const pool =
      (lower ? SETS.lower : "") +
      (upper ? SETS.upper : "") +
      (digits ? SETS.digits : "") +
      (symbols ? SETS.symbols : "");
    if (!pool) {
      setErr("حداقل یک مجموعه نویسه را انتخاب کنید.");
      setList([]);
      return;
    }
    setErr("");
    const len = Math.min(Math.max(length, 1), 256);
    const n = Math.min(Math.max(count, 1), 500);
    setList(
      Array.from({ length: n }, () => {
        let s = "";
        for (let i = 0; i < len; i++) s += pool[randInt(pool.length)];
        return s;
      }),
    );
  }, [length, count, lower, upper, digits, symbols]);

  useEffect(() => {
    gen();
  }, [gen]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
        <Field label="طول" hint="۱ تا ۲۵۶" className="w-32">
          <TextInput
            type="number"
            min={1}
            max={256}
            dir="ltr"
            value={length}
            onChange={(e) => setLength(Number(e.target.value) || 1)}
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
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
        <Toggle checked={lower} onChange={setLower} label="حروف کوچک (a-z)" />
        <Toggle checked={upper} onChange={setUpper} label="حروف بزرگ (A-Z)" />
        <Toggle checked={digits} onChange={setDigits} label="ارقام (0-9)" />
        <Toggle checked={symbols} onChange={setSymbols} label="نمادها (!@#)" />
      </div>
      {err && <ErrorNote>{err}</ErrorNote>}
      <Output
        label={`رشته تصادفی (${list.length})`}
        value={list.join("\n")}
        className="min-h-48"
        download={{ filename: "random-strings.txt" }}
      />
    </div>
  );
}

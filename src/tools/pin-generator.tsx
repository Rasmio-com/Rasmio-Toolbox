"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button, Field, Output, TextInput, Toggle } from "@/components/tool/kit";

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

export default function PinGeneratorTool() {
  const [length, setLength] = useState(6);
  const [count, setCount] = useState(5);
  const [leadingZero, setLeadingZero] = useState(true);
  const [list, setList] = useState<string[]>([]);

  const gen = useCallback(() => {
    const len = Math.min(Math.max(length, 1), 32);
    const n = Math.min(Math.max(count, 1), 500);
    setList(
      Array.from({ length: n }, () => {
        let pin = "";
        for (let i = 0; i < len; i++) {
          // First digit must be 1-9 when leading zeros are disallowed.
          const d = i === 0 && !leadingZero ? randInt(9) + 1 : randInt(10);
          pin += String(d);
        }
        return pin;
      }),
    );
  }, [length, count, leadingZero]);

  useEffect(() => {
    gen();
  }, [gen]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
        <Field label="طول پین" hint="۱ تا ۳۲" className="w-32">
          <TextInput
            type="number"
            min={1}
            max={32}
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
        <Toggle
          checked={leadingZero}
          onChange={setLeadingZero}
          label="اجازه صفر ابتدایی"
        />
        <Button variant="primary" onClick={gen} className="gap-1.5">
          <RefreshCw className="size-4" />
          تولید مجدد
        </Button>
      </div>
      <Output
        label={`پین (${list.length})`}
        value={list.join("\n")}
        className="min-h-56"
        download={{ filename: "pins.txt" }}
      />
    </div>
  );
}

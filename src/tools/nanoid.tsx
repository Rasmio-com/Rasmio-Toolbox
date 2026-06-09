"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { nanoid } from "nanoid";
import { Button, Field, Output, TextInput } from "@/components/tool/kit";

export default function NanoidTool() {
  const [size, setSize] = useState(21);
  const [count, setCount] = useState(5);
  const [list, setList] = useState<string[]>([]);

  const gen = useCallback(() => {
    const s = Math.min(Math.max(size, 2), 256);
    const n = Math.min(Math.max(count, 1), 500);
    setList(Array.from({ length: n }, () => nanoid(s)));
  }, [size, count]);

  useEffect(() => {
    gen();
  }, [gen]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
        <Field label="طول هر شناسه" hint="۲ تا ۲۵۶" className="w-32">
          <TextInput
            type="number"
            min={2}
            max={256}
            dir="ltr"
            value={size}
            onChange={(e) => setSize(Number(e.target.value) || 21)}
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
      <Output
        label={`NanoID (${list.length})`}
        value={list.join("\n")}
        className="min-h-56"
        download={{ filename: "nanoids.txt" }}
      />
    </div>
  );
}

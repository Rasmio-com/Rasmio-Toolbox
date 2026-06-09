"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button, Field, Output, TextInput, Toggle } from "@/components/tool/kit";

export default function UuidTool() {
  const [count, setCount] = useState(5);
  const [dashes, setDashes] = useState(true);
  const [upper, setUpper] = useState(false);
  const [list, setList] = useState<string[]>([]);

  const gen = useCallback(() => {
    const n = Math.min(Math.max(count, 1), 200);
    setList(
      Array.from({ length: n }, () => {
        let u = crypto.randomUUID();
        if (!dashes) u = u.replace(/-/g, "");
        if (upper) u = u.toUpperCase();
        return u;
      }),
    );
  }, [count, dashes, upper]);

  useEffect(() => {
    gen();
  }, [gen]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
        <Field label="تعداد" className="w-28">
          <TextInput
            type="number"
            min={1}
            max={200}
            value={count}
            onChange={(e) => setCount(Number(e.target.value) || 1)}
          />
        </Field>
        <Toggle checked={dashes} onChange={setDashes} label="با خط تیره" />
        <Toggle checked={upper} onChange={setUpper} label="حروف بزرگ" />
        <Button variant="primary" onClick={gen} className="gap-1.5">
          <RefreshCw className="size-4" />
          تولید مجدد
        </Button>
      </div>
      <Output label={`UUID نسخه ۴ (${list.length})`} value={list.join("\n")} className="min-h-56" />
    </div>
  );
}

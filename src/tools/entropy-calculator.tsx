"use client";

import { useMemo, useState } from "react";
import { Field, Stat, TextArea } from "@/components/tool/kit";

export default function EntropyCalculatorTool() {
  const [text, setText] = useState("");

  const result = useMemo(() => {
    const chars = [...text];
    const n = chars.length;
    if (n === 0) return null;
    const freq = new Map<string, number>();
    for (const ch of chars) freq.set(ch, (freq.get(ch) ?? 0) + 1);
    let perChar = 0;
    for (const count of freq.values()) {
      const p = count / n;
      perChar -= p * Math.log2(p);
    }
    return {
      perChar,
      total: perChar * n,
      count: n,
      unique: freq.size,
    };
  }, [text]);

  return (
    <div className="space-y-4">
      <Field label="متن ورودی" hint="آنتروپی شانون بر اساس توزیع کاراکترها">
        <TextArea
          value={text}
          onChange={(e) => setText(e.target.value)}
          dir="auto"
          placeholder="متن یا رمز عبور را وارد کنید…"
          className="min-h-32"
        />
      </Field>
      {result && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="بیت بر کاراکتر" value={result.perChar.toFixed(2)} />
            <Stat label="کل بیت‌ها" value={result.total.toFixed(1)} />
            <Stat label="تعداد کاراکتر" value={result.count.toLocaleString("fa-IR")} />
            <Stat label="کاراکترهای یکتا" value={result.unique.toLocaleString("fa-IR")} />
          </div>
          <p className="text-xs text-faint">
            آنتروپی شانون میزان غیرقابل‌پیش‌بینی بودن داده را اندازه می‌گیرد؛ مقدار بیشتر به‌معنای
            تصادفی‌تر بودن است.
          </p>
        </>
      )}
    </div>
  );
}

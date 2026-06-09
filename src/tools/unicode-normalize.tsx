"use client";

import { useMemo, useState } from "react";
import { Field, Output, Select, Stat, TextArea } from "@/components/tool/kit";

type Form = "NFC" | "NFD" | "NFKC" | "NFKD";

export default function UnicodeNormalizeTool() {
  const [form, setForm] = useState<Form>("NFC");
  const [input, setInput] = useState("");

  const out = useMemo(() => (input ? input.normalize(form) : ""), [input, form]);

  return (
    <div className="space-y-4">
      <Field label="فرم نرمال‌سازی">
        <Select value={form} onChange={(e) => setForm(e.target.value as Form)}>
          <option value="NFC">NFC — ترکیبی متعارف</option>
          <option value="NFD">NFD — تجزیه‌ای متعارف</option>
          <option value="NFKC">NFKC — ترکیبی سازگار</option>
          <option value="NFKD">NFKD — تجزیه‌ای سازگار</option>
        </Select>
      </Field>
      <Field label="ورودی">
        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="café"
          dir="auto"
          className="min-h-28"
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Stat label="طول قبل (نقطه‌کد)" value={Array.from(input).length} />
        <Stat label="طول بعد (نقطه‌کد)" value={Array.from(out).length} />
      </div>
      <Output label="خروجی نرمال‌شده" value={out} />
    </div>
  );
}

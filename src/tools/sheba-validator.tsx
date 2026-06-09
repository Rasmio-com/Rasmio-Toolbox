"use client";

import { useMemo, useState } from "react";
import { CopyButton, Field, TextInput, Verdict } from "@/components/tool/kit";
import { formatSheba, shebaBank, shebaValid } from "@/lib/validators";

export default function ShebaValidatorTool() {
  const [value, setValue] = useState("");
  const res = useMemo(() => {
    const s = value.trim();
    if (!s) return null;
    return { valid: shebaValid(s), bank: shebaBank(s), formatted: formatSheba(s) };
  }, [value]);

  return (
    <div className="space-y-4">
      <Field label="شمارهٔ شبا / IBAN" hint="با یا بدون IR و فاصله">
        <TextInput
          mono
          dir="ltr"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="IR062960000000100324200001"
        />
      </Field>
      {res && (
        <Verdict valid={res.valid}>
          <div className="space-y-1">
            {res.bank && (
              <div>
                بانک: <span className="font-semibold">{res.bank}</span>
              </div>
            )}
            {res.valid && (
              <div className="flex items-center gap-2">
                <span dir="ltr" className="font-mono">
                  {res.formatted}
                </span>
                <CopyButton value={res.formatted.replace(/\s/g, "")} />
              </div>
            )}
            {!res.valid && "چک‌سام mod-97 یا قالب شبا نادرست است."}
          </div>
        </Verdict>
      )}
      <p className="text-xs text-faint">
        صحت چک‌سام و تشخیص بانک از روی کد سه‌رقمی انجام می‌شود؛ هیچ استعلامی به سرور
        ارسال نمی‌شود.
      </p>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { CopyButton, Field, TextInput, Verdict } from "@/components/tool/kit";
import { cardBank, cardValid, formatCard } from "@/lib/validators";
import { toAsciiDigits } from "@/lib/utils";

export default function BankCardTool() {
  const [value, setValue] = useState("");
  const res = useMemo(() => {
    const c = toAsciiDigits(value).replace(/\D/g, "");
    if (!c) return null;
    return { valid: cardValid(value), bank: cardBank(value), formatted: formatCard(value) };
  }, [value]);

  return (
    <div className="space-y-4">
      <Field label="شمارهٔ کارت بانکی (۱۶ رقم)">
        <TextInput
          mono
          dir="ltr"
          inputMode="numeric"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="6037-9912-3456-7890"
        />
      </Field>
      {res && (
        <Verdict valid={res.valid}>
          <div className="space-y-1">
            <div>
              بانک صادرکننده:{" "}
              <span className="font-semibold">{res.bank ?? "نامشخص"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span dir="ltr" className="font-mono">
                {res.formatted}
              </span>
              <CopyButton value={res.formatted.replace(/-/g, "")} />
            </div>
            {!res.valid && "شماره باید ۱۶ رقم و چک‌سام Luhn آن درست باشد."}
          </div>
        </Verdict>
      )}
      <p className="text-xs text-faint">
        صحت با الگوریتم Luhn و بانک از روی پیش‌شمارهٔ ۶ رقمی (BIN) تشخیص داده می‌شود.
        پردازش کاملاً در مرورگر است.
      </p>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Field, Panel, Stat, TextInput } from "@/components/tool/kit";
import { toAsciiDigits } from "@/lib/utils";

function luhnValid(num: string): boolean {
  let sum = 0;
  let dbl = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let d = num.charCodeAt(i) - 48;
    if (dbl) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
    dbl = !dbl;
  }
  return sum % 10 === 0;
}

function brand(num: string): string {
  if (/^4\d{12}(\d{3})?(\d{3})?$/.test(num)) return "Visa";
  if (/^(5[1-5]\d{14}|2(2[2-9]\d|[3-6]\d{2}|7[01]\d|720)\d{12})$/.test(num)) return "Mastercard";
  if (/^3[47]\d{13}$/.test(num)) return "American Express";
  if (/^(6011\d{12}|65\d{14}|64[4-9]\d{13}|622\d{13})$/.test(num)) return "Discover";
  if (/^3(0[0-5]|[68]\d)\d{11}$/.test(num)) return "Diners Club";
  if (/^35(2[89]|[3-8]\d)\d{12}$/.test(num)) return "JCB";
  if (/^(50|5[6-9]|6\d)\d{10,17}$/.test(num)) return "Maestro";
  if (/^62\d{14,17}$/.test(num)) return "UnionPay";
  return "نامشخص";
}

export default function CreditCardValidatorTool() {
  const [raw, setRaw] = useState("");

  const result = useMemo(() => {
    const num = toAsciiDigits(raw).replace(/[\s-]/g, "");
    if (!num) return null;
    if (!/^\d+$/.test(num)) return { error: "فقط ارقام، فاصله یا خط تیره مجاز است." };
    const ok = num.length >= 12 && num.length <= 19 && luhnValid(num);
    const isIranian = num.length === 16;
    return {
      num,
      ok,
      brand: brand(num),
      length: num.length,
      iranian: isIranian,
      grouped: num.replace(/(.{4})/g, "$1 ").trim(),
    };
  }, [raw]);

  return (
    <div className="space-y-4">
      <Field label="شمارهٔ کارت" hint="با یا بدون فاصله/خط تیره">
        <TextInput
          mono
          dir="ltr"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder="6037 9979 1234 5678"
        />
      </Field>

      {result && "error" in result && (
        <p className="text-sm text-danger">{result.error}</p>
      )}

      {result && !("error" in result) && (
        <Panel title={result.ok ? "کارت معتبر ✓" : "کارت نامعتبر ✗"}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat
              label="بررسی Luhn"
              value={result.ok ? <span className="text-success">معتبر</span> : <span className="text-danger">ناموفق</span>}
            />
            <Stat label="برند" value={<span className="text-base">{result.brand}</span>} />
            <Stat label="تعداد ارقام" value={result.length} />
            <Stat
              label="قالب کارت ایرانی"
              value={result.iranian ? "۱۶ رقمی ✓" : "—"}
            />
          </div>
          <p dir="ltr" className="mt-3 text-center font-mono text-lg tracking-wider text-fg">
            {result.grouped}
          </p>
        </Panel>
      )}

      {!result && (
        <p className="text-sm text-muted">یک شمارهٔ کارت وارد کنید تا اعتبار و برند آن بررسی شود.</p>
      )}
    </div>
  );
}

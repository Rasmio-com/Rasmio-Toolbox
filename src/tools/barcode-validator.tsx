"use client";

import { useMemo, useState } from "react";
import { Field, TextInput, Verdict } from "@/components/tool/kit";
import { barcodeType, barcodeValid } from "@/lib/validators";
import { toAsciiDigits } from "@/lib/utils";

export default function BarcodeValidatorTool() {
  const [value, setValue] = useState("");
  const res = useMemo(() => {
    const c = toAsciiDigits(value).replace(/\D/g, "");
    if (!c) return null;
    return { valid: barcodeValid(value), type: barcodeType(value) };
  }, [value]);

  return (
    <div className="space-y-4">
      <Field label="بارکد (EAN-8، UPC-A یا EAN-13)">
        <TextInput
          mono
          dir="ltr"
          inputMode="numeric"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="5901234123457"
        />
      </Field>
      {res && (
        <Verdict valid={res.valid}>
          <div className="space-y-1">
            <div>
              نوع: <span className="font-semibold">{res.type ?? "نامشخص (طول نامعتبر)"}</span>
            </div>
            {!res.valid && "رقم کنترل بارکد نادرست است یا طول آن ۸، ۱۲ یا ۱۳ نیست."}
          </div>
        </Verdict>
      )}
      <p className="text-xs text-faint">
        رقم کنترل با وزن‌دهی متناوب ۳ و ۱ از سمت راست محاسبه می‌شود.
      </p>
    </div>
  );
}

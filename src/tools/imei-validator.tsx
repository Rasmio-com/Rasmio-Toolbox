"use client";

import { useMemo, useState } from "react";
import { Field, TextInput, Verdict } from "@/components/tool/kit";
import { imeiValid } from "@/lib/validators";
import { toAsciiDigits } from "@/lib/utils";

export default function ImeiValidatorTool() {
  const [value, setValue] = useState("");
  const valid = useMemo(() => {
    const c = toAsciiDigits(value).replace(/\D/g, "");
    if (!c) return null;
    return imeiValid(value);
  }, [value]);

  return (
    <div className="space-y-4">
      <Field label="کد IMEI (۱۵ رقم)" hint="با شماره‌گیری *#06# قابل مشاهده است">
        <TextInput
          mono
          dir="ltr"
          inputMode="numeric"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="490154203237518"
        />
      </Field>
      <Verdict valid={valid}>
        {valid === false && "IMEI باید ۱۵ رقم و چک‌سام Luhn آن درست باشد."}
        {valid === true && "این IMEI از نظر چک‌سام Luhn معتبر است."}
      </Verdict>
    </div>
  );
}

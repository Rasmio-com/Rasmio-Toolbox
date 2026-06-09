"use client";

import { useMemo, useState } from "react";
import { Field, TextInput, Verdict } from "@/components/tool/kit";
import { nationalCodeValid } from "@/lib/validators";
import { toAsciiDigits } from "@/lib/utils";

export default function NationalCodeTool() {
  const [value, setValue] = useState("");
  const valid = useMemo(() => {
    const c = toAsciiDigits(value).replace(/\D/g, "");
    if (!c) return null;
    return nationalCodeValid(value);
  }, [value]);

  return (
    <div className="space-y-4">
      <Field label="کد ملی (۱۰ رقم)" hint="ارقام فارسی هم پذیرفته می‌شود">
        <TextInput
          mono
          dir="ltr"
          inputMode="numeric"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="0012345678"
        />
      </Field>
      <Verdict valid={valid}>
        {valid === false && "رقم کنترل با الگوریتم کد ملی هم‌خوانی ندارد."}
        {valid === true && "این کد ملی از نظر ساختار و رقم کنترل معتبر است."}
      </Verdict>
      <p className="text-xs text-faint">
        اعتبار ساختاری بررسی می‌شود؛ تخصیص واقعی کد به یک شخص تأیید نمی‌شود. همه‌چیز
        در مرورگر شما انجام می‌شود.
      </p>
    </div>
  );
}

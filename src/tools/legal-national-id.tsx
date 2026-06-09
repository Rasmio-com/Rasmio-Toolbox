"use client";

import { useMemo, useState } from "react";
import { Field, TextInput, Verdict } from "@/components/tool/kit";
import { legalIdValid } from "@/lib/validators";
import { toAsciiDigits } from "@/lib/utils";

export default function LegalNationalIdTool() {
  const [value, setValue] = useState("");
  const valid = useMemo(() => {
    const c = toAsciiDigits(value).replace(/\D/g, "");
    if (!c) return null;
    return legalIdValid(value);
  }, [value]);

  return (
    <div className="space-y-4">
      <Field label="شناسهٔ ملی اشخاص حقوقی (۱۱ رقم)">
        <TextInput
          mono
          dir="ltr"
          inputMode="numeric"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="10380284000"
        />
      </Field>
      <Verdict valid={valid}>
        {valid === false && "رقم کنترل با الگوریتم شناسهٔ ملی هم‌خوانی ندارد."}
        {valid === true && "این شناسهٔ ملی از نظر ساختار و رقم کنترل معتبر است."}
      </Verdict>
      <p className="text-xs text-faint">
        فقط صحت ساختاری بررسی می‌شود؛ ثبت واقعی شرکت راستی‌آزمایی نمی‌شود.
      </p>
    </div>
  );
}

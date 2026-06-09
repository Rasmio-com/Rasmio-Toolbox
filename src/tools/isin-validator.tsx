"use client";

import { useMemo, useState } from "react";
import { Field, TextInput, Verdict } from "@/components/tool/kit";
import { isinValid } from "@/lib/validators";

export default function IsinValidatorTool() {
  const [value, setValue] = useState("");
  const valid = useMemo(() => {
    const s = value.trim();
    if (!s) return null;
    return isinValid(s);
  }, [value]);

  return (
    <div className="space-y-4">
      <Field label="کد ISIN (۱۲ نویسه)" hint="۲ حرف کشور + ۹ نویسه + ۱ رقم کنترل">
        <TextInput
          value={value}
          onChange={(e) => setValue(e.target.value.toUpperCase())}
          dir="ltr"
          mono
          placeholder="US0378331005"
        />
      </Field>
      <Verdict valid={valid}>
        {valid === false && "قالب یا رقم کنترل ISIN (Luhn) نادرست است."}
        {valid === true && "این ISIN از نظر قالب و رقم کنترل معتبر است."}
      </Verdict>
    </div>
  );
}

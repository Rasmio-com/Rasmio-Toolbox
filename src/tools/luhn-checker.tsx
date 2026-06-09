"use client";

import { useMemo, useState } from "react";
import { CopyButton, Field, Grid2, Panel, Segmented, Stat, TextInput } from "@/components/tool/kit";
import { toAsciiDigits } from "@/lib/utils";

// Luhn sum where `partial` is true if a check digit will be appended (offset parity).
function luhnSum(digits: string, partial: boolean): number {
  let sum = 0;
  let dbl = partial;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits.charCodeAt(i) - 48;
    if (dbl) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
    dbl = !dbl;
  }
  return sum;
}

export default function LuhnCheckerTool() {
  const [mode, setMode] = useState<"validate" | "generate">("validate");
  const [raw, setRaw] = useState("");

  const num = useMemo(() => toAsciiDigits(raw).replace(/[\s-]/g, ""), [raw]);
  const bad = num !== "" && !/^\d+$/.test(num);

  const validation = useMemo(() => {
    if (mode !== "validate" || !num || bad) return null;
    return luhnSum(num, false) % 10 === 0;
  }, [mode, num, bad]);

  const generated = useMemo(() => {
    if (mode !== "generate" || !num || bad) return null;
    const checkDigit = (10 - (luhnSum(num, true) % 10)) % 10;
    return { checkDigit, full: num + checkDigit };
  }, [mode, num, bad]);

  return (
    <div className="space-y-4">
      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: "validate", label: "اعتبارسنجی" },
          { value: "generate", label: "محاسبهٔ رقم کنترلی" },
        ]}
      />

      <Field
        label={mode === "validate" ? "عدد کامل (با رقم کنترلی)" : "عدد ناقص (بدون رقم کنترلی)"}
        hint="فقط ارقام"
      >
        <TextInput
          mono
          dir="ltr"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder={mode === "validate" ? "79927398713" : "7992739871"}
        />
      </Field>

      {bad && <p className="text-sm text-danger">فقط ارقام، فاصله یا خط تیره مجاز است.</p>}

      {validation !== null && (
        <Panel title={validation ? "معتبر ✓" : "نامعتبر ✗"}>
          <Grid2>
            <Stat
              label="نتیجهٔ Luhn"
              value={validation ? <span className="text-success">معتبر</span> : <span className="text-danger">ناموفق</span>}
            />
            <Stat label="تعداد ارقام" value={num.length} />
          </Grid2>
        </Panel>
      )}

      {generated && (
        <Panel title="رقم کنترلی محاسبه شد">
          <div className="grid grid-cols-2 gap-3">
            <Stat label="رقم کنترلی" value={generated.checkDigit} />
            <Stat label="تعداد ارقام نهایی" value={generated.full.length} />
          </div>
          <Field label="عدد کامل" className="mt-3">
            <div className="flex items-center gap-2">
              <TextInput mono dir="ltr" readOnly value={generated.full} />
              <CopyButton value={generated.full} />
            </div>
          </Field>
        </Panel>
      )}

      {!num && !bad && (
        <p className="text-sm text-muted">
          {mode === "validate"
            ? "یک عدد وارد کنید تا با الگوریتم Luhn بررسی شود."
            : "یک عدد ناقص وارد کنید تا رقم کنترلی آن محاسبه شود."}
        </p>
      )}
    </div>
  );
}

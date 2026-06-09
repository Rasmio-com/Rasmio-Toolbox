"use client";

import { useMemo, useState } from "react";
import { Field, Panel, Stat, TextInput } from "@/components/tool/kit";

// Country code → total IBAN length and Persian country name.
const COUNTRIES: Record<string, { len: number; name: string }> = {
  IR: { len: 26, name: "ایران" }, DE: { len: 22, name: "آلمان" }, GB: { len: 22, name: "بریتانیا" },
  FR: { len: 27, name: "فرانسه" }, IT: { len: 27, name: "ایتالیا" }, ES: { len: 24, name: "اسپانیا" },
  NL: { len: 18, name: "هلند" }, BE: { len: 16, name: "بلژیک" }, CH: { len: 21, name: "سوئیس" },
  AT: { len: 20, name: "اتریش" }, SE: { len: 24, name: "سوئد" }, NO: { len: 15, name: "نروژ" },
  DK: { len: 18, name: "دانمارک" }, FI: { len: 18, name: "فنلاند" }, PL: { len: 28, name: "لهستان" },
  PT: { len: 25, name: "پرتغال" }, IE: { len: 22, name: "ایرلند" }, TR: { len: 26, name: "ترکیه" },
  AE: { len: 23, name: "امارات" }, SA: { len: 24, name: "عربستان" }, QA: { len: 29, name: "قطر" },
  KW: { len: 30, name: "کویت" }, LU: { len: 20, name: "لوکزامبورگ" }, GR: { len: 27, name: "یونان" },
};

// mod-97 over a long numeric string, computed in chunks.
function mod97(s: string): number {
  let rem = 0;
  for (let i = 0; i < s.length; i += 7) {
    rem = Number(String(rem) + s.slice(i, i + 7)) % 97;
  }
  return rem;
}

function validate(input: string) {
  const iban = input.replace(/\s+/g, "").toUpperCase();
  if (!iban) return null;
  if (!/^[A-Z0-9]+$/.test(iban)) return { iban, error: "فقط حروف و ارقام لاتین مجاز است." };
  if (!/^[A-Z]{2}\d{2}/.test(iban)) return { iban, error: "باید با دو حرف کد کشور و دو رقم کنترلی شروع شود." };

  const cc = iban.slice(0, 2);
  const info = COUNTRIES[cc];
  if (info && iban.length !== info.len)
    return { iban, country: info.name, cc, error: `طول IBAN برای ${info.name} باید ${info.len} نویسه باشد (فعلی: ${iban.length}).` };
  if (iban.length < 15 || iban.length > 34)
    return { iban, error: "طول IBAN باید بین ۱۵ تا ۳۴ نویسه باشد." };

  // Move first 4 chars to the end, then convert letters A=10..Z=35.
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  const numeric = rearranged.replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));
  const ok = mod97(numeric) === 1;

  return {
    iban,
    cc,
    country: info?.name ?? "نامشخص",
    ok,
    formatted: iban.replace(/(.{4})/g, "$1 ").trim(),
  };
}

export default function IbanValidatorTool() {
  const [raw, setRaw] = useState("");
  const r = useMemo(() => validate(raw), [raw]);

  return (
    <div className="space-y-4">
      <Field label="شماره IBAN / شبا" hint="مثلاً IR06 0120 0000 ...">
        <TextInput
          mono
          dir="ltr"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder="DE89 3704 0044 0532 0130 00"
        />
      </Field>

      {r && "error" in r && <p dir="auto" className="text-sm text-danger">{r.error}</p>}

      {r && !("error" in r) && (
        <Panel title={r.ok ? "IBAN معتبر ✓" : "IBAN نامعتبر ✗"}>
          <div className="grid grid-cols-2 gap-3">
            <Stat
              label="چک‌سام mod-97"
              value={r.ok ? <span className="text-success">معتبر</span> : <span className="text-danger">ناموفق</span>}
            />
            <Stat label="کشور" value={<span className="text-base">{r.country} ({r.cc})</span>} />
          </div>
          <p dir="ltr" className="mt-3 text-center font-mono text-base tracking-wide text-fg break-all">
            {r.formatted}
          </p>
        </Panel>
      )}

      {!r && <p className="text-sm text-muted">یک شماره IBAN وارد کنید تا صحت آن بررسی شود.</p>}
    </div>
  );
}

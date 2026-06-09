"use client";

import { useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { ErrorNote, Field, TextInput } from "@/components/tool/kit";
import { toAsciiDigits } from "@/lib/utils";

function isIPv4(s: string): boolean {
  const parts = s.split(".");
  if (parts.length !== 4) return false;
  return parts.every((p) => {
    if (!/^\d{1,3}$/.test(p)) return false;
    if (p.length > 1 && p[0] === "0") return false; // no leading zeros
    const n = Number(p);
    return n >= 0 && n <= 255;
  });
}

function isIPv6(s: string): boolean {
  if (s.indexOf("::") !== s.lastIndexOf("::")) return false; // at most one ::
  const hasDouble = s.includes("::");
  let groups = s.split(":");
  // handle leading/trailing :: producing empty edge groups
  if (hasDouble) {
    groups = groups.filter((g, i) => !(g === "" && i !== 0 && i !== groups.length - 1));
    if (groups[0] === "") groups = groups.slice(1);
    if (groups[groups.length - 1] === "") groups = groups.slice(0, -1);
  }
  // an embedded IPv4 in the last group counts as two groups
  let count = 0;
  for (let i = 0; i < groups.length; i++) {
    const g = groups[i];
    if (g.includes(".")) {
      if (i !== groups.length - 1 || !isIPv4(g)) return false;
      count += 2;
      continue;
    }
    if (!/^[0-9a-fA-F]{1,4}$/.test(g)) return false;
    count += 1;
  }
  return hasDouble ? count <= 7 : count === 8;
}

export default function IpValidatorTool() {
  const [input, setInput] = useState<string>("");

  const result = useMemo(() => {
    const s = toAsciiDigits(input.trim());
    if (!s) return null;
    if (isIPv4(s)) return { ok: true, version: "IPv4", note: "آدرس IPv4 معتبر (۳۲ بیت)." };
    if (isIPv6(s)) return { ok: true, version: "IPv6", note: "آدرس IPv6 معتبر (۱۲۸ بیت)." };
    return { ok: false, version: "—", note: "این رشته یک آدرس IPv4 یا IPv6 معتبر نیست." };
  }, [input]);

  return (
    <div className="space-y-4">
      <Field label="آدرس IP">
        <TextInput
          mono
          dir="ltr"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="192.168.1.1 یا 2001:db8::1"
        />
      </Field>
      {result && result.ok && (
        <div className="flex items-center gap-3 rounded-xl border border-success/40 bg-success/10 px-4 py-3 text-success">
          <CheckCircle2 className="size-5 shrink-0" />
          <div>
            <div className="font-semibold">معتبر · {result.version}</div>
            <div className="text-sm text-muted">{result.note}</div>
          </div>
        </div>
      )}
      {result && !result.ok && <ErrorNote>{result.note}</ErrorNote>}
      {!result && (
        <p className="text-sm text-muted">یک آدرس IP وارد کنید تا نسخهٔ آن تشخیص داده شود.</p>
      )}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { CopyButton, ErrorNote, Field, Stat, TextInput } from "@/components/tool/kit";
import { toAsciiDigits } from "@/lib/utils";

/** Parse an IPv6 string into eight 16-bit groups, or null if invalid. */
function parseIPv6(s: string): number[] | null {
  if (s.indexOf("::") !== s.lastIndexOf("::")) return null;
  const dbl = s.includes("::");
  let head: string[] = [];
  let tail: string[] = [];
  if (dbl) {
    const [h, t] = s.split("::");
    head = h ? h.split(":") : [];
    tail = t ? t.split(":") : [];
  } else {
    head = s.split(":");
  }
  const expand = (g: string[]) => g.filter((x) => x !== "");
  head = expand(head);
  tail = expand(tail);
  const all = [...head, ...tail];
  const groups: number[] = [];
  for (let i = 0; i < all.length; i++) {
    const g = all[i];
    if (!/^[0-9a-fA-F]{1,4}$/.test(g)) return null;
    groups.push(parseInt(g, 16));
  }
  if (dbl) {
    if (groups.length > 8) return null;
    const zeros = new Array(8 - groups.length).fill(0);
    return [...head.map((g) => parseInt(g, 16)), ...zeros, ...tail.map((g) => parseInt(g, 16))];
  }
  return groups.length === 8 ? groups : null;
}

function expandFull(groups: number[]): string {
  return groups.map((g) => g.toString(16).padStart(4, "0")).join(":");
}

/** RFC 5952 compression. */
function compress(groups: number[]): string {
  let bestStart = -1;
  let bestLen = 0;
  let curStart = -1;
  let curLen = 0;
  for (let i = 0; i < 8; i++) {
    if (groups[i] === 0) {
      if (curStart === -1) curStart = i;
      curLen++;
      if (curLen > bestLen) {
        bestLen = curLen;
        bestStart = curStart;
      }
    } else {
      curStart = -1;
      curLen = 0;
    }
  }
  const parts = groups.map((g) => g.toString(16));
  if (bestLen < 2) return parts.join(":");
  const before = parts.slice(0, bestStart);
  const after = parts.slice(bestStart + bestLen);
  return `${before.join(":")}::${after.join(":")}`;
}

export default function Ipv6CidrTool() {
  const [input, setInput] = useState<string>("");

  const { full, comp, prefix, count, err } = useMemo(() => {
    const raw = toAsciiDigits(input.trim());
    if (!raw) return { full: "", comp: "", prefix: "", count: "", err: "" };
    let addr = raw;
    let pfx = 128;
    if (raw.includes("/")) {
      const [a, b] = raw.split("/");
      addr = a;
      const n = Number(toAsciiDigits(b.trim()));
      if (!/^\d{1,3}$/.test(toAsciiDigits(b.trim())) || n < 0 || n > 128)
        return { full: "", comp: "", prefix: "", count: "", err: "پیشوند IPv6 باید بین ۰ تا ۱۲۸ باشد." };
      pfx = n;
    }
    const groups = parseIPv6(addr);
    if (!groups) return { full: "", comp: "", prefix: "", count: "", err: "آدرس IPv6 نامعتبر است." };
    const total = 1n << BigInt(128 - pfx);
    return {
      full: expandFull(groups),
      comp: compress(groups),
      prefix: `/${pfx}`,
      count: total.toLocaleString("en-US"),
      err: "",
    };
  }, [input]);

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-bg-soft px-3 py-2.5">
      <span className="w-40 shrink-0 text-xs text-saffron">{label}</span>
      <code dir="ltr" className="min-w-0 flex-1 truncate font-mono text-sm text-fg">
        {value}
      </code>
      <CopyButton value={value} />
    </div>
  );

  return (
    <div className="space-y-4">
      <Field label="آدرس IPv6 یا IPv6/prefix" hint="مثلاً 2001:db8::1/64">
        <TextInput
          mono
          dir="ltr"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="2001:db8::1/64"
        />
      </Field>
      {err && <ErrorNote>{err}</ErrorNote>}
      {full && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="پیشوند" value={prefix} />
            <Stat
              label="تعداد آدرس‌ها (۲ به توان ۱۲۸ منهای prefix)"
              value={<span className="text-sm break-all">{count}</span>}
            />
          </div>
          <div className="space-y-2">
            <Row label="فرم کامل (Expanded)" value={full} />
            <Row label="فرم فشرده (Compressed)" value={comp} />
          </div>
        </>
      )}
    </div>
  );
}

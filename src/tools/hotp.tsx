"use client";

import { useEffect, useState } from "react";
import { ErrorNote, Field, Stat, TextInput } from "@/components/tool/kit";
import { toAsciiDigits } from "@/lib/utils";

const B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function base32Decode(input: string): Uint8Array {
  const clean = input.toUpperCase().replace(/=+$/, "").replace(/\s/g, "");
  let bits = "";
  for (const ch of clean) {
    const idx = B32.indexOf(ch);
    if (idx < 0) throw new Error("invalid base32");
    bits += idx.toString(2).padStart(5, "0");
  }
  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }
  return new Uint8Array(bytes);
}

async function hotp(secret: Uint8Array, counter: number, digits: number): Promise<string> {
  const buf = new ArrayBuffer(8);
  const view = new DataView(buf);
  view.setUint32(0, Math.floor(counter / 2 ** 32));
  view.setUint32(4, counter >>> 0);
  const key = await crypto.subtle.importKey(
    "raw",
    secret as BufferSource,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"],
  );
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, buf));
  const offset = sig[sig.length - 1] & 0x0f;
  const code =
    ((sig[offset] & 0x7f) << 24) |
    ((sig[offset + 1] & 0xff) << 16) |
    ((sig[offset + 2] & 0xff) << 8) |
    (sig[offset + 3] & 0xff);
  return (code % 10 ** digits).toString().padStart(digits, "0");
}

export default function HotpTool() {
  const [secret, setSecret] = useState("JBSWY3DPEHPK3PXP");
  const [counter, setCounter] = useState("0");
  const [digits, setDigits] = useState("6");
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setErr("");
      const c = parseInt(toAsciiDigits(counter), 10);
      const d = parseInt(toAsciiDigits(digits), 10) || 6;
      if (!secret.trim() || isNaN(c) || c < 0) {
        setCode("");
        return;
      }
      try {
        const key = base32Decode(secret);
        if (key.length === 0) throw new Error("empty");
        const result = await hotp(key, c, d);
        if (!cancelled) setCode(result);
      } catch {
        if (!cancelled) {
          setCode("");
          setErr("راز Base32 نامعتبر است.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [secret, counter, digits]);

  return (
    <div className="space-y-4">
      <Field label="راز (Base32)">
        <TextInput
          mono
          dir="ltr"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder="JBSWY3DPEHPK3PXP"
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="شمارنده (Counter)">
          <TextInput
            mono
            dir="ltr"
            inputMode="numeric"
            value={counter}
            onChange={(e) => setCounter(e.target.value)}
          />
        </Field>
        <Field label="تعداد رقم">
          <TextInput
            mono
            dir="ltr"
            inputMode="numeric"
            value={digits}
            onChange={(e) => setDigits(e.target.value)}
          />
        </Field>
      </div>
      <Stat
        label="کد HOTP"
        value={<span dir="ltr" className="tracking-widest">{code || "—"}</span>}
      />
      {err && <ErrorNote>{err}</ErrorNote>}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { ErrorNote, Field, Grid2, Output, Select, TextInput } from "@/components/tool/kit";
import { toAsciiDigits } from "@/lib/utils";

type Hash = "SHA-1" | "SHA-256" | "SHA-512";

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

export default function Pbkdf2Tool() {
  const [password, setPassword] = useState("");
  const [salt, setSalt] = useState("");
  const [iterations, setIterations] = useState("100000");
  const [hash, setHash] = useState<Hash>("SHA-256");
  const [keyLen, setKeyLen] = useState("32");
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setErr("");
      const iter = parseInt(toAsciiDigits(iterations), 10);
      const bytes = parseInt(toAsciiDigits(keyLen), 10);
      if (!password || !salt) return setOut("");
      if (!iter || iter < 1 || !bytes || bytes < 1 || bytes > 256) {
        setOut("");
        return setErr("تعداد تکرار و طول کلید باید معتبر باشند (طول کلید ۱ تا ۲۵۶ بایت).");
      }
      try {
        const enc = new TextEncoder();
        const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, [
          "deriveBits",
        ]);
        const bits = await crypto.subtle.deriveBits(
          { name: "PBKDF2", salt: enc.encode(salt), iterations: iter, hash },
          key,
          bytes * 8,
        );
        if (!cancelled) setOut(toHex(bits));
      } catch {
        if (!cancelled) setErr("مشتق‌گیری کلید ناموفق بود.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [password, salt, iterations, hash, keyLen]);

  return (
    <div className="space-y-4">
      <Grid2>
        <Field label="رمز عبور">
          <TextInput
            mono
            dir="ltr"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="my-password"
          />
        </Field>
        <Field label="نمک (Salt)">
          <TextInput
            mono
            dir="ltr"
            value={salt}
            onChange={(e) => setSalt(e.target.value)}
            placeholder="random-salt"
          />
        </Field>
      </Grid2>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="تعداد تکرار">
          <TextInput
            mono
            dir="ltr"
            inputMode="numeric"
            value={iterations}
            onChange={(e) => setIterations(e.target.value)}
          />
        </Field>
        <Field label="الگوریتم هش">
          <Select value={hash} onChange={(e) => setHash(e.target.value as Hash)}>
            <option value="SHA-1">SHA-1</option>
            <option value="SHA-256">SHA-256</option>
            <option value="SHA-512">SHA-512</option>
          </Select>
        </Field>
        <Field label="طول کلید (بایت)">
          <TextInput
            mono
            dir="ltr"
            inputMode="numeric"
            value={keyLen}
            onChange={(e) => setKeyLen(e.target.value)}
          />
        </Field>
      </div>
      <Output label="کلید مشتق‌شده (Hex)" value={out} />
      {err && <ErrorNote>{err}</ErrorNote>}
    </div>
  );
}

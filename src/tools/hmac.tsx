"use client";

import { useEffect, useState } from "react";
import { ErrorNote, Field, Output, Select, TextArea, TextInput } from "@/components/tool/kit";

type Hash = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

export default function HmacTool() {
  const [message, setMessage] = useState("");
  const [secret, setSecret] = useState("");
  const [hash, setHash] = useState<Hash>("SHA-256");
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setErr("");
      if (!message || !secret) {
        setOut("");
        return;
      }
      try {
        const enc = new TextEncoder();
        const key = await crypto.subtle.importKey(
          "raw",
          enc.encode(secret),
          { name: "HMAC", hash },
          false,
          ["sign"],
        );
        const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
        if (!cancelled) setOut(toHex(sig));
      } catch {
        if (!cancelled) setErr("محاسبه‌ی HMAC ناموفق بود.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [message, secret, hash]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <Field label="کلید مخفی (Secret)">
          <TextInput
            mono
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="my-secret-key"
          />
        </Field>
        <Field label="الگوریتم" className="sm:w-44">
          <Select value={hash} onChange={(e) => setHash(e.target.value as Hash)}>
            <option value="SHA-1">SHA-1</option>
            <option value="SHA-256">SHA-256</option>
            <option value="SHA-384">SHA-384</option>
            <option value="SHA-512">SHA-512</option>
          </Select>
        </Field>
      </div>
      <Field label="پیام">
        <TextArea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="متن پیام…"
          className="min-h-28"
        />
      </Field>
      <Output label="HMAC (Hex)" value={out} />
      {err && <ErrorNote>{err}</ErrorNote>}
    </div>
  );
}

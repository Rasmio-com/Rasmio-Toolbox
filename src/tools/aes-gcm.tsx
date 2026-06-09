"use client";

import { useEffect, useState } from "react";
import { ErrorNote, Field, Grid2, Output, Segmented, TextArea, TextInput } from "@/components/tool/kit";

type Mode = "encrypt" | "decrypt";

const ITER = 150000;

function bytesToB64(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
}

function b64ToBytes(b64: string): Uint8Array {
  const s = atob(b64.trim());
  const out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
  return out;
}

async function deriveKey(passphrase: string, salt: BufferSource): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const base = await crypto.subtle.importKey("raw", enc.encode(passphrase), "PBKDF2", false, [
    "deriveKey",
  ]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: ITER, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export default function AesGcmTool() {
  const [mode, setMode] = useState<Mode>("encrypt");
  const [passphrase, setPassphrase] = useState("");
  const [input, setInput] = useState("");
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setErr("");
      if (!passphrase || !input) return setOut("");
      try {
        const enc = new TextEncoder();
        if (mode === "encrypt") {
          const salt = crypto.getRandomValues(new Uint8Array(16));
          const iv = crypto.getRandomValues(new Uint8Array(12));
          const key = await deriveKey(passphrase, salt);
          const ct = new Uint8Array(
            await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(input)),
          );
          const packed = new Uint8Array(salt.length + iv.length + ct.length);
          packed.set(salt, 0);
          packed.set(iv, salt.length);
          packed.set(ct, salt.length + iv.length);
          if (!cancelled) setOut(bytesToB64(packed));
        } else {
          const packed = b64ToBytes(input);
          if (packed.length < 28) throw new Error("short");
          const salt = packed.slice(0, 16);
          const iv = packed.slice(16, 28);
          const ct = packed.slice(28);
          const key = await deriveKey(passphrase, salt);
          const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
          if (!cancelled) setOut(new TextDecoder().decode(pt));
        }
      } catch {
        if (!cancelled) {
          setOut("");
          setErr(
            mode === "encrypt"
              ? "رمزنگاری ناموفق بود."
              : "رمزگشایی ناموفق بود؛ عبارت‌عبور یا داده نامعتبر است.",
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mode, passphrase, input]);

  return (
    <div className="space-y-4">
      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: "encrypt", label: "رمزنگاری" },
          { value: "decrypt", label: "رمزگشایی" },
        ]}
      />
      <Field label="عبارت‌عبور">
        <TextInput
          mono
          dir="ltr"
          type="password"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
          placeholder="passphrase"
        />
      </Field>
      <Grid2>
        <Field label={mode === "encrypt" ? "متن ساده" : "متن رمزشده (Base64)"}>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            dir={mode === "encrypt" ? "auto" : "ltr"}
            placeholder={mode === "encrypt" ? "متن محرمانه…" : "Base64…"}
          />
        </Field>
        <Output
          label={mode === "encrypt" ? "خروجی (Base64)" : "متن ساده"}
          value={out}
          mono={mode === "encrypt"}
        />
      </Grid2>
      {err && <ErrorNote>{err}</ErrorNote>}
      <p className="text-xs text-faint">
        کلید با PBKDF2 (SHA-256، {ITER.toLocaleString("fa-IR")} تکرار) از عبارت‌عبور ساخته می‌شود و
        خروجی شامل salt و IV است.
      </p>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import {
  ErrorNote,
  Field,
  Grid2,
  Output,
  Segmented,
  Select,
  TextArea,
} from "@/components/tool/kit";

type Scheme = "base32" | "base58" | "base85";

const B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

/* ── Base32 (RFC 4648) ─────────────────────────────────── */
function base32Encode(bytes: Uint8Array): string {
  let bits = 0;
  let value = 0;
  let out = "";
  for (const b of bytes) {
    value = (value << 8) | b;
    bits += 8;
    while (bits >= 5) {
      out += B32[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += B32[(value << (5 - bits)) & 31];
  while (out.length % 8) out += "=";
  return out;
}

function base32Decode(str: string): Uint8Array {
  const clean = str.replace(/=+$/, "").toUpperCase().replace(/\s+/g, "");
  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (const ch of clean) {
    const idx = B32.indexOf(ch);
    if (idx === -1) throw new Error("invalid");
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return new Uint8Array(out);
}

/* ── Base58 (Bitcoin) ──────────────────────────────────── */
function base58Encode(bytes: Uint8Array): string {
  if (bytes.length === 0) return "";
  const digits: number[] = [0];
  for (const b of bytes) {
    let carry = b;
    for (let i = 0; i < digits.length; i++) {
      carry += digits[i] << 8;
      digits[i] = carry % 58;
      carry = (carry / 58) | 0;
    }
    while (carry > 0) {
      digits.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }
  let out = "";
  for (let k = 0; bytes[k] === 0 && k < bytes.length - 1; k++) out += B58[0];
  for (let i = digits.length - 1; i >= 0; i--) out += B58[digits[i]];
  return out;
}

function base58Decode(str: string): Uint8Array {
  const s = str.trim();
  if (s.length === 0) return new Uint8Array();
  const bytes: number[] = [0];
  for (const ch of s) {
    const val = B58.indexOf(ch);
    if (val === -1) throw new Error("invalid");
    let carry = val;
    for (let i = 0; i < bytes.length; i++) {
      carry += bytes[i] * 58;
      bytes[i] = carry & 0xff;
      carry >>= 8;
    }
    while (carry > 0) {
      bytes.push(carry & 0xff);
      carry >>= 8;
    }
  }
  for (let k = 0; s[k] === B58[0] && k < s.length - 1; k++) bytes.push(0);
  return new Uint8Array(bytes.reverse());
}

/* ── Base85 (Ascii85) ──────────────────────────────────── */
function base85Encode(bytes: Uint8Array): string {
  let out = "";
  for (let i = 0; i < bytes.length; i += 4) {
    const chunk = bytes.subarray(i, i + 4);
    const pad = 4 - chunk.length;
    let n = 0;
    for (let j = 0; j < 4; j++) n = (n * 256 + (chunk[j] ?? 0)) >>> 0;
    if (pad === 4) break;
    if (n === 0 && pad === 0) {
      out += "z";
      continue;
    }
    const block: string[] = [];
    for (let j = 0; j < 5; j++) {
      block.unshift(String.fromCharCode((n % 85) + 33));
      n = Math.floor(n / 85);
    }
    out += block.join("").slice(0, 5 - pad);
  }
  return out;
}

function base85Decode(str: string): Uint8Array {
  const clean = str.replace(/^<~|~>$/g, "").replace(/\s+/g, "");
  const out: number[] = [];
  let i = 0;
  while (i < clean.length) {
    if (clean[i] === "z") {
      out.push(0, 0, 0, 0);
      i++;
      continue;
    }
    const block = clean.slice(i, i + 5);
    const pad = 5 - block.length;
    let n = 0;
    for (let j = 0; j < 5; j++) {
      const c = j < block.length ? block.charCodeAt(j) - 33 : 84;
      if (c < 0 || c > 84) throw new Error("invalid");
      n = n * 85 + c;
    }
    const bytes = [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff];
    for (let j = 0; j < 4 - pad; j++) out.push(bytes[j]);
    i += 5;
  }
  return new Uint8Array(out);
}

export default function BaseEncoderTool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [scheme, setScheme] = useState<Scheme>("base58");
  const [input, setInput] = useState("");

  const { out, err } = useMemo(() => {
    if (!input) return { out: "", err: "" };
    try {
      if (mode === "encode") {
        const bytes = new TextEncoder().encode(input);
        const out =
          scheme === "base32"
            ? base32Encode(bytes)
            : scheme === "base58"
              ? base58Encode(bytes)
              : base85Encode(bytes);
        return { out, err: "" };
      }
      const bytes =
        scheme === "base32"
          ? base32Decode(input)
          : scheme === "base58"
            ? base58Decode(input)
            : base85Decode(input);
      return { out: new TextDecoder().decode(bytes), err: "" };
    } catch {
      return { out: "", err: "ورودی برای این طرح نامعتبر است." };
    }
  }, [input, mode, scheme]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: "encode", label: "کدگذاری" },
            { value: "decode", label: "رمزگشایی" },
          ]}
        />
        <Field label="طرح">
          <Select value={scheme} onChange={(e) => setScheme(e.target.value as Scheme)}>
            <option value="base32">Base32 (RFC4648)</option>
            <option value="base58">Base58 (Bitcoin)</option>
            <option value="base85">Base85 (Ascii85)</option>
          </Select>
        </Field>
      </div>
      <Grid2>
        <Field label="ورودی">
          <TextArea value={input} onChange={(e) => setInput(e.target.value)} />
        </Field>
        <Output label="خروجی" value={out} />
      </Grid2>
      {err && <ErrorNote>{err}</ErrorNote>}
    </div>
  );
}

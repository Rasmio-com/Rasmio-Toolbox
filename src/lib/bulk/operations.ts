import { md5 } from "@/lib/hash/md5";
import { parseHex } from "@/lib/color";
import { toAsciiDigits } from "@/lib/utils";
import {
  barcodeValid,
  cardBank,
  cardValid,
  ibanValid,
  imeiValid,
  isinValid,
  legalIdValid,
  luhnValid,
  nationalCodeValid,
  shebaBank,
  shebaValid,
} from "@/lib/validators";

export interface BulkResult {
  ok: boolean;
  value: string;
}

export interface BulkOp {
  id: string;
  /** Source tool id this op corresponds to (for deep-links / pre-select). */
  toolId?: string;
  label: string;
  group: string;
  kind: "convert" | "validate";
  run: (line: string) => BulkResult | Promise<BulkResult>;
}

const enc = new TextEncoder();
const dec = new TextDecoder();
const okR = (value: string): BulkResult => ({ ok: true, value });
const vR = (valid: boolean, extra = ""): BulkResult => ({
  ok: valid,
  value: valid ? "معتبر" + extra : "نامعتبر",
});

/* ── convert helpers ─────────────────────────────────────── */
function b64encode(s: string): string {
  let bin = "";
  enc.encode(s).forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}
function b64decode(s: string): string {
  const bin = atob(s.replace(/\s/g, ""));
  return dec.decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}
function htmlEncode(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
function htmlDecode(s: string): string {
  const el = document.createElement("textarea");
  el.innerHTML = s;
  return el.value;
}
function hexEncode(s: string): string {
  return Array.from(enc.encode(s), (b) => b.toString(16).padStart(2, "0")).join("");
}
function hexDecode(s: string): string {
  const c = s.replace(/0x/gi, "").replace(/[^0-9a-f]/gi, "");
  if (c.length % 2) throw new Error("odd");
  const a = new Uint8Array(c.length / 2);
  for (let i = 0; i < a.length; i++) a[i] = parseInt(c.substr(i * 2, 2), 16);
  return dec.decode(a);
}
function binEncode(s: string): string {
  return Array.from(enc.encode(s), (b) => b.toString(2).padStart(8, "0")).join(" ");
}
function binDecode(s: string): string {
  const g = s.trim().split(/\s+/);
  const a = new Uint8Array(g.length);
  for (let i = 0; i < g.length; i++) {
    if (!/^[01]{1,8}$/.test(g[i])) throw new Error("bad");
    a[i] = parseInt(g[i], 2);
  }
  return dec.decode(a);
}
const rot13 = (s: string) =>
  s
    .replace(/[a-z]/g, (c) => String.fromCharCode(((c.charCodeAt(0) - 97 + 13) % 26) + 97))
    .replace(/[A-Z]/g, (c) => String.fromCharCode(((c.charCodeAt(0) - 65 + 13) % 26) + 65));
function slugify(s: string): string {
  const t = s
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/[\s\-_]+/g, " ")
    .replace(/[^a-z0-9؀-ۿ ]/gi, "");
  return t.trim().replace(/\s+/g, "-");
}
function parseInBase(input: string, base: number): bigint | null {
  let s = input.trim().toLowerCase().replace(/\s+/g, "");
  if (!s) return null;
  let neg = false;
  if (s[0] === "-") {
    neg = true;
    s = s.slice(1);
  }
  const digits = "0123456789abcdefghijklmnopqrstuvwxyz".slice(0, base);
  let val = 0n;
  for (const ch of s) {
    const d = digits.indexOf(ch);
    if (d < 0) return null;
    val = val * BigInt(base) + BigInt(d);
  }
  return neg ? -val : val;
}
function baseConv(s: string, from: number, to: number): string {
  const v = parseInBase(s, from);
  if (v === null) throw new Error("bad");
  return v.toString(to);
}
const ROMAN: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"],
  [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];
function toRoman(input: string): string {
  let n = Number(toAsciiDigits(input.trim()));
  if (!Number.isInteger(n) || n < 1 || n > 3999) throw new Error("range");
  let r = "";
  for (const [val, sym] of ROMAN)
    while (n >= val) {
      r += sym;
      n -= val;
    }
  return r;
}
function fromRoman(input: string): string {
  const s = input.trim().toUpperCase();
  const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let n = 0;
  let prev = 0;
  for (let i = s.length - 1; i >= 0; i--) {
    const c = map[s[i]];
    if (c == null) throw new Error("bad");
    if (c < prev) n -= c;
    else {
      n += c;
      prev = c;
    }
  }
  if (toRoman(String(n)) !== s) throw new Error("invalid");
  return String(n);
}
const FA = "۰۱۲۳۴۵۶۷۸۹";
const toFaDigits = (s: string) => s.replace(/[0-9]/g, (d) => FA[+d]);
function unixToDate(s: string): string {
  const n = Number(toAsciiDigits(s.trim()));
  if (!Number.isFinite(n)) throw new Error("nan");
  const ms = Math.abs(n) >= 1e12 ? n : n * 1000;
  const d = new Date(ms);
  if (isNaN(d.getTime())) throw new Error("date");
  return d.toISOString();
}
function hexToRgb(s: string): string {
  const rgb = parseHex(s.trim());
  if (!rgb) throw new Error("color");
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}
async function sha(algo: "SHA-1" | "SHA-256" | "SHA-512", s: string): Promise<string> {
  const buf = await crypto.subtle.digest(algo, enc.encode(s));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

/* ── validate helpers ────────────────────────────────────── */
const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RE_URL = /^https?:\/\/[^\s]+$/i;
const RE_DOMAIN = /^(?:[a-z0-9-]+\.)+[a-z]{2,}$/i;
const RE_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const RE_MAC = /^([0-9a-f]{2}[:-]){5}[0-9a-f]{2}$/i;
function ipv4Valid(s: string): boolean {
  const m = s.trim().match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  return !!m && m.slice(1).every((x) => +x <= 255);
}
function isbnValid(input: string): boolean {
  const c = input.replace(/[\s-]/g, "").toUpperCase();
  if (/^\d{9}[\dX]$/.test(c)) {
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += +c[i] * (10 - i);
    sum += c[9] === "X" ? 10 : +c[9];
    return sum % 11 === 0;
  }
  if (/^\d{13}$/.test(c)) {
    let sum = 0;
    for (let i = 0; i < 12; i++) sum += +c[i] * (i % 2 ? 3 : 1);
    return (10 - (sum % 10)) % 10 === +c[12];
  }
  return false;
}

/* ── operations registry ─────────────────────────────────── */
const G_ENC = "کدگذاری و رمزگشایی";
const G_HASH = "هش";
const G_TXT = "متن و عدد";
const G_VAL = "اعتبارسنجی";

export const BULK_OPS: BulkOp[] = [
  // Encoding
  { id: "base64-encode", toolId: "base64", label: "Base64 — کدگذاری", group: G_ENC, kind: "convert", run: (l) => okR(b64encode(l)) },
  { id: "base64-decode", toolId: "base64", label: "Base64 — رمزگشایی", group: G_ENC, kind: "convert", run: (l) => okR(b64decode(l)) },
  { id: "url-encode", toolId: "url-encode", label: "URL — کدگذاری", group: G_ENC, kind: "convert", run: (l) => okR(encodeURIComponent(l)) },
  { id: "url-decode", toolId: "url-encode", label: "URL — رمزگشایی", group: G_ENC, kind: "convert", run: (l) => okR(decodeURIComponent(l)) },
  { id: "html-encode", toolId: "html-entities", label: "HTML entity — کدگذاری", group: G_ENC, kind: "convert", run: (l) => okR(htmlEncode(l)) },
  { id: "html-decode", toolId: "html-entities", label: "HTML entity — رمزگشایی", group: G_ENC, kind: "convert", run: (l) => okR(htmlDecode(l)) },
  { id: "hex-encode", toolId: "hex-text", label: "Hex — کدگذاری", group: G_ENC, kind: "convert", run: (l) => okR(hexEncode(l)) },
  { id: "hex-decode", toolId: "hex-text", label: "Hex — رمزگشایی", group: G_ENC, kind: "convert", run: (l) => okR(hexDecode(l)) },
  { id: "binary-encode", toolId: "binary-text", label: "باینری — کدگذاری", group: G_ENC, kind: "convert", run: (l) => okR(binEncode(l)) },
  { id: "binary-decode", toolId: "binary-text", label: "باینری — رمزگشایی", group: G_ENC, kind: "convert", run: (l) => okR(binDecode(l)) },
  { id: "rot13", toolId: "caesar-cipher", label: "ROT13", group: G_ENC, kind: "convert", run: (l) => okR(rot13(l)) },

  // Hash
  { id: "md5", toolId: "hash-text", label: "MD5", group: G_HASH, kind: "convert", run: (l) => okR(md5(enc.encode(l))) },
  { id: "sha1", toolId: "hash-text", label: "SHA-1", group: G_HASH, kind: "convert", run: async (l) => okR(await sha("SHA-1", l)) },
  { id: "sha256", toolId: "hash-text", label: "SHA-256", group: G_HASH, kind: "convert", run: async (l) => okR(await sha("SHA-256", l)) },
  { id: "sha512", toolId: "hash-text", label: "SHA-512", group: G_HASH, kind: "convert", run: async (l) => okR(await sha("SHA-512", l)) },

  // Text & number
  { id: "slugify", toolId: "slug", label: "ساخت Slug", group: G_TXT, kind: "convert", run: (l) => okR(slugify(l)) },
  { id: "uppercase", toolId: "case-converter", label: "حروف بزرگ", group: G_TXT, kind: "convert", run: (l) => okR(l.toUpperCase()) },
  { id: "lowercase", toolId: "case-converter", label: "حروف کوچک", group: G_TXT, kind: "convert", run: (l) => okR(l.toLowerCase()) },
  { id: "fa-to-en-digits", toolId: "persian-number", label: "ارقام فارسی ← انگلیسی", group: G_TXT, kind: "convert", run: (l) => okR(toAsciiDigits(l)) },
  { id: "en-to-fa-digits", toolId: "persian-number", label: "ارقام انگلیسی ← فارسی", group: G_TXT, kind: "convert", run: (l) => okR(toFaDigits(l)) },
  { id: "dec-to-hex", toolId: "number-base", label: "ده‌دهی ← شانزده‌گانه", group: G_TXT, kind: "convert", run: (l) => okR(baseConv(toAsciiDigits(l), 10, 16)) },
  { id: "hex-to-dec", toolId: "number-base", label: "شانزده‌گانه ← ده‌دهی", group: G_TXT, kind: "convert", run: (l) => okR(baseConv(l, 16, 10)) },
  { id: "dec-to-bin", toolId: "number-base", label: "ده‌دهی ← دودویی", group: G_TXT, kind: "convert", run: (l) => okR(baseConv(toAsciiDigits(l), 10, 2)) },
  { id: "bin-to-dec", toolId: "number-base", label: "دودویی ← ده‌دهی", group: G_TXT, kind: "convert", run: (l) => okR(baseConv(l, 2, 10)) },
  { id: "int-to-roman", toolId: "roman-numeral", label: "عدد ← رومی", group: G_TXT, kind: "convert", run: (l) => okR(toRoman(l)) },
  { id: "roman-to-int", toolId: "roman-numeral", label: "رومی ← عدد", group: G_TXT, kind: "convert", run: (l) => okR(fromRoman(l)) },
  { id: "unix-to-date", toolId: "timestamp", label: "Timestamp ← تاریخ ISO", group: G_TXT, kind: "convert", run: (l) => okR(unixToDate(l)) },
  { id: "hex-to-rgb", toolId: "color-converter", label: "رنگ HEX ← RGB", group: G_TXT, kind: "convert", run: (l) => okR(hexToRgb(l)) },

  // Validate
  { id: "email", toolId: "validator-suite", label: "ایمیل", group: G_VAL, kind: "validate", run: (l) => vR(RE_EMAIL.test(l.trim())) },
  { id: "url", toolId: "validator-suite", label: "آدرس URL", group: G_VAL, kind: "validate", run: (l) => vR(RE_URL.test(l.trim())) },
  { id: "domain", toolId: "validator-suite", label: "دامنه", group: G_VAL, kind: "validate", run: (l) => vR(RE_DOMAIN.test(l.trim())) },
  { id: "ipv4", toolId: "validator-suite", label: "آدرس IPv4", group: G_VAL, kind: "validate", run: (l) => vR(ipv4Valid(l)) },
  { id: "uuid", toolId: "validator-suite", label: "UUID", group: G_VAL, kind: "validate", run: (l) => vR(RE_UUID.test(l.trim())) },
  { id: "mac", toolId: "validator-suite", label: "آدرس MAC", group: G_VAL, kind: "validate", run: (l) => vR(RE_MAC.test(l.trim())) },
  { id: "national-code", toolId: "national-code", label: "کد ملی", group: G_VAL, kind: "validate", run: (l) => vR(nationalCodeValid(l)) },
  { id: "legal-national-id", toolId: "legal-national-id", label: "شناسهٔ ملی حقوقی", group: G_VAL, kind: "validate", run: (l) => vR(legalIdValid(l)) },
  {
    id: "sheba", toolId: "sheba-validator", label: "شبا (IBAN ایران)", group: G_VAL, kind: "validate",
    run: (l) => {
      const ok = shebaValid(l);
      const bank = ok ? shebaBank(l) : null;
      return { ok, value: ok ? "معتبر" + (bank ? ` — ${bank}` : "") : "نامعتبر" };
    },
  },
  {
    id: "bank-card", toolId: "bank-card", label: "شماره کارت بانکی", group: G_VAL, kind: "validate",
    run: (l) => {
      const ok = cardValid(l);
      const bank = ok ? cardBank(l) : null;
      return { ok, value: ok ? "معتبر" + (bank ? ` — ${bank}` : "") : "نامعتبر" };
    },
  },
  { id: "iban", toolId: "iban-validator", label: "IBAN (بین‌المللی)", group: G_VAL, kind: "validate", run: (l) => vR(ibanValid(l)) },
  { id: "isbn", toolId: "isbn-validator", label: "شابک ISBN", group: G_VAL, kind: "validate", run: (l) => vR(isbnValid(l)) },
  { id: "luhn", toolId: "luhn-checker", label: "Luhn", group: G_VAL, kind: "validate", run: (l) => vR(luhnValid(l)) },
  { id: "imei", toolId: "imei-validator", label: "IMEI", group: G_VAL, kind: "validate", run: (l) => vR(imeiValid(l)) },
  { id: "isin", toolId: "isin-validator", label: "ISIN", group: G_VAL, kind: "validate", run: (l) => vR(isinValid(l)) },
  { id: "barcode", toolId: "barcode-validator", label: "بارکد EAN/UPC", group: G_VAL, kind: "validate", run: (l) => vR(barcodeValid(l)) },
];

export const BULK_GROUPS: string[] = [G_ENC, G_HASH, G_TXT, G_VAL];

const byId = new Map(BULK_OPS.map((o) => [o.id, o]));
export function getBulkOp(id: string): BulkOp | undefined {
  return byId.get(id);
}

/** Resolve the op for a `?tool=` deep-link (exact op id, else first by toolId). */
export function resolveBulkOp(param: string | null): BulkOp {
  if (param) {
    return (
      BULK_OPS.find((o) => o.id === param) ??
      BULK_OPS.find((o) => o.toolId === param) ??
      BULK_OPS[0]
    );
  }
  return BULK_OPS[0];
}

const toolIdsWithBulk = new Set(BULK_OPS.map((o) => o.toolId).filter(Boolean) as string[]);
export function hasBulkTool(toolId: string): boolean {
  return toolIdsWithBulk.has(toolId);
}

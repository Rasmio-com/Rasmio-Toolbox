import { toAsciiDigits } from "./utils";

const onlyDigits = (s: string) => toAsciiDigits(s).replace(/\D/g, "");

/* ── Luhn (mod-10) ───────────────────────────────────────── */
export function luhnValid(input: string): boolean {
  const s = onlyDigits(input);
  if (s.length < 2) return false;
  let sum = 0;
  let alt = false;
  for (let i = s.length - 1; i >= 0; i--) {
    let d = +s[i];
    if (alt) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    alt = !alt;
  }
  return sum % 10 === 0;
}

/* ── Iranian National Code (کد ملی اشخاص حقیقی) ───────────── */
export function nationalCodeValid(input: string): boolean {
  let code = onlyDigits(input);
  if (code.length < 8 || code.length > 10) return false;
  code = code.padStart(10, "0");
  if (/^(\d)\1{9}$/.test(code)) return false; // all-equal digits are invalid
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += +code[i] * (10 - i);
  const r = sum % 11;
  const c = +code[9];
  return r < 2 ? c === r : c === 11 - r;
}

/* ── Iranian Legal-Entity National ID (شناسه ملی حقوقی) ───── */
export function legalIdValid(input: string): boolean {
  const id = onlyDigits(input);
  if (!/^\d{11}$/.test(id)) return false;
  const d = id.split("").map(Number);
  const base = d[9] + 2;
  const coef = [29, 27, 23, 19, 17, 29, 27, 23, 19, 17];
  let sum = 0;
  for (let i = 0; i < 10; i++) sum += (d[i] + base) * coef[i];
  let rem = sum % 11;
  if (rem === 10) rem = 0;
  return rem === d[10];
}

/* ── IBAN / Sheba (mod-97, ISO 13616) ────────────────────── */
export function ibanMod97(iban: string): number {
  const s = iban.toUpperCase().replace(/\s/g, "");
  const rearranged = s.slice(4) + s.slice(0, 4);
  let remainder = 0;
  for (const ch of rearranged) {
    const part = /[0-9]/.test(ch) ? ch : (ch.charCodeAt(0) - 55).toString();
    for (const digit of part) remainder = (remainder * 10 + +digit) % 97;
  }
  return remainder;
}

export function ibanValid(input: string): boolean {
  const s = input.toUpperCase().replace(/\s/g, "");
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(s)) return false;
  return ibanMod97(s) === 1;
}

function normalizeSheba(input: string): string {
  let s = input.toUpperCase().replace(/\s/g, "");
  if (/^\d{24}$/.test(s)) s = "IR" + s;
  return s;
}

export function shebaValid(input: string): boolean {
  const s = normalizeSheba(input);
  return /^IR\d{24}$/.test(s) && ibanMod97(s) === 1;
}

/** 3-digit Iranian bank code → bank name (positions 5–7 of the IBAN). */
export const SHEBA_BANKS: Record<string, string> = {
  "010": "بانک مرکزی جمهوری اسلامی ایران",
  "011": "بانک صنعت و معدن",
  "012": "بانک ملت",
  "013": "بانک رفاه کارگران",
  "014": "بانک مسکن",
  "015": "بانک سپه",
  "016": "بانک کشاورزی",
  "017": "بانک ملی ایران",
  "018": "بانک تجارت",
  "019": "بانک صادرات ایران",
  "020": "بانک توسعه صادرات ایران",
  "021": "پست بانک ایران",
  "022": "بانک توسعه تعاون",
  "051": "مؤسسه اعتباری توسعه",
  "052": "بانک قرض‌الحسنه مهر ایران",
  "053": "بانک کارآفرین",
  "054": "بانک پارسیان",
  "055": "بانک اقتصاد نوین",
  "056": "بانک سامان",
  "057": "بانک پاسارگاد",
  "058": "بانک سرمایه",
  "059": "بانک سینا",
  "060": "بانک قوامین",
  "061": "بانک شهر",
  "062": "بانک آینده",
  "063": "بانک انصار",
  "064": "بانک گردشگری",
  "065": "بانک حکمت ایرانیان",
  "066": "بانک دی",
  "069": "بانک ایران زمین",
  "070": "بانک رسالت",
  "073": "مؤسسه اعتباری کوثر",
  "075": "مؤسسه اعتباری ملل",
  "078": "بانک خاورمیانه",
  "090": "بانک مهر ایران",
  "095": "بانک مشترک ایران-ونزوئلا",
};

export function shebaBank(input: string): string | null {
  const s = normalizeSheba(input);
  if (!/^IR\d{24}$/.test(s)) return null;
  return SHEBA_BANKS[s.slice(4, 7)] ?? null;
}

export function formatSheba(input: string): string {
  const s = normalizeSheba(input);
  if (!/^IR\d{24}$/.test(s)) return input;
  return s.replace(/(.{4})/g, "$1 ").trim();
}

/* ── Iranian bank card (16 digits, Luhn + bank by 6-digit BIN) ── */
export function cardValid(input: string): boolean {
  const c = onlyDigits(input);
  return /^\d{16}$/.test(c) && luhnValid(c);
}

/** 6-digit BIN prefix → Iranian bank name. */
export const CARD_BINS: Record<string, string> = {
  "603799": "بانک ملی ایران",
  "589210": "بانک سپه",
  "627648": "بانک توسعه صادرات",
  "207177": "بانک توسعه صادرات",
  "627961": "بانک صنعت و معدن",
  "603770": "بانک کشاورزی",
  "639217": "بانک کشاورزی",
  "628023": "بانک مسکن",
  "627760": "پست بانک ایران",
  "502908": "بانک توسعه تعاون",
  "627412": "بانک اقتصاد نوین",
  "622106": "بانک پارسیان",
  "627884": "بانک پارسیان",
  "639194": "بانک پارسیان",
  "502229": "بانک پاسارگاد",
  "639347": "بانک پاسارگاد",
  "627488": "بانک کارآفرین",
  "502910": "بانک کارآفرین",
  "621986": "بانک سامان",
  "639346": "بانک سینا",
  "639607": "بانک سرمایه",
  "502806": "بانک شهر",
  "504706": "بانک شهر",
  "502938": "بانک دی",
  "603769": "بانک صادرات ایران",
  "610433": "بانک ملت",
  "991975": "بانک ملت",
  "627353": "بانک تجارت",
  "585983": "بانک تجارت",
  "589463": "بانک رفاه کارگران",
  "505785": "بانک ایران زمین",
  "636795": "بانک مرکزی",
  "628157": "مؤسسه اعتباری توسعه",
  "505416": "بانک گردشگری",
  "606373": "بانک قرض‌الحسنه مهر ایران",
  "504172": "بانک رسالت",
  "606256": "مؤسسه اعتباری ملل",
  "636214": "بانک آینده",
};

export function cardBank(input: string): string | null {
  const c = onlyDigits(input);
  if (c.length < 6) return null;
  return CARD_BINS[c.slice(0, 6)] ?? null;
}

export function formatCard(input: string): string {
  const c = onlyDigits(input);
  return c.replace(/(\d{4})(?=\d)/g, "$1-");
}

/* ── EAN-8 / EAN-13 / UPC-A barcode ──────────────────────── */
export function barcodeType(input: string): string | null {
  const c = onlyDigits(input);
  if (c.length === 8) return "EAN-8";
  if (c.length === 12) return "UPC-A";
  if (c.length === 13) return "EAN-13";
  return null;
}

export function barcodeValid(input: string): boolean {
  const c = onlyDigits(input);
  if (![8, 12, 13].includes(c.length)) return false;
  const digits = c.split("").map(Number);
  const check = digits.pop()!;
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    const fromRight = digits.length - 1 - i;
    sum += digits[i] * (fromRight % 2 === 0 ? 3 : 1);
  }
  return (10 - (sum % 10)) % 10 === check;
}

/* ── IMEI (15 digits, Luhn) ──────────────────────────────── */
export function imeiValid(input: string): boolean {
  const c = onlyDigits(input);
  return /^\d{15}$/.test(c) && luhnValid(c);
}

/* ── ISIN (ISO 6166, letters→digits + Luhn) ──────────────── */
export function isinValid(input: string): boolean {
  const s = input.toUpperCase().replace(/\s/g, "");
  if (!/^[A-Z]{2}[A-Z0-9]{9}\d$/.test(s)) return false;
  let digits = "";
  for (const ch of s) {
    digits += /[0-9]/.test(ch) ? ch : (ch.charCodeAt(0) - 55).toString();
  }
  return luhnValid(digits);
}

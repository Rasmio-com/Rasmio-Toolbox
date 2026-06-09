import type { ToolMeta } from "./types";
import { items as networkItems } from "./meta/network";
import { items as encodingItems } from "./meta/encoding";
import { items as cryptoItems } from "./meta/crypto";
import { items as browserItems } from "./meta/browser";
import { items as textItems } from "./meta/text";
import { items as regexItems } from "./meta/regex";
import { items as dataItems } from "./meta/data";
import { items as codeItems } from "./meta/code";
import { items as apiItems } from "./meta/api";
import { items as urlItems } from "./meta/url";
import { items as seoItems } from "./meta/seo";
import { items as a11yItems } from "./meta/a11y";
import { items as datetimeItems } from "./meta/datetime";
import { items as unitsItems } from "./meta/units";
import { items as financeItems } from "./meta/finance";
import { items as colorItems } from "./meta/color";
import { items as mediaItems } from "./meta/media";
import { items as fileItems } from "./meta/file";
import { items as tableItems } from "./meta/table";
import { items as generatorsItems } from "./meta/generators";
import { items as logsItems } from "./meta/logs";
import { items as geoItems } from "./meta/geo";
import { items as referenceItems } from "./meta/reference";
import { items as diagramItems } from "./meta/diagram";
import { items as validatorsItems } from "./meta/validators";

/**
 * Static metadata for every tool. Add a tool by:
 *   1) creating src/tools/<id>.tsx (default export, "use client")
 *   2) adding a meta entry here
 *   3) adding the dynamic import in registry.tsx
 */
const core: ToolMeta[] = [
  // ── Network (server action, limited) ──────────────────────
  {
    id: "http-headers",
    title: "بازرسی هدرهای HTTP",
    titleEn: "HTTP Headers Inspector",
    description: "دریافت وضعیت و هدرهای پاسخ یک آدرس (از طریق سرور، با محدودیت)",
    category: "network",
    keywords: ["http", "headers", "هدر", "curl", "cors", "وضعیت", "response"],
    server: true,
  },

  // ── Encoding ──────────────────────────────────────────────
  {
    id: "base64",
    title: "کدگذار و رمزگشای Base64",
    titleEn: "Base64 Encode / Decode",
    description: "تبدیل متن به Base64 و بالعکس، با پشتیبانی از حالت URL-safe",
    category: "encoding",
    keywords: ["base64", "بیس ۶۴", "encode", "decode", "رمزگذاری", "atob", "btoa"],
    featured: true,
  },
  {
    id: "url-encode",
    title: "کدگذار و رمزگشای URL",
    titleEn: "URL Encode / Decode",
    description: "encodeURIComponent و decodeURIComponent برای آدرس‌ها و پارامترها",
    category: "encoding",
    keywords: ["url", "percent", "درصد", "encodeuri", "آدرس", "کوئری"],
  },
  {
    id: "html-entities",
    title: "موجودیت‌های HTML",
    titleEn: "HTML Entities Encode / Decode",
    description: "تبدیل کاراکترهای ویژه به entity و بالعکس",
    category: "encoding",
    keywords: ["html", "entity", "موجودیت", "escape", "amp", "lt", "gt"],
  },
  {
    id: "jwt-decoder",
    title: "رمزگشای JWT",
    titleEn: "JWT Decoder",
    description: "نمایش header و payload توکن JWT بدون نیاز به سرور",
    category: "encoding",
    keywords: ["jwt", "token", "توکن", "json web token", "header", "payload"],
    featured: true,
  },
  {
    id: "hex-text",
    title: "تبدیل متن و Hex",
    titleEn: "Text ↔ Hex",
    description: "کدگذاری و رمزگشایی متن به مبنای شانزده‌گانه",
    category: "encoding",
    keywords: ["hex", "hexadecimal", "شانزده", "bytes", "بایت"],
  },
  {
    id: "morse-code",
    title: "کد مورس",
    titleEn: "Morse Code",
    description: "تبدیل متن به کد مورس و بالعکس",
    category: "encoding",
    keywords: ["morse", "مورس", "code", "dot", "dash"],
  },
  {
    id: "caesar-cipher",
    title: "رمز سزار و ROT13",
    titleEn: "Caesar Cipher / ROT13",
    description: "رمز جابه‌جایی حروف با شیفت دلخواه و ROT13",
    category: "encoding",
    keywords: ["caesar", "rot13", "سزار", "cipher", "رمز", "shift"],
  },

  // ── Crypto ────────────────────────────────────────────────
  {
    id: "hash-text",
    title: "هش متن",
    titleEn: "Text Hash (MD5 / SHA)",
    description: "محاسبه‌ی MD5، SHA-1، SHA-256، SHA-384 و SHA-512 در مرورگر",
    category: "crypto",
    keywords: ["hash", "md5", "sha", "sha256", "هش", "checksum", "digest"],
    featured: true,
  },
  {
    id: "hmac",
    title: "مولد HMAC",
    titleEn: "HMAC Generator",
    description: "تولید HMAC با کلید و الگوریتم SHA دلخواه",
    category: "crypto",
    keywords: ["hmac", "key", "کلید", "sha", "signature", "امضا"],
  },
  {
    id: "password-strength",
    title: "سنجش قدرت رمز عبور",
    titleEn: "Password Strength",
    description: "برآورد آنتروپی و قدرت رمز عبور (تخمینی)",
    category: "crypto",
    keywords: ["password", "رمز", "strength", "entropy", "آنتروپی", "قدرت"],
  },

  // ── Text ──────────────────────────────────────────────────
  {
    id: "text-counter",
    title: "شمارشگر متن",
    titleEn: "Text Counter",
    description: "شمارش کاراکتر، کلمه، خط، جمله و زمان مطالعه",
    category: "text",
    keywords: ["count", "word", "character", "شمارش", "کلمه", "کاراکتر", "خط"],
    featured: true,
  },
  {
    id: "case-converter",
    title: "تبدیل حالت حروف",
    titleEn: "Case Converter",
    description: "camelCase، snake_case، kebab-case، Title Case و بیشتر",
    category: "text",
    keywords: ["case", "camel", "snake", "kebab", "حالت", "بزرگ", "کوچک"],
  },
  {
    id: "line-tools",
    title: "ابزار خطوط",
    titleEn: "Line Tools",
    description: "مرتب‌سازی، حذف تکراری، معکوس، بُرزدن و شماره‌گذاری خطوط",
    category: "text",
    keywords: ["sort", "lines", "خط", "مرتب", "تکراری", "dedupe", "reverse"],
  },
  {
    id: "find-replace",
    title: "یافتن و جایگزینی",
    titleEn: "Find & Replace",
    description: "جایگزینی متن با پشتیبانی از regex و حالت حساس به حروف",
    category: "text",
    keywords: ["find", "replace", "جایگزین", "یافتن", "regex"],
  },
  {
    id: "text-diff",
    title: "تفاوت دو متن",
    titleEn: "Text Diff",
    description: "مقایسه‌ی خط‌به‌خط دو متن و نمایش تفاوت‌ها",
    category: "text",
    keywords: ["diff", "compare", "تفاوت", "مقایسه", "difference"],
  },
  {
    id: "extract-text",
    title: "استخراج از متن",
    titleEn: "Extract from Text",
    description: "استخراج ایمیل، URL، IP، شماره و اعداد از متن",
    category: "text",
    keywords: ["extract", "email", "url", "ip", "استخراج", "ایمیل", "عدد"],
  },

  // ── Regex ─────────────────────────────────────────────────
  {
    id: "regex-tester",
    title: "آزمونگر Regex",
    titleEn: "Regex Tester",
    description: "تست عبارت باقاعده با هایلایت، گروه‌ها و فلگ‌ها",
    category: "regex",
    keywords: ["regex", "regexp", "باقاعده", "pattern", "match", "test"],
    featured: true,
  },

  // ── Data ──────────────────────────────────────────────────
  {
    id: "json-formatter",
    title: "قالب‌بند JSON",
    titleEn: "JSON Formatter",
    description: "زیباسازی، فشرده‌سازی و اعتبارسنجی JSON",
    category: "data",
    keywords: ["json", "format", "beautify", "minify", "قالب", "validate"],
    featured: true,
  },
  {
    id: "json-yaml",
    title: "تبدیل JSON و YAML",
    titleEn: "JSON ↔ YAML",
    description: "تبدیل دوطرفه‌ی JSON و YAML",
    category: "data",
    keywords: ["json", "yaml", "yml", "convert", "تبدیل"],
  },

  // ── Table ─────────────────────────────────────────────────
  {
    id: "csv-json",
    title: "تبدیل CSV و JSON",
    titleEn: "CSV ↔ JSON",
    description: "تبدیل دوطرفه‌ی CSV و JSON با تشخیص جداکننده",
    category: "table",
    keywords: ["csv", "json", "table", "جدول", "convert", "تبدیل"],
  },

  // ── Color ─────────────────────────────────────────────────
  {
    id: "color-converter",
    title: "تبدیل رنگ",
    titleEn: "Color Converter",
    description: "تبدیل میان HEX، RGB، HSL و HSV با انتخابگر رنگ",
    category: "color",
    keywords: ["color", "hex", "rgb", "hsl", "رنگ", "picker", "تبدیل"],
    featured: true,
  },
  {
    id: "contrast-checker",
    title: "بررسی کنتراست رنگ",
    titleEn: "Contrast Checker",
    description: "محاسبه‌ی نسبت کنتراست و انطباق با WCAG",
    category: "color",
    keywords: ["contrast", "wcag", "کنتراست", "a11y", "accessibility"],
  },

  // ── Units ─────────────────────────────────────────────────
  {
    id: "number-base",
    title: "تبدیل مبنای عدد",
    titleEn: "Number Base Converter",
    description: "تبدیل میان دودویی، هشت‌هشتی، ده‌دهی، شانزده‌گانه و Base36",
    category: "units",
    keywords: ["binary", "hex", "octal", "base", "مبنا", "دودویی", "عدد"],
  },
  {
    id: "unit-converter",
    title: "تبدیل واحدها",
    titleEn: "Unit Converter",
    description: "طول، وزن، دما، سرعت، حجم، داده و بیشتر",
    category: "units",
    keywords: ["unit", "length", "weight", "temperature", "واحد", "تبدیل", "متر"],
    featured: true,
  },

  // ── Datetime ──────────────────────────────────────────────
  {
    id: "timestamp",
    title: "تبدیل Timestamp",
    titleEn: "Unix Timestamp Converter",
    description: "تبدیل Unix timestamp به تاریخ و بالعکس",
    category: "datetime",
    keywords: ["timestamp", "unix", "epoch", "زمان", "تاریخ", "date"],
    featured: true,
  },

  // ── URL ───────────────────────────────────────────────────
  {
    id: "url-parser",
    title: "تجزیه‌گر URL",
    titleEn: "URL Parser",
    description: "تجزیه‌ی آدرس به اجزا و نمایش پارامترهای کوئری",
    category: "url",
    keywords: ["url", "parse", "query", "آدرس", "تجزیه", "پارامتر"],
  },
  {
    id: "slug",
    title: "مولد Slug",
    titleEn: "Slug Generator",
    description: "ساخت اسلاگ مناسب URL از متن (با پشتیبانی فارسی)",
    category: "url",
    keywords: ["slug", "اسلاگ", "url", "permalink", "نامک"],
  },

  // ── Generators ────────────────────────────────────────────
  {
    id: "uuid",
    title: "مولد UUID",
    titleEn: "UUID Generator",
    description: "تولید UUID نسخه ۴ و شناسه‌های یکتای تصادفی",
    category: "generators",
    keywords: ["uuid", "guid", "شناسه", "random", "v4"],
    featured: true,
  },
  {
    id: "password-generator",
    title: "مولد رمز عبور",
    titleEn: "Password Generator",
    description: "ساخت رمز عبور قوی و قابل تنظیم با تصادف امن",
    category: "generators",
    keywords: ["password", "رمز", "generate", "تولید", "secure", "تصادفی"],
    featured: true,
  },
  {
    id: "lorem-ipsum",
    title: "مولد متن ساختگی",
    titleEn: "Lorem Ipsum Generator",
    description: "تولید متن نمونه (لاتین و فارسی) برای طراحی",
    category: "generators",
    keywords: ["lorem", "ipsum", "متن ساختگی", "placeholder", "نمونه"],
  },
  {
    id: "qr-code",
    title: "مولد QR کد",
    titleEn: "QR Code Generator",
    description: "ساخت QR کد از متن یا URL و دانلود به‌صورت PNG/SVG",
    category: "generators",
    keywords: ["qr", "qrcode", "بارکد", "code", "کد"],
    featured: true,
  },

  // ── Browser ───────────────────────────────────────────────
  {
    id: "user-agent",
    title: "اطلاعات مرورگر و دستگاه",
    titleEn: "Browser & Device Info",
    description: "تجزیه‌ی User-Agent و نمایش قابلیت‌های مرورگر فعلی",
    category: "browser",
    keywords: ["user agent", "browser", "device", "مرورگر", "دستگاه", "ua"],
  },

  // ── Reference ─────────────────────────────────────────────
  {
    id: "http-status",
    title: "مرجع کدهای وضعیت HTTP",
    titleEn: "HTTP Status Codes",
    description: "فهرست و توضیح کدهای وضعیت HTTP با جست‌وجو",
    category: "reference",
    keywords: ["http", "status", "code", "وضعیت", "404", "500", "مرجع"],
  },
];

const extra: ToolMeta[] = [
  ...networkItems,
  ...encodingItems,
  ...cryptoItems,
  ...browserItems,
  ...textItems,
  ...regexItems,
  ...dataItems,
  ...codeItems,
  ...apiItems,
  ...urlItems,
  ...seoItems,
  ...a11yItems,
  ...datetimeItems,
  ...unitsItems,
  ...financeItems,
  ...colorItems,
  ...mediaItems,
  ...fileItems,
  ...tableItems,
  ...generatorsItems,
  ...logsItems,
  ...geoItems,
  ...referenceItems,
  ...diagramItems,
  ...validatorsItems,
];

function dedupeById(list: ToolMeta[]): ToolMeta[] {
  const seen = new Set<string>();
  const out: ToolMeta[] = [];
  for (const t of list) {
    if (!seen.has(t.id)) {
      seen.add(t.id);
      out.push(t);
    }
  }
  return out;
}

export const toolsMeta: ToolMeta[] = dedupeById([...core, ...extra]);

const metaById = new Map(toolsMeta.map((t) => [t.id, t]));

export function getToolMeta(id: string): ToolMeta | undefined {
  return metaById.get(id);
}

export function getToolsByCategory(categoryId: string): ToolMeta[] {
  return toolsMeta.filter((t) => t.category === categoryId);
}

export function getFeaturedTools(): ToolMeta[] {
  return toolsMeta.filter((t) => t.featured);
}

export function countToolsByCategory(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const t of toolsMeta) counts[t.category] = (counts[t.category] ?? 0) + 1;
  return counts;
}

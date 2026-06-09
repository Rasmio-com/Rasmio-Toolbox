import type { ToolMeta } from "../types";

export const items: ToolMeta[] = [
  {
    id: "file-hash",
    title: "هش فایل",
    titleEn: "File Hash",
    description:
      "محاسبه هش SHA-1، SHA-256 و SHA-512 یک فایل با crypto.subtle همراه با نمایش حجم و کپی هگز",
    category: "file",
    keywords: ["hash", "هش", "sha", "sha256", "sha512", "checksum", "چک‌سام", "file"],
  },
  {
    id: "file-size-formatter",
    title: "قالب‌بند حجم فایل",
    titleEn: "File Size Formatter",
    description:
      "تبدیل دوطرفه بایت به واحدهای خوانا با هر دو مبنای ده‌دهی (KB/MB/GB) و دودویی (KiB/MiB/GiB)",
    category: "file",
    keywords: ["size", "حجم", "bytes", "بایت", "kb", "mb", "gb", "kib", "mib", "binary"],
  },
  {
    id: "hex-dump",
    title: "نمایش‌گر Hex",
    titleEn: "Hex Dump",
    description:
      "نمایش بایت‌های فایل یا متن به سبک xxd با ستون آفست، بایت‌های هگز و معادل اسکی در ردیف‌های ۱۶ بایتی",
    category: "file",
    keywords: ["hex", "هگز", "dump", "xxd", "binary", "دودویی", "bytes", "ascii"],
  },
  {
    id: "base64-file",
    title: "Base64 فایل",
    titleEn: "Base64 File",
    description:
      "تبدیل فایل به Base64 و Data URI و رمزگشایی Base64 یا Data URI به فایل قابل دانلود",
    category: "file",
    keywords: ["base64", "بیس۶۴", "file", "فایل", "data uri", "encode", "decode", "رمزگشایی"],
  },
  {
    id: "gzip-tool",
    title: "فشرده‌سازی Gzip",
    titleEn: "Gzip / Deflate",
    description:
      "فشرده‌سازی متن با الگوریتم Gzip یا Deflate و خروجی Base64 و بازگشایی Base64 به متن",
    category: "file",
    keywords: ["gzip", "deflate", "فشرده", "compress", "زیپ", "zip", "decompress", "base64"],
  },
  {
    id: "line-ending-converter",
    title: "تبدیل پایان خط",
    titleEn: "Line Ending Converter",
    description:
      "تشخیص نوع پایان خط (LF/CRLF/CR/مخلوط) و تبدیل آن به LF، CRLF یا CR همراه با شمارش خطوط",
    category: "file",
    keywords: ["line ending", "پایان خط", "lf", "crlf", "cr", "eol", "newline", "خط جدید"],
  },
];

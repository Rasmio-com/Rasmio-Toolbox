import type { ToolMeta } from "../types";

export const items: ToolMeta[] = [
  {
    id: "curl-builder",
    title: "سازنده cURL",
    titleEn: "cURL Builder",
    description: "ساخت دستور curl از روی متد، آدرس، هدرها، بدنه و احراز هویت Basic با خروجی آمادهٔ کپی.",
    category: "api",
    keywords: ["curl", "request", "درخواست", "http", "header", "builder", "api", "ساخت"],
  },
  {
    id: "curl-to-code",
    title: "cURL به کد",
    titleEn: "cURL to Code",
    description: "تجزیه دستور curl و تولید قطعه‌کد fetch() و axios در جاوااسکریپت.",
    category: "api",
    keywords: ["curl", "fetch", "axios", "code", "javascript", "تبدیل", "کد", "api"],
  },
  {
    id: "auth-header",
    title: "هدر احراز هویت",
    titleEn: "Authorization Header",
    description: "ساخت هدر Basic و Bearer و تجزیهٔ هدر Authorization (رمزگشایی Basic و دیکد JWT برای Bearer).",
    category: "api",
    keywords: ["authorization", "احراز هویت", "basic", "bearer", "jwt", "token", "header", "هدر"],
  },
  {
    id: "cache-control",
    title: "هدر Cache-Control",
    titleEn: "Cache-Control Builder/Parser",
    description: "ساخت مقدار Cache-Control از گزینه‌ها (max-age، no-store و …) و تجزیهٔ آن با توضیح فارسی هر دایرکتیو.",
    category: "api",
    keywords: ["cache-control", "کش", "http", "max-age", "no-store", "header", "هدر", "directive"],
  },
];

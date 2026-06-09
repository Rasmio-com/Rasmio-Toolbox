import type { ToolMeta } from "../types";

export const items: ToolMeta[] = [
  {
    id: "json-to-typescript",
    title: "JSON به TypeScript",
    titleEn: "JSON to TypeScript",
    description:
      "تبدیل JSON به اینترفیس‌های TypeScript با تشخیص اشیاء تو‌در‌تو، آرایه‌ها و انواع اختیاری",
    category: "data",
    keywords: ["json", "typescript", "ts", "interface", "اینترفیس", "type", "نوع", "تایپ‌اسکریپت"],
  },
  {
    id: "json-path",
    title: "مسیریاب JSON",
    titleEn: "JSONPath Evaluator",
    description:
      "ارزیابی عبارت JSONPath روی داده JSON با پشتیبانی از $، کلید، اندیس و wildcard و نمایش نتایج",
    category: "data",
    keywords: ["json", "jsonpath", "مسیر", "path", "query", "پرس‌وجو", "wildcard", "ارزیابی"],
  },
  {
    id: "json-diff",
    title: "تفاوت JSON",
    titleEn: "JSON Diff",
    description:
      "مقایسه دو JSON و نمایش مسیرهای اضافه‌شده، حذف‌شده و تغییر‌یافته همراه با مقدار قدیم و جدید",
    category: "data",
    keywords: ["json", "diff", "تفاوت", "compare", "مقایسه", "تغییرات", "اختلاف", "delta"],
  },
  {
    id: "json-flatten",
    title: "تخت‌سازی JSON",
    titleEn: "JSON Flatten / Unflatten",
    description:
      "تبدیل JSON تو‌در‌تو به کلیدهای نقطه‌ای مسطح و بازگرداندن آن به ساختار تو‌در‌تو",
    category: "data",
    keywords: ["json", "flatten", "تخت", "unflatten", "مسطح", "dot", "نقطه‌ای", "کلید"],
  },
  {
    id: "ndjson",
    title: "تبدیل NDJSON",
    titleEn: "NDJSON ↔ JSON Array",
    description:
      "تبدیل دوطرفه NDJSON و آرایه JSON با اعتبارسنجی هر خط و گزارش خطوط نامعتبر",
    category: "data",
    keywords: ["ndjson", "jsonl", "json lines", "array", "آرایه", "خط", "stream", "تبدیل"],
  },
  {
    id: "xml-formatter",
    title: "قالب‌بند XML",
    titleEn: "XML Formatter",
    description:
      "زیباسازی یا فشرده‌سازی XML با تورفتگی خودکار و تشخیص خطاهای تجزیه با DOMParser",
    category: "data",
    keywords: ["xml", "format", "قالب", "pretty", "زیباسازی", "minify", "فشرده", "indent"],
  },
  {
    id: "xml-json",
    title: "تبدیل XML و JSON",
    titleEn: "XML ↔ JSON",
    description:
      "تبدیل دوطرفه XML و JSON با نگاشت معقول عناصر و صفت‌ها (پیشوند @ برای صفت و #text برای متن)",
    category: "data",
    keywords: ["xml", "json", "convert", "تبدیل", "attribute", "صفت", "element", "نگاشت"],
  },
  {
    id: "config-parser",
    title: "تجزیه‌گر تنظیمات",
    titleEn: "Config Parser",
    description:
      "تجزیه فایل‌های تنظیمات INI، ‎.env و ‎.properties و تبدیل آن‌ها به JSON",
    category: "data",
    keywords: ["config", "تنظیمات", "ini", "env", "properties", "parse", "تجزیه", "dotenv"],
  },
  {
    id: "markdown-html",
    title: "تبدیل Markdown و HTML",
    titleEn: "Markdown ↔ HTML",
    description:
      "تبدیل Markdown به HTML و HTML به Markdown به‌صورت دوطرفه با پشتیبانی GFM",
    category: "data",
    keywords: ["markdown", "مارک‌داون", "html", "md", "gfm", "convert", "تبدیل", "turndown"],
  },
  {
    id: "markdown-preview",
    title: "پیش‌نمایش Markdown",
    titleEn: "Markdown Preview",
    description:
      "ویرایشگر Markdown با پیش‌نمایش زنده و استایل‌دار در کنار آن (عنوان، فهرست، کد و جدول)",
    category: "data",
    keywords: ["markdown", "مارک‌داون", "preview", "پیش‌نمایش", "md", "render", "زنده", "live"],
  },
  {
    id: "html-formatter",
    title: "قالب‌بند HTML",
    titleEn: "HTML Formatter",
    description:
      "زیباسازی یا فشرده‌سازی HTML با تورفتگی بر اساس تگ‌ها و حفظ محتوای pre و script",
    category: "data",
    keywords: ["html", "format", "قالب", "pretty", "زیباسازی", "minify", "فشرده", "indent"],
  },
  {
    id: "svg-optimizer",
    title: "بهینه‌ساز SVG",
    titleEn: "SVG Optimizer",
    description:
      "حذف کامنت‌ها، metadata، اعلان XML و فاصله‌های اضافی SVG با نمایش حجم و پیش‌نمایش زنده",
    category: "data",
    keywords: ["svg", "optimize", "بهینه", "minify", "فشرده", "vector", "وکتور", "icon"],
  },
  {
    id: "css-selector-tester",
    title: "آزمونگر سلکتور CSS",
    titleEn: "CSS Selector Tester",
    description:
      "اجرای یک سلکتور CSS روی HTML با querySelectorAll و نمایش تعداد و کد عناصر تطبیق‌یافته",
    category: "data",
    keywords: ["css", "selector", "سلکتور", "queryselector", "html", "match", "تطبیق", "آزمون"],
  },
];

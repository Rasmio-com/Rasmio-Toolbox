import type { ToolMeta } from "../types";

export const items: ToolMeta[] = [
  {
    id: "regex-cheatsheet",
    title: "برگه تقلب Regex",
    titleEn: "Regex Cheatsheet",
    description: "مرجع قابل‌جست‌وجوی عبارات باقاعده با توضیح فارسی هر نشانه",
    category: "regex",
    keywords: ["regex", "cheatsheet", "برگه تقلب", "مرجع", "anchor", "quantifier", "lookaround", "flags"],
  },
  {
    id: "common-regex",
    title: "الگوهای آماده Regex",
    titleEn: "Common Regex Patterns",
    description: "کتابخانه الگوهای رایج مانند ایمیل، URL، IP و تاریخ به‌همراه آزمونگر",
    category: "regex",
    keywords: ["regex", "patterns", "الگو", "email", "url", "ipv4", "uuid", "phone", "آماده"],
  },
  {
    id: "regex-replace",
    title: "جایگزینی با Regex",
    titleEn: "Regex Replace",
    description: "جایگزینی متن با عبارت باقاعده، فلگ‌ها و پشتیبانی از $1",
    category: "regex",
    keywords: ["regex", "replace", "جایگزینی", "substitute", "flags", "capture", "گروه", "match"],
  },
];

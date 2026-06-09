import type { ToolMeta } from "../types";

export const items: ToolMeta[] = [
  {
    id: "ansi-stripper",
    title: "حذف کدهای ANSI",
    titleEn: "ANSI Code Stripper",
    description:
      "حذف دنباله‌های گریز ANSI از متن لاگ یا نمایش رنگ‌های ANSI (SGR) به‌صورت پیش‌نمایش HTML.",
    category: "logs",
    keywords: ["ansi", "escape", "گریز", "color", "رنگ", "terminal", "ترمینال", "sgr"],
  },
  {
    id: "log-parser",
    title: "تجزیه‌گر لاگ",
    titleEn: "Log Parser",
    description:
      "تجزیه خطوط لاگ Apache و Nginx (قالب Common و Combined) به جدولی شامل IP، زمان، متد، مسیر، وضعیت و…",
    category: "logs",
    keywords: ["log", "لاگ", "apache", "nginx", "access", "parse", "تجزیه", "combined"],
  },
  {
    id: "json-log-viewer",
    title: "نمایش‌گر لاگ JSON",
    titleEn: "JSON Log Viewer",
    description:
      "نمایش لاگ‌های NDJSON یا آرایه JSON در جدولی مرتب با رنگ‌بندی سطح (error/warn/info) و فیلتر متنی.",
    category: "logs",
    keywords: ["json", "log", "لاگ", "ndjson", "viewer", "نمایش", "level", "سطح"],
  },
  {
    id: "traceparent-parser",
    title: "تجزیه‌گر traceparent",
    titleEn: "W3C Traceparent Parser",
    description:
      "تجزیه هدر traceparent استاندارد W3C به اجزای نسخه، شناسه ردیابی، شناسه والد و پرچم‌ها با توضیح نمونه‌گیری.",
    category: "logs",
    keywords: ["traceparent", "trace", "ردیابی", "w3c", "otel", "opentelemetry", "tracing", "header"],
  },
  {
    id: "exit-code-reference",
    title: "مرجع کدهای خروج",
    titleEn: "Exit Code Reference",
    description:
      "مرجع جست‌وجوپذیر کدهای خروج رایج یونیکس و سیگنال‌ها (۰، ۱، ۲، ۱۲۶، ۱۲۷، ۱۳۰، ۱۳۷، ۱۴۳ و…) با توضیح فارسی.",
    category: "logs",
    keywords: ["exit code", "کد خروج", "signal", "سیگنال", "unix", "bash", "sigkill", "sigterm"],
  },
];

import type { ToolMeta } from "../types";

export const items: ToolMeta[] = [
  {
    id: "csv-to-markdown",
    title: "CSV به جدول Markdown",
    titleEn: "CSV → Markdown Table",
    description:
      "تجزیه CSV با انتخاب جداکننده و پشتیبانی از نقل‌قول و تبدیل آن به جدول Markdown",
    category: "table",
    keywords: ["csv", "markdown", "مارک‌داون", "table", "جدول", "convert", "تبدیل", "md"],
  },
  {
    id: "markdown-table-csv",
    title: "جدول Markdown به CSV",
    titleEn: "Markdown Table → CSV",
    description:
      "تجزیه یک جدول Markdown و تبدیل آن به CSV با نقل‌قول‌گذاری مناسب مقادیر",
    category: "table",
    keywords: ["markdown", "مارک‌داون", "csv", "table", "جدول", "convert", "تبدیل", "md"],
  },
  {
    id: "csv-to-html",
    title: "CSV به جدول HTML",
    titleEn: "CSV → HTML Table",
    description:
      "تبدیل CSV به جدول HTML استاندارد با thead و tbody و امکان کپی کد خروجی",
    category: "table",
    keywords: ["csv", "html", "table", "جدول", "thead", "tbody", "convert", "تبدیل"],
  },
  {
    id: "csv-tools",
    title: "ابزار CSV",
    titleEn: "CSV Tools",
    description:
      "عملیات روی CSV: مرتب‌سازی بر اساس ستون، حذف ردیف‌های تکراری، ترانهاده و فیلتر ردیف‌ها",
    category: "table",
    keywords: ["csv", "sort", "مرتب‌سازی", "duplicate", "تکراری", "transpose", "ترانهاده", "filter"],
  },
  {
    id: "sql-insert-generator",
    title: "مولد INSERT از CSV",
    titleEn: "SQL INSERT Generator",
    description:
      "ساخت دستورهای INSERT INTO از CSV دارای سرستون با نقل‌قول‌گذاری رشته‌ها و NULL برای مقادیر خالی",
    category: "table",
    keywords: ["sql", "insert", "csv", "database", "دیتابیس", "query", "پرس‌وجو", "generator"],
  },
  {
    id: "markdown-table-generator",
    title: "مولد جدول Markdown",
    titleEn: "Markdown Table Generator",
    description:
      "ساخت جدول Markdown با تعیین تعداد سطر و ستون، ویرایش سلول‌ها و انتخاب ترازبندی هر ستون",
    category: "table",
    keywords: ["markdown", "مارک‌داون", "table", "جدول", "generator", "مولد", "grid", "align"],
  },
];

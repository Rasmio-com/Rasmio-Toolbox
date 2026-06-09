import type { ToolMeta } from "../types";

export const items: ToolMeta[] = [
  {
    id: "loan-calculator",
    title: "ماشین‌حساب وام",
    titleEn: "Loan Calculator",
    description:
      "محاسبه‌ی قسط ماهانه، مجموع پرداختی و سود وام همراه با جدول استهلاک چند قسط نخست",
    category: "finance",
    keywords: [
      "loan",
      "وام",
      "installment",
      "قسط",
      "amortization",
      "استهلاک",
      "interest",
    ],
  },
  {
    id: "interest-calculator",
    title: "ماشین‌حساب سود",
    titleEn: "Interest Calculator",
    description:
      "محاسبه‌ی سود مرکب، نرخ رشد مرکب سالانه (CAGR) و بازده سرمایه‌گذاری (ROI)",
    category: "finance",
    keywords: [
      "interest",
      "سود",
      "compound",
      "مرکب",
      "cagr",
      "roi",
      "investment",
      "سرمایه",
    ],
  },
  {
    id: "discount-vat-calculator",
    title: "تخفیف و مالیات",
    titleEn: "Discount & VAT",
    description:
      "محاسبه‌ی قیمت پس از تخفیف، حاشیه‌ی سود و افزایش قیمت و افزودن یا کسر مالیات بر ارزش افزوده",
    category: "finance",
    keywords: [
      "discount",
      "تخفیف",
      "vat",
      "مالیات",
      "margin",
      "حاشیه سود",
      "markup",
      "tax",
    ],
  },
  {
    id: "salary-converter",
    title: "تبدیل حقوق",
    titleEn: "Salary Converter",
    description:
      "تبدیل دستمزد میان ساعتی، ماهانه و سالانه بر اساس ساعت کار هفتگی و هفته‌های کاری سال",
    category: "finance",
    keywords: [
      "salary",
      "حقوق",
      "wage",
      "دستمزد",
      "hourly",
      "ساعتی",
      "annual",
      "سالانه",
    ],
  },
  {
    id: "currency-formatter",
    title: "قالب‌بند ارز",
    titleEn: "Currency Formatter",
    description:
      "قالب‌بندی مبلغ با واحد پول و زبان دلخواه از طریق Intl.NumberFormat همراه با مبدل ریال و تومان",
    category: "finance",
    keywords: [
      "currency",
      "ارز",
      "format",
      "rial",
      "ریال",
      "toman",
      "تومان",
      "intl",
    ],
  },
];

import type { ToolMeta } from "../types";

export const items: ToolMeta[] = [
  {
    id: "query-string",
    title: "تجزیه‌گر کوئری‌استرینگ",
    titleEn: "Query String",
    description:
      "یک کوئری‌استرینگ یا آدرس کامل را به ردیف‌های کلید/مقدار تجزیه کنید، ویرایش و دوباره بسازید.",
    category: "url",
    keywords: [
      "کوئری استرینگ",
      "query string",
      "querystring",
      "پارامتر",
      "url params",
      "تجزیه",
      "parse",
    ],
  },
  {
    id: "utm-builder",
    title: "سازنده UTM",
    titleEn: "UTM Builder",
    description:
      "ساخت لینک کمپین با پارامترهای UTM (source، medium، campaign و …) و استخراج UTM از یک آدرس.",
    category: "url",
    keywords: [
      "utm",
      "کمپین",
      "campaign",
      "بازاریابی",
      "marketing",
      "utm_source",
      "تحلیل",
      "tracking",
    ],
  },
  {
    id: "link-generator",
    title: "مولد لینک",
    titleEn: "Link Generator",
    description:
      "ساخت لینک‌های ویژه mailto، tel، sms و geo با فیلدهای مرتبط مانند موضوع و متن ایمیل.",
    category: "url",
    keywords: [
      "لینک",
      "link",
      "mailto",
      "tel",
      "sms",
      "geo",
      "ایمیل",
      "تماس",
    ],
  },
  {
    id: "url-normalizer",
    title: "نرمال‌ساز URL",
    titleEn: "URL Normalizer",
    description:
      "یکدست‌سازی آدرس: حروف کوچک scheme و host، حذف پورت پیش‌فرض، مرتب‌سازی پارامترها و حل مسیرها.",
    category: "url",
    keywords: [
      "نرمال سازی",
      "normalize",
      "url",
      "canonical",
      "یکدست",
      "مرتب سازی",
      "trailing slash",
    ],
  },
  {
    id: "cookie-parser",
    title: "تجزیه‌گر کوکی",
    titleEn: "Cookie Parser",
    description:
      "تجزیه هدر Cookie یا Set-Cookie به جدول ویژگی‌ها (Domain، Path، Expires، SameSite و …) با توضیح فارسی.",
    category: "url",
    keywords: [
      "کوکی",
      "cookie",
      "set-cookie",
      "samesite",
      "httponly",
      "هدر",
      "header",
      "parse",
    ],
  },
];

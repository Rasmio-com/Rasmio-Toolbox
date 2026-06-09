import type { ToolMeta } from "../types";

export const items: ToolMeta[] = [
  {
    id: "nanoid",
    title: "مولد NanoID",
    titleEn: "NanoID Generator",
    description:
      "تولید شناسه‌های یکتای کوتاه و امن NanoID با انتخاب طول و تعداد، همراه با کپی و تولید مجدد.",
    category: "generators",
    keywords: ["nanoid", "نانوآی‌دی", "id", "شناسه", "یکتا", "unique", "random", "تصادفی"],
  },
  {
    id: "ulid",
    title: "مولد ULID",
    titleEn: "ULID Generator",
    description:
      "تولید شناسه ULID مرتب‌پذیر بر اساس زمان (۴۸ بیت زمان + ۸۰ بیت تصادفی) با کدگذاری Crockford Base32.",
    category: "generators",
    keywords: ["ulid", "id", "شناسه", "sortable", "مرتب", "timestamp", "base32", "یکتا"],
  },
  {
    id: "pin-generator",
    title: "مولد پین",
    titleEn: "PIN Generator",
    description:
      "تولید کد پین عددی تصادفی و امن با انتخاب طول و تعداد و امکان مجاز کردن صفر ابتدایی.",
    category: "generators",
    keywords: ["pin", "پین", "code", "کد", "عددی", "otp", "تصادفی", "random"],
  },
  {
    id: "random-string",
    title: "رشته تصادفی",
    titleEn: "Random String Generator",
    description:
      "ساخت رشته‌های تصادفی امن با انتخاب مجموعه نویسه‌ها (کوچک، بزرگ، ارقام، نمادها)، طول و تعداد.",
    category: "generators",
    keywords: ["random", "رشته", "string", "تصادفی", "charset", "نویسه", "secret", "crypto"],
  },
  {
    id: "token-generator",
    title: "مولد توکن",
    titleEn: "Token Generator",
    description:
      "تولید توکن‌های امن تصادفی با خروجی Hex یا Base64URL و انتخاب تعداد بایت و تعداد توکن.",
    category: "generators",
    keywords: ["token", "توکن", "hex", "base64url", "secret", "راز", "api key", "crypto"],
  },
  {
    id: "fake-data",
    title: "داده ساختگی",
    titleEn: "Fake Data Generator",
    description:
      "تولید اشخاص ساختگی با نام فارسی یا انگلیسی، ایمیل، تلفن، شهر و شرکت؛ خروجی فهرستی یا JSON.",
    category: "generators",
    keywords: ["fake", "ساختگی", "mock", "نمونه", "person", "شخص", "data", "داده"],
  },
  {
    id: "identicon",
    title: "مولد آیدنتیکون",
    titleEn: "Identicon Generator",
    description:
      "ساخت آواتار آیدنتیکون قطعی و متقارن ۵×۵ از هش SHA-256 متن ورودی روی بوم و دانلود PNG.",
    category: "generators",
    keywords: ["identicon", "آیدنتیکون", "avatar", "آواتار", "hash", "هش", "sha-256", "canvas"],
  },
  {
    id: "dummy-json",
    title: "JSON نمونه",
    titleEn: "Dummy JSON Generator",
    description:
      "تولید آرایه‌ای از اشیاء JSON واقع‌نما (شناسه، نام، ایمیل، وضعیت، تاریخ ساخت و…) برای آزمون و توسعه.",
    category: "generators",
    keywords: ["json", "dummy", "نمونه", "mock", "fake", "sample", "api", "داده"],
  },
];

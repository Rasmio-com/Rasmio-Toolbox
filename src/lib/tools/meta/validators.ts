import type { ToolMeta } from "../types";

export const items: ToolMeta[] = [
  {
    id: "validator-suite",
    title: "مجموعه اعتبارسنج",
    titleEn: "Validator Suite",
    description:
      "اعتبارسنجی سریع ایمیل، URL، دامنه، IPv4/IPv6، MAC، UUID، رنگ Hex، Base64، JSON، Slug و شماره تلفن با نمایش دلیل به فارسی.",
    category: "validators",
    keywords: ["validator", "اعتبارسنج", "email", "ایمیل", "url", "uuid", "json", "ip", "regex"],
  },
  {
    id: "credit-card-validator",
    title: "اعتبارسنج کارت بانکی",
    titleEn: "Credit Card Validator",
    description:
      "بررسی صحت شماره کارت با الگوریتم Luhn و تشخیص برند (ویزا، مسترکارت، امریکن‌اکسپرس و…) به‌همراه شناسایی قالب کارت ۱۶ رقمی ایرانی.",
    category: "validators",
    keywords: ["credit card", "کارت بانکی", "luhn", "visa", "mastercard", "کارت", "iin", "ایران"],
  },
  {
    id: "iban-validator",
    title: "اعتبارسنج IBAN",
    titleEn: "IBAN Validator",
    description:
      "اعتبارسنجی شماره شبا/IBAN با بررسی طول هر کشور و چک‌سام mod-97، به‌همراه نمایش کشور و قالب‌بندی استاندارد.",
    category: "validators",
    keywords: ["iban", "شبا", "sheba", "bank", "بانک", "mod-97", "checksum", "ایران"],
  },
  {
    id: "isbn-validator",
    title: "اعتبارسنج ISBN",
    titleEn: "ISBN Validator",
    description:
      "بررسی صحت شابک ISBN-10 (mod 11) و ISBN-13 (mod 10) و تبدیل دوسویه میان این دو قالب.",
    category: "validators",
    keywords: ["isbn", "شابک", "book", "کتاب", "isbn-10", "isbn-13", "checksum", "convert"],
  },
  {
    id: "luhn-checker",
    title: "بررسی Luhn",
    titleEn: "Luhn Checker",
    description:
      "اعتبارسنجی هر رشتهٔ عددی با الگوریتم Luhn و محاسبهٔ رقم کنترلی برای یک شمارهٔ ناقص.",
    category: "validators",
    keywords: ["luhn", "checksum", "check digit", "رقم کنترلی", "mod 10", "عدد", "validate"],
  },
  {
    id: "regex-validator",
    title: "اعتبارسنج Regex",
    titleEn: "Regex Validator",
    description:
      "بررسی معتبر بودن یک الگوی عبارت باقاعده با new RegExp، تشخیص پرچم‌ها از قالب /pattern/flags و نمایش پیام خطا به فارسی.",
    category: "validators",
    keywords: ["regex", "regexp", "عبارت باقاعده", "pattern", "flags", "validate", "compile"],
  },
  {
    id: "national-code",
    title: "اعتبارسنج کد ملی",
    titleEn: "Iranian National Code Validator",
    description: "بررسی صحت کد ملی ۱۰ رقمی ایران با الگوریتم رقم کنترل رسمی.",
    category: "validators",
    keywords: ["کد ملی", "national code", "iran", "ایران", "checksum", "رقم کنترل", "code melli"],
    featured: true,
  },
  {
    id: "legal-national-id",
    title: "اعتبارسنج شناسهٔ ملی اشخاص حقوقی",
    titleEn: "Legal Entity National ID Validator",
    description: "بررسی صحت شناسهٔ ملی ۱۱ رقمی شرکت‌ها و اشخاص حقوقی با الگوریتم رسمی.",
    category: "validators",
    keywords: ["شناسه ملی", "اشخاص حقوقی", "legal id", "company", "شرکت", "checksum"],
  },
  {
    id: "sheba-validator",
    title: "اعتبارسنج شبا و تشخیص بانک",
    titleEn: "Sheba (IBAN) Validator",
    description: "اعتبارسنجی شمارهٔ شبا (IBAN ایران) با چک‌سام mod-97 و تشخیص نام بانک از کد سه‌رقمی.",
    category: "validators",
    keywords: ["شبا", "sheba", "iban", "بانک", "mod-97", "ایران", "بانک ایرانی"],
    featured: true,
  },
  {
    id: "bank-card",
    title: "اعتبارسنج شماره کارت و تشخیص بانک",
    titleEn: "Bank Card Validator",
    description: "بررسی صحت شماره کارت ۱۶ رقمی با Luhn و تشخیص بانک صادرکننده از پیش‌شمارهٔ BIN.",
    category: "validators",
    keywords: ["شماره کارت", "bank card", "luhn", "بانک", "bin", "کارت بانکی", "ایران"],
    featured: true,
  },
  {
    id: "imei-validator",
    title: "اعتبارسنج IMEI",
    titleEn: "IMEI Validator",
    description: "بررسی صحت کد ۱۵ رقمی IMEI گوشی با الگوریتم Luhn.",
    category: "validators",
    keywords: ["imei", "موبایل", "گوشی", "luhn", "phone", "آی‌ام‌ای‌آی"],
  },
  {
    id: "barcode-validator",
    title: "اعتبارسنج بارکد (EAN/UPC)",
    titleEn: "Barcode (EAN/UPC) Validator",
    description: "بررسی رقم کنترل بارکدهای EAN-13، EAN-8 و UPC-A.",
    category: "validators",
    keywords: ["بارکد", "barcode", "ean", "upc", "ean-13", "checksum", "کالا"],
  },
  {
    id: "isin-validator",
    title: "اعتبارسنج ISIN",
    titleEn: "ISIN Validator",
    description: "بررسی صحت کد بین‌المللی اوراق بهادار ISIN با تبدیل حروف به عدد و Luhn.",
    category: "validators",
    keywords: ["isin", "اوراق بهادار", "سهام", "securities", "luhn", "iso 6166"],
  },
];

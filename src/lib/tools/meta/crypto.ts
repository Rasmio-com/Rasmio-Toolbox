import type { ToolMeta } from "../types";

export const items: ToolMeta[] = [
  {
    id: "pbkdf2",
    title: "مشتق‌گیر PBKDF2",
    titleEn: "PBKDF2",
    description:
      "مشتق کلید از رمز عبور و نمک با PBKDF2 و انتخاب الگوریتم هش و طول کلید.",
    category: "crypto",
    keywords: ["pbkdf2", "کلید", "مشتق کلید", "key derivation", "salt", "نمک", "رمزنگاری"],
  },
  {
    id: "aes-gcm",
    title: "رمزنگاری AES-GCM",
    titleEn: "AES-GCM Encrypt/Decrypt",
    description:
      "رمزنگاری و رمزگشایی متن با AES-GCM و عبارت‌عبور؛ خروجی Base64 شامل IV.",
    category: "crypto",
    keywords: ["aes", "aes-gcm", "رمزنگاری", "رمزگشایی", "encrypt", "decrypt", "symmetric"],
  },
  {
    id: "rsa-keygen",
    title: "مولد کلید RSA",
    titleEn: "RSA Key Pair",
    description:
      "تولید جفت‌کلید RSA-OAEP ۲۰۴۸ بیتی و خروجی PEM برای کلید عمومی و خصوصی.",
    category: "crypto",
    keywords: ["rsa", "کلید", "key pair", "جفت کلید", "pem", "spki", "pkcs8", "رمزنگاری"],
  },
  {
    id: "ecdsa-keygen",
    title: "مولد کلید ECDSA",
    titleEn: "ECDSA Key Pair",
    description: "تولید جفت‌کلید ECDSA روی منحنی P-256 و خروجی PEM (SPKI/PKCS8).",
    category: "crypto",
    keywords: ["ecdsa", "ec", "p-256", "کلید", "key pair", "pem", "امضا", "elliptic"],
  },
  {
    id: "totp",
    title: "مولد TOTP",
    titleEn: "TOTP Generator",
    description:
      "تولید کد TOTP زنده از راز Base32 با بازه و تعداد رقم دلخواه و شمارش معکوس.",
    category: "crypto",
    keywords: ["totp", "otp", "2fa", "احراز هویت دو مرحله‌ای", "base32", "authenticator", "کد یکبارمصرف"],
  },
  {
    id: "hotp",
    title: "مولد HOTP",
    titleEn: "HOTP Generator",
    description: "تولید کد HOTP از راز Base32 و شمارنده (counter) بر پایه HMAC-SHA1.",
    category: "crypto",
    keywords: ["hotp", "otp", "counter", "شمارنده", "base32", "hmac", "کد یکبارمصرف"],
  },
  {
    id: "otp-uri",
    title: "مولد لینک OTP",
    titleEn: "OTP URI",
    description:
      "ساخت لینک otpauth:// برای TOTP/HOTP همراه با کد QR قابل اسکن در اپلیکیشن‌ها.",
    category: "crypto",
    keywords: ["otpauth", "otp", "uri", "qr", "totp", "hotp", "authenticator", "لینک"],
  },
  {
    id: "entropy-calculator",
    title: "محاسبه‌گر آنتروپی",
    titleEn: "Entropy Calculator",
    description:
      "محاسبه آنتروپی شانون متن ورودی: بیت بر کاراکتر، کل بیت‌ها و تعداد کاراکترها.",
    category: "crypto",
    keywords: ["entropy", "آنتروپی", "shannon", "شانون", "تصادفی", "randomness", "bits"],
  },
  {
    id: "secret-scanner",
    title: "اسکنر رازها",
    titleEn: "Secret Scanner",
    description:
      "اسکن متن برای یافتن کلیدهای حساس مانند AWS، Google API، JWT و کلیدهای خصوصی.",
    category: "crypto",
    keywords: ["secret", "راز", "scanner", "اسکن", "aws", "api key", "jwt", "نشت"],
  },
  {
    id: "diceware",
    title: "عبارت‌عبور دایس‌ور",
    titleEn: "Diceware Passphrase",
    description:
      "تولید عبارت‌عبور قوی از واژگان انگلیسی ساده با تعداد و جداکننده دلخواه و برآورد آنتروپی.",
    category: "crypto",
    keywords: ["diceware", "passphrase", "عبارت عبور", "رمز عبور", "password", "آنتروپی", "wordlist"],
  },
];

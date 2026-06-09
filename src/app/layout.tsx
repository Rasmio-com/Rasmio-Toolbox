import type { Metadata, Viewport } from "next";
import { Vazirmatn, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const vazir = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazir",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "جعبه‌ابزار رسمیو — ابزارهای آنلاین توسعه‌دهندگان",
    template: "%s — جعبه‌ابزار رسمیو",
  },
  description:
    "مجموعه‌ای بزرگ از ابزارهای آنلاین برای توسعه‌دهندگان؛ کدگذاری، هش، JSON، رنگ، تاریخ و ده‌ها ابزار دیگر که همه در مرورگر شما اجرا می‌شوند.",
  keywords: ["ابزار توسعه‌دهنده", "developer tools", "جعبه ابزار", "آنلاین", "فارسی"],
  authors: [{ name: "Rasmio" }],
  applicationName: "جعبه‌ابزار رسمیو",
};

export const viewport: Viewport = {
  themeColor: "#0a0f14",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={`${vazir.variable} ${mono.variable}`}>
      <body className="min-h-dvh">
        <Header />
        <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-6 sm:px-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

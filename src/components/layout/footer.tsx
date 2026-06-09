import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted sm:flex-row">
          <p>
            ساخته‌شده با ❤ برای توسعه‌دهندگان فارسی‌زبان —{" "}
            <span className="text-fg">جعبه‌ابزار رسمیو</span>
          </p>
          <p className="flex items-center gap-2 text-xs">
            <ShieldCheck className="size-4 text-success" />
            همه‌ی ابزارها در مرورگر شما اجرا می‌شوند؛ داده‌ای ارسال نمی‌شود.
          </p>
        </div>
        <p className="mt-4 text-center text-xs text-faint sm:text-end">
          <Link href="/" className="hover:text-muted">
            خانه
          </Link>
        </p>
      </div>
    </footer>
  );
}

import { Suspense } from "react";
import type { Metadata } from "next";
import { Layers } from "lucide-react";
import { BulkRunner } from "@/components/bulk/bulk-runner";

export const metadata: Metadata = {
  title: "اجرای گروهی — تبدیل و اعتبارسنجی دسته‌ای",
  description:
    "یک ابزار را انتخاب کنید و آن را به‌صورت هم‌زمان روی همه‌ی خطوط ورودی اجرا کنید؛ تبدیل و اعتبارسنجی دسته‌ای (Base64، هش، کد ملی، شبا، کارت بانکی و…) کاملاً در مرورگر.",
  keywords: ["bulk", "اجرای گروهی", "دسته‌ای", "batch", "convert", "validate", "اعتبارسنجی"],
};

export default function BulkPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-start gap-4">
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl border border-border bg-bg-soft text-turquoise">
          <Layers className="size-7" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-fg sm:text-3xl">اجرای گروهی</h1>
          <p className="mt-1 text-muted">
            یک ابزار را انتخاب کنید و آن را روی همه‌ی خطوط ورودی به‌صورت یک‌جا اجرا کنید.
          </p>
        </div>
      </header>

      <Suspense
        fallback={
          <div className="flex min-h-48 items-center justify-center text-muted">
            در حال بارگذاری…
          </div>
        }
      >
        <BulkRunner />
      </Suspense>
    </div>
  );
}

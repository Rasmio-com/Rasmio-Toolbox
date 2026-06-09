import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <Compass className="size-12 text-turquoise" />
      <h1 className="mt-4 text-3xl font-bold text-fg">صفحه پیدا نشد</h1>
      <p className="mt-2 text-muted">
        ابزار یا صفحه‌ای که دنبالش بودید وجود ندارد.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-turquoise px-5 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-turquoise-bright"
      >
        بازگشت به خانه
      </Link>
    </div>
  );
}

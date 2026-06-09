import { Sparkles, ShieldCheck, Zap } from "lucide-react";
import { categories } from "@/lib/tools/categories";
import {
  countToolsByCategory,
  getFeaturedTools,
  toolsMeta,
} from "@/lib/tools/meta";
import { CategoryCard } from "@/components/tool/category-card";
import { ToolCard } from "@/components/tool/tool-card";
import { SearchTrigger } from "@/components/layout/search-trigger";

export default function Home() {
  const counts = countToolsByCategory();
  const featured = getFeaturedTools();

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="relative pt-10 text-center sm:pt-16">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted">
          <Sparkles className="size-3.5 text-saffron" />
          جعبه‌ابزار توسعه‌دهندگان فارسی‌زبان
        </p>
        <h1 className="text-balance text-4xl font-black leading-tight tracking-tight sm:text-6xl">
          همه‌ی ابزارهای توسعه،
          <br />
          <span className="bg-gradient-to-l from-turquoise to-saffron bg-clip-text text-transparent">
            در یک جا و در مرورگر شما
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-balance text-lg text-muted">
          ده‌ها ابزار برای کدگذاری، هش، JSON، رنگ، تاریخ و بیشتر — سریع، بدون
          ثبت‌نام، و بدون ارسال داده به سرور.
        </p>

        <div className="mt-8">
          <SearchTrigger />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted">
          <span className="flex items-center gap-2">
            <Zap className="size-4 text-turquoise" />
            <b className="text-fg">{toolsMeta.length}</b> ابزار آماده
          </span>
          <span className="flex items-center gap-2">
            <Sparkles className="size-4 text-saffron" />
            <b className="text-fg">{categories.length}</b> دسته‌بندی
          </span>
          <span className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-success" />
            <b className="text-fg">۱۰۰٪</b> سمت کاربر
          </span>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section>
          <div className="mb-5 flex items-end justify-between">
            <h2 className="text-xl font-bold text-fg">ابزارهای پرکاربرد</h2>
            <span className="text-sm text-muted">دست‌چین‌شده</span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featured.map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      <section id="categories" className="scroll-mt-20">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-xl font-bold text-fg">دسته‌بندی‌ها</h2>
          <span className="text-sm text-muted">
            {categories.length} دسته
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} count={counts[c.id] ?? 0} />
          ))}
        </div>
      </section>
    </div>
  );
}

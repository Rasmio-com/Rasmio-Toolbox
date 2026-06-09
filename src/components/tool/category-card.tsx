import Link from "next/link";
import type { Category } from "@/lib/tools/types";
import { CategoryIcon } from "@/components/ui/icon";

export function CategoryCard({
  category,
  count,
}: {
  category: Category;
  count: number;
}) {
  return (
    <Link
      href={`/category/${category.id}`}
      className="group relative overflow-hidden rounded-2xl border border-border bg-surface/50 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-turquoise-dim hover:bg-surface"
    >
      <div
        className="pointer-events-none absolute -left-8 -top-8 size-24 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-25"
        style={{ background: category.accent }}
      />
      <div className="relative flex items-center gap-4">
        <span
          className="grid size-12 shrink-0 place-items-center rounded-xl border border-border bg-bg-soft"
          style={{ color: category.accent }}
        >
          <CategoryIcon name={category.icon} className="size-6" />
        </span>
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-fg">{category.title}</h3>
          <p className="truncate text-xs text-muted">
            {count > 0 ? `${count} ابزار` : "به‌زودی"}
          </p>
        </div>
      </div>
      <p className="relative mt-3 line-clamp-2 text-sm leading-relaxed text-muted">
        {category.description}
      </p>
    </Link>
  );
}

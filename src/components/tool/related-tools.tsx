import Link from "next/link";
import { getToolsByCategory } from "@/lib/tools/meta";
import { getCategory } from "@/lib/tools/categories";
import { ToolCard } from "./tool-card";

export function RelatedTools({
  id,
  category,
}: {
  id: string;
  category: string;
}) {
  const others = getToolsByCategory(category).filter((t) => t.id !== id);
  if (others.length === 0) return null;
  const cat = getCategory(category);
  const shown = others.slice(0, 8);

  return (
    <section className="mt-14 border-t border-border pt-10">
      <div className="mb-5 flex items-end justify-between gap-3">
        <h2 className="text-lg font-bold text-fg">
          ابزارهای مرتبط{cat ? ` در «${cat.title}»` : ""}
        </h2>
        {cat && others.length > shown.length && (
          <Link
            href={`/category/${cat.id}`}
            className="shrink-0 text-sm text-turquoise hover:underline"
          >
            مشاهده همه ({others.length.toLocaleString("fa-IR")})
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {shown.map((t) => (
          <ToolCard key={t.id} tool={t} />
        ))}
      </div>
    </section>
  );
}

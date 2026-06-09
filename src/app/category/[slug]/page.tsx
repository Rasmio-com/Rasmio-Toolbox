import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import { categories, getCategory } from "@/lib/tools/categories";
import { getToolsByCategory } from "@/lib/tools/meta";
import { CategoryIcon } from "@/components/ui/icon";
import { ToolCard } from "@/components/tool/tool-card";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) return {};
  return { title: cat.title, description: cat.description };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) notFound();

  const tools = getToolsByCategory(cat.id);

  return (
    <div className="space-y-8">
      <nav className="flex items-center gap-1.5 text-sm text-muted">
        <Link href="/" className="hover:text-fg">
          خانه
        </Link>
        <ChevronLeft className="size-4" />
        <span className="text-fg">{cat.title}</span>
      </nav>

      <header className="flex items-start gap-4">
        <span
          className="grid size-14 shrink-0 place-items-center rounded-2xl border border-border bg-bg-soft"
          style={{ color: cat.accent }}
        >
          <CategoryIcon name={cat.icon} className="size-7" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-fg sm:text-3xl">{cat.title}</h1>
          <p className="mt-1 text-muted">{cat.description}</p>
        </div>
      </header>

      {tools.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <ToolCard key={t.id} tool={t} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-surface/40 p-12 text-center text-muted">
          ابزارهای این دسته به‌زودی اضافه می‌شوند.
        </div>
      )}
    </div>
  );
}

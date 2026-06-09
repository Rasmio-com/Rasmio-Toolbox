import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronLeft, ShieldCheck, Server, Layers } from "lucide-react";
import { hasBulkTool } from "@/lib/bulk/operations";
import { getToolMeta, toolsMeta } from "@/lib/tools/meta";
import { getCategory } from "@/lib/tools/categories";
import { getToolContent } from "@/lib/tools/content";
import { CategoryIcon } from "@/components/ui/icon";
import { ToolHost } from "@/components/tool/tool-host";
import { ToolSeo } from "@/components/tool/tool-seo";
import { RelatedTools } from "@/components/tool/related-tools";

export function generateStaticParams() {
  return toolsMeta.map((t) => ({ slug: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolMeta(slug);
  if (!tool) return {};
  return {
    title: tool.title,
    description: tool.description,
    keywords: tool.keywords,
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolMeta(slug);
  if (!tool) notFound();
  const cat = getCategory(tool.category);
  const content = getToolContent(tool.id);

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <Link href="/" className="hover:text-fg">
          خانه
        </Link>
        <ChevronLeft className="size-4" />
        {cat && (
          <>
            <Link href={`/category/${cat.id}`} className="hover:text-fg">
              {cat.title}
            </Link>
            <ChevronLeft className="size-4" />
          </>
        )}
        <span className="text-fg">{tool.title}</span>
      </nav>

      <header className="flex items-start gap-4">
        {cat && (
          <span
            className="grid size-14 shrink-0 place-items-center rounded-2xl border border-border bg-bg-soft"
            style={{ color: cat.accent }}
          >
            <CategoryIcon name={cat.icon} className="size-7" />
          </span>
        )}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-fg sm:text-3xl">
              {tool.title}
            </h1>
            <span className="font-mono text-sm text-faint">{tool.titleEn}</span>
          </div>
          <p className="mt-1 text-muted">{tool.description}</p>
        </div>
      </header>

      {/* Privacy / server note */}
      {tool.server ? (
        <p className="flex items-center gap-2 rounded-xl border border-saffron/30 bg-saffron/10 px-3 py-2 text-sm text-saffron">
          <Server className="size-4 shrink-0" />
          این ابزار از یک اکشن سرور استفاده می‌کند و حجم ورودی به حداکثر ۵ مگابایت
          محدود شده است.
        </p>
      ) : (
        <p className="flex items-center gap-2 rounded-xl border border-border bg-surface/40 px-3 py-2 text-sm text-muted">
          <ShieldCheck className="size-4 shrink-0 text-success" />
          این ابزار کاملاً در مرورگر شما اجرا می‌شود؛ هیچ داده‌ای ارسال نمی‌شود.
        </p>
      )}

      {hasBulkTool(tool.id) && (
        <Link
          href={`/bulk?tool=${tool.id}`}
          className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-border bg-surface/40 px-3 py-2 text-sm text-turquoise transition-colors hover:border-turquoise-dim"
        >
          <Layers className="size-4" />
          اجرای گروهی این ابزار روی چند خط
        </Link>
      )}

      <ToolHost id={tool.id} />

      {content && <ToolSeo content={content} title={tool.title} />}

      <RelatedTools id={tool.id} category={tool.category} />

      {content?.faq && content.faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: content.faq.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            }),
          }}
        />
      )}
    </div>
  );
}

import Link from "next/link";
import { ArrowUpLeft, Server } from "lucide-react";
import type { ToolMeta } from "@/lib/tools/types";
import { getCategory } from "@/lib/tools/categories";
import { CategoryIcon } from "@/components/ui/icon";

export function ToolCard({ tool }: { tool: ToolMeta }) {
  const cat = getCategory(tool.category);
  return (
    <Link
      href={`/tools/${tool.id}`}
      className="group relative flex flex-col rounded-2xl border border-border bg-surface/50 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-turquoise-dim hover:bg-surface"
    >
      <div className="mb-3 flex items-start justify-between">
        <span
          className="grid size-10 place-items-center rounded-xl border border-border bg-bg-soft transition-colors group-hover:border-current"
          style={{ color: cat?.accent }}
        >
          <CategoryIcon name={cat?.icon ?? ""} className="size-5" />
        </span>
        <ArrowUpLeft className="size-4 -translate-x-1 text-faint opacity-0 transition-all group-hover:translate-x-0 group-hover:text-turquoise group-hover:opacity-100" />
      </div>

      <h3 className="font-semibold text-fg">{tool.title}</h3>
      <p className="mt-0.5 font-mono text-xs text-faint">{tool.titleEn}</p>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
        {tool.description}
      </p>

      {tool.server && (
        <span className="mt-3 inline-flex w-fit items-center gap-1 rounded-md border border-saffron/30 bg-saffron/10 px-2 py-0.5 text-[11px] text-saffron">
          <Server className="size-3" />
          نیازمند سرور (حداکثر ۵ مگابایت)
        </span>
      )}
    </Link>
  );
}

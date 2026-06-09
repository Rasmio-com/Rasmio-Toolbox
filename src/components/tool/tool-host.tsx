"use client";

import { getToolComponent } from "@/lib/tools/registry";

export function ToolHost({ id }: { id: string }) {
  const Tool = getToolComponent(id);
  if (!Tool) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface/40 p-10 text-center text-muted">
        این ابزار به‌زودی اضافه می‌شود.
      </div>
    );
  }
  return <Tool />;
}

"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

function Loading() {
  return (
    <div className="flex min-h-48 items-center justify-center gap-3 text-muted">
      <span className="size-4 animate-spin rounded-full border-2 border-turquoise border-t-transparent" />
      <span>در حال بارگذاری ابزار…</span>
    </div>
  );
}

const cache: Record<string, ComponentType> = {};

/**
 * Resolve a tool's lazily-loaded client component by id. Uses a dynamic import
 * with a template path so every file in src/tools is code-split automatically —
 * adding a tool needs only the component file + a meta entry (no registry edit).
 */
export function getToolComponent(id: string): ComponentType | null {
  if (!/^[a-z0-9-]+$/.test(id)) return null;
  if (!cache[id]) {
    cache[id] = dynamic(() => import(`@/tools/${id}`), {
      loading: Loading,
      ssr: false,
    });
  }
  return cache[id];
}

import { toolsMeta } from "./meta";
import { getCategory } from "./categories";
import type { ToolMeta } from "./types";

/** Normalize Persian/English text for forgiving comparison. */
export function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/‌/g, " ") // ZWNJ → space
    .replace(/[يی]/g, "ی")
    .replace(/[كک]/g, "ک")
    .replace(/[ۀة]/g, "ه")
    .replace(/[آأإا]/g, "ا")
    .replace(/[ً-ٰٟ]/g, "") // Arabic diacritics
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/\s+/g, " ")
    .trim();
}

interface Indexed {
  meta: ToolMeta;
  haystack: string;
  title: string;
}

const index: Indexed[] = toolsMeta.map((meta) => {
  const cat = getCategory(meta.category);
  const parts = [
    meta.title,
    meta.titleEn,
    meta.description,
    ...(meta.keywords ?? []),
    cat?.title ?? "",
    cat?.titleEn ?? "",
  ];
  return {
    meta,
    title: normalize(`${meta.title} ${meta.titleEn}`),
    haystack: normalize(parts.join(" ")),
  };
});

/** Search tools by a free-text query. Returns ranked metadata. */
export function searchTools(query: string, limit = 40): ToolMeta[] {
  const q = normalize(query);
  if (!q) return [];
  const terms = q.split(" ").filter(Boolean);

  const scored = index
    .map(({ meta, haystack, title }) => {
      let score = 0;
      for (const term of terms) {
        if (!haystack.includes(term)) return { meta, score: -1 };
        if (title.startsWith(term)) score += 12;
        else if (title.includes(term)) score += 6;
        else score += 2; // matched only in keywords/description/category
      }
      if (meta.featured) score += 1;
      return { meta, score };
    })
    .filter((r) => r.score >= 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map((r) => r.meta);
}

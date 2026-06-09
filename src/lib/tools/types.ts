import type { ComponentType } from "react";

/** Static metadata for a tool. Kept free of component code so it is cheap to
 *  import in server components (listings, search, category pages, sitemap). */
export interface ToolMeta {
  /** URL slug, unique across the app. */
  id: string;
  /** Persian display title. */
  title: string;
  /** English title — used for search and as a subtitle. */
  titleEn: string;
  /** Short Persian description shown on cards and tool headers. */
  description: string;
  /** Category id (see categories.ts). */
  category: string;
  /** Extra search terms, Persian and English. */
  keywords?: string[];
  /** True when the tool relies on a (size-limited) server action. */
  server?: boolean;
  /** Surface on the home page. */
  featured?: boolean;
}

/** A top-level category grouping tools. */
export interface Category {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  /** Key into the icon map in components/ui/icon.tsx. */
  icon: string;
  /** Accent color (hex) used for category theming. */
  accent: string;
}

/** A registry entry binds metadata to a lazily-loaded client component. */
export interface ToolEntry {
  meta: ToolMeta;
  Component: ComponentType;
}

/** SEO/explanatory content rendered at the bottom of each tool page. */
export interface ToolGuideItem {
  title: string;
  desc: string;
}
export interface ToolFaqItem {
  q: string;
  a: string;
}
export interface ToolContent {
  /** 2–4 sentence Persian introduction. */
  intro: string;
  /** Use cases / who needs it. */
  usages: string[];
  /** Inputs, options and how-to — accurate to the actual tool. */
  guide: ToolGuideItem[];
  /** Frequently asked questions. */
  faq: ToolFaqItem[];
  /** Optional extra tips/notes. */
  tips?: string[];
}

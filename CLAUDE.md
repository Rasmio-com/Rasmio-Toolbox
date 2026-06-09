# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Rasmio Toolbox (جعبه‌ابزار رسمیو) — a large catalog of Persian/RTL developer tools (~200 tools across 25 categories). Tools run **entirely client-side** by default; only a handful that genuinely need a server (e.g. reading cross-origin HTTP headers, which CORS blocks) use Server Actions, and those are hard-capped at **5 MB** of input.

Stack: Next.js 16 (App Router) · React 19 · TypeScript 6 (strict) · Tailwind CSS v4 (via `@tailwindcss/postcss`) · Turbopack (dev). Path alias `@/*` → `./src/*`.

## Commands

```bash
npm run dev      # dev server on http://localhost:3000 (Turbopack)
npm run build    # production build (SSG — statically generates every tool page)
npm start        # serve the production build
```

There is **no lint script and no test suite** — `next build` (which type-checks) is the only gate. There is no ESLint config. Verify changes by building and/or running the dev server.

## Adding a tool (the core workflow)

Tools are discovered dynamically — **you almost never edit a central registry**. To add a tool with id `<id>` (must match `^[a-z0-9-]+$`):

1. **Component** — create `src/tools/<id>.tsx`. Must be `"use client"` with a `default export`. Build the UI from the shared kit in [src/components/tool/kit.tsx](src/components/tool/kit.tsx) (`Button`, `Field`, `TextArea`, `Output`, `CopyButton`, `Grid2`, `Segmented`, `Toggle`, `Verdict`, …) so it matches every other tool.
2. **Metadata** — add a `ToolMeta` entry to the `items` array in `src/lib/tools/meta/<category>.ts` (the per-category file). Set `featured: true` to surface it on the home page; `server: true` if it uses a server action (renders a warning banner automatically).
3. **SEO content** (standard, optional) — add a `ToolContent` entry keyed by `<id>` to `src/lib/tools/content/<category>.ts` (intro / usages / guide / faq). This renders the explanatory section + JSON-LD `FAQPage` at the bottom of the tool page.

That's it — [registry.tsx](src/lib/tools/registry.tsx) resolves the component via a template-path dynamic import (`import(\`@/tools/${id}\`)`, code-split + `ssr: false` + cached), and the tool then appears in its category, search, and (if featured) the home page automatically.

> Note: the docstring in [meta.ts](src/lib/tools/meta.ts) mentions a third step "add the dynamic import in registry.tsx" — this is **outdated**; the registry needs no edits. Also, the inline `core[]` array in `meta.ts` is the original seed set; **put new tools in the per-category `meta/<category>.ts` files**, not `core[]`.

All user-facing strings are in **Persian**. Keep `id` stable once shipped (it is the URL slug and the SSG static-params key).

## Architecture

**Metadata is split from components on purpose.** `ToolMeta` (in [types.ts](src/lib/tools/types.ts)) carries no component code, so it is cheap to import in server components (listings, category pages, search index, `generateStaticParams`). The actual tool component is only ever loaded lazily on the client via the registry. This is the key separation to preserve.

- **`src/app/`** — App Router pages.
  - [layout.tsx](src/app/layout.tsx) — root `<html lang="fa" dir="rtl">`, Vazirmatn + JetBrains Mono fonts, header/footer.
  - `tools/[slug]/page.tsx` — `generateStaticParams` over every tool (SSG) → renders breadcrumb, privacy/server banner, optional bulk link, `<ToolHost>`, SEO content, related tools.
  - `category/[slug]/`, `page.tsx` (home), `bulk/page.tsx`, `actions/` (server actions), `not-found.tsx`, `globals.css`.
- **`src/lib/tools/`** — the tool system.
  - [meta.ts](src/lib/tools/meta.ts) — aggregates `core[]` + all `meta/<category>.ts` `items`, dedupes by id; exposes `getToolMeta`, `getToolsByCategory`, `getFeaturedTools`, `countToolsByCategory`.
  - `meta/<category>.ts` — per-category `ToolMeta[]` (exported as `items`).
  - `content/index.ts` + `content/<category>.ts` — SEO/FAQ content; `getToolContent(id)`.
  - [registry.tsx](src/lib/tools/registry.tsx) — `getToolComponent(id)` dynamic loader (the only thing that touches `src/tools/`).
  - [categories.ts](src/lib/tools/categories.ts) — the 25 categories (`getCategory`).
  - [search.ts](src/lib/tools/search.ts) — `searchTools()` with **Persian-aware `normalize()`** (folds ي/ی, ك/ک, ZWNJ→space, Persian→ASCII digits, strips diacritics). Powers the Ctrl/Cmd+K palette. Reuse `normalize()` for any Persian text matching.
- **`src/lib/`** — shared logic: [validators.ts](src/lib/validators.ts) (Iranian-focused: national code, SHEBA/IBAN, bank card + BIN→bank, IMEI, ISIN, Luhn, barcode), `color.ts`, `hash/md5.ts`, `utils.ts`, `server/limits.ts`.
- **`src/lib/bulk/operations.ts`** — "run one tool over many lines" feature backing `/bulk?tool=<id>`. A `BulkOp` registry (`hasBulkTool`, `getBulkOp`, `resolveBulkOp`); the tool page shows a bulk link when `hasBulkTool(id)` is true. Add a `BulkOp` here if a new tool makes sense line-by-line.
- **`src/components/`** — `tool/kit.tsx` (shared UI primitives — always build tools from these), `tool/tool-host.tsx` (client wrapper around the registry), `layout/` (header, footer, search palette), `ui/icon.tsx` (category→lucide icon map).

## Server actions & the 5 MB rule

Server-side tools must respect the size cap, enforced in two places: `experimental.serverActions.bodySizeLimit: "5mb"` in [next.config.ts](next.config.ts), and `checkSize()` / `MAX_UPLOAD_BYTES` in [src/lib/server/limits.ts](src/lib/server/limits.ts). Any server fetch must also go through `isBlockedHost()` (SSRF denylist for localhost / private ranges / cloud metadata). See [app/actions/http-inspect.ts](src/app/actions/http-inspect.ts) for the pattern (http/https only, host denylist, 8s timeout, response body discarded). Prefer keeping a tool client-side unless the browser genuinely cannot do it.

## Deployment

`output: "standalone"` in next.config.ts produces a self-contained server bundle; the multi-stage [Dockerfile](Dockerfile) builds it onto `node:22-bookworm-slim` running as a non-root user on port 3000.

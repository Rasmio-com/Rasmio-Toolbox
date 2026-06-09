# Contributing to Rasmio Toolbox

Thanks for your interest in contributing! 🎉 This project is a catalog of Persian/RTL developer tools, and it's designed so that **adding a new tool is easy and needs no central wiring**. This guide covers setup, the "add a tool" workflow, and conventions.

> راهنمای مشارکت به فارسی در انتهای همین فایل آمده است. ↓

---

## Code of Conduct

By participating, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please be respectful and constructive.

## Getting started

**Prerequisites:** Node.js 22+ and npm.

```bash
git clone https://github.com/your-username/rasmio-toolbox.git
cd rasmio-toolbox
npm install
npm run dev          # http://localhost:3000
```

Before opening a PR, make sure the production build passes — it type-checks the whole project and is the only automated quality gate:

```bash
npm run build
```

There is currently no separate lint or test step. Keep `strict` TypeScript happy and prefer the existing code style.

## Project layout (the parts you'll touch)

| Path | What it is |
| --- | --- |
| `src/tools/<id>.tsx` | One file per tool — a client component, lazily loaded by `id`. |
| `src/lib/tools/meta/<category>.ts` | Per-category tool metadata (drives listing + search). |
| `src/lib/tools/content/<category>.ts` | Per-tool SEO/FAQ content (optional but encouraged). |
| `src/lib/tools/categories.ts` | The 25 categories (use an existing category `id`). |
| `src/components/tool/kit.tsx` | Shared UI primitives — build every tool from these. |
| `src/lib/bulk/operations.ts` | Bulk "run over many lines" registry (optional). |

You should **not** need to edit `registry.tsx` or `meta.ts` — components are resolved dynamically.

## Adding a new tool

Pick a unique `id` (URL slug). It must match `^[a-z0-9-]+$`, and once shipped it should stay stable (it's the page URL and the static-generation key).

### 1. Create the component

`src/tools/<id>.tsx` — a `"use client"` component with a **default export**, built from the shared kit so it looks and behaves like every other tool:

```tsx
"use client";
import { useMemo, useState } from "react";
import { Field, Grid2, Output, TextArea } from "@/components/tool/kit";

export default function MyTool() {
  const [input, setInput] = useState("");
  const out = useMemo(() => input.toUpperCase(), [input]);

  return (
    <Grid2>
      <Field label="ورودی">
        <TextArea value={input} onChange={(e) => setInput(e.target.value)} />
      </Field>
      <Output label="خروجی" value={out} />
    </Grid2>
  );
}
```

Handy kit components include `Button`, `Panel`, `Field`, `TextInput`, `TextArea`, `Select`, `Segmented`, `Toggle`, `CopyButton`, `DownloadButton`, `Output`, `Stat`, `ErrorNote`, `Grid2`, and `Verdict`. Browse [`src/components/tool/kit.tsx`](src/components/tool/kit.tsx) before rolling your own UI.

### 2. Register the metadata

Add an entry to the `items` array in `src/lib/tools/meta/<category>.ts` (matching your tool's category):

```ts
{
  id: "my-tool",
  title: "ابزار من",            // Persian title (shown everywhere)
  titleEn: "My Tool",           // English title (search + subtitle)
  description: "توضیح کوتاه",   // short Persian description
  category: "text",             // an existing id from categories.ts
  keywords: ["mytool", "ابزار", "uppercase"], // search terms, FA + EN
  // featured: true,            // optional: show on the home page
  // server: true,              // only if it uses a Server Action
}
```

### 3. (Recommended) Add SEO content

Add an entry keyed by your `id` to `src/lib/tools/content/<category>.ts`. This renders an explanatory section and a JSON-LD FAQ at the bottom of the tool page:

```ts
"my-tool": {
  intro: "۲ تا ۴ جمله معرفی ابزار…",
  usages: ["کاربرد اول", "کاربرد دوم"],
  guide: [{ title: "ورودی", desc: "توضیح ورودی و گزینه‌ها" }],
  faq: [{ q: "سوال متداول؟", a: "پاسخ." }],
  // tips: ["نکته اختیاری"],
}
```

### 4. (Optional) Add a bulk operation

If your tool makes sense applied line-by-line, register a `BulkOp` in [`src/lib/bulk/operations.ts`](src/lib/bulk/operations.ts) and reference your `toolId`. A "run on many lines" link then appears automatically on the tool page and at `/bulk?tool=<id>`.

### 5. Verify

```bash
npm run dev      # find your tool via Ctrl/Cmd+K, its category, and /tools/<id>
npm run build    # confirm it type-checks and statically generates
```

## Conventions

- **All user-facing strings are in Persian.** Keep `titleEn` and English `keywords` so the tool is searchable in both languages.
- **Client-first.** Keep tools fully in the browser. Only reach for a Server Action when the browser genuinely cannot do the job (e.g. CORS-blocked requests). Server tools must:
  - set `server: true` in metadata,
  - respect the **5 MB** input cap (`src/lib/server/limits.ts`),
  - route any outbound fetch through the SSRF host guard (`isBlockedHost`).
- **Reuse, don't reinvent.** Use the shared kit, the `normalize()` helper in `search.ts` for Persian text matching, and existing helpers in `src/lib/` (validators, color, hash, utils).
- **Match the surrounding style** — strict TypeScript, no unused exports, RTL-friendly markup.

## Submitting changes

1. Fork the repo and create a branch: `git checkout -b add-my-tool`.
2. Make your changes and run `npm run build`.
3. Use clear commit messages (e.g. `feat(tools): add My Tool`).
4. Open a pull request describing **what** the tool does and **why** it belongs, using the PR template.

Bug reports and tool requests are welcome via [GitHub Issues](../../issues) using the provided templates.

---

<div dir="rtl" align="right">

## راهنمای مشارکت (فارسی)

از علاقه‌ی شما به مشارکت سپاسگزاریم! این پروژه مجموعه‌ای از ابزارهای توسعه‌دهندگان با رابط فارسی است و طوری طراحی شده که **افزودن ابزار جدید ساده باشد و به سیم‌کشی مرکزی نیاز نداشته باشد**.

### راه‌اندازی

پیش‌نیاز: Node.js نسخه ۲۲ به بالا.

```bash
git clone https://github.com/your-username/rasmio-toolbox.git
cd rasmio-toolbox
npm install
npm run dev
```

پیش از ارسال Pull Request، از موفق‌بودن ساخت تولید مطمئن شوید (این مرحله کل پروژه را type-check می‌کند):

```bash
npm run build
```

### افزودن ابزار جدید (۳ گام)

یک `id` یکتا انتخاب کنید (الگوی `^[a-z0-9-]+$`). این `id` همان نشانی صفحه است و باید پس از انتشار ثابت بماند.

۱) **کامپوننت:** فایل `src/tools/<id>.tsx` را بسازید — کلاینتی (`"use client"`)، با `default export` و ساخته‌شده از کیت مشترک `@/components/tool/kit`.

۲) **متادیتا:** یک ورودی به آرایه‌ی `items` در `src/lib/tools/meta/<category>.ts` اضافه کنید (با `category` معتبر از `categories.ts`). برای نمایش در خانه `featured: true` و در صورت استفاده از Server Action مقدار `server: true` را قرار دهید.

۳) **محتوای سئو (توصیه‌شده):** ورودی متناظر با `id` را به `src/lib/tools/content/<category>.ts` بیفزایید (intro، usages، guide، faq).

همین! ابزار به‌صورت خودکار در دسته، جست‌وجو و (در صورت `featured`) خانه ظاهر می‌شود.

### قراردادها

- همه‌ی متن‌های کاربری **فارسی** هستند؛ اما `titleEn` و کلیدواژه‌های انگلیسی را برای جست‌وجوی دوزبانه نگه دارید.
- ابزارها را **کلاینتی** نگه دارید؛ تنها وقتی مرورگر واقعاً نمی‌تواند (مثل درخواست‌های مسدودشده با CORS) سراغ Server Action بروید و محدودیت **۵ مگابایت** و محافظ SSRF را رعایت کنید.
- از کیت مشترک و کمک‌تابع‌های موجود در `src/lib/` (به‌ویژه `normalize()` برای تطبیق متن فارسی) استفاده کنید.

### ارسال تغییرات

پروژه را Fork کنید، یک شاخه بسازید، `npm run build` را اجرا کنید و با توضیح روشنِ کارکرد ابزار، یک Pull Request باز کنید. گزارش باگ و درخواست ابزار را هم از طریق Issues بفرستید.

با تشکر از مشارکت شما! 💚

</div>

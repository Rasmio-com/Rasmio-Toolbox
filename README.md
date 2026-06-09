<div align="center">

# 🧰 Rasmio Toolbox · جعبه‌ابزار رسمیو

**200+ developer tools that run entirely in your browser — Persian-first, RTL, privacy-friendly.**

**بیش از ۲۰۰ ابزار توسعه‌دهندگان که کاملاً در مرورگر شما اجرا می‌شوند — فارسی، راست‌به‌چپ و حریم‌خصوصی‌محور.**

<p>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT"></a>
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white" alt="Next.js 16">
  <img src="https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white" alt="TypeScript strict">
  <img src="https://img.shields.io/badge/tools-200%2B-2DD4BF" alt="200+ tools">
  <a href="CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-welcome-34D399.svg" alt="PRs welcome"></a>
</p>

[English](#english) · [فارسی](#فارسی)

<!-- Add a screenshot or GIF of the app here, e.g.:
<img src="public/screenshot.png" alt="Rasmio Toolbox screenshot" width="800">
-->

</div>

---

## English

A large catalog of online developer utilities with a Persian (RTL) interface. Almost every tool runs **100% client-side** — your data never leaves the browser. The handful of tools that genuinely cannot work in the browser (e.g. reading cross-origin HTTP headers, which CORS forbids) use size-limited Server Actions capped at **5 MB**.

### ✨ Features

- ⚡ **Runs in your browser** — no data is sent to any server for client-side tools.
- 🔒 **Privacy by default** — each tool page states explicitly whether it is local or server-backed.
- 🔎 **Fast fuzzy search** (`Ctrl`/`Cmd` + `K`) with Persian-aware normalization (handles ي/ی, ك/ک, ZWNJ, Persian digits).
- 🗂️ **~200 tools across 25 categories** — encoding, crypto, text, regex, JSON/YAML, color, units, date/time, generators, validators, and more.
- 🧮 **Bulk mode** — run a tool over many lines at once at `/bulk`.
- 🎨 **Dark RTL design** with turquoise/saffron accents and the Vazirmatn font.
- 🧩 **Incremental architecture** — every tool is a single lazy-loaded file; adding one needs no central wiring.

### 🛠️ Tech stack

[Next.js 16](https://nextjs.org/) (App Router, SSG) · [React 19](https://react.dev/) · [TypeScript 6](https://www.typescriptlang.org/) (strict) · [Tailwind CSS v4](https://tailwindcss.com/) · [Turbopack](https://turbo.build/pack) · [lucide-react](https://lucide.dev/) icons.

### 🚀 Quick start

```bash
# 1. Clone
git clone https://github.com/your-username/rasmio-toolbox.git
cd rasmio-toolbox

# 2. Install dependencies (Node 22+ recommended)
npm install

# 3. Run the dev server → http://localhost:3000
npm run dev
```

Other scripts:

```bash
npm run build    # production build (statically generates every tool page)
npm start        # serve the production build
```

> There is no separate lint or test step yet; `npm run build` type-checks the whole project and is the current quality gate.

### 📁 Project structure

```
src/
  app/                       # Next.js App Router
    layout.tsx               # RTL root (<html lang="fa" dir="rtl">), fonts, header/footer
    page.tsx                 # Home (hero + categories + featured tools)
    category/[slug]/         # Category page
    tools/[slug]/            # Tool page (SSG via generateStaticParams)
    bulk/                    # Bulk "run over many lines" page
    actions/                 # Server Actions (the few server-backed tools)
  components/
    tool/kit.tsx             # Shared UI kit (Button, Field, Output, CopyButton, …)
    layout/                  # Header, footer, Ctrl/Cmd+K search palette
    ui/icon.tsx              # Category → icon map
  lib/
    tools/
      meta.ts                # Aggregates tool metadata, dedupes by id
      meta/<category>.ts     # Per-category tool metadata (search/listing)
      content/<category>.ts  # Per-tool SEO/FAQ content
      registry.tsx           # Dynamic component loader (id → lazy component)
      categories.ts          # The 25 categories
      search.ts              # Client search with Persian normalization
      types.ts
    bulk/operations.ts       # Bulk operations registry
    server/limits.ts         # 5 MB cap + SSRF host guard for server actions
    validators.ts, color.ts, hash/md5.ts, utils.ts
  tools/                     # One file per tool (client component, lazy-loaded)
```

### ➕ Adding a tool

Adding a tool needs **no central registry edits** — components are resolved dynamically by `id`.

1. **Component** — create `src/tools/<id>.tsx` (`id` must match `^[a-z0-9-]+$`). It must be a client component with a default export, built from the shared kit:

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

2. **Metadata** — add an entry to the `items` array in `src/lib/tools/meta/<category>.ts`:

   ```ts
   { id: "my-tool", title: "ابزار من", titleEn: "My Tool",
     description: "توضیح کوتاه", category: "text", keywords: ["..."] }
   ```

   Set `featured: true` to surface it on the home page, or `server: true` if it uses a Server Action.

3. **(Optional) SEO content** — add an intro/usages/guide/FAQ entry keyed by `id` to `src/lib/tools/content/<category>.ts`.

That's it — the tool appears in its category, in search, and (if featured) on the home page automatically. See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

### 🔐 Tools that need a server

Some tools (e.g. the HTTP Headers inspector) can't run in the browser due to CORS. These use Next.js Server Actions and are intentionally limited:

- Input is hard-capped at **5 MB** (`next.config.ts` + [`src/lib/server/limits.ts`](src/lib/server/limits.ts)).
- Outbound requests pass through an SSRF host denylist (no localhost / private ranges / cloud metadata).
- Such tools are marked `server: true` and show a warning banner on their page.

Prefer keeping a tool client-side unless the browser genuinely cannot do the job.

### 🐳 Deployment

The app builds to a self-contained standalone server (`output: "standalone"`). A multi-stage [`Dockerfile`](Dockerfile) is included:

```bash
docker build -t rasmio-toolbox .
docker run -p 3000:3000 rasmio-toolbox
```

It runs as a non-root user on port 3000.

### 🤝 Contributing

Contributions are very welcome — especially new tools! Please read [CONTRIBUTING.md](CONTRIBUTING.md) and our [Code of Conduct](CODE_OF_CONDUCT.md). Good first contributions:

- Add a missing tool from `Toolslist.md`.
- Improve an existing tool's UX or SEO content.
- Fix a bug or improve Persian copy.

### 📄 License

Released under the [MIT License](LICENSE).

---

<div dir="rtl" align="right">

## فارسی

مجموعه‌ای بزرگ از ابزارهای آنلاین توسعه‌دهندگان با رابط فارسی (راست‌به‌چپ). تقریباً همه‌ی ابزارها **۱۰۰٪ در مرورگر** اجرا می‌شوند و داده‌ی شما هرگز از دستگاهتان خارج نمی‌شود. تنها معدودی از ابزارها که واقعاً در مرورگر ممکن نیستند (مثل خواندن هدرهای HTTP که به‌خاطر CORS در مرورگر شدنی نیست) از Server Action با محدودیت حجم **۵ مگابایت** استفاده می‌کنند.

### ✨ امکانات

- ⚡ **اجرای کامل در مرورگر** — برای ابزارهای کلاینتی هیچ داده‌ای به سرور ارسال نمی‌شود.
- 🔒 **حریم‌خصوصی پیش‌فرض** — هر صفحه‌ی ابزار به‌روشنی می‌گوید محلی است یا سروری.
- 🔎 **جست‌وجوی سریع** (`Ctrl`/`Cmd` + `K`) با نرمال‌سازی فارسی (ی/ي، ک/ك، نیم‌فاصله، ارقام فارسی).
- 🗂️ **حدود ۲۰۰ ابزار در ۲۵ دسته** — کدگذاری، رمزنگاری، متن، Regex، JSON/YAML، رنگ، واحدها، تاریخ و زمان، مولدها، اعتبارسنج‌ها و بیشتر.
- 🧮 **حالت گروهی** — اجرای یک ابزار روی چندین خط به‌صورت یک‌جا در مسیر `/bulk`.
- 🎨 **طراحی تیره‌ی راست‌به‌چپ** با لهجه‌ی فیروزه‌ای/زعفرانی و فونت وزیرمتن.
- 🧩 **معماری افزایشی** — هر ابزار یک فایل مستقل و lazy-load است؛ افزودن ابزار به سیم‌کشی مرکزی نیاز ندارد.

### 🚀 راه‌اندازی

```bash
git clone https://github.com/your-username/rasmio-toolbox.git
cd rasmio-toolbox
npm install
npm run dev      # محیط توسعه روی http://localhost:3000
```

اسکریپت‌های دیگر:

```bash
npm run build    # ساخت نسخه‌ی تولید (تولید استاتیک همه‌ی صفحات ابزار)
npm start        # اجرای نسخه‌ی تولید
```

### ➕ افزودن یک ابزار (۲ گام)

افزودن ابزار **به ویرایش رجیستری نیاز ندارد**؛ کامپوننت به‌صورت پویا از روی `id` بارگذاری می‌شود.

۱) فایل کامپوننت را در `src/tools/<id>.tsx` بسازید (کلاینتی، با `default export`، ساخته‌شده از کیت مشترک `@/components/tool/kit`).

۲) متادیتا را به آرایه‌ی `items` در `src/lib/tools/meta/<category>.ts` اضافه کنید:

```ts
{ id: "my-tool", title: "ابزار من", titleEn: "My Tool",
  description: "توضیح کوتاه", category: "text", keywords: ["..."] }
```

همین! ابزار به‌صورت خودکار در دسته، جست‌وجو و (در صورت `featured`) صفحه‌ی خانه ظاهر می‌شود. برای جزئیات بیشتر [CONTRIBUTING.md](CONTRIBUTING.md) را ببینید.

### 🤝 مشارکت

مشارکت‌ها به‌گرمی پذیرفته می‌شوند — به‌ویژه افزودن ابزارهای جدید! لطفاً [راهنمای مشارکت](CONTRIBUTING.md) و [منشور رفتار](CODE_OF_CONDUCT.md) را بخوانید.

### 📄 مجوز

این پروژه تحت [مجوز MIT](LICENSE) منتشر شده است.

</div>

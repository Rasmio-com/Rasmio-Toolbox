# SEO content spec (read fully before writing)

You write **Persian, SEO-optimized explanatory content** for tools of a developer toolbox. For each assigned tool you produce one `ToolContent` object. Repo root: `C:\Users\AmirM\git\RasmioToolbox`.

## Output

Create ONE file per category you own: `src/lib/tools/content/<category-id>.ts`

```ts
import type { ToolContent } from "../types";

export const content: Record<string, ToolContent> = {
  "<tool-id>": {
    intro: "…",
    usages: ["…", "…"],
    guide: [{ title: "…", desc: "…" }],
    faq: [{ q: "…", a: "…" }],
    tips: ["…"],
  },
  // …one entry per tool id you are given
};
```

`ToolContent = { intro: string; usages: string[]; guide: {title,desc}[]; faq: {q,a}[]; tips?: string[] }`

Do NOT edit any other file. Do NOT run npm/build.

## Accuracy is mandatory

For EACH tool, first **read its source** at `src/tools/<tool-id>.tsx` to see its real inputs, options, modes and outputs. Describe only features that actually exist — never invent buttons, parameters, or formats the tool doesn't have. The `guide` items must match the tool's actual controls (e.g. real toggles/selects/fields).

## Writing guidelines (Persian)

- All content in fluent, natural **Persian (فارسی)**. Use correct ZWNJ (نیم‌فاصله). Keep technical terms (Base64, JSON, Regex, …) in Latin where natural.
- **intro**: 2–4 sentences. What the tool is, what problem it solves, and that it runs in the browser (client-side, no upload) — or, for server tools, that it uses a limited server action. Weave in natural keywords (the Persian + English tool name) without stuffing.
- **usages**: 3–6 concrete, real use cases / who needs it.
- **guide**: 3–6 items. Each `{title, desc}` explains an input, option, or step — accurate to the source. Think of this as the "parameters / how to use" section.
- **faq**: 3–5 realistic question/answer pairs a user would actually ask (incl. at least one about privacy/where data goes, and one practical edge case). Answers 1–3 sentences.
- **tips** (optional): 2–4 short practical notes, gotchas, or limitations.
- Be genuinely helpful and specific to THIS tool; avoid generic filler that could apply to any tool. No marketing fluff.
- Keep each tool's total content reasonable (roughly 150–350 words).

## Reminders about this app (use where relevant)

- Almost all tools run 100% in the browser; nothing is uploaded. Mention this for privacy-sensitive tools (hashing, passwords, JWT, files, images).
- A few tools use a size-limited (۵ مگابایت) server action — only say this if the tool's source imports from `@/app/actions/...`.

## Output of your run

Reply with ONLY a terse manifest: the content file you created and how many tool entries it has, plus any tool you skipped. Do NOT paste the content.

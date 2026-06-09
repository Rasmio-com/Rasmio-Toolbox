# Tool implementation spec (read fully before writing any code)

You implement client-side tools for a **Persian (RTL) developer toolbox** — Next.js 16 + React 19 + Tailwind v4. Repo root: `C:\Users\AmirM\git\RasmioToolbox`.

## Hard rules

- Each tool is ONE file: `src/tools/<id>.tsx`.
- First line must be exactly: `"use client";`
- Export: `export default function XxxTool() { ... }` — **no props**.
- All visible text in **Persian**. Put `dir="ltr"` on inputs/outputs that hold code, data, hex, base64, URLs, etc. Latin digits are fine.
- **Only** import from: `react`, `lucide-react`, `@/components/tool/kit`, `@/lib/utils`, `@/lib/color`, `js-yaml`, `qrcode`, `nanoid`, `fflate`, `marked`, `turndown`. Native browser APIs are allowed: `crypto.subtle`, `DOMParser`/`XMLSerializer`, Canvas, `CompressionStream`/`DecompressionStream`, `fetch`, `File`/`FileReader`. **Do NOT import any other npm package.**
- Fully client-side. For network features use ONLY these CORS-enabled endpoints, always wrapped in try/catch with `ErrorNote` on failure:
  - DNS-over-HTTPS: `https://cloudflare-dns.com/dns-query?name=<name>&type=<type>` with header `{ accept: "application/dns-json" }`
  - Public IP: `https://api.ipify.org?format=json` and `https://api64.ipify.org?format=json`
  - RDAP (whois): `https://rdap.org/domain/<domain>`
- Must pass strict TypeScript (skipLibCheck is on). Type event handlers, e.g. `(e: React.ChangeEvent<HTMLInputElement>) => ...`. Prefer `useState<string>("")`. Async work (WebCrypto, fetch, compression) goes in `useEffect`/handlers with `useState` for results — never top-level await.
- Do NOT run `npm`, `tsc`, or `next build`. Only write files.
- Keep each tool genuinely useful and correct, but concise (aim 40–110 lines). Handle empty input (render nothing/placeholder) and invalid input (ErrorNote).

## Kit API — `import { ... } from "@/components/tool/kit"`

- `Button({ variant?: "primary"|"secondary"|"ghost"|"danger", ...buttonProps })`
- `Panel({ title?, subtitle?, actions?, children, className? })` — card section
- `Field({ label?, hint?, htmlFor?, children, className? })` — label + control
- `TextInput({ mono?: boolean, ...inputProps })` — styled `<input>`
- `TextArea({ mono?: boolean=true, ...textareaProps })` — defaults `dir="ltr"`; pass `dir="auto"` for prose
- `Select({ children, ...selectProps })` — styled `<select>`
- `Segmented<T extends string>({ options: {value:T,label:ReactNode}[], value:T, onChange:(v:T)=>void, className? })`
- `Toggle({ checked:boolean, onChange:(v:boolean)=>void, label:ReactNode })`
- `CopyButton({ value:string, className?, label? })`
- `DownloadButton({ value:string, filename:string, mime?, label? })`
- `Output({ value:string, label?, placeholder?, mono?:boolean, className?, download?:{filename:string,mime?:string} })` — read-only textarea + copy
- `Stat({ label:ReactNode, value:ReactNode })` — big number tile
- `ErrorNote({ children })` — red note
- `Grid2({ children })` — responsive 2-column grid

Utils — `import { ... } from "@/lib/utils"`: `cn`, `copyText`, `downloadFile(data, filename, mime?)`, `formatBytes(bytes)`, `toAsciiDigits`.
Color — `import { ... } from "@/lib/color"`: `parseHex(hex): RGB|null`, `toHex(rgb)`, `rgbToHsl(rgb)`, `rgbToHsv(rgb)`, `luminance(rgb)`, `contrastRatio(a,b)`, type `RGB = {r,g,b}`.

Icons: import any icon from `lucide-react` (e.g. `import { RefreshCw, Copy } from "lucide-react"`). Use `className="size-4"` etc.

## Example A — mode toggle + two-pane IO (`src/tools/base64.tsx`)

```tsx
"use client";
import { useMemo, useState } from "react";
import { ErrorNote, Field, Grid2, Output, Segmented, TextArea, Toggle } from "@/components/tool/kit";

export default function Base64Tool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const { out, err } = useMemo(() => {
    if (!input) return { out: "", err: "" };
    try {
      if (mode === "encode") return { out: btoa(unescape(encodeURIComponent(input))), err: "" };
      return { out: decodeURIComponent(escape(atob(input.trim()))), err: "" };
    } catch { return { out: "", err: "ورودی نامعتبر است." }; }
  }, [input, mode]);
  return (
    <div className="space-y-4">
      <Segmented value={mode} onChange={setMode}
        options={[{ value: "encode", label: "کدگذاری" }, { value: "decode", label: "رمزگشایی" }]} />
      <Grid2>
        <Field label="ورودی"><TextArea value={input} onChange={(e) => setInput(e.target.value)} /></Field>
        <Output label="خروجی" value={out} />
      </Grid2>
      {err && <ErrorNote>{err}</ErrorNote>}
    </div>
  );
}
```

## Example B — stats + async WebCrypto

```tsx
"use client";
import { useEffect, useState } from "react";
import { Field, Stat, TextArea } from "@/components/tool/kit";

export default function ExampleTool() {
  const [text, setText] = useState("");
  const [hash, setHash] = useState("");
  useEffect(() => {
    let cancel = false;
    (async () => {
      if (!text) return setHash("");
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
      const hex = [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
      if (!cancel) setHash(hex);
    })();
    return () => { cancel = true; };
  }, [text]);
  return (
    <div className="space-y-4">
      <Field label="متن"><TextArea value={text} onChange={(e) => setText(e.target.value)} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Stat label="طول" value={text.length} />
        <Stat label="SHA-256" value={<span className="text-xs break-all">{hash || "—"}</span>} />
      </div>
    </div>
  );
}
```

## Metadata file (create once per category you own)

Create `src/lib/tools/meta/<category-id>.ts`:

```ts
import type { ToolMeta } from "../types";
export const items: ToolMeta[] = [
  { id: "<id>", title: "<عنوان فارسی>", titleEn: "<English Title>",
    description: "<توضیح کوتاه فارسی>", category: "<category-id>",
    keywords: ["کلیدواژه فارسی", "english", "..."] },
  // ...one entry per tool you implement
];
```

`ToolMeta = { id, title, titleEn, description, category, keywords?, server?, featured? }`. Use the exact `id` and category id given to you. Write a helpful Persian `description` and 4–8 mixed Persian/English `keywords` per tool.

## Output of your run

Reply with ONLY a terse manifest: list of files created and any tool you skipped (with a one-line reason). **Do not paste code.**

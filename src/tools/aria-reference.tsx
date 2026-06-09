"use client";

import { useMemo, useState } from "react";
import { Field, Segmented, TextInput } from "@/components/tool/kit";

type Kind = "role" | "state";
type Entry = { name: string; kind: Kind; fa: string };

const DATA: Entry[] = [
  // Roles
  { name: "button", kind: "role", fa: "عنصری که با کلیک/فشردن یک کنش را اجرا می‌کند." },
  { name: "link", kind: "role", fa: "پیوندی برای رفتن به منبع یا بخش دیگر." },
  { name: "checkbox", kind: "role", fa: "گزینهٔ دوحالته که می‌تواند علامت‌خورده باشد یا نه." },
  { name: "radio", kind: "role", fa: "یکی از چند گزینه که فقط یکی انتخاب می‌شود." },
  { name: "switch", kind: "role", fa: "کلید روشن/خاموش با دو حالت on و off." },
  { name: "tab", kind: "role", fa: "سرزبانه‌ای که یک پنل محتوا را نمایش می‌دهد." },
  { name: "tablist", kind: "role", fa: "مجموعه‌ای از سرزبانه‌ها." },
  { name: "tabpanel", kind: "role", fa: "محتوای مرتبط با یک سرزبانه." },
  { name: "dialog", kind: "role", fa: "پنجرهٔ گفت‌وگو که روی محتوا باز می‌شود." },
  { name: "alertdialog", kind: "role", fa: "گفت‌وگوی هشدار که نیازمند پاسخ کاربر است." },
  { name: "alert", kind: "role", fa: "پیام مهم و فوری که بی‌درنگ اعلام می‌شود." },
  { name: "status", kind: "role", fa: "پیام وضعیت غیرفوری برای فناوری کمکی." },
  { name: "menu", kind: "role", fa: "فهرستی از گزینه‌ها یا کنش‌ها." },
  { name: "menuitem", kind: "role", fa: "یک گزینه درون منو." },
  { name: "navigation", kind: "role", fa: "ناحیهٔ پیوندهای ناوبری سایت." },
  { name: "banner", kind: "role", fa: "سربرگ اصلی صفحه (header)." },
  { name: "main", kind: "role", fa: "محتوای اصلی و یکتای صفحه." },
  { name: "contentinfo", kind: "role", fa: "اطلاعات پاورقی صفحه (footer)." },
  { name: "complementary", kind: "role", fa: "محتوای مکمل مانند نوار کناری (aside)." },
  { name: "search", kind: "role", fa: "ناحیهٔ جست‌وجوی صفحه." },
  { name: "region", kind: "role", fa: "ناحیهٔ مهم با برچسب دسترس‌پذیر." },
  { name: "list / listitem", kind: "role", fa: "فهرست و آیتم‌های آن." },
  { name: "table / row / cell", kind: "role", fa: "ساختار جدول داده." },
  { name: "progressbar", kind: "role", fa: "نوار پیشرفت یک عملیات." },
  { name: "tooltip", kind: "role", fa: "راهنمای کوتاه هنگام تمرکز/هاور." },
  // States & properties
  { name: "aria-label", kind: "state", fa: "برچسب متنی دسترس‌پذیر برای عنصر بدون متن مرئی." },
  { name: "aria-labelledby", kind: "state", fa: "ارجاع به id عنصری که برچسب را فراهم می‌کند." },
  { name: "aria-describedby", kind: "state", fa: "ارجاع به توضیح تکمیلی عنصر." },
  { name: "aria-hidden", kind: "state", fa: "عنصر را از درخت دسترس‌پذیری پنهان می‌کند." },
  { name: "aria-expanded", kind: "state", fa: "باز/بسته بودن بخش بازشونده را نشان می‌دهد." },
  { name: "aria-selected", kind: "state", fa: "انتخاب‌شده بودن آیتم (مثلاً tab)." },
  { name: "aria-checked", kind: "state", fa: "وضعیت علامت‌خوردن checkbox/radio/switch." },
  { name: "aria-disabled", kind: "state", fa: "غیرفعال بودن عنصر برای تعامل." },
  { name: "aria-current", kind: "state", fa: "آیتم جاری در مجموعه (مثلاً صفحهٔ فعلی)." },
  { name: "aria-live", kind: "state", fa: "نحوهٔ اعلام تغییرات ناحیهٔ زنده (polite/assertive)." },
  { name: "aria-controls", kind: "state", fa: "id عنصری که این کنترل آن را مدیریت می‌کند." },
  { name: "aria-haspopup", kind: "state", fa: "وجود منو/گفت‌وگوی بازشونده را اعلام می‌کند." },
  { name: "aria-required", kind: "state", fa: "اجباری بودن پر کردن فیلد فرم." },
  { name: "aria-invalid", kind: "state", fa: "نامعتبر بودن مقدار واردشده در فیلد." },
  { name: "role", kind: "state", fa: "نقش معنایی عنصر را مشخص می‌کند." },
];

export default function AriaReferenceTool() {
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<"all" | Kind>("all");

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return DATA.filter(
      (d) =>
        (kind === "all" || d.kind === kind) &&
        (!t || d.name.toLowerCase().includes(t) || d.fa.includes(t)),
    );
  }, [q, kind]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented
          value={kind}
          onChange={setKind}
          options={[
            { value: "all", label: "همه" },
            { value: "role", label: "نقش‌ها" },
            { value: "state", label: "حالت‌ها/ویژگی‌ها" },
          ]}
        />
      </div>
      <Field label="جست‌وجو">
        <TextInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="مثلاً tab یا aria-expanded یا «هشدار»" />
      </Field>
      <div className="space-y-2">
        {list.map((d) => (
          <div key={d.name} className="flex items-center gap-3 rounded-xl border border-border bg-bg-soft px-3 py-2.5">
            <code
              dir="ltr"
              className="shrink-0 rounded-md border border-border px-2 py-1 font-mono text-xs"
              style={{ color: d.kind === "role" ? "#22d3ee" : "#f4a93b" }}
            >
              {d.name}
            </code>
            <span className="text-sm text-muted">{d.fa}</span>
          </div>
        ))}
        {list.length === 0 && <p className="py-8 text-center text-sm text-muted">نتیجه‌ای یافت نشد.</p>}
      </div>
    </div>
  );
}

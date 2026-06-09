"use client";

import { useMemo, useState } from "react";
import { Field, TextInput } from "@/components/tool/kit";

const CODES: { code: number; name: string; fa: string }[] = [
  { code: 100, name: "Continue", fa: "ادامه بده؛ بخش اول درخواست دریافت شد." },
  { code: 101, name: "Switching Protocols", fa: "تغییر پروتکل طبق درخواست کلاینت." },
  { code: 200, name: "OK", fa: "درخواست با موفقیت انجام شد." },
  { code: 201, name: "Created", fa: "منبع جدید با موفقیت ایجاد شد." },
  { code: 202, name: "Accepted", fa: "درخواست پذیرفته شد اما هنوز پردازش نشده." },
  { code: 204, name: "No Content", fa: "موفق؛ بدون محتوای بازگشتی." },
  { code: 206, name: "Partial Content", fa: "بخشی از منبع بازگردانده شد (Range)." },
  { code: 301, name: "Moved Permanently", fa: "انتقال دائمی به آدرس جدید." },
  { code: 302, name: "Found", fa: "انتقال موقت به آدرس دیگر." },
  { code: 304, name: "Not Modified", fa: "تغییری نکرده؛ از کش استفاده کن." },
  { code: 307, name: "Temporary Redirect", fa: "انتقال موقت با حفظ متد درخواست." },
  { code: 308, name: "Permanent Redirect", fa: "انتقال دائمی با حفظ متد درخواست." },
  { code: 400, name: "Bad Request", fa: "درخواست نامعتبر یا اشتباه است." },
  { code: 401, name: "Unauthorized", fa: "احراز هویت لازم است." },
  { code: 403, name: "Forbidden", fa: "دسترسی ممنوع است." },
  { code: 404, name: "Not Found", fa: "منبع موردنظر یافت نشد." },
  { code: 405, name: "Method Not Allowed", fa: "متد درخواست مجاز نیست." },
  { code: 408, name: "Request Timeout", fa: "زمان درخواست به پایان رسید." },
  { code: 409, name: "Conflict", fa: "تعارض با وضعیت فعلی منبع." },
  { code: 410, name: "Gone", fa: "منبع برای همیشه حذف شده است." },
  { code: 413, name: "Payload Too Large", fa: "حجم درخواست بیش از حد مجاز است." },
  { code: 415, name: "Unsupported Media Type", fa: "نوع محتوا پشتیبانی نمی‌شود." },
  { code: 422, name: "Unprocessable Entity", fa: "داده معتبر نیست (خطای اعتبارسنجی)." },
  { code: 429, name: "Too Many Requests", fa: "تعداد درخواست‌ها بیش از حد مجاز." },
  { code: 500, name: "Internal Server Error", fa: "خطای داخلی سرور." },
  { code: 501, name: "Not Implemented", fa: "قابلیت موردنظر پیاده‌سازی نشده." },
  { code: 502, name: "Bad Gateway", fa: "پاسخ نامعتبر از سرور بالادست." },
  { code: 503, name: "Service Unavailable", fa: "سرویس در دسترس نیست (اضافه‌بار/تعمیر)." },
  { code: 504, name: "Gateway Timeout", fa: "اتمام زمان پاسخ از سرور بالادست." },
];

const classColor = (code: number) =>
  code < 200
    ? "#38bdf8"
    : code < 300
      ? "#34d399"
      : code < 400
        ? "#fbbf24"
        : code < 500
          ? "#fb923c"
          : "#f87171";

export default function HttpStatusTool() {
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return CODES;
    return CODES.filter(
      (c) =>
        String(c.code).includes(t) ||
        c.name.toLowerCase().includes(t) ||
        c.fa.includes(t),
    );
  }, [q]);

  return (
    <div className="space-y-4">
      <Field label="جست‌وجو">
        <TextInput
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="مثلاً 404 یا redirect یا «یافت نشد»"
        />
      </Field>
      <div className="space-y-2">
        {list.map((c) => (
          <div
            key={c.code}
            className="flex items-center gap-3 rounded-xl border border-border bg-bg-soft px-3 py-2.5"
          >
            <span
              className="grid w-14 shrink-0 place-items-center rounded-lg border py-1 font-mono text-sm font-bold"
              style={{ color: classColor(c.code), borderColor: classColor(c.code) + "55" }}
            >
              {c.code}
            </span>
            <div className="min-w-0">
              <div className="font-mono text-sm text-fg">{c.name}</div>
              <div className="text-xs text-muted">{c.fa}</div>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <p className="py-8 text-center text-sm text-muted">نتیجه‌ای یافت نشد.</p>
        )}
      </div>
    </div>
  );
}

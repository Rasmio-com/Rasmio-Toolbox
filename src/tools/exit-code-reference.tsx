"use client";

import { useMemo, useState } from "react";
import { Field, TextInput } from "@/components/tool/kit";

interface Entry {
  code: number;
  name: string;
  fa: string;
}

// Common Unix/Bash exit codes. 128+N denotes termination by signal N.
const CODES: Entry[] = [
  { code: 0, name: "Success", fa: "اجرای موفق بدون خطا." },
  { code: 1, name: "General Error", fa: "خطای عمومی؛ شکست نامشخص برنامه." },
  { code: 2, name: "Misuse of Shell Builtins", fa: "استفاده نادرست از دستورات داخلی شل (مثلاً سینتکس اشتباه)." },
  { code: 126, name: "Command Not Executable", fa: "دستور یافت شد اما قابل اجرا نبود (مجوز اجرا ندارد)." },
  { code: 127, name: "Command Not Found", fa: "دستور پیدا نشد (مسیر اشتباه یا نصب‌نشده)." },
  { code: 128, name: "Invalid Exit Argument", fa: "آرگومان نامعتبر برای exit (خارج از بازه ۰ تا ۲۵۵)." },
  { code: 130, name: "Terminated by Ctrl-C (SIGINT)", fa: "خاتمه با Ctrl-C؛ سیگنال SIGINT شماره ۲ (۱۲۸+۲)." },
  { code: 131, name: "SIGQUIT", fa: "خاتمه با سیگنال SIGQUIT شماره ۳ (۱۲۸+۳)." },
  { code: 132, name: "SIGILL", fa: "دستورالعمل نامعتبر؛ سیگنال SIGILL شماره ۴ (۱۲۸+۴)." },
  { code: 134, name: "SIGABRT (abort)", fa: "خاتمه با abort()؛ سیگنال SIGABRT شماره ۶ (۱۲۸+۶)." },
  { code: 136, name: "SIGFPE", fa: "خطای اعشاری/تقسیم بر صفر؛ سیگنال SIGFPE شماره ۸ (۱۲۸+۸)." },
  { code: 137, name: "Killed (SIGKILL)", fa: "کشته‌شدن اجباری؛ سیگنال SIGKILL شماره ۹ (۱۲۸+۹) — اغلب OOM Killer." },
  { code: 139, name: "Segmentation Fault (SIGSEGV)", fa: "نقض دسترسی حافظه؛ سیگنال SIGSEGV شماره ۱۱ (۱۲۸+۱۱)." },
  { code: 141, name: "Broken Pipe (SIGPIPE)", fa: "نوشتن در لوله بسته؛ سیگنال SIGPIPE شماره ۱۳ (۱۲۸+۱۳)." },
  { code: 143, name: "Terminated (SIGTERM)", fa: "درخواست خاتمه مؤدبانه؛ سیگنال SIGTERM شماره ۱۵ (۱۲۸+۱۵)." },
  { code: 255, name: "Exit Status Out of Range", fa: "وضعیت خروج خارج از محدوده یا خطای کلی (مثلاً exit -1)." },
];

const SIGNALS: Entry[] = [
  { code: 1, name: "SIGHUP", fa: "قطع پایانه؛ اغلب برای بارگذاری مجدد تنظیمات استفاده می‌شود." },
  { code: 2, name: "SIGINT", fa: "وقفه از صفحه‌کلید (Ctrl-C)." },
  { code: 3, name: "SIGQUIT", fa: "خروج با ذخیره core dump (Ctrl-\\)." },
  { code: 9, name: "SIGKILL", fa: "کشتن فوری و غیرقابل‌نادیده‌گرفتن فرایند." },
  { code: 11, name: "SIGSEGV", fa: "خطای تقسیم‌بندی حافظه." },
  { code: 13, name: "SIGPIPE", fa: "نوشتن در لوله بدون خواننده." },
  { code: 15, name: "SIGTERM", fa: "درخواست خاتمه مؤدبانه (سیگنال پیش‌فرض kill)." },
  { code: 18, name: "SIGCONT", fa: "ادامه اجرای فرایند متوقف‌شده." },
  { code: 19, name: "SIGSTOP", fa: "توقف فرایند به‌صورت غیرقابل‌نادیده‌گرفتن." },
  { code: 20, name: "SIGTSTP", fa: "توقف از پایانه (Ctrl-Z)." },
];

function color(code: number): string {
  if (code === 0) return "#34d399";
  if (code >= 137) return "#f87171";
  if (code >= 126) return "#fb923c";
  return "#fbbf24";
}

export default function ExitCodeReferenceTool() {
  const [q, setQ] = useState("");

  const term = q.trim().toLowerCase();
  const matchE = (e: Entry) =>
    !term ||
    String(e.code).includes(term) ||
    e.name.toLowerCase().includes(term) ||
    e.fa.includes(term);

  const codes = useMemo(() => CODES.filter(matchE), [term]);
  const signals = useMemo(() => SIGNALS.filter(matchE), [term]);

  return (
    <div className="space-y-4">
      <Field label="جست‌وجو">
        <TextInput
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="مثلاً 137 یا SIGKILL یا «حافظه»"
        />
      </Field>

      {codes.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-fg">کدهای خروج</h3>
          {codes.map((c) => (
            <div key={c.code} className="flex items-center gap-3 rounded-xl border border-border bg-bg-soft px-3 py-2.5">
              <span
                className="grid w-14 shrink-0 place-items-center rounded-lg border py-1 font-mono text-sm font-bold"
                style={{ color: color(c.code), borderColor: color(c.code) + "55" }}
              >
                {c.code}
              </span>
              <div className="min-w-0">
                <div dir="ltr" className="font-mono text-sm text-fg">{c.name}</div>
                <div className="text-xs text-muted">{c.fa}</div>
              </div>
            </div>
          ))}
        </section>
      )}

      {signals.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-fg">سیگنال‌ها</h3>
          {signals.map((s) => (
            <div key={s.name} className="flex items-center gap-3 rounded-xl border border-border bg-bg-soft px-3 py-2.5">
              <span className="grid w-14 shrink-0 place-items-center rounded-lg border border-turquoise-dim/50 py-1 font-mono text-sm font-bold text-turquoise">
                {s.code}
              </span>
              <div className="min-w-0">
                <div dir="ltr" className="font-mono text-sm text-fg">{s.name}</div>
                <div className="text-xs text-muted">{s.fa}</div>
              </div>
            </div>
          ))}
        </section>
      )}

      {codes.length === 0 && signals.length === 0 && (
        <p className="py-8 text-center text-sm text-muted">نتیجه‌ای یافت نشد.</p>
      )}
    </div>
  );
}

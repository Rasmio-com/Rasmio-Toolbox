"use client";

import { useMemo, useState } from "react";
import { CopyButton, Field, Select, TextInput } from "@/components/tool/kit";

type Entry = { cmd: string; desc: string };

const SHEETS: Record<string, Entry[]> = {
  Git: [
    { cmd: "git init", desc: "ساخت مخزن جدید" },
    { cmd: "git clone <url>", desc: "کلون کردن یک مخزن" },
    { cmd: "git status", desc: "نمایش وضعیت تغییرات" },
    { cmd: "git add <file>", desc: "افزودن فایل به استیج" },
    { cmd: "git add -A", desc: "افزودن همهٔ تغییرات" },
    { cmd: "git commit -m \"msg\"", desc: "ثبت تغییرات با پیام" },
    { cmd: "git commit --amend", desc: "ویرایش آخرین کامیت" },
    { cmd: "git log --oneline --graph", desc: "تاریخچهٔ فشرده و گرافیکی" },
    { cmd: "git diff", desc: "تفاوت تغییرات استیج‌نشده" },
    { cmd: "git branch <name>", desc: "ساخت شاخهٔ جدید" },
    { cmd: "git checkout -b <name>", desc: "ساخت و رفتن به شاخه" },
    { cmd: "git switch <name>", desc: "تعویض شاخه" },
    { cmd: "git merge <name>", desc: "ادغام یک شاخه" },
    { cmd: "git rebase <name>", desc: "بازپایه‌گذاری روی شاخه" },
    { cmd: "git pull", desc: "دریافت و ادغام از ریموت" },
    { cmd: "git push -u origin <name>", desc: "ارسال شاخه به ریموت" },
    { cmd: "git stash", desc: "ذخیرهٔ موقت تغییرات" },
    { cmd: "git reset --hard HEAD", desc: "بازگردانی به آخرین کامیت" },
  ],
  Docker: [
    { cmd: "docker ps", desc: "کانتینرهای در حال اجرا" },
    { cmd: "docker ps -a", desc: "همهٔ کانتینرها" },
    { cmd: "docker images", desc: "فهرست ایمیج‌ها" },
    { cmd: "docker pull <image>", desc: "دریافت ایمیج" },
    { cmd: "docker build -t <name> .", desc: "ساخت ایمیج از Dockerfile" },
    { cmd: "docker run -d -p 80:80 <image>", desc: "اجرای کانتینر در پس‌زمینه" },
    { cmd: "docker run -it <image> sh", desc: "اجرای تعاملی با شل" },
    { cmd: "docker exec -it <id> sh", desc: "ورود به کانتینر در حال اجرا" },
    { cmd: "docker logs -f <id>", desc: "مشاهدهٔ زندهٔ لاگ‌ها" },
    { cmd: "docker stop <id>", desc: "توقف کانتینر" },
    { cmd: "docker rm <id>", desc: "حذف کانتینر" },
    { cmd: "docker rmi <image>", desc: "حذف ایمیج" },
    { cmd: "docker compose up -d", desc: "اجرای سرویس‌ها در پس‌زمینه" },
    { cmd: "docker compose down", desc: "توقف و حذف سرویس‌ها" },
    { cmd: "docker volume ls", desc: "فهرست والیوم‌ها" },
    { cmd: "docker system prune -a", desc: "پاک‌سازی منابع بلااستفاده" },
  ],
  Kubernetes: [
    { cmd: "kubectl get pods", desc: "فهرست پادها" },
    { cmd: "kubectl get svc", desc: "فهرست سرویس‌ها" },
    { cmd: "kubectl get nodes", desc: "فهرست نودها" },
    { cmd: "kubectl get all -n <ns>", desc: "همهٔ منابع یک namespace" },
    { cmd: "kubectl describe pod <name>", desc: "جزئیات یک پاد" },
    { cmd: "kubectl logs -f <pod>", desc: "مشاهدهٔ زندهٔ لاگ پاد" },
    { cmd: "kubectl exec -it <pod> -- sh", desc: "ورود به پاد" },
    { cmd: "kubectl apply -f <file>", desc: "اعمال پیکربندی از فایل" },
    { cmd: "kubectl delete -f <file>", desc: "حذف منابع فایل" },
    { cmd: "kubectl scale deploy <n> --replicas=3", desc: "تغییر تعداد رپلیکا" },
    { cmd: "kubectl rollout status deploy/<n>", desc: "وضعیت استقرار" },
    { cmd: "kubectl rollout undo deploy/<n>", desc: "بازگشت به نسخهٔ قبل" },
    { cmd: "kubectl port-forward <pod> 8080:80", desc: "فوروارد پورت محلی" },
    { cmd: "kubectl config get-contexts", desc: "فهرست کانتکست‌ها" },
    { cmd: "kubectl top pods", desc: "مصرف منابع پادها" },
  ],
  Linux: [
    { cmd: "ls -lah", desc: "فهرست با جزئیات و اندازهٔ خوانا" },
    { cmd: "cd -", desc: "بازگشت به مسیر قبلی" },
    { cmd: "find . -name '*.log'", desc: "جست‌وجوی فایل بر اساس نام" },
    { cmd: "grep -rn 'text' .", desc: "جست‌وجوی بازگشتی متن" },
    { cmd: "chmod +x <file>", desc: "اجرایی کردن فایل" },
    { cmd: "chown user:group <file>", desc: "تغییر مالک فایل" },
    { cmd: "df -h", desc: "فضای دیسک" },
    { cmd: "du -sh *", desc: "اندازهٔ هر پوشه" },
    { cmd: "ps aux | grep <name>", desc: "یافتن پروسه" },
    { cmd: "kill -9 <pid>", desc: "کشتن اجباری پروسه" },
    { cmd: "tar -czf out.tar.gz dir/", desc: "فشرده‌سازی پوشه" },
    { cmd: "tar -xzf file.tar.gz", desc: "استخراج آرشیو" },
    { cmd: "ln -s <target> <link>", desc: "ساخت لینک نمادین" },
    { cmd: "systemctl status <svc>", desc: "وضعیت سرویس" },
    { cmd: "journalctl -u <svc> -f", desc: "مشاهدهٔ زندهٔ لاگ سرویس" },
    { cmd: "ss -tulpn", desc: "پورت‌های در حال گوش‌دادن" },
  ],
  Bash: [
    { cmd: "for i in {1..5}; do echo $i; done", desc: "حلقهٔ شمارشی" },
    { cmd: "if [ -f file ]; then ...; fi", desc: "بررسی وجود فایل" },
    { cmd: "while read line; do ...; done < f", desc: "خواندن خط‌به‌خط فایل" },
    { cmd: "name() { echo hi; }", desc: "تعریف تابع" },
    { cmd: "var=${1:-default}", desc: "مقدار پیش‌فرض پارامتر" },
    { cmd: "${var//old/new}", desc: "جایگزینی در رشته" },
    { cmd: "$(command)", desc: "جایگزینی خروجی دستور" },
    { cmd: "cmd1 && cmd2", desc: "اجرای دوم در صورت موفقیت اول" },
    { cmd: "cmd1 || cmd2", desc: "اجرای دوم در صورت شکست اول" },
    { cmd: "cmd > out 2>&1", desc: "هدایت خروجی و خطا" },
    { cmd: "set -euo pipefail", desc: "حالت سخت‌گیرانه اسکریپت" },
    { cmd: "trap 'cleanup' EXIT", desc: "اجرای تابع هنگام خروج" },
    { cmd: "arr=(a b c); echo ${arr[1]}", desc: "آرایه و دسترسی به عنصر" },
    { cmd: "echo ${#var}", desc: "طول رشته" },
  ],
  Cron: [
    { cmd: "* * * * *", desc: "هر دقیقه" },
    { cmd: "*/5 * * * *", desc: "هر ۵ دقیقه" },
    { cmd: "0 * * * *", desc: "هر ساعت (دقیقهٔ صفر)" },
    { cmd: "0 0 * * *", desc: "هر روز نیمه‌شب" },
    { cmd: "0 9 * * 1-5", desc: "ساعت ۹ روزهای کاری" },
    { cmd: "0 0 * * 0", desc: "هر یکشنبه نیمه‌شب" },
    { cmd: "0 0 1 * *", desc: "اول هر ماه" },
    { cmd: "0 0 1 1 *", desc: "اول ژانویه هر سال" },
    { cmd: "30 2 * * 6", desc: "ساعت ۲:۳۰ هر شنبه" },
    { cmd: "@reboot", desc: "هنگام راه‌اندازی سیستم" },
    { cmd: "@daily", desc: "روزانه (معادل 0 0 * * *)" },
    { cmd: "@hourly", desc: "ساعتی (معادل 0 * * * *)" },
    { cmd: "min hour day month weekday", desc: "ترتیب فیلدها" },
    { cmd: "crontab -e", desc: "ویرایش جدول کرون" },
  ],
  Markdown: [
    { cmd: "# عنوان", desc: "سرتیتر سطح یک" },
    { cmd: "## زیرعنوان", desc: "سرتیتر سطح دو" },
    { cmd: "**bold**", desc: "متن پررنگ" },
    { cmd: "*italic*", desc: "متن کج" },
    { cmd: "~~strike~~", desc: "خط‌خورده" },
    { cmd: "[متن](https://url)", desc: "پیوند" },
    { cmd: "![alt](img.png)", desc: "تصویر" },
    { cmd: "`code`", desc: "کد درون‌خطی" },
    { cmd: "```lang ... ```", desc: "بلوک کد" },
    { cmd: "- مورد", desc: "فهرست بدون ترتیب" },
    { cmd: "1. مورد", desc: "فهرست با ترتیب" },
    { cmd: "> نقل‌قول", desc: "نقل‌قول" },
    { cmd: "| a | b |", desc: "جدول" },
    { cmd: "- [ ] کار", desc: "چک‌لیست" },
    { cmd: "---", desc: "خط افقی" },
  ],
  SQL: [
    { cmd: "SELECT * FROM t WHERE x = 1", desc: "انتخاب با شرط" },
    { cmd: "SELECT DISTINCT col FROM t", desc: "مقادیر یکتا" },
    { cmd: "INSERT INTO t (a,b) VALUES (1,2)", desc: "درج رکورد" },
    { cmd: "UPDATE t SET a = 1 WHERE id = 5", desc: "به‌روزرسانی" },
    { cmd: "DELETE FROM t WHERE id = 5", desc: "حذف رکورد" },
    { cmd: "ORDER BY col DESC", desc: "مرتب‌سازی نزولی" },
    { cmd: "LIMIT 10 OFFSET 20", desc: "صفحه‌بندی" },
    { cmd: "GROUP BY col HAVING COUNT(*) > 1", desc: "گروه‌بندی با شرط" },
    { cmd: "JOIN t2 ON t.id = t2.tid", desc: "اتصال درونی" },
    { cmd: "LEFT JOIN t2 ON ...", desc: "اتصال چپ" },
    { cmd: "COUNT(*), SUM(x), AVG(x)", desc: "توابع تجمیعی" },
    { cmd: "CREATE TABLE t (id INT PRIMARY KEY)", desc: "ساخت جدول" },
    { cmd: "ALTER TABLE t ADD col TEXT", desc: "افزودن ستون" },
    { cmd: "CREATE INDEX idx ON t (col)", desc: "ساخت ایندکس" },
    { cmd: "LIKE '%text%'", desc: "جست‌وجوی الگو" },
  ],
};

const TOPICS = Object.keys(SHEETS);

export default function CheatsheetsTool() {
  const [topic, setTopic] = useState(TOPICS[0]);
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    const entries = SHEETS[topic];
    if (!t) return entries;
    return entries.filter((e) => e.cmd.toLowerCase().includes(t) || e.desc.includes(q.trim()));
  }, [topic, q]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
        <Field label="موضوع">
          <Select value={topic} onChange={(e) => setTopic(e.target.value)}>
            {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
        </Field>
        <Field label="جست‌وجو">
          <TextInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="جست‌وجوی دستور یا توضیح…" />
        </Field>
      </div>
      <div className="space-y-1.5">
        {list.map((e) => (
          <div key={e.cmd} className="flex items-center gap-3 rounded-lg border border-border bg-bg-soft px-3 py-2 text-sm">
            <code dir="ltr" className="min-w-0 flex-1 break-all font-mono text-turquoise">{e.cmd}</code>
            <span className="hidden shrink-0 text-xs text-muted sm:block">{e.desc}</span>
            <CopyButton value={e.cmd} />
          </div>
        ))}
        {list.length === 0 && <p className="py-8 text-center text-sm text-muted">نتیجه‌ای یافت نشد.</p>}
      </div>
    </div>
  );
}

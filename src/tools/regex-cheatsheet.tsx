"use client";

import { useMemo, useState } from "react";
import { Field, Panel, TextInput } from "@/components/tool/kit";

type Row = { token: string; fa: string };
type Group = { title: string; rows: Row[] };

const GROUPS: Group[] = [
  {
    title: "لنگرها (Anchors)",
    rows: [
      { token: "^", fa: "ابتدای رشته یا خط (با فلگ m)" },
      { token: "$", fa: "انتهای رشته یا خط (با فلگ m)" },
      { token: "\\b", fa: "مرز کلمه" },
      { token: "\\B", fa: "غیرِ مرز کلمه" },
    ],
  },
  {
    title: "کلاس‌های کاراکتری (Character Classes)",
    rows: [
      { token: ".", fa: "هر کاراکتر به‌جز خط جدید (با s شامل آن هم می‌شود)" },
      { token: "\\d  \\D", fa: "رقم / غیرِ رقم" },
      { token: "\\w  \\W", fa: "کاراکتر کلمه‌ای (حرف، رقم، _) / غیرِ آن" },
      { token: "\\s  \\S", fa: "فاصله‌ی سفید / غیرِ آن" },
      { token: "[abc]", fa: "یکی از a یا b یا c" },
      { token: "[^abc]", fa: "هر چیزی به‌جز a، b، c" },
      { token: "[a-z]", fa: "بازه‌ی کاراکتری از a تا z" },
    ],
  },
  {
    title: "کمیت‌سنج‌ها (Quantifiers)",
    rows: [
      { token: "*", fa: "صفر یا بیشتر" },
      { token: "+", fa: "یک یا بیشتر" },
      { token: "?", fa: "صفر یا یک (اختیاری)" },
      { token: "{n}", fa: "دقیقاً n بار" },
      { token: "{n,}", fa: "حداقل n بار" },
      { token: "{n,m}", fa: "بین n تا m بار" },
      { token: "*?  +?  ??", fa: "حالت تنبل (کم‌ترین تطبیق ممکن)" },
    ],
  },
  {
    title: "گروه‌ها و مرجع‌ها (Groups)",
    rows: [
      { token: "(...)", fa: "گروه ثبت‌شونده (capturing)" },
      { token: "(?:...)", fa: "گروه بدون ثبت" },
      { token: "(?<name>...)", fa: "گروه نام‌دار" },
      { token: "\\1  \\k<name>", fa: "ارجاع به گروه ثبت‌شده" },
      { token: "a|b", fa: "یای منطقی: a یا b" },
    ],
  },
  {
    title: "نگاه به اطراف (Lookaround)",
    rows: [
      { token: "(?=...)", fa: "نگاه مثبت به جلو" },
      { token: "(?!...)", fa: "نگاه منفی به جلو" },
      { token: "(?<=...)", fa: "نگاه مثبت به عقب" },
      { token: "(?<!...)", fa: "نگاه منفی به عقب" },
    ],
  },
  {
    title: "فلگ‌ها (Flags)",
    rows: [
      { token: "g", fa: "global — همه‌ی تطبیق‌ها" },
      { token: "i", fa: "ignore case — بی‌توجه به بزرگی/کوچکی" },
      { token: "m", fa: "multiline — ^ و $ روی هر خط" },
      { token: "s", fa: "dotAll — نقطه شامل خط جدید" },
      { token: "u", fa: "unicode — پشتیبانی کامل یونیکد" },
      { token: "y", fa: "sticky — تطبیق از موقعیت lastIndex" },
    ],
  },
  {
    title: "گریزها (Escapes)",
    rows: [
      { token: "\\n  \\t  \\r", fa: "خط جدید، تب، بازگشت کالسکه" },
      { token: "\\.  \\*  \\\\", fa: "کاراکترهای خاص به‌صورت تحت‌اللفظی" },
      { token: "\\uXXXX", fa: "کاراکتر یونیکد با کد شانزده‌گانه" },
    ],
  },
];

export default function RegexCheatsheetTool() {
  const [q, setQ] = useState("");

  const groups = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return GROUPS;
    return GROUPS.map((g) => ({
      ...g,
      rows: g.rows.filter(
        (r) => r.token.toLowerCase().includes(t) || r.fa.includes(t) || g.title.includes(t),
      ),
    })).filter((g) => g.rows.length > 0);
  }, [q]);

  return (
    <div className="space-y-4">
      <Field label="جست‌وجو">
        <TextInput
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="مثلاً lookahead یا «کمیت» یا \\d"
        />
      </Field>
      {groups.map((g) => (
        <Panel key={g.title} title={g.title}>
          <div className="space-y-1.5">
            {g.rows.map((r) => (
              <div key={r.token} className="flex items-start gap-3">
                <code
                  dir="ltr"
                  className="w-32 shrink-0 rounded-md border border-border bg-bg-soft px-2 py-1 font-mono text-sm text-turquoise"
                >
                  {r.token}
                </code>
                <span className="pt-1 text-sm text-muted">{r.fa}</span>
              </div>
            ))}
          </div>
        </Panel>
      ))}
      {groups.length === 0 && (
        <p className="py-8 text-center text-sm text-muted">نتیجه‌ای یافت نشد.</p>
      )}
    </div>
  );
}

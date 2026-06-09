"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Field, Panel, Stat, TextArea } from "@/components/tool/kit";

type Issue = { line: number; level: "error" | "warn"; msg: string };
type Entry = { key: string; value: string };

function validate(text: string): { issues: Issue[]; entries: Entry[] } {
  const issues: Issue[] = [];
  const entries: Entry[] = [];
  const seen = new Map<string, number>();
  const lines = text.split("\n");

  lines.forEach((raw, idx) => {
    const ln = idx + 1;
    const line = raw.replace(/\r$/, "");
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    const eq = line.indexOf("=");
    if (eq === -1) {
      issues.push({ line: ln, level: "error", msg: "بدون علامت = (KEY=VALUE نیست)" });
      return;
    }
    let key = line.slice(0, eq);
    const rawValue = line.slice(eq + 1);

    // export prefix is allowed
    key = key.replace(/^\s*export\s+/, "");
    const keyTrim = key.trim();

    if (keyTrim === "") {
      issues.push({ line: ln, level: "error", msg: "کلید خالی است" });
    } else {
      if (key !== keyTrim) {
        issues.push({ line: ln, level: "warn", msg: "فاصلهٔ اضافی اطراف کلید" });
      }
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(keyTrim)) {
        issues.push({
          line: ln,
          level: "error",
          msg: "نام کلید نامعتبر (فقط حروف، عدد و _ ، و نه شروع با عدد)",
        });
      }
      if (keyTrim && keyTrim !== keyTrim.toUpperCase()) {
        issues.push({ line: ln, level: "warn", msg: "قرارداد: کلیدها معمولاً با حروف بزرگ نوشته می‌شوند" });
      }
      if (seen.has(keyTrim)) {
        issues.push({ line: ln, level: "error", msg: `کلید تکراری (قبلاً در خط ${seen.get(keyTrim)})` });
      }
      seen.set(keyTrim, ln);
    }

    // Value checks
    const quoted = /^\s*(["']).*\1\s*$/.test(rawValue);
    const valTrim = rawValue.trim();
    if (!quoted) {
      if (/\s/.test(valTrim) && valTrim !== "") {
        issues.push({ line: ln, level: "warn", msg: "مقدار دارای فاصله بدون نقل‌قول است" });
      }
      if (/[#]/.test(valTrim)) {
        issues.push({ line: ln, level: "warn", msg: "کاراکتر # در مقدار بدون نقل‌قول ممکن است کامنت تلقی شود" });
      }
    }
    if (/^["'].*[^"']$/.test(valTrim) || /^[^"'].*["']$/.test(valTrim)) {
      issues.push({ line: ln, level: "warn", msg: "نقل‌قول نامتوازن در مقدار" });
    }

    // Parsed value (strip matching quotes)
    let parsed = valTrim;
    const m = /^(["'])([\s\S]*)\1$/.exec(valTrim);
    if (m) parsed = m[2];
    entries.push({ key: keyTrim || "(نامعتبر)", value: parsed });
  });

  return { issues, entries };
}

export default function DotenvValidatorTool() {
  const [text, setText] = useState("");
  const { issues, entries } = useMemo(() => {
    if (!text.trim()) return { issues: [] as Issue[], entries: [] as Entry[] };
    return validate(text);
  }, [text]);

  const errors = issues.filter((i) => i.level === "error").length;
  const warns = issues.filter((i) => i.level === "warn").length;

  return (
    <div className="space-y-4">
      <Field label="محتوای ‎.env">
        <TextArea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={'API_KEY=abc123\nDB HOST=localhost\nDEBUG = true\nNAME="John Doe"'}
        />
      </Field>

      {text.trim() && (
        <div className="grid grid-cols-3 gap-3">
          <Stat label="کلیدها" value={entries.length} />
          <Stat label="خطا" value={errors} />
          <Stat label="هشدار" value={warns} />
        </div>
      )}

      {issues.length > 0 && (
        <Panel title="مشکلات">
          <ul className="space-y-1.5 text-sm">
            {issues.map((it, i) => (
              <li key={i} className="flex items-start gap-2">
                <AlertTriangle
                  className={`mt-0.5 size-4 shrink-0 ${it.level === "error" ? "text-danger" : "text-warning"}`}
                />
                <span className={it.level === "error" ? "text-danger" : "text-fg"}>
                  خط {it.line}: {it.msg}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      {text.trim() && issues.length === 0 && (
        <p className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
          <CheckCircle2 className="size-4" /> هیچ مشکلی یافت نشد.
        </p>
      )}

      {entries.length > 0 && (
        <Panel title="کلید/مقدارهای تجزیه‌شده">
          <div className="space-y-1.5" dir="ltr">
            {entries.map((e, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <code className="shrink-0 font-semibold text-turquoise">{e.key}</code>
                <span className="text-faint">=</span>
                <code className="min-w-0 flex-1 break-all text-fg">{e.value || '""'}</code>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}

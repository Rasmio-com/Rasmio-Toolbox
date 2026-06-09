"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Field,
  Grid2,
  Output,
  Segmented,
  Select,
  Stat,
  TextArea,
} from "@/components/tool/kit";
import {
  BULK_GROUPS,
  BULK_OPS,
  getBulkOp,
  resolveBulkOp,
} from "@/lib/bulk/operations";

const MAX_LINES = 5000;

export function BulkRunner() {
  const params = useSearchParams();
  const [opId, setOpId] = useState<string>(() => resolveBulkOp(params.get("tool")).id);
  const [input, setInput] = useState("");
  const [format, setFormat] = useState<"both" | "output">("both");
  const [out, setOut] = useState("");
  const [stats, setStats] = useState<{
    total: number;
    ok: number;
    kind: "convert" | "validate";
    truncated: boolean;
  } | null>(null);

  const op = getBulkOp(opId);

  useEffect(() => {
    let cancel = false;
    (async () => {
      if (!op) return;
      let lines = input.split(/\r?\n/).filter((l) => l.trim() !== "");
      const truncated = lines.length > MAX_LINES;
      if (truncated) lines = lines.slice(0, MAX_LINES);
      if (lines.length === 0) {
        setOut("");
        setStats(null);
        return;
      }
      const rows = await Promise.all(
        lines.map(async (line) => {
          const t = line.trim();
          try {
            const r = await op.run(t);
            return { input: t, ok: r.ok, value: r.value };
          } catch {
            return { input: t, ok: false, value: "خطا در پردازش" };
          }
        }),
      );
      if (cancel) return;
      const text = rows
        .map((r) => (format === "both" ? `${r.input}: ${r.value}` : r.value))
        .join("\n");
      setOut(text);
      setStats({
        total: rows.length,
        ok: rows.filter((r) => r.ok).length,
        kind: op.kind,
        truncated,
      });
    })();
    return () => {
      cancel = true;
    };
  }, [op, input, format]);

  const fa = (n: number) => n.toLocaleString("fa-IR");

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <Field label="ابزار" hint={op?.kind === "validate" ? "اعتبارسنجی" : "تبدیل"}>
          <Select value={opId} onChange={(e) => setOpId(e.target.value)}>
            {BULK_GROUPS.map((g) => (
              <optgroup key={g} label={g}>
                {BULK_OPS.filter((o) => o.group === g).map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </Select>
        </Field>
        <Field label="قالب خروجی">
          <Segmented
            value={format}
            onChange={setFormat}
            options={[
              { value: "both", label: "ورودی: خروجی" },
              { value: "output", label: "فقط خروجی" },
            ]}
          />
        </Field>
      </div>

      <Grid2>
        <Field label="ورودی (هر مورد در یک خط)">
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={"هر سطر یک مقدار…\nمقدار دوم\nمقدار سوم"}
            className="min-h-72"
          />
        </Field>
        <Output
          label="خروجی"
          value={out}
          className="min-h-72"
          download={{ filename: `bulk-${opId}.txt` }}
        />
      </Grid2>

      {stats && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Stat label="تعداد خطوط" value={fa(stats.total)} />
          {stats.kind === "validate" ? (
            <>
              <Stat label="معتبر" value={fa(stats.ok)} />
              <Stat label="نامعتبر" value={fa(stats.total - stats.ok)} />
            </>
          ) : (
            <>
              <Stat label="موفق" value={fa(stats.ok)} />
              <Stat label="خطا" value={fa(stats.total - stats.ok)} />
            </>
          )}
        </div>
      )}
      {stats?.truncated && (
        <p className="text-xs text-saffron">
          فقط {fa(MAX_LINES)} خط نخست پردازش شد؛ برای حجم بیشتر ورودی را تقسیم کنید.
        </p>
      )}
      <p className="text-xs text-faint">
        هر خط مستقل پردازش می‌شود و همه‌چیز در مرورگر شما اجرا می‌گردد؛ خطوط خالی نادیده
        گرفته می‌شوند.
      </p>
    </div>
  );
}

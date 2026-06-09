"use client";

import { useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Field, Grid2, TextInput } from "@/components/tool/kit";

function Badge({ pass, label }: { pass: boolean; label: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm",
        pass
          ? "border-success/40 bg-success/10 text-success"
          : "border-danger/40 bg-danger/10 text-danger",
      )}
    >
      {pass ? <Check className="size-4 shrink-0" /> : <X className="size-4 shrink-0" />}
      <span className="font-medium">{label}</span>
      <span className="ms-auto font-mono text-xs">{pass ? "قبول" : "رد"}</span>
    </div>
  );
}

export default function TouchTargetTool() {
  const [w, setW] = useState("44");
  const [h, setH] = useState("44");

  const { wn, hn, min } = useMemo(() => {
    const wn = Math.max(0, Number(w) || 0);
    const hn = Math.max(0, Number(h) || 0);
    return { wn, hn, min: Math.min(wn, hn) };
  }, [w, h]);

  const passAAA = min >= 44; // WCAG 2.5.5 (AAA)
  const passAA = min >= 24; // WCAG 2.5.8 (AA)
  const previewSize = Math.max(8, Math.min(160, min || 0));

  return (
    <div className="space-y-4">
      <Grid2>
        <Field label="عرض (px)">
          <TextInput
            mono
            dir="ltr"
            type="number"
            inputMode="numeric"
            value={w}
            onChange={(e) => setW(e.target.value)}
            placeholder="44"
          />
        </Field>
        <Field label="ارتفاع (px)">
          <TextInput
            mono
            dir="ltr"
            type="number"
            inputMode="numeric"
            value={h}
            onChange={(e) => setH(e.target.value)}
            placeholder="44"
          />
        </Field>
      </Grid2>

      {wn > 0 && hn > 0 && (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <Badge pass={passAA} label="WCAG 2.5.8 — حداقل ۲۴×۲۴ (سطح AA)" />
            <Badge pass={passAAA} label="WCAG 2.5.5 — حداقل ۴۴×۴۴ (سطح AAA)" />
          </div>

          <Field label="نمای بصری (نسبت به آستانهٔ ۴۴px)">
            <div className="grid min-h-44 place-items-center rounded-xl border border-border bg-bg-soft p-4">
              <div className="relative grid place-items-center">
                {/* 44px reference outline */}
                <div className="absolute rounded-md border-2 border-dashed border-faint" style={{ width: 44, height: 44 }} />
                {/* actual target */}
                <div
                  className={cn(
                    "rounded-md",
                    passAAA ? "bg-success/70" : passAA ? "bg-saffron/70" : "bg-danger/70",
                  )}
                  style={{ width: previewSize, height: previewSize }}
                  title={`${wn}×${hn}px`}
                />
              </div>
            </div>
          </Field>
          <p className="text-xs text-muted">
            کوچک‌ترین بُعد هدف <span className="font-mono text-fg">{min}px</span> است.
            خط‌چین، آستانهٔ توصیه‌شدهٔ ۴۴px را نشان می‌دهد.
          </p>
        </>
      )}
    </div>
  );
}

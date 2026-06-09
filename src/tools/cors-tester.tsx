"use client";

import { useState } from "react";
import { CheckCircle2, Send, XCircle } from "lucide-react";
import { Button, ErrorNote, Field, Panel, TextInput } from "@/components/tool/kit";

interface Result {
  ok: boolean;
  corsBlocked: boolean;
  status?: number;
  statusText?: string;
  type?: string;
  message: string;
}

export default function CorsTesterTool() {
  const [url, setUrl] = useState<string>("");
  const [res, setRes] = useState<Result | null>(null);
  const [err, setErr] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const run = async () => {
    const u = url.trim();
    if (!u) return;
    try {
      new URL(u);
    } catch {
      setErr("آدرس URL نامعتبر است.");
      setRes(null);
      return;
    }
    setLoading(true);
    setErr("");
    setRes(null);
    try {
      const r = await fetch(u, { method: "GET", mode: "cors" });
      setRes({
        ok: true,
        corsBlocked: false,
        status: r.status,
        statusText: r.statusText,
        type: r.type,
        message: "درخواست موفق بود و پاسخ از سمت مرورگر قابل‌خواندن است؛ CORS اجازه داده است.",
      });
    } catch (e) {
      const isType = e instanceof TypeError;
      setRes({
        ok: false,
        corsBlocked: isType,
        message: isType
          ? "درخواست توسط مرورگر مسدود شد — به‌احتمال زیاد سرور هدر CORS لازم (Access-Control-Allow-Origin) را برنمی‌گرداند، یا آدرس در دسترس نیست."
          : "درخواست ناموفق بود.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Field label="آدرس مقصد (URL)">
        <div className="flex gap-2">
          <TextInput
            mono
            dir="ltr"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run()}
            placeholder="https://api.example.com/data"
          />
          <Button variant="primary" onClick={run} disabled={loading} className="gap-1.5">
            <Send className="size-4" />
            {loading ? "…" : "آزمون"}
          </Button>
        </div>
      </Field>

      {err && <ErrorNote>{err}</ErrorNote>}

      {res && (
        <Panel>
          <div className="flex items-start gap-3">
            {res.ok ? (
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
            ) : (
              <XCircle className="mt-0.5 size-5 shrink-0 text-danger" />
            )}
            <div className="space-y-2">
              <div className={`font-semibold ${res.ok ? "text-success" : "text-danger"}`}>
                {res.ok ? "CORS مجاز است" : res.corsBlocked ? "احتمالاً CORS مسدود است" : "ناموفق"}
              </div>
              <p className="text-sm text-muted">{res.message}</p>
              {res.ok && (
                <div className="flex flex-wrap gap-2 pt-1" dir="ltr">
                  {res.status != null && (
                    <span className="rounded-md border border-border bg-surface-2 px-2 py-1 font-mono text-xs text-fg">
                      status: {res.status} {res.statusText}
                    </span>
                  )}
                  {res.type && (
                    <span className="rounded-md border border-border bg-surface-2 px-2 py-1 font-mono text-xs text-fg">
                      type: {res.type}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </Panel>
      )}

      <p className="text-xs text-muted">
        توجه: مرورگر جزئیات خطای CORS را پنهان می‌کند؛ این ابزار تنها می‌تواند موفقیت یا شکست درخواست را گزارش دهد.
      </p>
    </div>
  );
}

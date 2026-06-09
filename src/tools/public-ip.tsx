"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button, CopyButton, ErrorNote, Field } from "@/components/tool/kit";
import { getServerSeenIp } from "@/app/actions/server-ip";

export default function PublicIpTool() {
  const [v4, setV4] = useState<string>("");
  const [v6, setV6] = useState<string>("");
  const [serverIp, setServerIp] = useState<string>("");
  const [serverSrc, setServerSrc] = useState<string>("");
  const [err, setErr] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchIps = useCallback(async () => {
    setLoading(true);
    setErr("");
    // Client-side lookup via ipify
    try {
      const [r4, r6] = await Promise.all([
        fetch("https://api.ipify.org?format=json").then((r) => r.json()),
        fetch("https://api64.ipify.org?format=json").then((r) => r.json()),
      ]);
      setV4(r4?.ip ?? "");
      setV6(r6?.ip ?? "");
    } catch {
      setErr("دریافت آی‌پی ناموفق بود. اتصال اینترنت را بررسی کنید.");
    }
    // What this site's server sees (request headers)
    try {
      const s = await getServerSeenIp();
      setServerIp(s.ip);
      setServerSrc(s.source);
    } catch {
      setServerIp("");
      setServerSrc("");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancel = false;
    (async () => {
      if (!cancel) await fetchIps();
    })();
    return () => {
      cancel = true;
    };
  }, [fetchIps]);

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-bg-soft px-4 py-3">
      <span className="w-28 shrink-0 text-xs text-saffron">{label}</span>
      <code dir="ltr" className="min-w-0 flex-1 truncate font-mono text-sm text-fg">
        {value || (loading ? "در حال دریافت…" : "—")}
      </code>
      <CopyButton value={value} />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="primary" onClick={fetchIps} disabled={loading} className="gap-1.5">
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "در حال دریافت…" : "تازه‌سازی"}
        </Button>
      </div>
      {err && <ErrorNote>{err}</ErrorNote>}
      <Field label="آدرس‌های عمومی شما (از سرویس ipify)">
        <div className="space-y-2">
          <Row label="IPv4" value={v4} />
          <Row label="IPv6" value={v6} />
        </div>
      </Field>
      <p className="text-xs text-muted">
        اگر IPv6 خالی است، شبکهٔ شما احتمالاً از آن پشتیبانی نمی‌کند.
      </p>

      <Field label="آی‌پی نزد سرور این سایت">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-bg-soft px-4 py-3">
          <span className="w-28 shrink-0 text-xs text-saffron">سرور می‌بیند</span>
          <code dir="ltr" className="min-w-0 flex-1 truncate font-mono text-sm text-fg">
            {serverIp ||
              (loading ? "در حال دریافت…" : "نامشخص (پشت پراکسی نیستید یا محیط توسعه)")}
          </code>
          <CopyButton value={serverIp} />
        </div>
      </Field>
      <p className="text-xs text-muted">
        این مقدار از طریق اکشن سرور و هدرهای درخواست (مانند{" "}
        <code className="font-mono text-faint" dir="ltr">
          X-Forwarded-For
        </code>
        ) خوانده می‌شود{serverSrc ? ` (منبع: ${serverSrc})` : ""} و ممکن است با آدرس
        بالا متفاوت باشد. تنها فراداده‌ی درخواست خوانده می‌شود؛ محتوایی ارسال نمی‌شود.
      </p>
    </div>
  );
}

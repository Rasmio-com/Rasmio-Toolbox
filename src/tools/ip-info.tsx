"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { Globe, MapPin, Network, Search } from "lucide-react";
import { Button, CopyButton, ErrorNote, Field, TextInput } from "@/components/tool/kit";
import { lookupIp, type IpInfo } from "@/app/actions/ip-info";

// 2-letter country code → flag emoji (regional indicator symbols)
function flag(cc?: string): string {
  if (!cc || cc.length !== 2) return "";
  return String.fromCodePoint(
    ...[...cc.toUpperCase()].map((ch) => 0x1f1e6 + ch.charCodeAt(0) - 65),
  );
}

export default function IpInfoTool() {
  const [ip, setIp] = useState("");
  const [res, setRes] = useState<IpInfo | null>(null);
  const [pending, startTransition] = useTransition();

  const run = useCallback((value?: string) => {
    startTransition(async () => setRes(await lookupIp(value)));
  }, []);

  // Auto-detect the visitor's own IP on first load.
  useEffect(() => {
    run();
  }, [run]);

  const rows: [string, string | undefined][] = res?.ok
    ? [
        [
          "کشور",
          res.country
            ? `${flag(res.countryCode)} ${res.country}${res.countryCode ? ` (${res.countryCode})` : ""}`
            : undefined,
        ],
        ["استان/منطقه", res.region],
        ["شهر", res.city],
        ["منطقهٔ زمانی", res.timezone],
        ["مختصات", res.latitude != null ? `${res.latitude}, ${res.longitude}` : undefined],
        ["شمارهٔ AS", res.asn != null ? `AS${res.asn}` : undefined],
        ["سازمان / ISP", res.org],
      ]
    : [];
  const dataRows = rows.filter(([, v]) => v != null && v !== "");

  return (
    <div className="space-y-4">
      <Field label="آدرس IP (خالی بگذارید تا آی‌پی خودتان بررسی شود)">
        <div className="flex flex-wrap gap-2">
          <TextInput
            mono
            dir="ltr"
            className="min-w-48 flex-1"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run(ip)}
            placeholder="8.8.8.8 یا 2001:4860:4860::8888"
          />
          <Button variant="primary" onClick={() => run(ip)} disabled={pending} className="gap-1.5">
            <Search className="size-4" />
            {pending ? "در حال جست‌وجو…" : "جست‌وجو"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setIp("");
              run();
            }}
            disabled={pending}
            className="gap-1.5"
          >
            <Globe className="size-4" />
            آی‌پی من
          </Button>
        </div>
      </Field>

      {res?.error && <ErrorNote>{res.error}</ErrorNote>}

      {res?.ok && res.ip && (
        <>
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-bg-soft px-4 py-3">
            <Network className="size-4 shrink-0 text-turquoise" />
            <code dir="ltr" className="min-w-0 flex-1 truncate font-mono text-base font-bold text-fg">
              {res.ip}
            </code>
            {res.autodetected && (
              <span className="rounded-lg border border-saffron/40 px-2 py-0.5 text-xs text-saffron">
                آی‌پی شما{res.source ? ` · ${res.source}` : ""}
              </span>
            )}
            <CopyButton value={res.ip} />
          </div>

          {dataRows.length > 0 && (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {dataRows.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-xl border border-border bg-bg-soft px-4 py-3"
                >
                  <span className="w-24 shrink-0 text-xs text-saffron">{label}</span>
                  <code dir="ltr" className="min-w-0 flex-1 truncate font-mono text-sm text-fg">
                    {value}
                  </code>
                </div>
              ))}
            </div>
          )}

          {res.latitude != null && res.longitude != null && (
            <a
              href={`https://www.openstreetmap.org/?mlat=${res.latitude}&mlon=${res.longitude}#map=10/${res.latitude}/${res.longitude}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-turquoise hover:underline"
            >
              <MapPin className="size-4" />
              نمایش روی نقشه
            </a>
          )}
        </>
      )}

      <p className="text-xs text-muted">
        داده‌ها از پایگاه‌دادهٔ محلیِ{" "}
        <a
          href="https://db-ip.com"
          target="_blank"
          rel="noreferrer"
          className="text-turquoise hover:underline"
        >
          DB-IP
        </a>{" "}
        (مجوز CC BY) خوانده می‌شود. آدرس واردشده فقط برای جست‌وجوی محلی به سرور این سایت می‌رود و به
        هیچ سرویس بیرونی ارسال نمی‌شود.
      </p>
    </div>
  );
}

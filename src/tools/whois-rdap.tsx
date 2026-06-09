"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button, ErrorNote, Field, Panel, TextInput } from "@/components/tool/kit";

interface RdapEntity {
  roles?: string[];
  vcardArray?: [string, [string, object, string, string][]];
}
interface RdapEvent {
  eventAction?: string;
  eventDate?: string;
}
interface RdapNameserver {
  ldhName?: string;
}
interface RdapResponse {
  ldhName?: string;
  status?: string[];
  events?: RdapEvent[];
  entities?: RdapEntity[];
  nameservers?: RdapNameserver[];
  errorCode?: number;
  title?: string;
}

const EVENT_FA: Record<string, string> = {
  registration: "ثبت",
  expiration: "انقضا",
  "last changed": "آخرین تغییر",
  "last update of RDAP database": "آخرین به‌روزرسانی پایگاه RDAP",
  transfer: "انتقال",
  reregistration: "ثبت مجدد",
};

function registrarName(data: RdapResponse): string {
  const reg = data.entities?.find((e) => e.roles?.includes("registrar"));
  const fn = reg?.vcardArray?.[1]?.find((row) => row[0] === "fn");
  return (fn?.[3] as string) || "—";
}

export default function WhoisRdapTool() {
  const [domain, setDomain] = useState<string>("");
  const [data, setData] = useState<RdapResponse | null>(null);
  const [err, setErr] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const run = async () => {
    const d = domain.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    if (!d) return;
    setLoading(true);
    setErr("");
    setData(null);
    try {
      const res = await fetch(`https://rdap.org/domain/${encodeURIComponent(d)}`);
      if (!res.ok) {
        setErr(res.status === 404 ? "دامنه یافت نشد یا ثبت نشده است." : `خطای سرور (${res.status}).`);
        return;
      }
      const json = (await res.json()) as RdapResponse;
      setData(json);
    } catch {
      setErr("دریافت اطلاعات WHOIS ناموفق بود. اتصال اینترنت را بررسی کنید.");
    } finally {
      setLoading(false);
    }
  };

  const events = data?.events ?? [];
  const nameservers = data?.nameservers ?? [];
  const statuses = data?.status ?? [];

  return (
    <div className="space-y-4">
      <Field label="دامنه">
        <div className="flex gap-2">
          <TextInput
            mono
            dir="ltr"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run()}
            placeholder="example.com"
          />
          <Button variant="primary" onClick={run} disabled={loading} className="gap-1.5">
            <Search className="size-4" />
            {loading ? "…" : "جست‌وجو"}
          </Button>
        </div>
      </Field>

      {err && <ErrorNote>{err}</ErrorNote>}

      {data && (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-bg-soft px-4 py-3">
              <div className="text-xs text-muted">دامنه</div>
              <code dir="ltr" className="text-sm font-semibold text-fg">
                {data.ldhName ?? domain.trim()}
              </code>
            </div>
            <div className="rounded-xl border border-border bg-bg-soft px-4 py-3">
              <div className="text-xs text-muted">ثبت‌کننده (Registrar)</div>
              <div dir="ltr" className="text-sm font-semibold text-fg">
                {registrarName(data)}
              </div>
            </div>
          </div>

          {events.length > 0 && (
            <Panel title="تاریخ‌های مهم">
              <div className="space-y-1.5" dir="ltr">
                {events.map((ev, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="w-44 shrink-0 text-saffron">
                      {EVENT_FA[ev.eventAction ?? ""] ?? ev.eventAction}
                    </span>
                    <code className="text-fg">
                      {ev.eventDate ? new Date(ev.eventDate).toISOString().replace("T", " ").slice(0, 19) : "—"}
                    </code>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {statuses.length > 0 && (
            <Panel title="وضعیت‌ها">
              <div className="flex flex-wrap gap-2" dir="ltr">
                {statuses.map((s, i) => (
                  <span
                    key={i}
                    className="rounded-md border border-border bg-surface-2 px-2 py-1 font-mono text-xs text-muted"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Panel>
          )}

          {nameservers.length > 0 && (
            <Panel title={`Nameserverها (${nameservers.length})`}>
              <div className="space-y-1" dir="ltr">
                {nameservers.map((ns, i) => (
                  <code key={i} className="block break-all text-sm text-fg">
                    {ns.ldhName}
                  </code>
                ))}
              </div>
            </Panel>
          )}
        </>
      )}
    </div>
  );
}

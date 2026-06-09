"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button, CopyButton, ErrorNote, Field, Panel, TextInput } from "@/components/tool/kit";
import { toAsciiDigits } from "@/lib/utils";

function parseIPv4(s: string): number[] | null {
  const parts = s.split(".");
  if (parts.length !== 4) return null;
  const out: number[] = [];
  for (const p of parts) {
    if (!/^\d{1,3}$/.test(p)) return null;
    const n = Number(p);
    if (n > 255) return null;
    out.push(n);
  }
  return out;
}

interface Answer {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

export default function ReverseDnsTool() {
  const [ip, setIp] = useState<string>("");
  const [arpa, setArpa] = useState<string>("");
  const [hosts, setHosts] = useState<Answer[] | null>(null);
  const [err, setErr] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const run = async () => {
    const s = toAsciiDigits(ip.trim());
    const octets = parseIPv4(s);
    if (!s) return;
    if (!octets) {
      setErr("آدرس IPv4 نامعتبر است.");
      setHosts(null);
      setArpa("");
      return;
    }
    const name = `${octets.slice().reverse().join(".")}.in-addr.arpa`;
    setArpa(name);
    setLoading(true);
    setErr("");
    setHosts(null);
    try {
      const res = await fetch(
        `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=PTR`,
        { headers: { accept: "application/dns-json" } },
      );
      const json = await res.json();
      const ans = (json.Answer ?? []) as Answer[];
      if (ans.length === 0) {
        setErr("هیچ رکورد PTR (نام میزبان) برای این آدرس یافت نشد.");
        return;
      }
      setHosts(ans);
    } catch {
      setErr("جست‌وجوی DNS معکوس ناموفق بود. اتصال اینترنت را بررسی کنید.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Field label="آدرس IPv4">
        <div className="flex gap-2">
          <TextInput
            mono
            dir="ltr"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run()}
            placeholder="8.8.8.8"
          />
          <Button variant="primary" onClick={run} disabled={loading} className="gap-1.5">
            <Search className="size-4" />
            {loading ? "…" : "جست‌وجو"}
          </Button>
        </div>
      </Field>

      {arpa && (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-bg-soft px-3 py-2.5">
          <span className="w-28 shrink-0 text-xs text-saffron">نام معکوس</span>
          <code dir="ltr" className="min-w-0 flex-1 truncate font-mono text-sm text-fg">
            {arpa}
          </code>
          <CopyButton value={arpa} />
        </div>
      )}

      {err && <ErrorNote>{err}</ErrorNote>}

      {hosts && hosts.length > 0 && (
        <Panel title={`نام‌های میزبان (${hosts.length})`}>
          <div className="space-y-2" dir="ltr">
            {hosts.map((h, i) => (
              <div key={i} className="flex items-center gap-3">
                <code className="min-w-0 flex-1 break-all text-sm text-fg">{h.data}</code>
                <CopyButton value={h.data} />
              </div>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}

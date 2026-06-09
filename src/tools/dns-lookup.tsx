"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button, CopyButton, ErrorNote, Field, Panel, Select, TextInput } from "@/components/tool/kit";

const TYPES = ["A", "AAAA", "MX", "TXT", "NS", "CNAME", "SOA"];
const TYPE_NAMES: Record<number, string> = {
  1: "A",
  2: "NS",
  5: "CNAME",
  6: "SOA",
  15: "MX",
  16: "TXT",
  28: "AAAA",
};

interface Answer {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

export default function DnsLookupTool() {
  const [domain, setDomain] = useState<string>("");
  const [type, setType] = useState<string>("A");
  const [answers, setAnswers] = useState<Answer[] | null>(null);
  const [err, setErr] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const run = async () => {
    const d = domain.trim();
    if (!d) return;
    setLoading(true);
    setErr("");
    setAnswers(null);
    try {
      const res = await fetch(
        `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(d)}&type=${type}`,
        { headers: { accept: "application/dns-json" } },
      );
      const json = await res.json();
      if (json.Status !== 0 && !json.Answer) {
        setErr("رکوردی یافت نشد یا دامنه نامعتبر است.");
        return;
      }
      setAnswers((json.Answer ?? []) as Answer[]);
    } catch {
      setErr("جست‌وجوی DNS ناموفق بود. اتصال اینترنت را بررسی کنید.");
    } finally {
      setLoading(false);
    }
  };

  const answersText = answers?.map((a) => `${a.name}\t${a.TTL}\t${TYPE_NAMES[a.type] ?? a.type}\t${a.data}`).join("\n");

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto] sm:items-end">
        <Field label="دامنه">
          <TextInput
            mono
            dir="ltr"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run()}
            placeholder="example.com"
          />
        </Field>
        <Field label="نوع رکورد" className="sm:w-40">
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </Field>
        <Button variant="primary" onClick={run} disabled={loading} className="gap-1.5">
          <Search className="size-4" />
          {loading ? "در حال جست‌وجو…" : "جست‌وجو"}
        </Button>
      </div>

      {err && <ErrorNote>{err}</ErrorNote>}

      {answers && answers.length === 0 && !err && (
        <p className="text-sm text-muted">هیچ رکوردی از نوع {type} یافت نشد.</p>
      )}

      {answers && answers.length > 0 && (
        <Panel
          title={`پاسخ‌ها (${answers.length})`}
          actions={answersText ? <CopyButton value={answersText} /> : null}
        >
          <div className="space-y-1.5" dir="ltr">
            <div className="flex gap-2 border-b border-border pb-1 text-xs font-semibold text-muted">
              <span className="min-w-0 flex-[2] truncate">Name</span>
              <span className="w-12 shrink-0">Type</span>
              <span className="w-16 shrink-0">TTL</span>
              <span className="min-w-0 flex-[3] truncate">Data</span>
            </div>
            {answers.map((a, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <code className="min-w-0 flex-[2] truncate text-muted">{a.name}</code>
                <code className="w-12 shrink-0 text-turquoise">{TYPE_NAMES[a.type] ?? a.type}</code>
                <code className="w-16 shrink-0 text-faint">{a.TTL}</code>
                <code className="min-w-0 flex-[3] break-all text-fg">{a.data}</code>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}

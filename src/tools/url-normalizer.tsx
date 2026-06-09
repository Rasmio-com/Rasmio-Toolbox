"use client";

import { useMemo, useState } from "react";
import { ErrorNote, Field, Output, TextInput, Toggle } from "@/components/tool/kit";

const DEFAULT_PORTS: Record<string, string> = {
  "http:": "80",
  "https:": "443",
  "ftp:": "21",
  "ws:": "80",
  "wss:": "443",
};

export default function UrlNormalizerTool() {
  const [input, setInput] = useState("");
  const [sortParams, setSortParams] = useState(true);
  const [stripSlash, setStripSlash] = useState(true);

  const { out, err } = useMemo(() => {
    if (!input.trim()) return { out: "", err: "" };
    try {
      // URL constructor already lowercases scheme/host and resolves ./.. segments.
      const u = new URL(input.trim());

      // Remove default port for the scheme.
      if (u.port && DEFAULT_PORTS[u.protocol] === u.port) u.port = "";

      // Sort query parameters by key.
      if (sortParams) {
        const entries = [...u.searchParams.entries()].sort((a, b) =>
          a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0,
        );
        const sp = new URLSearchParams();
        for (const [k, v] of entries) sp.append(k, v);
        u.search = sp.toString() ? "?" + sp.toString() : "";
      }

      // Strip trailing slash from the path (but keep root "/").
      if (stripSlash && u.pathname.length > 1 && u.pathname.endsWith("/")) {
        u.pathname = u.pathname.replace(/\/+$/, "");
      }

      return { out: u.toString(), err: "" };
    } catch {
      return { out: "", err: "آدرس نامعتبر است (پروتکل مانند https:// را اضافه کنید)." };
    }
  }, [input, sortParams, stripSlash]);

  return (
    <div className="space-y-4">
      <Field label="آدرس ورودی">
        <TextInput
          mono
          dir="ltr"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="HTTPS://Example.com:443/a/../b/?z=1&a=2/"
        />
      </Field>
      <div className="flex flex-wrap items-center gap-5">
        <Toggle checked={sortParams} onChange={setSortParams} label="مرتب‌سازی پارامترها" />
        <Toggle checked={stripSlash} onChange={setStripSlash} label="حذف اسلش انتهایی" />
      </div>
      {err && <ErrorNote>{err}</ErrorNote>}
      <Output label="آدرس نرمال‌شده" value={out} />
    </div>
  );
}

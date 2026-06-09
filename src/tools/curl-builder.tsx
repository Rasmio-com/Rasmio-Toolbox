"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button, Field, Output, Select, TextArea, TextInput, Toggle } from "@/components/tool/kit";

type Header = { key: string; value: string };
const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];

function shellQuote(s: string): string {
  return `'${s.replace(/'/g, `'\\''`)}'`;
}

export default function CurlBuilderTool() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState<Header[]>([{ key: "", value: "" }]);
  const [body, setBody] = useState("");
  const [useAuth, setUseAuth] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const setHeader = (i: number, patch: Partial<Header>) =>
    setHeaders((h) => h.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  const addHeader = () => setHeaders((h) => [...h, { key: "", value: "" }]);
  const removeHeader = (i: number) => setHeaders((h) => h.filter((_, idx) => idx !== i));

  const curl = useMemo(() => {
    if (!url.trim()) return "";
    // Each element is a full token group; joined with line continuations.
    const parts = ["curl"];
    if (method !== "GET") parts.push(`-X ${method}`);
    parts.push(shellQuote(url.trim()));
    for (const h of headers) {
      if (h.key.trim()) parts.push(`-H ${shellQuote(`${h.key.trim()}: ${h.value}`)}`);
    }
    if (useAuth && (user || pass)) parts.push(`-u ${shellQuote(`${user}:${pass}`)}`);
    if (body.trim()) parts.push(`-d ${shellQuote(body)}`);
    return parts.join(" \\\n  ");
  }, [method, url, headers, body, useAuth, user, pass]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
        <Field label="متد">
          <Select value={method} onChange={(e) => setMethod(e.target.value)}>
            {METHODS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </Select>
        </Field>
        <Field label="آدرس (URL)">
          <TextInput
            mono
            dir="ltr"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/users"
          />
        </Field>
      </div>

      <Field label="هدرها">
        <div className="space-y-2">
          {headers.map((h, i) => (
            <div key={i} className="flex gap-2">
              <TextInput
                mono dir="ltr" className="flex-1"
                value={h.key}
                onChange={(e) => setHeader(i, { key: e.target.value })}
                placeholder="Content-Type"
              />
              <TextInput
                mono dir="ltr" className="flex-1"
                value={h.value}
                onChange={(e) => setHeader(i, { value: e.target.value })}
                placeholder="application/json"
              />
              <Button variant="ghost" onClick={() => removeHeader(i)} aria-label="حذف">
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          <Button variant="secondary" onClick={addHeader} className="gap-1.5">
            <Plus className="size-4" /> افزودن هدر
          </Button>
        </div>
      </Field>

      <Toggle checked={useAuth} onChange={setUseAuth} label="احراز هویت Basic" />
      {useAuth && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="نام کاربری">
            <TextInput mono dir="ltr" value={user} onChange={(e) => setUser(e.target.value)} placeholder="user" />
          </Field>
          <Field label="رمز عبور">
            <TextInput mono dir="ltr" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="pass" />
          </Field>
        </div>
      )}

      <Field label="بدنه (Body)" hint="برای POST/PUT/PATCH">
        <TextArea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder='{"name":"ali"}'
          className="min-h-24"
        />
      </Field>

      <Output label="دستور cURL" value={curl} download={{ filename: "request.sh" }} />
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { ErrorNote, Field, Output, TextArea } from "@/components/tool/kit";

type Parsed = {
  method: string;
  url: string;
  headers: [string, string][];
  body: string;
  auth?: { user: string; pass: string };
};

/** Split a curl command into argv, respecting quotes and line continuations. */
function tokenize(cmd: string): string[] {
  const s = cmd.replace(/\\\r?\n/g, " ");
  const tokens: string[] = [];
  let i = 0;
  while (i < s.length) {
    while (i < s.length && /\s/.test(s[i])) i++;
    if (i >= s.length) break;
    let tok = "";
    while (i < s.length && !/\s/.test(s[i])) {
      const c = s[i];
      if (c === "'") {
        i++;
        while (i < s.length && s[i] !== "'") tok += s[i++];
        i++;
      } else if (c === '"') {
        i++;
        while (i < s.length && s[i] !== '"') {
          if (s[i] === "\\" && i + 1 < s.length) { tok += s[i + 1]; i += 2; }
          else tok += s[i++];
        }
        i++;
      } else {
        tok += c;
        i++;
      }
    }
    tokens.push(tok);
  }
  return tokens;
}

function parseCurl(cmd: string): Parsed | null {
  const tk = tokenize(cmd.trim());
  if (!tk.length || tk[0] !== "curl") return null;
  const parsed: Parsed = { method: "", url: "", headers: [], body: "" };
  for (let i = 1; i < tk.length; i++) {
    const t = tk[i];
    const next = () => tk[++i] ?? "";
    if (t === "-X" || t === "--request") parsed.method = next().toUpperCase();
    else if (t === "-H" || t === "--header") {
      const h = next();
      const idx = h.indexOf(":");
      if (idx > -1) parsed.headers.push([h.slice(0, idx).trim(), h.slice(idx + 1).trim()]);
    } else if (t === "-d" || t === "--data" || t === "--data-raw" || t === "--data-binary") {
      parsed.body += (parsed.body ? "&" : "") + next();
    } else if (t === "-u" || t === "--user") {
      const u = next();
      const idx = u.indexOf(":");
      parsed.auth = { user: idx > -1 ? u.slice(0, idx) : u, pass: idx > -1 ? u.slice(idx + 1) : "" };
    } else if (t === "--url") parsed.url = next();
    else if (!t.startsWith("-") && !parsed.url) parsed.url = t;
    // ignore other flags (-L, -s, -k, etc.)
  }
  if (!parsed.url) return null;
  if (!parsed.method) parsed.method = parsed.body ? "POST" : "GET";
  return parsed;
}

function toFetch(p: Parsed): string {
  const headers = p.headers.map(([k, v]) => `    ${JSON.stringify(k)}: ${JSON.stringify(v)},`);
  if (p.auth) {
    headers.push(`    "Authorization": "Basic " + btoa(${JSON.stringify(`${p.auth.user}:${p.auth.pass}`)}),`);
  }
  const lines = [`const res = await fetch(${JSON.stringify(p.url)}, {`];
  lines.push(`  method: ${JSON.stringify(p.method)},`);
  if (headers.length) lines.push(`  headers: {`, ...headers, `  },`);
  if (p.body) lines.push(`  body: ${JSON.stringify(p.body)},`);
  lines.push(`});`, `const data = await res.json();`);
  return lines.join("\n");
}

function toAxios(p: Parsed): string {
  const cfg: string[] = [`  method: ${JSON.stringify(p.method.toLowerCase())},`, `  url: ${JSON.stringify(p.url)},`];
  if (p.headers.length) {
    cfg.push(`  headers: {`);
    for (const [k, v] of p.headers) cfg.push(`    ${JSON.stringify(k)}: ${JSON.stringify(v)},`);
    cfg.push(`  },`);
  }
  if (p.auth) cfg.push(`  auth: { username: ${JSON.stringify(p.auth.user)}, password: ${JSON.stringify(p.auth.pass)} },`);
  if (p.body) cfg.push(`  data: ${JSON.stringify(p.body)},`);
  return `const res = await axios({\n${cfg.join("\n")}\n});`;
}

export default function CurlToCodeTool() {
  const [input, setInput] = useState("");

  const result = useMemo(() => {
    if (!input.trim()) return null;
    const p = parseCurl(input);
    if (!p) return { error: "دستور cURL معتبر یافت نشد (باید با curl و یک URL شروع شود)." };
    return { fetch: toFetch(p), axios: toAxios(p) };
  }, [input]);

  return (
    <div className="space-y-4">
      <Field label="دستور cURL">
        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`curl -X POST https://api.example.com/u -H 'Content-Type: application/json' -d '{"a":1}'`}
          className="min-h-28"
        />
      </Field>

      {result?.error && <ErrorNote>{result.error}</ErrorNote>}

      {result && !result.error && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Output label="fetch()" value={result.fetch ?? ""} download={{ filename: "fetch.js" }} />
          <Output label="axios" value={result.axios ?? ""} download={{ filename: "axios.js" }} />
        </div>
      )}
    </div>
  );
}

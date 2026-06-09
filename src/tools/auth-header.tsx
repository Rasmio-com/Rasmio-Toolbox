"use client";

import { useMemo, useState } from "react";
import { ErrorNote, Field, Grid2, Output, Panel, Segmented, TextArea, TextInput } from "@/components/tool/kit";

function b64Encode(s: string): string {
  return btoa(unescape(encodeURIComponent(s)));
}
function b64Decode(s: string): string {
  return decodeURIComponent(escape(atob(s)));
}
function b64urlDecode(s: string): string {
  let t = s.replace(/-/g, "+").replace(/_/g, "/");
  while (t.length % 4) t += "=";
  return decodeURIComponent(escape(atob(t)));
}

export default function AuthHeaderTool() {
  const [mode, setMode] = useState<"build" | "parse">("build");
  const [scheme, setScheme] = useState<"basic" | "bearer">("basic");
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [token, setToken] = useState("");
  const [header, setHeader] = useState("");

  const built = useMemo(() => {
    if (mode !== "build") return "";
    if (scheme === "basic") {
      if (!user && !pass) return "";
      return "Authorization: Basic " + b64Encode(`${user}:${pass}`);
    }
    if (!token.trim()) return "";
    return "Authorization: Bearer " + token.trim();
  }, [mode, scheme, user, pass, token]);

  const parsed = useMemo<{
    error?: string;
    kind?: "basic" | "jwt" | "token";
    label?: string;
    user?: string;
    pass?: string;
    token?: string;
    jwtHeader?: string;
    jwtPayload?: string;
  } | null>(() => {
    if (mode !== "parse" || !header.trim()) return null;
    const raw = header.replace(/^\s*Authorization:\s*/i, "").trim();
    const m = /^(\w+)\s+([\s\S]*)$/.exec(raw);
    if (!m) return { error: "هدر باید به شکل «<scheme> <credentials>» باشد." };
    const sch = m[1].toLowerCase();
    const cred = m[2].trim();
    try {
      if (sch === "basic") {
        const dec = b64Decode(cred);
        const idx = dec.indexOf(":");
        if (idx === -1) throw new Error("no colon");
        return { kind: "basic", user: dec.slice(0, idx), pass: dec.slice(idx + 1) };
      }
      if (sch === "bearer") {
        const parts = cred.split(".");
        if (parts.length >= 2) {
          return {
            kind: "jwt",
            jwtHeader: JSON.stringify(JSON.parse(b64urlDecode(parts[0])), null, 2),
            jwtPayload: JSON.stringify(JSON.parse(b64urlDecode(parts[1])), null, 2),
          };
        }
        return { kind: "token", label: "Bearer", token: cred };
      }
      return { kind: "token", label: m[1], token: cred };
    } catch {
      return { error: "رمزگشایی اعتبارنامه ناموفق بود." };
    }
  }, [mode, header]);

  return (
    <div className="space-y-4">
      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: "build", label: "ساخت هدر" },
          { value: "parse", label: "تجزیه هدر" },
        ]}
      />

      {mode === "build" ? (
        <>
          <Segmented
            value={scheme}
            onChange={setScheme}
            options={[
              { value: "basic", label: "Basic" },
              { value: "bearer", label: "Bearer" },
            ]}
          />
          {scheme === "basic" ? (
            <Grid2>
              <Field label="نام کاربری">
                <TextInput mono dir="ltr" value={user} onChange={(e) => setUser(e.target.value)} placeholder="admin" />
              </Field>
              <Field label="رمز عبور">
                <TextInput mono dir="ltr" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="secret" />
              </Field>
            </Grid2>
          ) : (
            <Field label="توکن">
              <TextArea
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="eyJhbGciOi..."
                className="min-h-20"
              />
            </Field>
          )}
          <Output label="هدر Authorization" value={built} />
        </>
      ) : (
        <>
          <Field label="هدر Authorization" hint="با یا بدون پیشوند «Authorization:»">
            <TextArea
              value={header}
              onChange={(e) => setHeader(e.target.value)}
              placeholder="Authorization: Bearer eyJhbGci..."
              className="min-h-20"
            />
          </Field>
          {parsed?.error && <ErrorNote>{parsed.error}</ErrorNote>}
          {parsed?.kind === "basic" && (
            <Grid2>
              <Output label="نام کاربری" value={parsed.user ?? ""} />
              <Output label="رمز عبور" value={parsed.pass ?? ""} />
            </Grid2>
          )}
          {parsed?.kind === "jwt" && (
            <>
              <Panel title="نوع">
                <p className="text-sm text-fg">Bearer — توکن JWT</p>
              </Panel>
              <Grid2>
                <Output label="JWT Header" value={parsed.jwtHeader ?? ""} />
                <Output label="JWT Payload" value={parsed.jwtPayload ?? ""} />
              </Grid2>
            </>
          )}
          {parsed?.kind === "token" && (
            <Output label={`توکن (${parsed.label})`} value={parsed.token ?? ""} />
          )}
        </>
      )}
    </div>
  );
}

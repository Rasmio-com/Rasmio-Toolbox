"use client";

import { useMemo, useState } from "react";
import {
  ErrorNote,
  Field,
  Output,
  Segmented,
  TextArea,
  TextInput,
} from "@/components/tool/kit";

function b64Encode(s: string): string {
  return btoa(unescape(encodeURIComponent(s)));
}
function b64Decode(s: string): string {
  return decodeURIComponent(escape(atob(s)));
}

export default function BasicAuthTool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [header, setHeader] = useState("");

  const encoded = useMemo(() => {
    if (mode !== "encode" || (!user && !pass)) return "";
    return "Authorization: Basic " + b64Encode(`${user}:${pass}`);
  }, [user, pass, mode]);

  const decoded = useMemo(() => {
    if (mode !== "decode" || !header.trim()) return { user: "", pass: "", err: "" };
    try {
      const token = header.replace(/^\s*Authorization:\s*/i, "").replace(/^Basic\s+/i, "").trim();
      const raw = b64Decode(token);
      const idx = raw.indexOf(":");
      if (idx === -1) throw new Error("no colon");
      return { user: raw.slice(0, idx), pass: raw.slice(idx + 1), err: "" };
    } catch {
      return { user: "", pass: "", err: "هدر Basic نامعتبر است." };
    }
  }, [header, mode]);

  return (
    <div className="space-y-4">
      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: "encode", label: "ساخت هدر" },
          { value: "decode", label: "رمزگشایی هدر" },
        ]}
      />

      {mode === "encode" ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="نام کاربری">
              <TextInput
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="admin"
                dir="ltr"
              />
            </Field>
            <Field label="رمز عبور">
              <TextInput
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="secret"
                dir="ltr"
              />
            </Field>
          </div>
          <Output label="هدر Authorization" value={encoded} mono />
        </>
      ) : (
        <>
          <Field label="هدر Basic" hint="با یا بدون «Authorization: Basic»">
            <TextArea
              value={header}
              onChange={(e) => setHeader(e.target.value)}
              placeholder="Authorization: Basic YWRtaW46c2VjcmV0"
              className="min-h-20"
            />
          </Field>
          {decoded.err ? (
            <ErrorNote>{decoded.err}</ErrorNote>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <Output label="نام کاربری" value={decoded.user} />
              <Output label="رمز عبور" value={decoded.pass} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

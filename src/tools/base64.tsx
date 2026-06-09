"use client";

import { useMemo, useState } from "react";
import {
  ErrorNote,
  Field,
  Grid2,
  Output,
  Segmented,
  TextArea,
  Toggle,
} from "@/components/tool/kit";

export default function Base64Tool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [urlSafe, setUrlSafe] = useState(false);

  const { out, err } = useMemo(() => {
    if (!input) return { out: "", err: "" };
    try {
      if (mode === "encode") {
        const bytes = new TextEncoder().encode(input);
        let bin = "";
        bytes.forEach((b) => (bin += String.fromCharCode(b)));
        let b64 = btoa(bin);
        if (urlSafe)
          b64 = b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
        return { out: b64, err: "" };
      }
      let s = input.trim().replace(/\s+/g, "");
      s = s.replace(/-/g, "+").replace(/_/g, "/");
      while (s.length % 4) s += "=";
      const bin = atob(s);
      const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
      return { out: new TextDecoder().decode(bytes), err: "" };
    } catch {
      return { out: "", err: "ورودی نامعتبر است؛ رشته‌ی Base64 را بررسی کنید." };
    }
  }, [input, mode, urlSafe]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: "encode", label: "کدگذاری" },
            { value: "decode", label: "رمزگشایی" },
          ]}
        />
        <Toggle checked={urlSafe} onChange={setUrlSafe} label="حالت URL-safe" />
      </div>
      <Grid2>
        <Field label={mode === "encode" ? "متن ورودی" : "رشته‌ی Base64"}>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "encode" ? "متن خود را وارد کنید…" : "Base64 را وارد کنید…"
            }
          />
        </Field>
        <Output label="خروجی" value={out} />
      </Grid2>
      {err && <ErrorNote>{err}</ErrorNote>}
    </div>
  );
}

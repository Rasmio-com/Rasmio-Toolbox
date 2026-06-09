"use client";

import { useMemo, useState } from "react";
import { Field, Grid2, Output, Segmented, TextInput } from "@/components/tool/kit";

type Kind = "mailto" | "tel" | "sms" | "geo";

const enc = (s: string) => encodeURIComponent(s);

export default function LinkGeneratorTool() {
  const [kind, setKind] = useState<Kind>("mailto");
  const [f, setF] = useState<Record<string, string>>({});
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));

  const link = useMemo(() => {
    if (kind === "mailto") {
      const to = (f.to ?? "").trim();
      const params: string[] = [];
      for (const k of ["cc", "bcc", "subject", "body"]) {
        const v = (f[k] ?? "").trim();
        if (v) params.push(`${k}=${enc(v)}`);
      }
      if (!to && params.length === 0) return "";
      return `mailto:${to}${params.length ? "?" + params.join("&") : ""}`;
    }
    if (kind === "tel") {
      const n = (f.number ?? "").trim().replace(/\s+/g, "");
      return n ? `tel:${n}` : "";
    }
    if (kind === "sms") {
      const n = (f.number ?? "").trim().replace(/\s+/g, "");
      const body = (f.body ?? "").trim();
      if (!n && !body) return "";
      return `sms:${n}${body ? `?body=${enc(body)}` : ""}`;
    }
    // geo
    const lat = (f.lat ?? "").trim();
    const lon = (f.lon ?? "").trim();
    if (!lat && !lon) return "";
    const z = (f.zoom ?? "").trim();
    return `geo:${lat || "0"},${lon || "0"}${z ? `?z=${z}` : ""}`;
  }, [kind, f]);

  return (
    <div className="space-y-4">
      <Segmented
        value={kind}
        onChange={setKind}
        options={[
          { value: "mailto", label: "ایمیل" },
          { value: "tel", label: "تماس" },
          { value: "sms", label: "پیامک" },
          { value: "geo", label: "موقعیت" },
        ]}
      />

      {kind === "mailto" && (
        <Grid2>
          <Field label="گیرنده (To)">
            <TextInput mono dir="ltr" value={f.to ?? ""} onChange={(e) => set("to", e.target.value)} placeholder="user@example.com" />
          </Field>
          <Field label="رونوشت (Cc)">
            <TextInput mono dir="ltr" value={f.cc ?? ""} onChange={(e) => set("cc", e.target.value)} placeholder="cc@example.com" />
          </Field>
          <Field label="رونوشت پنهان (Bcc)">
            <TextInput mono dir="ltr" value={f.bcc ?? ""} onChange={(e) => set("bcc", e.target.value)} placeholder="bcc@example.com" />
          </Field>
          <Field label="موضوع (Subject)">
            <TextInput value={f.subject ?? ""} onChange={(e) => set("subject", e.target.value)} placeholder="موضوع ایمیل" />
          </Field>
          <Field label="متن (Body)" className="lg:col-span-2">
            <TextInput value={f.body ?? ""} onChange={(e) => set("body", e.target.value)} placeholder="متن پیام" />
          </Field>
        </Grid2>
      )}

      {kind === "tel" && (
        <Field label="شماره تماس">
          <TextInput mono dir="ltr" value={f.number ?? ""} onChange={(e) => set("number", e.target.value)} placeholder="+989121234567" />
        </Field>
      )}

      {kind === "sms" && (
        <Grid2>
          <Field label="شماره">
            <TextInput mono dir="ltr" value={f.number ?? ""} onChange={(e) => set("number", e.target.value)} placeholder="+989121234567" />
          </Field>
          <Field label="متن پیامک">
            <TextInput value={f.body ?? ""} onChange={(e) => set("body", e.target.value)} placeholder="متن پیام" />
          </Field>
        </Grid2>
      )}

      {kind === "geo" && (
        <Grid2>
          <Field label="عرض جغرافیایی (Latitude)">
            <TextInput mono dir="ltr" value={f.lat ?? ""} onChange={(e) => set("lat", e.target.value)} placeholder="35.6892" />
          </Field>
          <Field label="طول جغرافیایی (Longitude)">
            <TextInput mono dir="ltr" value={f.lon ?? ""} onChange={(e) => set("lon", e.target.value)} placeholder="51.3890" />
          </Field>
          <Field label="بزرگ‌نمایی (Zoom)" hint="اختیاری">
            <TextInput mono dir="ltr" value={f.zoom ?? ""} onChange={(e) => set("zoom", e.target.value)} placeholder="15" />
          </Field>
        </Grid2>
      )}

      <Output label="لینک تولیدشده" value={link} />
    </div>
  );
}

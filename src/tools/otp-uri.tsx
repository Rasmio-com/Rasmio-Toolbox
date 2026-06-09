"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import { ErrorNote, Field, Output, Segmented, TextInput } from "@/components/tool/kit";

type OtpType = "totp" | "hotp";

export default function OtpUriTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [type, setType] = useState<OtpType>("totp");
  const [issuer, setIssuer] = useState("Rasmio");
  const [account, setAccount] = useState("user@example.com");
  const [secret, setSecret] = useState("JBSWY3DPEHPK3PXP");
  const [err, setErr] = useState("");

  const uri = useMemo(() => {
    const sec = secret.trim().toUpperCase().replace(/\s/g, "");
    if (!sec || !account.trim()) return "";
    const label = issuer.trim()
      ? `${encodeURIComponent(issuer.trim())}:${encodeURIComponent(account.trim())}`
      : encodeURIComponent(account.trim());
    const params = new URLSearchParams();
    params.set("secret", sec);
    if (issuer.trim()) params.set("issuer", issuer.trim());
    if (type === "hotp") params.set("counter", "0");
    return `otpauth://${type}/${label}?${params.toString()}`;
  }, [type, issuer, account, secret]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!uri) {
      canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    QRCode.toCanvas(canvas, uri, { width: 220, margin: 2 }, (e) =>
      setErr(e ? "تولید کد QR ناموفق بود." : ""),
    );
  }, [uri]);

  return (
    <div className="space-y-4">
      <Segmented
        value={type}
        onChange={setType}
        options={[
          { value: "totp", label: "TOTP" },
          { value: "hotp", label: "HOTP" },
        ]}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="صادرکننده (Issuer)">
          <TextInput value={issuer} onChange={(e) => setIssuer(e.target.value)} placeholder="Rasmio" />
        </Field>
        <Field label="حساب (Account)">
          <TextInput
            dir="ltr"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            placeholder="user@example.com"
          />
        </Field>
      </div>
      <Field label="راز (Base32)">
        <TextInput
          mono
          dir="ltr"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder="JBSWY3DPEHPK3PXP"
        />
      </Field>
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
        <Output label="لینک otpauth://" value={uri} className="min-h-24" />
        {uri && (
          <div className="flex justify-center rounded-2xl border border-border bg-white p-3">
            <canvas ref={canvasRef} />
          </div>
        )}
      </div>
      {err && <ErrorNote>{err}</ErrorNote>}
    </div>
  );
}

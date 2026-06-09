"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button, ErrorNote, Grid2, Output } from "@/components/tool/kit";

function toPem(buf: ArrayBuffer, label: string): string {
  let s = "";
  const bytes = new Uint8Array(buf);
  for (const b of bytes) s += String.fromCharCode(b);
  const b64 = btoa(s);
  const lines = b64.match(/.{1,64}/g)?.join("\n") ?? b64;
  return `-----BEGIN ${label}-----\n${lines}\n-----END ${label}-----`;
}

export default function RsaKeygenTool() {
  const [pub, setPub] = useState("");
  const [priv, setPriv] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const generate = useCallback(async () => {
    setBusy(true);
    setErr("");
    try {
      const pair = await crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"],
      );
      const spki = await crypto.subtle.exportKey("spki", pair.publicKey);
      const pkcs8 = await crypto.subtle.exportKey("pkcs8", pair.privateKey);
      setPub(toPem(spki, "PUBLIC KEY"));
      setPriv(toPem(pkcs8, "PRIVATE KEY"));
    } catch {
      setErr("تولید کلید ناموفق بود.");
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    generate();
  }, [generate]);

  return (
    <div className="space-y-4">
      <Button variant="primary" onClick={generate} disabled={busy}>
        <RefreshCw className={`size-4 ${busy ? "animate-spin" : ""}`} />
        تولید جفت‌کلید جدید
      </Button>
      <Grid2>
        <Output
          label="کلید عمومی (SPKI / PEM)"
          value={pub}
          className="min-h-56"
          download={{ filename: "rsa-public.pem", mime: "application/x-pem-file" }}
        />
        <Output
          label="کلید خصوصی (PKCS8 / PEM)"
          value={priv}
          className="min-h-56"
          download={{ filename: "rsa-private.pem", mime: "application/x-pem-file" }}
        />
      </Grid2>
      {err && <ErrorNote>{err}</ErrorNote>}
      <p className="text-xs text-faint">
        کلید RSA-OAEP ۲۰۴۸ بیتی به‌صورت محلی در مرورگر شما تولید می‌شود و هرگز ارسال نمی‌گردد.
      </p>
    </div>
  );
}

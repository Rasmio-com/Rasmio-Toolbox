"use client";

import { useMemo, useRef, useState } from "react";
import { Upload } from "lucide-react";
import {
  Button,
  CopyButton,
  ErrorNote,
  Field,
  Output,
  Segmented,
  TextArea,
  TextInput,
} from "@/components/tool/kit";
import { downloadFile, formatBytes } from "@/lib/utils";

function bytesToBase64(bytes: Uint8Array): string {
  let bin = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
}

export default function Base64FileTool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [b64, setB64] = useState("");
  const [name, setName] = useState("");
  const [mime, setMime] = useState("");
  const [size, setSize] = useState(0);
  const [encErr, setEncErr] = useState("");
  const [input, setInput] = useState("");
  const [outName, setOutName] = useState("decoded.bin");
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEncErr("");
    try {
      setName(file.name);
      setMime(file.type || "application/octet-stream");
      setSize(file.size);
      setB64(bytesToBase64(new Uint8Array(await file.arrayBuffer())));
    } catch {
      setEncErr("خواندن فایل ناموفق بود.");
    }
  };

  const dataUri = b64 ? `data:${mime || "application/octet-stream"};base64,${b64}` : "";

  const decoded = useMemo(() => {
    if (mode !== "decode" || !input.trim()) return { bytes: null as Uint8Array | null, size: 0, err: "" };
    try {
      const m = input.trim().match(/^data:[^;,]*(;base64)?,(.*)$/s);
      const raw = m ? (m[1] ? atob(m[2]) : decodeURIComponent(m[2])) : atob(input.trim().replace(/\s+/g, ""));
      const bytes = Uint8Array.from(raw, (c) => c.charCodeAt(0));
      return { bytes, size: bytes.length, err: "" };
    } catch {
      return { bytes: null, size: 0, err: "Base64 یا Data URI نامعتبر است." };
    }
  }, [mode, input]);

  return (
    <div className="space-y-4">
      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: "encode", label: "فایل ← Base64" },
          { value: "decode", label: "Base64 ← فایل" },
        ]}
      />

      {mode === "encode" ? (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" onClick={() => fileRef.current?.click()}>
              <Upload className="size-4" />
              انتخاب فایل
            </Button>
            <input ref={fileRef} type="file" hidden onChange={onFile} />
            {name && (
              <span className="text-sm text-muted">
                <span className="font-mono text-fg" dir="ltr">
                  {name}
                </span>{" "}
                · {formatBytes(size)}
              </span>
            )}
          </div>
          {encErr && <ErrorNote>{encErr}</ErrorNote>}
          <Output label="Base64" value={b64} download={b64 ? { filename: "encoded.txt" } : undefined} />
          <Field
            label="Data URI"
            hint={dataUri ? <CopyButton value={dataUri} /> : undefined}
          >
            <TextArea readOnly value={dataUri} dir="ltr" className="min-h-24" placeholder="—" />
          </Field>
        </>
      ) : (
        <>
          <Field label="Base64 یا Data URI">
            <TextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="SGVsbG8= یا data:...;base64,..."
              className="min-h-32"
            />
          </Field>
          {decoded.err && <ErrorNote>{decoded.err}</ErrorNote>}
          {decoded.bytes && (
            <div className="flex flex-wrap items-end gap-3">
              <Field label="نام فایل خروجی" className="flex-1">
                <TextInput value={outName} onChange={(e) => setOutName(e.target.value)} dir="ltr" mono />
              </Field>
              <Button
                variant="primary"
                onClick={() =>
                  downloadFile(
                    new Blob([new Uint8Array(decoded.bytes!)], { type: "application/octet-stream" }),
                    outName || "decoded.bin",
                    "application/octet-stream",
                  )
                }
              >
                دانلود ({formatBytes(decoded.size)})
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

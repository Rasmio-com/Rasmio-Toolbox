"use client";

import { useMemo, useRef, useState } from "react";
import { Upload } from "lucide-react";
import {
  Button,
  ErrorNote,
  Field,
  Output,
  Segmented,
  TextInput,
  TextArea,
} from "@/components/tool/kit";
import { downloadFile, formatBytes } from "@/lib/utils";

export default function DataUriTool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [text, setText] = useState("");
  const [mime, setMime] = useState("text/plain");
  const [fileUri, setFileUri] = useState("");
  const [fileName, setFileName] = useState("");
  const [input, setInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setFileUri(String(reader.result));
    reader.readAsDataURL(file);
  };

  const textUri = useMemo(() => {
    if (fileUri || !text) return "";
    return `data:${mime || "text/plain"};base64,${btoa(unescape(encodeURIComponent(text)))}`;
  }, [text, mime, fileUri]);

  const encoded = fileUri || textUri;

  const decoded = useMemo(() => {
    if (mode !== "decode" || !input.trim()) {
      return { mime: "", isText: false, text: "", err: "" };
    }
    try {
      const m = input.trim().match(/^data:([^;,]*)(;base64)?,(.*)$/s);
      if (!m) throw new Error("bad");
      const mimeType = m[1] || "text/plain";
      const isB64 = !!m[2];
      const data = m[3];
      const raw = isB64 ? atob(data) : decodeURIComponent(data);
      const isText = /^text\/|application\/(json|xml|javascript)/.test(mimeType);
      const decodedText = isText
        ? decodeURIComponent(escape(raw))
        : `${raw.length} بایت داده دودویی (${mimeType})`;
      return { mime: mimeType, isText, text: decodedText, err: "" };
    } catch {
      return { mime: "", isText: false, text: "", err: "Data URI نامعتبر است." };
    }
  }, [input, mode]);

  const downloadDecoded = () => {
    const m = input.trim().match(/^data:([^;,]*)(;base64)?,(.*)$/s);
    if (!m) return;
    const mimeType = m[1] || "application/octet-stream";
    const raw = m[2] ? atob(m[3]) : decodeURIComponent(m[3]);
    const bytes = Uint8Array.from(raw, (c) => c.charCodeAt(0));
    const ext = (mimeType.split("/")[1] || "bin").split("+")[0];
    downloadFile(new Blob([bytes], { type: mimeType }), `decoded.${ext}`, mimeType);
  };

  return (
    <div className="space-y-4">
      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: "encode", label: "ساخت Data URI" },
          { value: "decode", label: "رمزگشایی" },
        ]}
      />

      {mode === "encode" ? (
        <>
          <div className="flex flex-wrap items-end gap-3">
            <Field label="نوع MIME" className="min-w-44 flex-1">
              <TextInput
                value={mime}
                onChange={(e) => setMime(e.target.value)}
                placeholder="text/plain"
                dir="ltr"
                disabled={!!fileUri}
              />
            </Field>
            <Button variant="secondary" onClick={() => fileRef.current?.click()}>
              <Upload className="size-4" />
              بارگذاری فایل
            </Button>
            <input ref={fileRef} type="file" hidden onChange={onFile} />
          </div>

          {fileUri ? (
            <p className="text-xs text-muted">
              فایل: <span className="font-mono">{fileName}</span> ·{" "}
              {formatBytes(Math.ceil((fileUri.length * 3) / 4))} —{" "}
              <button
                className="text-turquoise hover:underline"
                onClick={() => {
                  setFileUri("");
                  setFileName("");
                  if (fileRef.current) fileRef.current.value = "";
                }}
              >
                پاک‌کردن فایل
              </button>
            </p>
          ) : (
            <Field label="متن">
              <TextArea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="متن دلخواه…"
                dir="auto"
                className="min-h-24"
              />
            </Field>
          )}

          <Output
            label="Data URI"
            value={encoded}
            download={encoded ? { filename: "data-uri.txt" } : undefined}
          />
        </>
      ) : (
        <>
          <Field label="Data URI">
            <TextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="data:text/plain;base64,SGVsbG8="
              className="min-h-24"
            />
          </Field>
          {decoded.err ? (
            <ErrorNote>{decoded.err}</ErrorNote>
          ) : (
            decoded.mime && (
              <>
                <p className="text-xs text-muted">
                  نوع: <span className="font-mono text-fg">{decoded.mime}</span>
                </p>
                {decoded.isText ? (
                  <Output label="محتوا" value={decoded.text} />
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted">{decoded.text}</span>
                    <Button onClick={downloadDecoded}>دانلود فایل</Button>
                  </div>
                )}
              </>
            )
          )}
        </>
      )}
    </div>
  );
}

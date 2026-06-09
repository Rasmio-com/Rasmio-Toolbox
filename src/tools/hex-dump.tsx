"use client";

import { useMemo, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Button, ErrorNote, Field, Output, Segmented, TextArea } from "@/components/tool/kit";
import { formatBytes } from "@/lib/utils";

function dump(bytes: Uint8Array): string {
  const lines: string[] = [];
  for (let off = 0; off < bytes.length; off += 16) {
    const slice = bytes.subarray(off, off + 16);
    const hex: string[] = [];
    let ascii = "";
    for (let i = 0; i < 16; i++) {
      if (i < slice.length) {
        const b = slice[i];
        hex.push(b.toString(16).padStart(2, "0"));
        ascii += b >= 0x20 && b <= 0x7e ? String.fromCharCode(b) : ".";
      } else {
        hex.push("  ");
      }
      if (i === 7) hex.push("");
    }
    const offset = off.toString(16).padStart(8, "0");
    lines.push(`${offset}  ${hex.join(" ")}  |${ascii}|`);
  }
  return lines.join("\n");
}

export default function HexDumpTool() {
  const [mode, setMode] = useState<"text" | "file">("text");
  const [text, setText] = useState("");
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);
  const [fileName, setFileName] = useState("");
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr("");
    try {
      setFileName(file.name);
      setFileBytes(new Uint8Array(await file.arrayBuffer()));
    } catch {
      setErr("خواندن فایل ناموفق بود.");
    }
  };

  const out = useMemo(() => {
    if (mode === "text") {
      if (!text) return "";
      return dump(new TextEncoder().encode(text));
    }
    if (!fileBytes) return "";
    return dump(fileBytes);
  }, [mode, text, fileBytes]);

  const total = mode === "text" ? new TextEncoder().encode(text).length : fileBytes?.length ?? 0;

  return (
    <div className="space-y-4">
      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: "text", label: "متن" },
          { value: "file", label: "فایل" },
        ]}
      />

      {mode === "text" ? (
        <Field label="متن ورودی">
          <TextArea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Hello, World!"
            dir="ltr"
            className="min-h-28"
          />
        </Field>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary" onClick={() => fileRef.current?.click()}>
            <Upload className="size-4" />
            انتخاب فایل
          </Button>
          <input ref={fileRef} type="file" hidden onChange={onFile} />
          {fileName && (
            <span className="text-sm text-muted">
              <span className="font-mono text-fg" dir="ltr">
                {fileName}
              </span>
            </span>
          )}
        </div>
      )}

      {err && <ErrorNote>{err}</ErrorNote>}

      {!!total && <p className="text-xs text-muted">{total} بایت ({formatBytes(total)})</p>}

      <Output label="خروجی Hex" value={out} download={out ? { filename: "hexdump.txt" } : undefined} />
    </div>
  );
}

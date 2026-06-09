"use client";

import { useMemo, useState } from "react";
import {
  Button,
  Field,
  Grid2,
  Output,
  Segmented,
  TextArea,
  TextInput,
} from "@/components/tool/kit";

function shiftText(s: string, shift: number): string {
  const n = ((shift % 26) + 26) % 26;
  return s
    .replace(/[a-z]/g, (c) =>
      String.fromCharCode(((c.charCodeAt(0) - 97 + n) % 26) + 97),
    )
    .replace(/[A-Z]/g, (c) =>
      String.fromCharCode(((c.charCodeAt(0) - 65 + n) % 26) + 65),
    );
}

export default function CaesarCipherTool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [shift, setShift] = useState(3);

  const out = useMemo(() => {
    if (!input) return "";
    return shiftText(input, mode === "encode" ? shift : -shift);
  }, [input, mode, shift]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: "encode", label: "رمزگذاری" },
            { value: "decode", label: "رمزگشایی" },
          ]}
        />
        <Field label="میزان شیفت" className="w-28">
          <TextInput
            type="number"
            value={shift}
            min={0}
            max={25}
            onChange={(e) => setShift(Number(e.target.value) || 0)}
          />
        </Field>
        <Button variant="secondary" onClick={() => setShift(13)} className="mt-5">
          ROT13
        </Button>
      </div>
      <Grid2>
        <Field label="ورودی" hint="فقط حروف انگلیسی جابه‌جا می‌شوند">
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Hello, World!"
          />
        </Field>
        <Output label="خروجی" value={out} />
      </Grid2>
    </div>
  );
}

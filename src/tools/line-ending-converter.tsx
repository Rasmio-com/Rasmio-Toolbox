"use client";

import { useMemo, useState } from "react";
import { Field, Grid2, Output, Segmented, Stat, TextArea } from "@/components/tool/kit";

type Eol = "lf" | "crlf" | "cr";

const EOL: Record<Eol, string> = { lf: "\n", crlf: "\r\n", cr: "\r" };

export default function LineEndingConverterTool() {
  const [input, setInput] = useState("");
  const [target, setTarget] = useState<Eol>("lf");

  const stats = useMemo(() => {
    const crlf = (input.match(/\r\n/g) || []).length;
    const cr = (input.match(/\r(?!\n)/g) || []).length;
    const lf = (input.match(/(?<!\r)\n/g) || []).length;
    const kinds = [crlf > 0, cr > 0, lf > 0].filter(Boolean).length;
    let detected = "بدون پایان خط";
    if (kinds > 1) detected = "مخلوط";
    else if (crlf > 0) detected = "CRLF";
    else if (cr > 0) detected = "CR";
    else if (lf > 0) detected = "LF";
    const lines = input === "" ? 0 : crlf + cr + lf + 1;
    return { crlf, cr, lf, detected, lines };
  }, [input]);

  const out = useMemo(() => {
    if (!input) return "";
    return input.replace(/\r\n|\r|\n/g, EOL[target]);
  }, [input, target]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-muted">
          تبدیل به
          <Segmented
            value={target}
            onChange={setTarget}
            options={[
              { value: "lf", label: "LF (\\n)" },
              { value: "crlf", label: "CRLF (\\r\\n)" },
              { value: "cr", label: "CR (\\r)" },
            ]}
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="پایان خط کنونی" value={<span className="text-base">{stats.detected}</span>} />
        <Stat label="LF" value={stats.lf} />
        <Stat label="CRLF" value={stats.crlf} />
        <Stat label="CR" value={stats.cr} />
      </div>

      <Grid2>
        <Field label="ورودی">
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="متن خود را اینجا بچسبانید…"
            dir="ltr"
            className="min-h-56"
          />
        </Field>
        <Output label="خروجی" value={out} className="min-h-56" download={out ? { filename: "converted.txt" } : undefined} />
      </Grid2>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import {
  ErrorNote,
  Field,
  Grid2,
  Output,
  TextArea,
  TextInput,
  Toggle,
} from "@/components/tool/kit";

export default function FindReplaceTool() {
  const [text, setText] = useState("");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [useRegex, setUseRegex] = useState(false);
  const [ci, setCi] = useState(false);

  const { out, err, count } = useMemo(() => {
    if (!find || !text) return { out: text, err: "", count: 0 };
    try {
      const flags = "g" + (ci ? "i" : "");
      const pattern = useRegex
        ? find
        : find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(pattern, flags);
      const count = (text.match(re) ?? []).length;
      const rep = useRegex ? replace : replace.replace(/\$/g, "$$$$");
      return { out: text.replace(re, rep), err: "", count };
    } catch {
      return { out: "", err: "الگوی Regex نامعتبر است.", count: 0 };
    }
  }, [text, find, replace, useRegex, ci]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="یافتن">
          <TextInput
            mono
            value={find}
            onChange={(e) => setFind(e.target.value)}
            placeholder={useRegex ? "\\d+" : "متن مورد جستجو"}
          />
        </Field>
        <Field label="جایگزین با">
          <TextInput
            mono
            value={replace}
            onChange={(e) => setReplace(e.target.value)}
            placeholder={useRegex ? "$&" : "متن جایگزین"}
          />
        </Field>
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <Toggle checked={useRegex} onChange={setUseRegex} label="عبارت باقاعده (Regex)" />
        <Toggle checked={ci} onChange={setCi} label="بی‌توجه به بزرگی/کوچکی" />
        {find && !err && (
          <span className="text-sm text-muted">
            {count.toLocaleString("fa-IR")} مورد جایگزین شد
          </span>
        )}
      </div>
      {err && <ErrorNote>{err}</ErrorNote>}
      <Grid2>
        <Field label="متن ورودی">
          <TextArea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="متن اصلی…"
            className="min-h-52"
          />
        </Field>
        <Output label="نتیجه" value={out} className="min-h-52" />
      </Grid2>
    </div>
  );
}

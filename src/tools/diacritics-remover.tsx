"use client";

import { useMemo, useState } from "react";
import { Field, Grid2, Output, TextArea, Toggle } from "@/components/tool/kit";

export default function DiacriticsRemoverTool() {
  const [text, setText] = useState("");
  const [arabic, setArabic] = useState(true);

  const out = useMemo(() => {
    if (!text) return "";
    // Latin combining marks: NFD then strip U+0300–U+036F
    let s = text.normalize("NFD").replace(/[̀-ͯ]/g, "");
    if (arabic) {
      // Arabic/Persian harakat: U+064B–U+0652 (tanwin, fatha, damma, kasra, shadda, sukun…)
      s = s.replace(/[ً-ْ]/g, "");
    }
    return s.normalize("NFC");
  }, [text, arabic]);

  return (
    <div className="space-y-4">
      <Toggle checked={arabic} onChange={setArabic} label="حذف اعراب عربی/فارسی (حرکات) هم انجام شود" />
      <Grid2>
        <Field label="ورودی">
          <TextArea
            mono={false}
            dir="auto"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="مثلاً: café résumé یا کِتاب مُعَلَّم"
            className="min-h-44"
          />
        </Field>
        <Output label="خروجی" value={out} mono={false} className="min-h-44" />
      </Grid2>
    </div>
  );
}

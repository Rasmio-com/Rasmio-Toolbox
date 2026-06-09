"use client";

import { useMemo, useState } from "react";
import { Field, Stat, TextArea } from "@/components/tool/kit";
import { formatBytes } from "@/lib/utils";

export default function TextCounterTool() {
  const [text, setText] = useState("");

  const s = useMemo(() => {
    const chars = Array.from(text).length;
    const charsNoSpace = Array.from(text.replace(/\s/g, "")).length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text ? text.split(/\r\n|\r|\n/).length : 0;
    const sentences = text.split(/[.!?؟…]+/).filter((x) => x.trim()).length;
    const paragraphs = text.split(/\n\s*\n/).filter((x) => x.trim()).length;
    const bytes = new TextEncoder().encode(text).length;
    const minutes = words / 200;
    const readTime =
      words === 0
        ? "۰ ثانیه"
        : minutes < 1
          ? `${Math.ceil(minutes * 60).toLocaleString("fa-IR")} ثانیه`
          : `${Math.ceil(minutes).toLocaleString("fa-IR")} دقیقه`;
    return {
      chars,
      charsNoSpace,
      words,
      lines,
      sentences,
      paragraphs,
      bytes,
      readTime,
    };
  }, [text]);

  const fa = (n: number) => n.toLocaleString("fa-IR");

  return (
    <div className="space-y-5">
      <Field label="متن ورودی">
        <TextArea
          mono={false}
          dir="auto"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="متن خود را این‌جا بنویسید یا بچسبانید…"
          className="min-h-44"
        />
      </Field>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="کاراکتر" value={fa(s.chars)} />
        <Stat label="بدون فاصله" value={fa(s.charsNoSpace)} />
        <Stat label="کلمه" value={fa(s.words)} />
        <Stat label="خط" value={fa(s.lines)} />
        <Stat label="جمله" value={fa(s.sentences)} />
        <Stat label="پاراگراف" value={fa(s.paragraphs)} />
        <Stat label="حجم" value={formatBytes(s.bytes)} />
        <Stat label="زمان مطالعه" value={<span className="text-base">{s.readTime}</span>} />
      </div>
    </div>
  );
}

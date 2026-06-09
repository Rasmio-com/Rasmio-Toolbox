"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button, Field, Output, Segmented, TextInput } from "@/components/tool/kit";

const LATIN =
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur".split(
    " ",
  );
const FA =
  "لورم ایپسوم متن ساختگی با تولید نامفهوم از صنعت چاپ و طراحی گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون سطرآنچنان که لازم باشد و برای شرایط فعلی فناوری مورد نیاز کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می‌باشد".split(
    " ",
  );

const pick = (a: string[]) => a[Math.floor(Math.random() * a.length)];

function sentence(words: string[], len: number): string {
  const s = Array.from({ length: len }, () => pick(words)).join(" ");
  return s.charAt(0).toUpperCase() + s.slice(1) + ".";
}

function paragraph(words: string[]): string {
  const n = 4 + Math.floor(Math.random() * 4);
  return Array.from({ length: n }, () => sentence(words, 6 + Math.floor(Math.random() * 8))).join(" ");
}

export default function LoremIpsumTool() {
  const [unit, setUnit] = useState<"para" | "sentence" | "word">("para");
  const [count, setCount] = useState(3);
  const [lang, setLang] = useState<"latin" | "fa">("latin");
  const [out, setOut] = useState("");

  const gen = useCallback(() => {
    const words = lang === "fa" ? FA : LATIN;
    const n = Math.min(Math.max(count, 1), 100);
    if (unit === "word") setOut(Array.from({ length: n }, () => pick(words)).join(" "));
    else if (unit === "sentence")
      setOut(Array.from({ length: n }, () => sentence(words, 8 + Math.floor(Math.random() * 6))).join(" "));
    else setOut(Array.from({ length: n }, () => paragraph(words)).join("\n\n"));
  }, [unit, count, lang]);

  useEffect(() => {
    gen();
  }, [gen]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-x-5 gap-y-3">
        <Segmented
          value={unit}
          onChange={setUnit}
          options={[
            { value: "para", label: "پاراگراف" },
            { value: "sentence", label: "جمله" },
            { value: "word", label: "کلمه" },
          ]}
        />
        <Field label="تعداد" className="w-24">
          <TextInput
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Number(e.target.value) || 1)}
          />
        </Field>
        <Segmented
          value={lang}
          onChange={setLang}
          options={[
            { value: "latin", label: "لاتین" },
            { value: "fa", label: "فارسی" },
          ]}
        />
        <Button variant="primary" onClick={gen} className="gap-1.5">
          <RefreshCw className="size-4" />
          تولید
        </Button>
      </div>
      <Output
        label="خروجی"
        value={out}
        mono={false}
        className="min-h-56"
      />
    </div>
  );
}

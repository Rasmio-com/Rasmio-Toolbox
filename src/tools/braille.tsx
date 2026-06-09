"use client";

import { useMemo, useState } from "react";
import { Field, Grid2, Output, Segmented, TextArea } from "@/components/tool/kit";

// Grade 1 Braille (Unicode patterns). Numbers are prefixed with the number sign (⠼).
const LETTERS: Record<string, string> = {
  a: "⠁", b: "⠃", c: "⠉", d: "⠙", e: "⠑", f: "⠋", g: "⠛", h: "⠓", i: "⠊",
  j: "⠚", k: "⠅", l: "⠇", m: "⠍", n: "⠝", o: "⠕", p: "⠏", q: "⠟", r: "⠗",
  s: "⠎", t: "⠞", u: "⠥", v: "⠧", w: "⠺", x: "⠭", y: "⠽", z: "⠵",
  " ": " ", ",": "⠂", ";": "⠆", ":": "⠒", ".": "⠲", "?": "⠦",
  "!": "⠖", "'": "⠄", "-": "⠤", "(": "⠐⠣", ")": "⠐⠜", "/": "⠌",
};
const DIGITS: Record<string, string> = {
  "1": "⠁", "2": "⠃", "3": "⠉", "4": "⠙", "5": "⠑",
  "6": "⠋", "7": "⠛", "8": "⠓", "9": "⠊", "0": "⠚",
};
const NUM_SIGN = "⠼";

const DIGIT_FROM_LETTER: Record<string, string> = {
  "⠁": "1", "⠃": "2", "⠉": "3", "⠙": "4", "⠑": "5",
  "⠋": "6", "⠛": "7", "⠓": "8", "⠊": "9", "⠚": "0",
};
const LETTER_FROM_CELL: Record<string, string> = Object.fromEntries(
  Object.entries(LETTERS)
    .filter(([k, v]) => k !== " " && v.length === 1)
    .map(([k, v]) => [v, k]),
);

function toBraille(s: string): string {
  let out = "";
  let inNumber = false;
  for (const raw of s) {
    const ch = raw.toLowerCase();
    if (DIGITS[ch]) {
      if (!inNumber) {
        out += NUM_SIGN;
        inNumber = true;
      }
      out += DIGITS[ch];
      continue;
    }
    inNumber = false;
    out += LETTERS[ch] ?? raw;
  }
  return out;
}

function fromBraille(s: string): string {
  let out = "";
  let inNumber = false;
  for (const ch of s) {
    if (ch === NUM_SIGN) {
      inNumber = true;
      continue;
    }
    if (ch === " ") {
      inNumber = false;
      out += " ";
      continue;
    }
    if (inNumber && DIGIT_FROM_LETTER[ch]) {
      out += DIGIT_FROM_LETTER[ch];
      continue;
    }
    inNumber = false;
    out += LETTER_FROM_CELL[ch] ?? ch;
  }
  return out;
}

export default function BrailleTool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");

  const out = useMemo(() => {
    if (!input) return "";
    return mode === "encode" ? toBraille(input) : fromBraille(input);
  }, [input, mode]);

  return (
    <div className="space-y-4">
      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: "encode", label: "متن ← بریل" },
          { value: "decode", label: "بریل ← متن" },
        ]}
      />
      <Grid2>
        <Field label="ورودی">
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "hello 123" : "⠓⠑⠇⠇⠕"}
            mono={mode === "decode"}
          />
        </Field>
        <Output label="خروجی" value={out} mono={mode === "encode"} />
      </Grid2>
    </div>
  );
}

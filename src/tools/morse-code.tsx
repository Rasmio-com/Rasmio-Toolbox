"use client";

import { useMemo, useState } from "react";
import { Field, Grid2, Output, Segmented, TextArea } from "@/components/tool/kit";

const MORSE: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.",
  H: "....", I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.",
  O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-",
  V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--..",
  "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
  "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.", "!": "-.-.--",
  "/": "-..-.", "(": "-.--.", ")": "-.--.-", "&": ".-...", ":": "---...",
  ";": "-.-.-.", "=": "-...-", "+": ".-.-.", "-": "-....-", "_": "..--.-",
  '"': ".-..-.", "@": ".--.-.",
};
const REVERSE: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE).map(([k, v]) => [v, k]),
);

function toMorse(s: string): string {
  return s
    .toUpperCase()
    .split(/\s+/)
    .map((word) =>
      word
        .split("")
        .map((ch) => MORSE[ch] ?? "")
        .filter(Boolean)
        .join(" "),
    )
    .join(" / ");
}

function fromMorse(s: string): string {
  return s
    .trim()
    .split(/\s*\/\s*/)
    .map((word) =>
      word
        .split(/\s+/)
        .map((code) => REVERSE[code] ?? "")
        .join(""),
    )
    .join(" ");
}

export default function MorseCodeTool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");

  const out = useMemo(() => {
    if (!input) return "";
    return mode === "encode" ? toMorse(input) : fromMorse(input);
  }, [input, mode]);

  return (
    <div className="space-y-4">
      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: "encode", label: "متن ← مورس" },
          { value: "decode", label: "مورس ← متن" },
        ]}
      />
      <Grid2>
        <Field label="ورودی">
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "SOS" : "... --- ..."}
          />
        </Field>
        <Output label="خروجی" value={out} />
      </Grid2>
    </div>
  );
}

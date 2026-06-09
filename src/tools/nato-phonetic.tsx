"use client";

import { useMemo, useState } from "react";
import { Field, Output, TextArea } from "@/components/tool/kit";

const NATO: Record<string, string> = {
  A: "Alpha", B: "Bravo", C: "Charlie", D: "Delta", E: "Echo", F: "Foxtrot",
  G: "Golf", H: "Hotel", I: "India", J: "Juliett", K: "Kilo", L: "Lima",
  M: "Mike", N: "November", O: "Oscar", P: "Papa", Q: "Quebec", R: "Romeo",
  S: "Sierra", T: "Tango", U: "Uniform", V: "Victor", W: "Whiskey",
  X: "X-ray", Y: "Yankee", Z: "Zulu",
  "0": "Zero", "1": "One", "2": "Two", "3": "Three", "4": "Four",
  "5": "Five", "6": "Six", "7": "Seven", "8": "Eight", "9": "Nine",
  ".": "Stop", "-": "Dash", "@": "At",
};

export default function NatoPhoneticTool() {
  const [input, setInput] = useState("");

  const out = useMemo(() => {
    if (!input) return "";
    return Array.from(input.toUpperCase())
      .map((ch) => {
        if (ch === " ") return "(Space)";
        return NATO[ch] ?? ch;
      })
      .join(" ");
  }, [input]);

  return (
    <div className="space-y-4">
      <Field label="متن">
        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="SOS 2024"
        />
      </Field>
      <Output label="الفبای آوایی ناتو" value={out} mono={false} />
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { ErrorNote, Field, Grid2, Output, Segmented, TextArea } from "@/components/tool/kit";

type Mode = "srt2vtt" | "vtt2srt";

// SRT uses comma decimals (00:00:01,000); VTT uses dots (00:00:01.000).
function srtToVtt(srt: string): string {
  const body = srt
    .replace(/\r+/g, "")
    .trim()
    .replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, "$1.$2");
  return `WEBVTT\n\n${body}\n`;
}

function vttToSrt(vtt: string): string {
  let text = vtt.replace(/\r+/g, "");
  // Drop the WEBVTT header line and any NOTE/STYLE/REGION blocks before content.
  text = text.replace(/^WEBVTT.*\n/, "");
  // Convert dot decimals to commas in timestamps.
  text = text.replace(/(\d{2}:\d{2}:\d{2})\.(\d{3})/g, "$1,$2");

  // Split into cues separated by blank lines, re-number sequentially.
  const blocks = text.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  const out: string[] = [];
  let n = 1;
  for (const block of blocks) {
    const lines = block.split("\n");
    // Skip a leading cue identifier that isn't a timing line.
    if (lines[0] && !lines[0].includes("-->") && lines[1]?.includes("-->")) {
      lines.shift();
    }
    if (!lines.some((l) => l.includes("-->"))) continue;
    // Strip VTT cue settings after the timestamp.
    const timed = lines.map((l) =>
      l.includes("-->") ? l.replace(/\s+(align|line|position|size|vertical):\S+/g, "").trim() : l,
    );
    out.push(`${n}\n${timed.join("\n")}`);
    n++;
  }
  return out.join("\n\n") + "\n";
}

export default function SubtitleConverterTool() {
  const [mode, setMode] = useState<Mode>("srt2vtt");
  const [input, setInput] = useState("");

  const { out, err } = useMemo(() => {
    if (!input.trim()) return { out: "", err: "" };
    try {
      const out = mode === "srt2vtt" ? srtToVtt(input) : vttToSrt(input);
      if (!out.trim()) return { out: "", err: "محتوای زیرنویس معتبری یافت نشد." };
      return { out, err: "" };
    } catch {
      return { out: "", err: "تبدیل ناموفق بود؛ قالب زیرنویس را بررسی کنید." };
    }
  }, [input, mode]);

  return (
    <div className="space-y-4">
      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: "srt2vtt", label: "SRT ← VTT" },
          { value: "vtt2srt", label: "VTT ← SRT" },
        ]}
      />
      <Grid2>
        <Field label={mode === "srt2vtt" ? "ورودی SRT" : "ورودی VTT"}>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "srt2vtt"
                ? "1\n00:00:01,000 --> 00:00:04,000\nسلام دنیا"
                : "WEBVTT\n\n00:00:01.000 --> 00:00:04.000\nسلام دنیا"
            }
          />
        </Field>
        <Output
          label={mode === "srt2vtt" ? "خروجی VTT" : "خروجی SRT"}
          value={out}
          download={{
            filename: mode === "srt2vtt" ? "subtitle.vtt" : "subtitle.srt",
            mime: "text/plain",
          }}
        />
      </Grid2>
      {err && <ErrorNote>{err}</ErrorNote>}
    </div>
  );
}

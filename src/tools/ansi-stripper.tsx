"use client";

import { useMemo, useState } from "react";
import { Field, Output, Segmented, TextArea } from "@/components/tool/kit";

type Mode = "strip" | "render";

// Matches CSI / OSC / common single-char ANSI escape sequences.
// eslint-disable-next-line no-control-regex
const ANSI_RE = /\x1b\[[0-9;?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-_]/g;

const FG: Record<number, string> = {
  30: "#1e1e1e", 31: "#e74c3c", 32: "#2ecc71", 33: "#d4ac0d",
  34: "#3498db", 35: "#9b59b6", 36: "#17a2b8", 37: "#d0d0d0",
  90: "#7f8c8d", 91: "#ff6b6b", 92: "#5cf28b", 93: "#f1c40f",
  94: "#5dade2", 95: "#bb8fce", 96: "#48dbfb", 97: "#ffffff",
};
const BG: Record<number, string> = {
  40: "#1e1e1e", 41: "#e74c3c", 42: "#2ecc71", 43: "#d4ac0d",
  44: "#3498db", 45: "#9b59b6", 46: "#17a2b8", 47: "#d0d0d0",
  100: "#7f8c8d", 101: "#ff6b6b", 102: "#5cf28b", 103: "#f1c40f",
  104: "#5dade2", 105: "#bb8fce", 106: "#48dbfb", 107: "#ffffff",
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

interface Style {
  fg?: string;
  bg?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

function styleToCss(s: Style): string {
  const parts: string[] = [];
  if (s.fg) parts.push(`color:${s.fg}`);
  if (s.bg) parts.push(`background:${s.bg}`);
  if (s.bold) parts.push("font-weight:700");
  if (s.italic) parts.push("font-style:italic");
  if (s.underline) parts.push("text-decoration:underline");
  return parts.join(";");
}

function applySgr(style: Style, codes: number[]): Style {
  const s = { ...style };
  for (let i = 0; i < codes.length; i++) {
    const c = codes[i];
    if (c === 0) {
      delete s.fg; delete s.bg; s.bold = false; s.italic = false; s.underline = false;
    } else if (c === 1) s.bold = true;
    else if (c === 3) s.italic = true;
    else if (c === 4) s.underline = true;
    else if (c === 22) s.bold = false;
    else if (c === 23) s.italic = false;
    else if (c === 24) s.underline = false;
    else if (c === 39) delete s.fg;
    else if (c === 49) delete s.bg;
    else if (FG[c]) s.fg = FG[c];
    else if (BG[c]) s.bg = BG[c];
    else if (c === 38 || c === 48) {
      // 256-color (5;n) or truecolor (2;r;g;b) — consume args, approximate.
      const target = c === 38 ? "fg" : "bg";
      if (codes[i + 1] === 5) {
        i += 2;
      } else if (codes[i + 1] === 2) {
        const r = codes[i + 2] ?? 0, g = codes[i + 3] ?? 0, b = codes[i + 4] ?? 0;
        s[target] = `rgb(${r},${g},${b})`;
        i += 4;
      }
    }
  }
  return s;
}

function renderAnsi(input: string): string {
  // eslint-disable-next-line no-control-regex
  const sgr = /\x1b\[([0-9;]*)m/g;
  let html = "";
  let last = 0;
  let style: Style = {};
  let m: RegExpExecArray | null;
  const emit = (text: string) => {
    if (!text) return;
    const css = styleToCss(style);
    const safe = escapeHtml(text);
    html += css ? `<span style="${css}">${safe}</span>` : safe;
  };
  while ((m = sgr.exec(input))) {
    emit(input.slice(last, m.index));
    const codes = m[1] === "" ? [0] : m[1].split(";").map((n) => Number(n) || 0);
    style = applySgr(style, codes);
    last = sgr.lastIndex;
  }
  emit(input.slice(last));
  // strip any remaining non-SGR escapes left in the text
  return html.replace(ANSI_RE, "");
}

export default function AnsiStripperTool() {
  const [mode, setMode] = useState<Mode>("strip");
  const [input, setInput] = useState("");

  const stripped = useMemo(() => input.replace(ANSI_RE, ""), [input]);
  const rendered = useMemo(() => (mode === "render" ? renderAnsi(input) : ""), [input, mode]);

  return (
    <div className="space-y-4">
      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: "strip", label: "حذف کدها" },
          { value: "render", label: "نمایش رنگی" },
        ]}
      />
      <Field label="ورودی حاوی کدهای ANSI">
        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"\\x1b[31mخطا\\x1b[0m — متن را با کدهای ANSI واقعی جای‌گذاری کنید"}
          className="min-h-40"
        />
      </Field>

      {mode === "strip" ? (
        <Output label="متن بدون ANSI" value={stripped} className="min-h-40" />
      ) : (
        <Field label="پیش‌نمایش رنگی">
          <div
            dir="ltr"
            className="field min-h-40 overflow-auto whitespace-pre-wrap rounded-lg bg-[#0c0c0c] p-3 font-mono text-sm leading-relaxed text-[#d0d0d0]"
            dangerouslySetInnerHTML={{ __html: rendered || "<span style='color:#666'>خروجی اینجا نمایش داده می‌شود</span>" }}
          />
        </Field>
      )}
    </div>
  );
}

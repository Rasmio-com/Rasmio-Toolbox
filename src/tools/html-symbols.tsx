"use client";

import { useState } from "react";
import { copyText } from "@/lib/utils";

type Sym = { ch: string; entity?: string };

function entityOf(s: Sym): string {
  if (s.entity) return s.entity;
  return `&#${s.ch.codePointAt(0) ?? 0};`;
}

const CATEGORIES: { title: string; items: Sym[] }[] = [
  {
    title: "فلش‌ها",
    items: [
      { ch: "←", entity: "&larr;" }, { ch: "↑", entity: "&uarr;" },
      { ch: "→", entity: "&rarr;" }, { ch: "↓", entity: "&darr;" },
      { ch: "↔", entity: "&harr;" }, { ch: "↕", entity: "&varr;" },
      { ch: "⇐", entity: "&lArr;" }, { ch: "⇑", entity: "&uArr;" },
      { ch: "⇒", entity: "&rArr;" }, { ch: "⇓", entity: "&dArr;" },
      { ch: "⇔", entity: "&hArr;" }, { ch: "↩" }, { ch: "↪" },
      { ch: "⤴" }, { ch: "⤵" }, { ch: "↺" }, { ch: "↻" }, { ch: "➤" },
    ],
  },
  {
    title: "ریاضی",
    items: [
      { ch: "±", entity: "&plusmn;" }, { ch: "×", entity: "&times;" },
      { ch: "÷", entity: "&divide;" }, { ch: "≠", entity: "&ne;" },
      { ch: "≤", entity: "&le;" }, { ch: "≥", entity: "&ge;" },
      { ch: "≈", entity: "&asymp;" }, { ch: "≡", entity: "&equiv;" },
      { ch: "∞", entity: "&infin;" }, { ch: "√", entity: "&radic;" },
      { ch: "∑", entity: "&sum;" }, { ch: "∏", entity: "&prod;" },
      { ch: "∫", entity: "&int;" }, { ch: "∂", entity: "&part;" },
      { ch: "∆", entity: "&Delta;" }, { ch: "π", entity: "&pi;" },
      { ch: "µ", entity: "&micro;" }, { ch: "°", entity: "&deg;" },
      { ch: "∈", entity: "&isin;" }, { ch: "∉", entity: "&notin;" },
      { ch: "∩", entity: "&cap;" }, { ch: "∪", entity: "&cup;" },
      { ch: "∅", entity: "&empty;" }, { ch: "∀", entity: "&forall;" },
    ],
  },
  {
    title: "ارز",
    items: [
      { ch: "$", entity: "&#36;" }, { ch: "€", entity: "&euro;" },
      { ch: "£", entity: "&pound;" }, { ch: "¥", entity: "&yen;" },
      { ch: "¢", entity: "&cent;" }, { ch: "₽" }, { ch: "₹" },
      { ch: "₩" }, { ch: "₿" }, { ch: "﷼" }, { ch: "¤", entity: "&curren;" },
      { ch: "₺" }, { ch: "₪" }, { ch: "₫" },
    ],
  },
  {
    title: "نشانه‌گذاری",
    items: [
      { ch: "•", entity: "&bull;" }, { ch: "…", entity: "&hellip;" },
      { ch: "–", entity: "&ndash;" }, { ch: "—", entity: "&mdash;" },
      { ch: "“", entity: "&ldquo;" }, { ch: "”", entity: "&rdquo;" },
      { ch: "‘", entity: "&lsquo;" }, { ch: "’", entity: "&rsquo;" },
      { ch: "«", entity: "&laquo;" }, { ch: "»", entity: "&raquo;" },
      { ch: "†", entity: "&dagger;" }, { ch: "‡", entity: "&Dagger;" },
      { ch: "§", entity: "&sect;" }, { ch: "¶", entity: "&para;" },
      { ch: "©", entity: "&copy;" }, { ch: "®", entity: "&reg;" },
      { ch: "™", entity: "&trade;" }, { ch: "‰", entity: "&permil;" },
      { ch: "·", entity: "&middot;" }, { ch: "¿", entity: "&iquest;" },
      { ch: "¡", entity: "&iexcl;" }, { ch: "‌", entity: "&zwnj;" },
    ],
  },
  {
    title: "ستاره‌ها و نمادها",
    items: [
      { ch: "★" }, { ch: "☆" }, { ch: "✦" }, { ch: "✧" }, { ch: "✪" },
      { ch: "✩" }, { ch: "✫" }, { ch: "✬" }, { ch: "❄" }, { ch: "❅" },
      { ch: "✓", entity: "&check;" }, { ch: "✔" }, { ch: "✗" }, { ch: "✘" },
      { ch: "☑" }, { ch: "☒" }, { ch: "♠", entity: "&spades;" },
      { ch: "♣", entity: "&clubs;" }, { ch: "♥", entity: "&hearts;" },
      { ch: "♦", entity: "&diams;" }, { ch: "☀" }, { ch: "☁" },
      { ch: "☂" }, { ch: "☎" }, { ch: "✉" }, { ch: "✂" }, { ch: "✈" },
      { ch: "♻" }, { ch: "⚡" }, { ch: "☯" },
    ],
  },
];

export default function HtmlSymbolsTool() {
  const [copied, setCopied] = useState("");

  async function copy(key: string, value: string) {
    if (await copyText(value)) {
      setCopied(key);
      setTimeout(() => setCopied(""), 1200);
    }
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted">روی کاراکتر کلیک کنید تا کپی شود، یا روی موجودیت HTML آن.</p>
      {CATEGORIES.map((cat) => (
        <div key={cat.title} className="space-y-2">
          <h3 className="text-xs font-semibold text-saffron">{cat.title}</h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {cat.items.map((s, i) => {
              const ent = entityOf(s);
              const chKey = `${cat.title}-c-${i}`;
              const enKey = `${cat.title}-e-${i}`;
              return (
                <div key={i} className="flex items-center gap-1.5 rounded-lg border border-border bg-bg-soft p-1.5">
                  <button
                    type="button"
                    onClick={() => copy(chKey, s.ch)}
                    className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-surface-2 text-xl text-turquoise transition-colors hover:border-turquoise-dim"
                  >
                    {copied === chKey ? "✓" : s.ch}
                  </button>
                  <button
                    type="button"
                    onClick={() => copy(enKey, ent)}
                    dir="ltr"
                    className="min-w-0 flex-1 truncate rounded-md px-1.5 py-1 text-left font-mono text-xs text-muted transition-colors hover:text-fg"
                  >
                    {copied === enKey ? "کپی شد" : ent}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

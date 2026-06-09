"use client";

import { useState } from "react";
import { Stat } from "@/components/tool/kit";

interface Captured {
  key: string;
  code: string;
  keyCode: number;
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
  meta: boolean;
}

export default function KeycodeInspectorTool() {
  const [info, setInfo] = useState<Captured | null>(null);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    setInfo({
      key: e.key,
      code: e.code,
      keyCode: e.keyCode,
      ctrl: e.ctrlKey,
      alt: e.altKey,
      shift: e.shiftKey,
      meta: e.metaKey,
    });
  };

  const mods: { label: string; on: boolean }[] = info
    ? [
        { label: "Ctrl", on: info.ctrl },
        { label: "Alt", on: info.alt },
        { label: "Shift", on: info.shift },
        { label: "Meta", on: info.meta },
      ]
    : [];

  return (
    <div className="space-y-4">
      <div
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="flex min-h-32 cursor-text items-center justify-center rounded-2xl border-2 border-dashed border-border bg-bg-soft p-6 text-center text-muted outline-none transition-colors focus:border-turquoise-dim focus:text-fg"
      >
        {info ? (
          <span dir="ltr" className="font-mono text-3xl text-fg">
            {info.key === " " ? "Space" : info.key}
          </span>
        ) : (
          "اینجا کلیک کنید و یک کلید را فشار دهید"
        )}
      </div>

      {info && (
        <>
          <div className="grid grid-cols-3 gap-3">
            <Stat label="event.key" value={<span dir="ltr" className="text-base break-all">{info.key === " " ? "(space)" : info.key}</span>} />
            <Stat label="event.code" value={<span dir="ltr" className="text-base break-all">{info.code}</span>} />
            <Stat label="keyCode" value={info.keyCode} />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {mods.map((m) => (
              <div
                key={m.label}
                className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
                  m.on
                    ? "border-turquoise-dim bg-turquoise/15 text-turquoise"
                    : "border-border bg-surface-2 text-muted"
                }`}
              >
                <span dir="ltr">{m.label}</span>
                <span className="font-bold">{m.on ? "✓" : "✗"}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

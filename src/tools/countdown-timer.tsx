"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { Button, Field, Grid2, Segmented, TextInput } from "@/components/tool/kit";
import { toAsciiDigits } from "@/lib/utils";

function fmt(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

export default function CountdownTimerTool() {
  const [mode, setMode] = useState<"duration" | "target">("duration");
  const [mins, setMins] = useState("5");
  const [secs, setSecs] = useState("0");
  const [target, setTarget] = useState("");

  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const endRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    const tick = () => {
      const left = endRef.current - Date.now();
      if (left <= 0) {
        setRemaining(0);
        setRunning(false);
        setDone(true);
      } else {
        setRemaining(left);
      }
    };
    tick();
    const id = setInterval(tick, 100);
    return () => clearInterval(id);
  }, [running]);

  const start = () => {
    setDone(false);
    let ms = 0;
    if (mode === "duration") {
      const m = Number(toAsciiDigits(mins)) || 0;
      const s = Number(toAsciiDigits(secs)) || 0;
      ms = (m * 60 + s) * 1000;
    } else {
      const t = new Date(target).getTime();
      if (isNaN(t)) return;
      ms = t - Date.now();
    }
    if (ms <= 0) return;
    endRef.current = Date.now() + ms;
    setRemaining(ms);
    setRunning(true);
  };

  const pause = () => {
    setRunning(false);
  };
  const resume = () => {
    if (remaining <= 0) return;
    endRef.current = Date.now() + remaining;
    setRunning(true);
  };
  const reset = () => {
    setRunning(false);
    setRemaining(0);
    setDone(false);
  };

  return (
    <div className="space-y-5">
      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: "duration", label: "مدت‌زمان" },
          { value: "target", label: "زمان هدف" },
        ]}
      />

      {mode === "duration" ? (
        <Grid2>
          <Field label="دقیقه">
            <TextInput
              mono
              dir="ltr"
              type="number"
              value={mins}
              onChange={(e) => setMins(e.target.value)}
              placeholder="5"
            />
          </Field>
          <Field label="ثانیه">
            <TextInput
              mono
              dir="ltr"
              type="number"
              value={secs}
              onChange={(e) => setSecs(e.target.value)}
              placeholder="0"
            />
          </Field>
        </Grid2>
      ) : (
        <Field label="تاریخ و زمان هدف">
          <input
            type="datetime-local"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="field"
          />
        </Field>
      )}

      <div className="rounded-2xl border border-border bg-bg-soft px-5 py-10 text-center">
        <div
          dir="ltr"
          className={`font-mono text-6xl font-bold tabular-nums ${done ? "text-saffron" : "text-turquoise"}`}
        >
          {fmt(remaining)}
        </div>
        {done && (
          <div className="mt-4 text-lg font-semibold text-saffron">زمان به پایان رسید! ⏰</div>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {!running ? (
          <Button variant="primary" onClick={remaining > 0 && !done ? resume : start}>
            <Play className="size-4" />
            {remaining > 0 && !done ? "ادامه" : "شروع"}
          </Button>
        ) : (
          <Button variant="secondary" onClick={pause}>
            <Pause className="size-4" />
            مکث
          </Button>
        )}
        <Button variant="danger" onClick={reset} disabled={remaining === 0 && !done}>
          <RotateCcw className="size-4" />
          بازنشانی
        </Button>
      </div>
    </div>
  );
}

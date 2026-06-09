"use client";

import { useEffect, useRef, useState } from "react";
import { Flag, Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/tool/kit";

function fmt(ms: number): string {
  const cs = Math.floor((ms % 1000) / 10);
  const totalSec = Math.floor(ms / 1000);
  const s = totalSec % 60;
  const m = Math.floor(totalSec / 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(m)}:${pad(s)}.${pad(cs)}`;
}

export default function StopwatchTool() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const startRef = useRef(0);
  const accRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!running) return;
    startRef.current = performance.now();
    const tick = () => {
      setElapsed(accRef.current + (performance.now() - startRef.current));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running]);

  const toggle = () => {
    if (running) {
      accRef.current += performance.now() - startRef.current;
      setElapsed(accRef.current);
      setRunning(false);
    } else {
      setRunning(true);
    }
  };

  const reset = () => {
    setRunning(false);
    accRef.current = 0;
    setElapsed(0);
    setLaps([]);
  };

  const lap = () => setLaps((l) => [...l, elapsed]);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-bg-soft px-5 py-10 text-center">
        <div dir="ltr" className="font-mono text-6xl font-bold tabular-nums text-turquoise">
          {fmt(elapsed)}
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Button variant="primary" onClick={toggle}>
          {running ? <Pause className="size-4" /> : <Play className="size-4" />}
          {running ? "توقف" : "شروع"}
        </Button>
        <Button variant="secondary" onClick={lap} disabled={!running}>
          <Flag className="size-4" />
          دور
        </Button>
        <Button variant="danger" onClick={reset} disabled={elapsed === 0 && laps.length === 0}>
          <RotateCcw className="size-4" />
          بازنشانی
        </Button>
      </div>
      {laps.length > 0 && (
        <div className="space-y-2">
          {laps.map((t, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl border border-border bg-bg-soft px-4 py-2.5"
            >
              <span className="text-xs text-muted">دور {(i + 1).toLocaleString("fa-IR")}</span>
              <span className="text-sm text-muted">
                + {fmt(t - (laps[i - 1] ?? 0))}
              </span>
              <code dir="ltr" className="font-mono text-sm font-semibold text-fg">
                {fmt(t)}
              </code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

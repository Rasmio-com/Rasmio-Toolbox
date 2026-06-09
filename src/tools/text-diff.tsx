"use client";

import { useMemo, useState } from "react";
import { Field, TextArea } from "@/components/tool/kit";

type Op = { type: "eq" | "del" | "add"; line: string };

function diffLines(a: string[], b: string[]): Op[] {
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array(m + 1).fill(0),
  );
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      dp[i][j] =
        a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);

  const ops: Op[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      ops.push({ type: "eq", line: a[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      ops.push({ type: "del", line: a[i++] });
    } else {
      ops.push({ type: "add", line: b[j++] });
    }
  }
  while (i < n) ops.push({ type: "del", line: a[i++] });
  while (j < m) ops.push({ type: "add", line: b[j++] });
  return ops;
}

export default function TextDiffTool() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");

  const { ops, added, removed } = useMemo(() => {
    if (!left && !right) return { ops: [] as Op[], added: 0, removed: 0 };
    const ops = diffLines(left.split("\n"), right.split("\n"));
    return {
      ops,
      added: ops.filter((o) => o.type === "add").length,
      removed: ops.filter((o) => o.type === "del").length,
    };
  }, [left, right]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="متن اول">
          <TextArea
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            placeholder="نسخه‌ی اصلی…"
            className="min-h-40"
          />
        </Field>
        <Field label="متن دوم">
          <TextArea
            value={right}
            onChange={(e) => setRight(e.target.value)}
            placeholder="نسخه‌ی جدید…"
            className="min-h-40"
          />
        </Field>
      </div>

      {ops.length > 0 && (
        <div>
          <div className="mb-2 flex gap-4 text-sm">
            <span className="text-success">+ {added.toLocaleString("fa-IR")} افزوده</span>
            <span className="text-danger">− {removed.toLocaleString("fa-IR")} حذف</span>
          </div>
          <div
            dir="ltr"
            className="max-h-[28rem] overflow-auto rounded-xl border border-border bg-bg-soft p-3 font-mono text-sm leading-relaxed"
          >
            {ops.map((o, idx) => (
              <div
                key={idx}
                className={
                  o.type === "add"
                    ? "bg-success/10 text-success"
                    : o.type === "del"
                      ? "bg-danger/10 text-danger"
                      : "text-muted"
                }
              >
                <span className="select-none pe-2 opacity-60">
                  {o.type === "add" ? "+" : o.type === "del" ? "−" : " "}
                </span>
                {o.line || " "}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

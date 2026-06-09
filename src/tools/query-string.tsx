"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  Button,
  Field,
  Output,
  TextInput,
  Toggle,
} from "@/components/tool/kit";

type Row = { key: string; value: string };

function parse(input: string): { base: string; rows: Row[] } {
  let s = input.trim();
  let base = "";
  if (!s) return { base: "", rows: [] };
  const hash = s.indexOf("#");
  if (hash !== -1) s = s.slice(0, hash);
  const q = s.indexOf("?");
  if (q !== -1) {
    base = s.slice(0, q);
    s = s.slice(q + 1);
  } else if (/^[a-z][a-z0-9+.-]*:\/\//i.test(s) || /^\//.test(s)) {
    // looks like a URL/path with no query
    base = s;
    s = "";
  }
  const sp = new URLSearchParams(s);
  const rows: Row[] = [];
  sp.forEach((value, key) => rows.push({ key, value }));
  return { base, rows };
}

export default function QueryStringTool() {
  const [input, setInput] = useState("");
  const [base, setBase] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [sort, setSort] = useState(false);

  // Re-parse whenever the raw input changes.
  useEffect(() => {
    const p = parse(input);
    setBase(p.base);
    setRows(p.rows);
  }, [input]);

  const built = useMemo(() => {
    const items = sort
      ? [...rows].sort((a, b) => a.key.localeCompare(b.key))
      : rows;
    const sp = new URLSearchParams();
    for (const r of items) if (r.key) sp.append(r.key, r.value);
    const qs = sp.toString();
    return base ? (qs ? `${base}?${qs}` : base) : qs;
  }, [rows, base, sort]);

  const update = (i: number, patch: Partial<Row>) =>
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const remove = (i: number) =>
    setRows((rs) => rs.filter((_, idx) => idx !== i));
  const add = () => setRows((rs) => [...rs, { key: "", value: "" }]);

  return (
    <div className="space-y-4">
      <Field label="کوئری‌استرینگ یا آدرس کامل">
        <TextInput
          mono
          dir="ltr"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="https://example.com/p?a=1&b=2  یا  a=1&b=2"
        />
      </Field>

      <div className="flex items-center justify-between gap-3">
        <Toggle checked={sort} onChange={setSort} label="مرتب‌سازی پارامترها" />
        <Button variant="secondary" onClick={add} className="gap-1.5">
          <Plus className="size-4" />
          افزودن پارامتر
        </Button>
      </div>

      {rows.length > 0 && (
        <div className="space-y-2">
          {rows.map((r, i) => (
            <div key={i} className="flex items-center gap-2" dir="ltr">
              <TextInput
                mono
                value={r.key}
                onChange={(e) => update(i, { key: e.target.value })}
                placeholder="کلید"
                className="flex-1"
              />
              <span className="text-faint">=</span>
              <TextInput
                mono
                value={r.value}
                onChange={(e) => update(i, { value: e.target.value })}
                placeholder="مقدار"
                className="flex-1"
              />
              <Button
                variant="ghost"
                onClick={() => remove(i)}
                className="shrink-0 px-2"
                aria-label="حذف"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Output label="خروجی ساخته‌شده" value={built} />
    </div>
  );
}

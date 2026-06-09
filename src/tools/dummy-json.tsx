"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button, Field, Output, TextInput } from "@/components/tool/kit";

const FIRST = ["James", "Mary", "John", "Patricia", "Robert", "Linda", "Michael", "Sarah", "David", "Emma", "Daniel", "Olivia", "Noah", "Sophia", "Liam", "Ava", "Lucas", "Mia", "Henry", "Isabella"];
const LAST = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White"];
const DOMAINS = ["example.com", "mail.com", "test.org", "demo.net", "inbox.io"];
const ROLES = ["admin", "editor", "viewer", "member", "guest"];
const COUNTRIES = ["IR", "US", "GB", "DE", "FR", "CA", "AU", "JP"];

function pick<T>(arr: T[]): T {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return arr[a[0] % arr.length];
}
function randInt(min: number, max: number): number {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return min + (a[0] % (max - min + 1));
}
function uuid(): string {
  return crypto.randomUUID();
}

interface FakeRecord {
  id: number;
  uuid: string;
  name: string;
  username: string;
  email: string;
  age: number;
  role: string;
  country: string;
  active: boolean;
  balance: number;
  createdAt: string;
}

function makeRecord(id: number): FakeRecord {
  const first = pick(FIRST);
  const last = pick(LAST);
  const username = `${first.toLowerCase()}_${last.toLowerCase()}${randInt(1, 99)}`;
  // random timestamp within the past ~2 years
  const ts = Date.now() - randInt(0, 730) * 86400000 - randInt(0, 86399) * 1000;
  return {
    id,
    uuid: uuid(),
    name: `${first} ${last}`,
    username,
    email: `${username}@${pick(DOMAINS)}`,
    age: randInt(18, 70),
    role: pick(ROLES),
    country: pick(COUNTRIES),
    active: randInt(0, 1) === 1,
    balance: Number((randInt(0, 1000000) / 100).toFixed(2)),
    createdAt: new Date(ts).toISOString(),
  };
}

export default function DummyJsonTool() {
  const [count, setCount] = useState(10);
  const [json, setJson] = useState("");

  const gen = useCallback(() => {
    const n = Math.min(Math.max(count, 1), 500);
    const rows = Array.from({ length: n }, (_, i) => makeRecord(i + 1));
    setJson(JSON.stringify(rows, null, 2));
  }, [count]);

  useEffect(() => {
    gen();
  }, [gen]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
        <Field label="تعداد رکورد" hint="۱ تا ۵۰۰" className="w-32">
          <TextInput
            type="number"
            min={1}
            max={500}
            dir="ltr"
            value={count}
            onChange={(e) => setCount(Number(e.target.value) || 1)}
          />
        </Field>
        <Button variant="primary" onClick={gen} className="gap-1.5">
          <RefreshCw className="size-4" />
          تولید مجدد
        </Button>
      </div>
      <p className="text-xs text-muted">
        آرایه‌ای از اشیاء نمونه با فیلدهای واقع‌نما (id، uuid، name، email، role،
        active، balance، createdAt و…) برای آزمون API و رابط کاربری.
      </p>
      <Output
        label="JSON نمونه"
        value={json}
        className="min-h-80"
        download={{ filename: "dummy.json", mime: "application/json" }}
      />
    </div>
  );
}

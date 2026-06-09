"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button, Field, Output, Segmented, TextInput, Toggle } from "@/components/tool/kit";

const FA_FIRST = ["علی", "رضا", "محمد", "حسین", "مهدی", "امیر", "سینا", "نیما", "زهرا", "فاطمه", "مریم", "سارا", "نگار", "الهام", "پریسا", "آرش", "بهنام", "کاوه", "لیلا", "شیما"];
const FA_LAST = ["محمدی", "حسینی", "رضایی", "کریمی", "موسوی", "احمدی", "علوی", "نجفی", "صادقی", "قاسمی", "کاظمی", "اکبری", "یوسفی", "بابایی", "رستمی"];
const EN_FIRST = ["James", "Mary", "John", "Patricia", "Robert", "Linda", "Michael", "Sarah", "David", "Emma", "Daniel", "Olivia", "Noah", "Sophia", "Liam", "Ava", "Lucas", "Mia", "Henry", "Isabella"];
const EN_LAST = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White"];
const FA_CITY = ["تهران", "مشهد", "اصفهان", "شیراز", "تبریز", "کرج", "اهواز", "قم", "رشت", "یزد", "کرمان", "ارومیه"];
const EN_CITY = ["New York", "London", "Toronto", "Berlin", "Sydney", "Paris", "Madrid", "Tokyo", "Dubai", "Amsterdam"];
const COMPANY = ["Rasmio", "Acme", "Globex", "Initech", "Umbrella", "Soylent", "Hooli", "Pied Piper", "Stark", "Wayne", "Cyberdyne", "Wonka"];
const COMPANY_SUFFIX = ["Inc", "LLC", "Group", "Co", "Tech", "Labs"];
const DOMAINS = ["example.com", "mail.com", "test.org", "demo.net", "inbox.io", "sample.co"];

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
function translit(s: string): string {
  // best-effort latin slug for emails from Persian names
  const map: Record<string, string> = { علی: "ali", رضا: "reza", محمد: "mohammad", حسین: "hossein", مهدی: "mehdi", امیر: "amir", سینا: "sina", نیما: "nima", زهرا: "zahra", فاطمه: "fateme", مریم: "maryam", سارا: "sara", نگار: "negar", الهام: "elham", پریسا: "parisa", آرش: "arash", بهنام: "behnam", کاوه: "kaveh", لیلا: "leila", شیما: "shima", محمدی: "mohammadi", حسینی: "hosseini", رضایی: "rezaei", کریمی: "karimi", موسوی: "mousavi", احمدی: "ahmadi", علوی: "alavi", نجفی: "najafi", صادقی: "sadeghi", قاسمی: "ghasemi", کاظمی: "kazemi", اکبری: "akbari", یوسفی: "yousefi", بابایی: "babaei", رستمی: "rostami" };
  return map[s] ?? s;
}

interface Person {
  name: string;
  email: string;
  phone: string;
  city: string;
  company: string;
}

function makePerson(fa: boolean): Person {
  const first = fa ? pick(FA_FIRST) : pick(EN_FIRST);
  const last = fa ? pick(FA_LAST) : pick(EN_LAST);
  const slugFirst = (fa ? translit(first) : first).toLowerCase();
  const slugLast = (fa ? translit(last) : last).toLowerCase();
  const email = `${slugFirst}.${slugLast}${randInt(1, 99)}@${pick(DOMAINS)}`;
  const phone = fa
    ? `+989${randInt(10, 39)}${String(randInt(0, 9999999)).padStart(7, "0")}`
    : `+1${randInt(200, 989)}${String(randInt(0, 9999999)).padStart(7, "0")}`;
  return {
    name: `${first} ${last}`,
    email,
    phone,
    city: fa ? pick(FA_CITY) : pick(EN_CITY),
    company: `${pick(COMPANY)} ${pick(COMPANY_SUFFIX)}`,
  };
}

export default function FakeDataTool() {
  const [count, setCount] = useState(5);
  const [fa, setFa] = useState(true);
  const [view, setView] = useState<"list" | "json">("list");
  const [people, setPeople] = useState<Person[]>([]);

  const gen = useCallback(() => {
    const n = Math.min(Math.max(count, 1), 200);
    setPeople(Array.from({ length: n }, () => makePerson(fa)));
  }, [count, fa]);

  useEffect(() => {
    gen();
  }, [gen]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
        <Field label="تعداد" hint="۱ تا ۲۰۰" className="w-32">
          <TextInput
            type="number"
            min={1}
            max={200}
            dir="ltr"
            value={count}
            onChange={(e) => setCount(Number(e.target.value) || 1)}
          />
        </Field>
        <Toggle checked={fa} onChange={setFa} label="نام‌های فارسی" />
        <Segmented
          value={view}
          onChange={setView}
          options={[
            { value: "list", label: "فهرست" },
            { value: "json", label: "JSON" },
          ]}
        />
        <Button variant="primary" onClick={gen} className="gap-1.5">
          <RefreshCw className="size-4" />
          تولید مجدد
        </Button>
      </div>

      {view === "json" ? (
        <Output
          label={`داده ساختگی (${people.length})`}
          value={JSON.stringify(people, null, 2)}
          className="min-h-72"
          download={{ filename: "fake-data.json", mime: "application/json" }}
        />
      ) : (
        <div className="space-y-2">
          {people.map((p, i) => (
            <div key={i} className="rounded-xl border border-border bg-bg-soft px-4 py-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-semibold text-fg">{p.name}</span>
                <code dir="ltr" className="text-xs text-saffron">{p.email}</code>
              </div>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted">
                <span dir="ltr">{p.phone}</span>
                <span>{p.city}</span>
                <span dir="ltr">{p.company}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

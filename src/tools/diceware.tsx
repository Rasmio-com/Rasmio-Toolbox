"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button, CopyButton, Field, Select, Stat } from "@/components/tool/kit";
import { toAsciiDigits } from "@/lib/utils";

const WORDS = [
  "apple", "river", "stone", "cloud", "tiger", "amber", "ocean", "maple", "ember", "frost",
  "grape", "honey", "ivory", "jolly", "koala", "lemon", "mango", "noble", "olive", "pearl",
  "quartz", "raven", "sunny", "tulip", "umber", "vivid", "willow", "xenon", "yacht", "zebra",
  "anchor", "bridge", "candle", "dragon", "eagle", "forest", "garden", "harbor", "island", "jungle",
  "kettle", "ladder", "meadow", "needle", "orange", "pepper", "quiver", "rocket", "silver", "thunder",
  "violet", "walnut", "yellow", "almond", "bamboo", "carbon", "diamond", "engine", "falcon", "galaxy",
  "hammer", "indigo", "jacket", "kitten", "lantern", "marble", "nectar", "onion", "pebble", "quilt",
  "ribbon", "saddle", "temple", "udder", "velvet", "wagon", "yarn", "acorn", "bison", "cedar",
  "daisy", "elbow", "fable", "glove", "hazel", "igloo", "jewel", "knot", "lilac", "moss",
  "north", "otter", "plum", "quail", "robin", "shell", "trout", "unity", "vase", "wheat",
  "zest", "angle", "berry", "cabin", "dune", "echo", "flame", "grain", "hill", "iron",
  "jade", "kite", "leaf", "mint", "nest", "oak", "pine", "reed", "sand", "vine",
];

function randInt(max: number): number {
  const arr = new Uint32Array(1);
  const limit = Math.floor(0xffffffff / max) * max;
  let x: number;
  do {
    crypto.getRandomValues(arr);
    x = arr[0];
  } while (x >= limit);
  return x % max;
}

export default function DicewareTool() {
  const [count, setCount] = useState("5");
  const [sep, setSep] = useState("-");
  const [phrase, setPhrase] = useState("");

  const gen = useCallback(() => {
    const n = Math.min(Math.max(parseInt(toAsciiDigits(count), 10) || 5, 1), 20);
    const picked: string[] = [];
    for (let i = 0; i < n; i++) picked.push(WORDS[randInt(WORDS.length)]);
    setPhrase(picked.join(sep));
  }, [count, sep]);

  useEffect(() => {
    gen();
  }, [gen]);

  const words = Math.min(Math.max(parseInt(toAsciiDigits(count), 10) || 5, 1), 20);
  const entropy = Math.round(words * Math.log2(WORDS.length));

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-bg-soft p-4">
        <code dir="ltr" className="min-w-0 flex-1 break-all font-mono text-lg text-fg">
          {phrase || "—"}
        </code>
        <CopyButton value={phrase} />
        <Button variant="primary" onClick={gen} aria-label="تولید مجدد">
          <RefreshCw className="size-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="تعداد کلمات">
          <Select value={count} onChange={(e) => setCount(e.target.value)}>
            {[3, 4, 5, 6, 7, 8, 10].map((n) => (
              <option key={n} value={String(n)}>
                {n}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="جداکننده">
          <Select value={sep} onChange={(e) => setSep(e.target.value)}>
            <option value="-">خط تیره ( - )</option>
            <option value=".">نقطه ( . )</option>
            <option value="_">زیرخط ( _ )</option>
            <option value=" ">فاصله ( )</option>
            <option value="">بدون جداکننده</option>
          </Select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Stat label="تعداد کلمات" value={words.toLocaleString("fa-IR")} />
        <Stat label="آنتروپی تقریبی (بیت)" value={`~${entropy}`} />
      </div>
      <p className="text-xs text-faint">
        از فهرستی شامل {WORDS.length.toLocaleString("fa-IR")} واژه و crypto.getRandomValues برای
        انتخاب تصادفی امن استفاده می‌شود.
      </p>
    </div>
  );
}

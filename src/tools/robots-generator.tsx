"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button, Field, Output, TextArea, TextInput } from "@/components/tool/kit";

type Group = { agent: string; allow: string; disallow: string };

export default function RobotsGeneratorTool() {
  const [groups, setGroups] = useState<Group[]>([
    { agent: "*", allow: "", disallow: "" },
  ]);
  const [sitemap, setSitemap] = useState("");
  const [crawlDelay, setCrawlDelay] = useState("");

  const update = (i: number, patch: Partial<Group>) =>
    setGroups((gs) => gs.map((g, idx) => (idx === i ? { ...g, ...patch } : g)));
  const remove = (i: number) => setGroups((gs) => gs.filter((_, idx) => idx !== i));
  const add = () => setGroups((gs) => [...gs, { agent: "*", allow: "", disallow: "" }]);

  const out = useMemo(() => {
    const blocks: string[] = [];
    const splitLines = (s: string) => s.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    for (const g of groups) {
      const lines: string[] = [`User-agent: ${g.agent.trim() || "*"}`];
      for (const p of splitLines(g.disallow)) lines.push(`Disallow: ${p}`);
      for (const p of splitLines(g.allow)) lines.push(`Allow: ${p}`);
      if (crawlDelay.trim()) lines.push(`Crawl-delay: ${crawlDelay.trim()}`);
      blocks.push(lines.join("\n"));
    }
    let text = blocks.join("\n\n");
    for (const sm of splitLines(sitemap)) text += `\n\nSitemap: ${sm}`;
    return text.trim();
  }, [groups, sitemap, crawlDelay]);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {groups.map((g, i) => (
          <div key={i} className="space-y-3 rounded-xl border border-border bg-bg-soft p-3">
            <div className="flex items-center gap-2">
              <Field label="User-agent" className="flex-1">
                <TextInput mono dir="ltr" value={g.agent} onChange={(e) => update(i, { agent: e.target.value })} placeholder="*" />
              </Field>
              <Button variant="ghost" onClick={() => remove(i)} className="mt-5 shrink-0 px-2" aria-label="حذف">
                <Trash2 className="size-4" />
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Disallow (هر خط یک مسیر)">
                <TextArea value={g.disallow} onChange={(e) => update(i, { disallow: e.target.value })} placeholder={"/admin/\n/private/"} className="min-h-20" />
              </Field>
              <Field label="Allow (هر خط یک مسیر)">
                <TextArea value={g.allow} onChange={(e) => update(i, { allow: e.target.value })} placeholder={"/public/"} className="min-h-20" />
              </Field>
            </div>
          </div>
        ))}
      </div>

      <Button variant="secondary" onClick={add} className="gap-1.5">
        <Plus className="size-4" />
        افزودن گروه User-agent
      </Button>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Crawl-delay" hint="اختیاری (ثانیه)">
          <TextInput mono dir="ltr" value={crawlDelay} onChange={(e) => setCrawlDelay(e.target.value)} placeholder="10" />
        </Field>
      </div>
      <Field label="Sitemap (هر خط یک آدرس)">
        <TextArea value={sitemap} onChange={(e) => setSitemap(e.target.value)} placeholder="https://example.com/sitemap.xml" className="min-h-20" />
      </Field>

      <Output label="robots.txt" value={out} download={{ filename: "robots.txt", mime: "text/plain" }} />
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import { Field, Grid2, TextArea, TextInput } from "@/components/tool/kit";

type Rule = { re: RegExp; negate: boolean; dirOnly: boolean; source: string };

/** Translate a single .gitignore pattern into a RegExp (best-effort). */
function patternToRegExp(pat: string): { re: RegExp; dirOnly: boolean; anchored: boolean } {
  let p = pat;
  let dirOnly = false;
  if (p.endsWith("/")) { dirOnly = true; p = p.slice(0, -1); }
  // Anchored if it contains a slash anywhere except a trailing one.
  const anchored = p.includes("/");
  if (p.startsWith("/")) p = p.slice(1);

  let re = "";
  let i = 0;
  while (i < p.length) {
    const c = p[i];
    if (c === "*") {
      if (p[i + 1] === "*") {
        // ** : match across directories
        if (p[i + 2] === "/") { re += "(?:.*/)?"; i += 3; }
        else { re += ".*"; i += 2; }
        continue;
      }
      re += "[^/]*";
      i++;
    } else if (c === "?") {
      re += "[^/]";
      i++;
    } else if (c === "[") {
      const end = p.indexOf("]", i);
      if (end === -1) { re += "\\["; i++; }
      else { re += p.slice(i, end + 1); i = end + 1; }
    } else {
      re += /[\\^$.+?()|{}]/.test(c) ? "\\" + c : c;
      i++;
    }
  }
  // A trailing match should also cover everything beneath a matched dir.
  const body = anchored ? "^" + re : "(?:^|.*/)" + re;
  return { re: new RegExp(body + "(?:/.*)?$"), dirOnly, anchored };
}

function buildRules(text: string): Rule[] {
  return text
    .split("\n")
    .map((l) => l.replace(/\r$/, ""))
    .filter((l) => l.trim() && !l.trim().startsWith("#"))
    .map((raw) => {
      let line = raw.trim();
      let negate = false;
      if (line.startsWith("!")) { negate = true; line = line.slice(1); }
      const { re, dirOnly } = patternToRegExp(line);
      return { re, negate, dirOnly, source: raw.trim() };
    });
}

function isIgnored(path: string, rules: Rule[]): { ignored: boolean; rule?: string } {
  const isDir = path.trim().endsWith("/");
  const clean = path.trim().replace(/^\.?\//, "").replace(/\/$/, "");
  let ignored = false;
  let matchedRule: string | undefined;
  // Last matching rule wins; negation un-ignores.
  for (const r of rules) {
    // A dir-only rule (e.g. "build/") only matches directories or paths inside them.
    if (r.dirOnly && !isDir && !clean.includes("/") && r.re.test(clean)) continue;
    if (r.re.test(clean)) {
      ignored = !r.negate;
      matchedRule = r.source;
    }
  }
  return { ignored, rule: matchedRule };
}

export default function GitignoreTesterTool() {
  const [rulesText, setRulesText] = useState("");
  const [path, setPath] = useState("");

  const rules = useMemo(() => buildRules(rulesText), [rulesText]);
  const result = useMemo(() => {
    if (!path.trim() || rules.length === 0) return null;
    return isIgnored(path, rules);
  }, [path, rules]);

  return (
    <div className="space-y-4">
      <Grid2>
        <Field label="محتوای ‎.gitignore" hint="هر خط یک قانون">
          <TextArea
            value={rulesText}
            onChange={(e) => setRulesText(e.target.value)}
            placeholder={"node_modules/\n*.log\n!important.log\ndist/\n**/.DS_Store"}
          />
        </Field>
        <Field label="مسیر برای آزمون" hint="پوشه را با / پایانی بنویسید">
          <TextInput
            mono
            dir="ltr"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="src/app.log"
          />
        </Field>
      </Grid2>

      {result && (
        <div
          className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
            result.ignored
              ? "border-danger/40 bg-danger/10 text-danger"
              : "border-success/40 bg-success/10 text-success"
          }`}
        >
          {result.ignored ? <X className="size-5" /> : <Check className="size-5" />}
          <div>
            <div className="font-semibold">
              {result.ignored ? "این مسیر نادیده گرفته می‌شود (ignored)" : "این مسیر دنبال می‌شود (tracked)"}
            </div>
            {result.rule && (
              <div className="mt-0.5 font-mono text-xs opacity-80" dir="ltr">
                قانون منطبق: {result.rule}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

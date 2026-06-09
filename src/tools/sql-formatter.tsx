"use client";

import { useMemo, useState } from "react";
import { Field, Grid2, Output, TextArea, Toggle } from "@/components/tool/kit";

const KEYWORDS = [
  "SELECT", "FROM", "WHERE", "AND", "OR", "NOT", "INSERT", "INTO", "VALUES",
  "UPDATE", "SET", "DELETE", "CREATE", "TABLE", "ALTER", "DROP", "INDEX",
  "VIEW", "JOIN", "INNER", "LEFT", "RIGHT", "FULL", "OUTER", "CROSS", "ON",
  "GROUP", "BY", "ORDER", "HAVING", "LIMIT", "OFFSET", "UNION", "ALL", "AS",
  "DISTINCT", "COUNT", "SUM", "AVG", "MIN", "MAX", "BETWEEN", "LIKE", "IN",
  "IS", "NULL", "ASC", "DESC", "CASE", "WHEN", "THEN", "ELSE", "END", "EXISTS",
  "PRIMARY", "KEY", "FOREIGN", "REFERENCES", "DEFAULT", "WITH",
];
const KW_SET = new Set(KEYWORDS);
// Clauses that begin a new line — longest phrases first so they match greedily.
const NEWLINE_BEFORE = [
  "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL JOIN", "CROSS JOIN",
  "OUTER JOIN", "GROUP BY", "ORDER BY", "SELECT", "FROM", "WHERE", "JOIN",
  "HAVING", "LIMIT", "OFFSET", "UNION", "VALUES", "SET", "INSERT", "UPDATE",
  "DELETE", "AND", "OR",
];

function tokenize(sql: string): string[] {
  const re = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`]|``)*`|[A-Za-z_][\w$]*|\d+(?:\.\d+)?|[(),;]|[<>=!]+|\S/g;
  return sql.match(re) ?? [];
}
const isString = (t: string) => /^['"`]/.test(t);
const norm = (t: string) =>
  !isString(t) && KW_SET.has(t.toUpperCase()) ? t.toUpperCase() : t;

function format(sql: string): string {
  const up = tokenize(sql).map(norm);
  const lines: string[] = [];
  let cur = "";
  let i = 0;
  const push = () => { if (cur.trim()) lines.push(cur.trimEnd()); cur = ""; };
  const matchPhrase = (idx: number, phrase: string): number => {
    const parts = phrase.split(" ");
    for (let k = 0; k < parts.length; k++)
      if ((up[idx + k] ?? "").toUpperCase() !== parts[k]) return 0;
    return parts.length;
  };

  while (i < up.length) {
    let len = 0, phrase = "";
    for (const p of NEWLINE_BEFORE) {
      const m = matchPhrase(i, p);
      if (m) { len = m; phrase = p; break; }
    }
    if (len) {
      push();
      cur = (phrase === "AND" || phrase === "OR" ? "  " : "") + phrase + " ";
      i += len;
      continue;
    }
    const tok = up[i];
    if (tok === ",") {
      cur = cur.trimEnd() + ",\n  ";
      i++;
      continue;
    }
    if (tok === ";") { cur = cur.trimEnd() + ";"; push(); i++; continue; }
    if (tok === "(") { cur += "("; i++; continue; }
    if (tok === ")") { cur = cur.trimEnd() + ") "; i++; continue; }
    cur += tok + " ";
    i++;
  }
  push();
  return lines.join("\n");
}

function minify(sql: string): string {
  return tokenize(sql)
    .map(norm)
    .reduce((acc, t) => {
      if (t === "," || t === ";" || t === ")") return acc + t;
      if (t === "(") return acc + (acc === "" || acc.endsWith("(") ? "(" : " (");
      return acc + (acc === "" || acc.endsWith("(") ? "" : " ") + t;
    }, "")
    .trim();
}

export default function SqlFormatterTool() {
  const [input, setInput] = useState("");
  const [min, setMin] = useState(false);

  const out = useMemo(() => {
    if (!input.trim()) return "";
    try {
      return min ? minify(input) : format(input);
    } catch {
      return "";
    }
  }, [input, min]);

  return (
    <div className="space-y-4">
      <Toggle checked={min} onChange={setMin} label="فشرده‌سازی (Minify)" />
      <Grid2>
        <Field label="SQL ورودی">
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="select id, name from users where age > 18 and active = 1 order by name"
          />
        </Field>
        <Output
          label={min ? "SQL فشرده" : "SQL قالب‌بندی‌شده"}
          value={out}
          download={{ filename: "query.sql", mime: "application/sql" }}
        />
      </Grid2>
    </div>
  );
}

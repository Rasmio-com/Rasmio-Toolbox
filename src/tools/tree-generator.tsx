"use client";

import { useMemo, useState } from "react";
import { Field, Grid2, Output, Segmented, TextArea } from "@/components/tool/kit";

type Node = { name: string; depth: number; children: Node[] };

// Detect indent unit by scanning leading whitespace; tab = 1 level, else N spaces.
function indentLevel(raw: string, spaces: number): number {
  const lead = raw.match(/^[\t ]*/)?.[0] ?? "";
  if (lead.includes("\t")) return lead.replace(/[^\t]/g, "").length;
  return Math.floor(lead.length / spaces);
}

function buildTree(lines: string[], spaces: number): Node[] {
  const root: Node = { name: "", depth: -1, children: [] };
  const stack: Node[] = [root];
  for (const line of lines) {
    if (!line.trim()) continue;
    const depth = indentLevel(line, spaces);
    const node: Node = { name: line.trim(), depth, children: [] };
    while (stack.length > 1 && stack[stack.length - 1].depth >= depth) stack.pop();
    stack[stack.length - 1].children.push(node);
    stack.push(node);
  }
  return root.children;
}

function render(nodes: Node[], prefix: string): string {
  let out = "";
  nodes.forEach((node, i) => {
    const last = i === nodes.length - 1;
    out += `${prefix}${last ? "└─ " : "├─ "}${node.name}\n`;
    if (node.children.length) {
      out += render(node.children, prefix + (last ? "   " : "│  "));
    }
  });
  return out;
}

export default function TreeGeneratorTool() {
  const [input, setInput] = useState("");
  const [unit, setUnit] = useState<"2" | "4" | "tab">("2");

  const out = useMemo(() => {
    if (!input.trim()) return "";
    const spaces = unit === "tab" ? 1 : Number(unit);
    const tree = buildTree(input.replace(/\r/g, "").split("\n"), spaces);
    if (tree.length === 0) return "";
    // Roots: first root printed plainly, rest tree-connected at top level.
    let out = "";
    tree.forEach((root, i) => {
      out += `${root.name}\n`;
      out += render(root.children, "");
      if (i < tree.length - 1) out += "\n";
    });
    return out.replace(/\n$/, "");
  }, [input, unit]);

  return (
    <div className="space-y-4">
      <Segmented
        value={unit}
        onChange={setUnit}
        options={[
          { value: "2", label: "۲ فاصله" },
          { value: "4", label: "۴ فاصله" },
          { value: "tab", label: "تب" },
        ]}
      />
      <Grid2>
        <Field label="ورودی (تورفتگی = عمق)" hint="هر خط یک نام">
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={"src\n  components\n    Button.tsx\n    Card.tsx\n  utils.ts\npackage.json"}
          />
        </Field>
        <Output label="درخت" value={out} download={{ filename: "tree.txt" }} />
      </Grid2>
    </div>
  );
}

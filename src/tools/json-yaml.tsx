"use client";

import { useMemo, useState } from "react";
import yaml from "js-yaml";
import { ErrorNote, Field, Grid2, Output, Segmented, TextArea } from "@/components/tool/kit";

export default function JsonYamlTool() {
  const [dir, setDir] = useState<"j2y" | "y2j">("j2y");
  const [input, setInput] = useState("");

  const { out, err } = useMemo(() => {
    if (!input.trim()) return { out: "", err: "" };
    try {
      if (dir === "j2y") {
        const obj = JSON.parse(input);
        return { out: yaml.dump(obj, { indent: 2, lineWidth: 120 }), err: "" };
      }
      const obj = yaml.load(input);
      return { out: JSON.stringify(obj, null, 2), err: "" };
    } catch (e) {
      return { out: "", err: `ورودی نامعتبر: ${(e as Error).message}` };
    }
  }, [input, dir]);

  return (
    <div className="space-y-4">
      <Segmented
        value={dir}
        onChange={setDir}
        options={[
          { value: "j2y", label: "JSON ← YAML" },
          { value: "y2j", label: "YAML ← JSON" },
        ]}
      />
      <Grid2>
        <Field label={dir === "j2y" ? "JSON ورودی" : "YAML ورودی"}>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            dir="ltr"
            placeholder={dir === "j2y" ? '{"a":1,"b":[2,3]}' : "a: 1\nb:\n  - 2\n  - 3"}
            className="min-h-72"
          />
        </Field>
        <Output
          label="خروجی"
          value={out}
          className="min-h-72"
          download={{
            filename: dir === "j2y" ? "out.yaml" : "out.json",
          }}
        />
      </Grid2>
      {err && <ErrorNote>{err}</ErrorNote>}
    </div>
  );
}

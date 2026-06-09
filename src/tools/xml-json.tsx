"use client";

import { useMemo, useState } from "react";
import { ErrorNote, Field, Grid2, Output, Segmented, TextArea } from "@/components/tool/kit";

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
interface JsonObject {
  [key: string]: JsonValue;
}

// ── XML → JSON ──────────────────────────────────────────────
// Attributes become "@name", text content becomes "#text"; repeated
// child elements collapse into arrays.
function elementToJson(el: Element): JsonValue {
  const obj: JsonObject = {};
  for (const attr of Array.from(el.attributes)) obj[`@${attr.name}`] = attr.value;

  const childEls = Array.from(el.children);
  const text = Array.from(el.childNodes)
    .filter((n) => n.nodeType === 3)
    .map((n) => n.nodeValue ?? "")
    .join("")
    .trim();

  if (childEls.length === 0) {
    if (Object.keys(obj).length === 0) return text; // pure leaf → its text
    if (text) obj["#text"] = text;
    return obj;
  }
  if (text) obj["#text"] = text;
  for (const child of childEls) {
    const val = elementToJson(child);
    const key = child.tagName;
    if (key in obj) {
      const prev = obj[key];
      if (Array.isArray(prev)) prev.push(val);
      else obj[key] = [prev, val];
    } else {
      obj[key] = val;
    }
  }
  return obj;
}

function xmlToJson(xml: string): JsonObject {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const errNode = doc.querySelector("parsererror");
  if (errNode) throw new Error(errNode.textContent?.replace(/\s+/g, " ").trim() || "XML نامعتبر");
  const root = doc.documentElement;
  if (!root) throw new Error("ریشه‌ای یافت نشد");
  return { [root.tagName]: elementToJson(root) };
}

// ── JSON → XML ──────────────────────────────────────────────
function escapeText(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeAttr(s: string): string {
  return escapeText(s).replace(/"/g, "&quot;");
}

function buildXml(tag: string, value: JsonValue, indent: string): string {
  if (Array.isArray(value)) return value.map((v) => buildXml(tag, v, indent)).join("\n");
  if (value !== null && typeof value === "object") {
    const attrs: string[] = [];
    const children: string[] = [];
    let textContent = "";
    for (const [k, v] of Object.entries(value)) {
      if (k.startsWith("@")) attrs.push(`${k.slice(1)}="${escapeAttr(String(v))}"`);
      else if (k === "#text") textContent = String(v);
      else children.push(buildXml(k, v as JsonValue, indent + "  "));
    }
    const attrStr = attrs.length ? " " + attrs.join(" ") : "";
    if (!children.length && !textContent) return `${indent}<${tag}${attrStr}/>`;
    if (!children.length) return `${indent}<${tag}${attrStr}>${escapeText(textContent)}</${tag}>`;
    return `${indent}<${tag}${attrStr}>\n${children.join("\n")}\n${indent}</${tag}>`;
  }
  if (value === null) return `${indent}<${tag}/>`;
  return `${indent}<${tag}>${escapeText(String(value))}</${tag}>`;
}

function jsonToXml(json: string): string {
  const data = JSON.parse(json) as JsonObject;
  const keys = Object.keys(data);
  const root = keys.length === 1 ? keys[0] : "root";
  const body = keys.length === 1 ? data[root] : data;
  return buildXml(root, body, "");
}

export default function XmlJsonTool() {
  const [mode, setMode] = useState<"x2j" | "j2x">("x2j");
  const [input, setInput] = useState("");

  const { out, err } = useMemo(() => {
    if (!input.trim()) return { out: "", err: "" };
    try {
      if (mode === "x2j") return { out: JSON.stringify(xmlToJson(input), null, 2), err: "" };
      return { out: jsonToXml(input), err: "" };
    } catch (e) {
      return { out: "", err: `ورودی نامعتبر: ${(e as Error).message}` };
    }
  }, [input, mode]);

  return (
    <div className="space-y-4">
      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: "x2j", label: "XML → JSON" },
          { value: "j2x", label: "JSON → XML" },
        ]}
      />
      <Grid2>
        <Field label={mode === "x2j" ? "XML ورودی" : "JSON ورودی"}>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            dir="ltr"
            placeholder={
              mode === "x2j"
                ? '<book id="1"><title>الف</title></book>'
                : '{"book":{"@id":"1","title":"الف"}}'
            }
            className="min-h-72"
          />
        </Field>
        <Output
          label="خروجی"
          value={out}
          className="min-h-72"
          download={{ filename: mode === "x2j" ? "out.json" : "out.xml" }}
        />
      </Grid2>
      {err && <ErrorNote>{err}</ErrorNote>}
    </div>
  );
}

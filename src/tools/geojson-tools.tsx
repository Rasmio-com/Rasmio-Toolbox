"use client";

import { useMemo, useState } from "react";
import { ErrorNote, Field, Output, Segmented, Stat, TextArea } from "@/components/tool/kit";

type BBox = { minLng: number; minLat: number; maxLng: number; maxLat: number };

// Recursively walk any coordinates structure ([lng,lat] leaves) into bbox.
function walkCoords(node: unknown, bb: BBox) {
  if (!Array.isArray(node)) return;
  if (typeof node[0] === "number" && typeof node[1] === "number") {
    const [lng, lat] = node as number[];
    bb.minLng = Math.min(bb.minLng, lng);
    bb.maxLng = Math.max(bb.maxLng, lng);
    bb.minLat = Math.min(bb.minLat, lat);
    bb.maxLat = Math.max(bb.maxLat, lat);
    return;
  }
  for (const child of node) walkCoords(child, bb);
}

function collectFeatures(obj: { type?: string; features?: unknown[]; geometry?: unknown; geometries?: unknown[] }): { count: number; geoms: unknown[] } {
  if (obj?.type === "FeatureCollection" && Array.isArray(obj.features)) {
    const geoms = obj.features.map((f) => (f as { geometry?: unknown })?.geometry).filter(Boolean);
    return { count: obj.features.length, geoms };
  }
  if (obj?.type === "Feature") return { count: 1, geoms: [obj.geometry] };
  if (obj?.type === "GeometryCollection" && Array.isArray(obj.geometries)) {
    return { count: obj.geometries.length, geoms: obj.geometries };
  }
  return { count: 1, geoms: [obj] };
}

export default function GeojsonToolsTool() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"pretty" | "minify">("pretty");

  const { out, stats, err } = useMemo(() => {
    if (!input.trim()) return { out: "", stats: [], err: "" };
    let parsed: unknown;
    try {
      parsed = JSON.parse(input);
    } catch {
      return { out: "", stats: [], err: "JSON نامعتبر است." };
    }
    const obj = parsed as { type?: string };
    const validTypes = [
      "FeatureCollection", "Feature", "Point", "MultiPoint", "LineString",
      "MultiLineString", "Polygon", "MultiPolygon", "GeometryCollection",
    ];
    if (!obj || typeof obj !== "object" || !obj.type || !validTypes.includes(obj.type))
      return { out: "", stats: [], err: "این یک شیء GeoJSON معتبر نیست (فیلد type نامعتبر)." };

    const { count, geoms } = collectFeatures(obj);
    const bb: BBox = { minLng: Infinity, minLat: Infinity, maxLng: -Infinity, maxLat: -Infinity };
    for (const g of geoms) walkCoords((g as { coordinates?: unknown; geometries?: unknown[] })?.coordinates ?? (g as { geometries?: unknown[] })?.geometries, bb);

    const hasBox = Number.isFinite(bb.minLng);
    const stats = [
      { label: "نوع", value: obj.type },
      { label: "تعداد ویژگی‌ها", value: String(count) },
      { label: "کادر SW", value: hasBox ? `${bb.minLng.toFixed(4)}, ${bb.minLat.toFixed(4)}` : "—" },
      { label: "کادر NE", value: hasBox ? `${bb.maxLng.toFixed(4)}, ${bb.maxLat.toFixed(4)}` : "—" },
    ];
    const formatted = mode === "pretty" ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed);
    return { out: formatted, stats, err: "" };
  }, [input, mode]);

  return (
    <div className="space-y-4">
      <Field label="ورودی GeoJSON">
        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"type":"Feature","geometry":{"type":"Point","coordinates":[51.38,35.68]},"properties":{}}'
        />
      </Field>
      {err && <ErrorNote>{err}</ErrorNote>}
      {stats.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <Stat key={s.label} label={s.label} value={<span className="text-base">{s.value}</span>} />
            ))}
          </div>
          <Segmented
            value={mode}
            onChange={setMode}
            options={[
              { value: "pretty", label: "زیباسازی" },
              { value: "minify", label: "فشرده‌سازی" },
            ]}
          />
          <Output label="خروجی" value={out} download={{ filename: "data.geojson", mime: "application/geo+json" }} />
        </>
      )}
    </div>
  );
}

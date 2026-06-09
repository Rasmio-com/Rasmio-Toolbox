"use client";

import { useMemo, useState } from "react";
import { ErrorNote, Field, Grid2, Output, Segmented, TextArea } from "@/components/tool/kit";
import { toAsciiDigits } from "@/lib/utils";

function encodeValue(num: number): string {
  let v = num < 0 ? ~(num << 1) : num << 1;
  let out = "";
  while (v >= 0x20) {
    out += String.fromCharCode((0x20 | (v & 0x1f)) + 63);
    v >>= 5;
  }
  out += String.fromCharCode(v + 63);
  return out;
}

function encodePolyline(points: [number, number][]): string {
  let out = "";
  let lastLat = 0, lastLng = 0;
  for (const [lat, lng] of points) {
    const ilat = Math.round(lat * 1e5);
    const ilng = Math.round(lng * 1e5);
    out += encodeValue(ilat - lastLat);
    out += encodeValue(ilng - lastLng);
    lastLat = ilat;
    lastLng = ilng;
  }
  return out;
}

function decodePolyline(str: string): [number, number][] {
  const pts: [number, number][] = [];
  let index = 0, lat = 0, lng = 0;
  while (index < str.length) {
    let result = 0, shift = 0, b: number;
    do {
      b = str.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;
    result = 0; shift = 0;
    do {
      b = str.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;
    pts.push([lat / 1e5, lng / 1e5]);
  }
  return pts;
}

export default function PolylineTool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");

  const { out, err } = useMemo(() => {
    if (!input.trim()) return { out: "", err: "" };
    try {
      if (mode === "encode") {
        const pts: [number, number][] = [];
        for (const line of toAsciiDigits(input).split("\n")) {
          const t = line.trim();
          if (!t) continue;
          const [a, b] = t.split(",").map((x) => parseFloat(x.trim()));
          if (Number.isNaN(a) || Number.isNaN(b)) throw new Error("bad");
          pts.push([a, b]);
        }
        if (pts.length === 0) return { out: "", err: "" };
        return { out: encodePolyline(pts), err: "" };
      }
      const pts = decodePolyline(input.trim());
      if (pts.length === 0) throw new Error("empty");
      return { out: pts.map(([a, b]) => `${a},${b}`).join("\n"), err: "" };
    } catch {
      return { out: "", err: mode === "encode" ? "هر خط باید به شکل lat,lng باشد." : "رشتهٔ Polyline نامعتبر است." };
    }
  }, [input, mode]);

  return (
    <div className="space-y-4">
      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: "encode", label: "کدگذاری" },
          { value: "decode", label: "رمزگشایی" },
        ]}
      />
      <Grid2>
        <Field
          label={mode === "encode" ? "نقاط (هر خط: lat,lng)" : "رشتهٔ Polyline"}
          hint={mode === "encode" ? "مثلاً 38.5,-120.2" : undefined}
        >
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "38.5,-120.2\n40.7,-120.95\n43.252,-126.453" : "_p~iF~ps|U_ulLnnqC_mqNvxq`@"}
          />
        </Field>
        <Output label="خروجی" value={out} />
      </Grid2>
      {err && <ErrorNote>{err}</ErrorNote>}
    </div>
  );
}

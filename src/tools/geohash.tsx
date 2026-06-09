"use client";

import { useMemo, useState } from "react";
import { CopyButton, ErrorNote, Field, Grid2, Select, TextInput } from "@/components/tool/kit";
import { toAsciiDigits } from "@/lib/utils";

const BASE32 = "0123456789bcdefghjkmnpqrstuvwxyz";

function encodeGeohash(lat: number, lng: number, precision: number): string {
  let latMin = -90, latMax = 90, lngMin = -180, lngMax = 180;
  let hash = "";
  let bit = 0;
  let ch = 0;
  let even = true;
  while (hash.length < precision) {
    if (even) {
      const mid = (lngMin + lngMax) / 2;
      if (lng >= mid) { ch = (ch << 1) | 1; lngMin = mid; } else { ch = ch << 1; lngMax = mid; }
    } else {
      const mid = (latMin + latMax) / 2;
      if (lat >= mid) { ch = (ch << 1) | 1; latMin = mid; } else { ch = ch << 1; latMax = mid; }
    }
    even = !even;
    if (++bit === 5) { hash += BASE32[ch]; bit = 0; ch = 0; }
  }
  return hash;
}

function decodeGeohash(hash: string) {
  let latMin = -90, latMax = 90, lngMin = -180, lngMax = 180;
  let even = true;
  for (const c of hash.toLowerCase()) {
    const idx = BASE32.indexOf(c);
    if (idx === -1) return null;
    for (let b = 4; b >= 0; b--) {
      const bit = (idx >> b) & 1;
      if (even) {
        const mid = (lngMin + lngMax) / 2;
        if (bit) lngMin = mid; else lngMax = mid;
      } else {
        const mid = (latMin + latMax) / 2;
        if (bit) latMin = mid; else latMax = mid;
      }
      even = !even;
    }
  }
  return { latMin, latMax, lngMin, lngMax, lat: (latMin + latMax) / 2, lng: (lngMin + lngMax) / 2 };
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-bg-soft px-3 py-2.5">
      <span className="w-44 shrink-0 text-xs text-saffron">{label}</span>
      <code dir="ltr" className="min-w-0 flex-1 truncate font-mono text-sm text-fg">{value}</code>
      <CopyButton value={value} />
    </div>
  );
}

export default function GeohashTool() {
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [precision, setPrecision] = useState("9");
  const [hash, setHash] = useState("");

  const enc = useMemo(() => {
    if (!lat.trim() && !lng.trim()) return { hash: "", err: "" };
    const la = parseFloat(toAsciiDigits(lat.trim()));
    const lo = parseFloat(toAsciiDigits(lng.trim()));
    if (Number.isNaN(la) || Number.isNaN(lo)) return { hash: "", err: "مختصات باید عدد باشند." };
    if (Math.abs(la) > 90 || Math.abs(lo) > 180) return { hash: "", err: "مختصات خارج از بازهٔ مجاز است." };
    return { hash: encodeGeohash(la, lo, Number(precision)), err: "" };
  }, [lat, lng, precision]);

  const dec = useMemo(() => {
    const h = hash.trim();
    if (!h) return { rows: [], err: "" };
    const r = decodeGeohash(h);
    if (!r) return { rows: [], err: "رشتهٔ Geohash نامعتبر است." };
    return {
      rows: [
        { label: "مرکز — عرض", value: r.lat.toFixed(6) },
        { label: "مرکز — طول", value: r.lng.toFixed(6) },
        { label: "کادر SW", value: `${r.latMin.toFixed(6)}, ${r.lngMin.toFixed(6)}` },
        { label: "کادر NE", value: `${r.latMax.toFixed(6)}, ${r.lngMax.toFixed(6)}` },
      ],
      err: "",
    };
  }, [hash]);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-fg">کدگذاری مختصات به Geohash</h3>
        <Grid2>
          <Field label="عرض جغرافیایی">
            <TextInput mono dir="ltr" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="35.6892" />
          </Field>
          <Field label="طول جغرافیایی">
            <TextInput mono dir="ltr" value={lng} onChange={(e) => setLng(e.target.value)} placeholder="51.3890" />
          </Field>
        </Grid2>
        <Field label="دقت" className="sm:w-40">
          <Select value={precision} onChange={(e) => setPrecision(e.target.value)}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </Select>
        </Field>
        {enc.err && <ErrorNote>{enc.err}</ErrorNote>}
        {enc.hash && <Row label="Geohash" value={enc.hash} />}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-fg">رمزگشایی Geohash</h3>
        <Field label="Geohash">
          <TextInput mono dir="ltr" value={hash} onChange={(e) => setHash(e.target.value)} placeholder="tnk3z6q" />
        </Field>
        {dec.err && <ErrorNote>{dec.err}</ErrorNote>}
        {dec.rows.length > 0 && (
          <div className="space-y-2">
            {dec.rows.map((r) => <Row key={r.label} label={r.label} value={r.value} />)}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { ErrorNote, Field, Grid2, Stat, TextInput } from "@/components/tool/kit";
import { toAsciiDigits } from "@/lib/utils";

const COMPASS = [
  "شمال", "شمال‌شرق", "شرق", "جنوب‌شرق",
  "جنوب", "جنوب‌غرب", "غرب", "شمال‌غرب",
];

function toRad(d: number): number {
  return (d * Math.PI) / 180;
}

function parse(v: string): number {
  return parseFloat(toAsciiDigits(v.trim()));
}

export default function GeoDistanceTool() {
  const [lat1, setLat1] = useState("");
  const [lng1, setLng1] = useState("");
  const [lat2, setLat2] = useState("");
  const [lng2, setLng2] = useState("");

  const { stats, err } = useMemo(() => {
    const vals = [lat1, lng1, lat2, lng2];
    if (vals.every((v) => !v.trim())) return { stats: [], err: "" };
    const [la1, lo1, la2, lo2] = vals.map(parse);
    if ([la1, lo1, la2, lo2].some((n) => Number.isNaN(n)))
      return { stats: [], err: "همهٔ مقادیر باید عدد باشند." };
    if (Math.abs(la1) > 90 || Math.abs(la2) > 90)
      return { stats: [], err: "عرض جغرافیایی باید بین ۹۰- و ۹۰ باشد." };
    if (Math.abs(lo1) > 180 || Math.abs(lo2) > 180)
      return { stats: [], err: "طول جغرافیایی باید بین ۱۸۰- و ۱۸۰ باشد." };

    const R = 6371; // km
    const dLat = toRad(la2 - la1);
    const dLng = toRad(lo2 - lo1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(la1)) * Math.cos(toRad(la2)) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const km = R * c;

    const y = Math.sin(toRad(lo2 - lo1)) * Math.cos(toRad(la2));
    const x =
      Math.cos(toRad(la1)) * Math.sin(toRad(la2)) -
      Math.sin(toRad(la1)) * Math.cos(toRad(la2)) * Math.cos(toRad(lo2 - lo1));
    const bearing = (Math.atan2(y, x) * 180) / Math.PI;
    const brg = (bearing + 360) % 360;
    const compass = COMPASS[Math.round(brg / 45) % 8];

    return {
      stats: [
        { label: "فاصله (کیلومتر)", value: km.toFixed(3) },
        { label: "فاصله (مایل)", value: (km * 0.621371).toFixed(3) },
        { label: "زاویهٔ سمت اولیه", value: `${brg.toFixed(1)}°` },
        { label: "جهت قطب‌نما", value: compass },
      ],
      err: "",
    };
  }, [lat1, lng1, lat2, lng2]);

  return (
    <div className="space-y-4">
      <Grid2>
        <Field label="نقطهٔ ۱ — عرض جغرافیایی">
          <TextInput mono dir="ltr" value={lat1} onChange={(e) => setLat1(e.target.value)} placeholder="35.6892" />
        </Field>
        <Field label="نقطهٔ ۱ — طول جغرافیایی">
          <TextInput mono dir="ltr" value={lng1} onChange={(e) => setLng1(e.target.value)} placeholder="51.3890" />
        </Field>
        <Field label="نقطهٔ ۲ — عرض جغرافیایی">
          <TextInput mono dir="ltr" value={lat2} onChange={(e) => setLat2(e.target.value)} placeholder="32.6539" />
        </Field>
        <Field label="نقطهٔ ۲ — طول جغرافیایی">
          <TextInput mono dir="ltr" value={lng2} onChange={(e) => setLng2(e.target.value)} placeholder="51.6660" />
        </Field>
      </Grid2>
      {err && <ErrorNote>{err}</ErrorNote>}
      {stats.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <Stat key={s.label} label={s.label} value={s.value} />
          ))}
        </div>
      )}
    </div>
  );
}

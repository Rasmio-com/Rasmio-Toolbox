"use client";

import { useMemo, useState } from "react";
import { ErrorNote, Field, Grid2, Output, Segmented, TextInput } from "@/components/tool/kit";
import { toAsciiDigits } from "@/lib/utils";

function decToDms(value: number, isLat: boolean): string {
  const dir = isLat ? (value < 0 ? "S" : "N") : (value < 0 ? "W" : "E");
  const abs = Math.abs(value);
  let deg = Math.floor(abs);
  let minFloat = (abs - deg) * 60;
  let min = Math.floor(minFloat);
  let sec = (minFloat - min) * 60;
  sec = Math.round(sec * 1000) / 1000;
  if (sec >= 60) { sec -= 60; min += 1; }
  if (min >= 60) { min -= 60; deg += 1; }
  return `${deg}° ${min}' ${sec}" ${dir}`;
}

// Parse "35 41 21 N" / "35°41'21\"N" / "35.6 N" -> signed decimal
function dmsToDec(raw: string, isLat: boolean): number | null {
  const s = toAsciiDigits(raw).trim().toUpperCase();
  if (!s) return null;
  const dirMatch = s.match(/[NSEW]/);
  const dir = dirMatch ? dirMatch[0] : "";
  const nums = s.replace(/[NSEW]/g, "").match(/-?\d+(\.\d+)?/g);
  if (!nums || nums.length === 0) return null;
  const deg = parseFloat(nums[0]);
  const min = nums[1] ? parseFloat(nums[1]) : 0;
  const sec = nums[2] ? parseFloat(nums[2]) : 0;
  if (min >= 60 || sec >= 60 || min < 0 || sec < 0) return null;
  let val = Math.abs(deg) + min / 60 + sec / 3600;
  if (deg < 0 || dir === "S" || dir === "W") val = -val;
  const limit = isLat ? 90 : 180;
  if (val < -limit || val > limit) return null;
  return val;
}

export default function CoordinateConverterTool() {
  const [mode, setMode] = useState<"toDms" | "toDec">("toDms");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const { out, err } = useMemo(() => {
    if (!lat.trim() && !lng.trim()) return { out: "", err: "" };
    if (mode === "toDms") {
      const la = parseFloat(toAsciiDigits(lat.trim()));
      const lo = parseFloat(toAsciiDigits(lng.trim()));
      if (Number.isNaN(la) || Number.isNaN(lo))
        return { out: "", err: "عرض و طول جغرافیایی باید عدد باشند." };
      if (la < -90 || la > 90) return { out: "", err: "عرض جغرافیایی باید بین ۹۰- و ۹۰ باشد." };
      if (lo < -180 || lo > 180) return { out: "", err: "طول جغرافیایی باید بین ۱۸۰- و ۱۸۰ باشد." };
      return { out: `${decToDms(la, true)}\n${decToDms(lo, false)}`, err: "" };
    }
    const la = dmsToDec(lat, true);
    const lo = dmsToDec(lng, false);
    if (la === null || lo === null) return { out: "", err: "فرمت DMS نامعتبر است یا خارج از بازه است." };
    return { out: `${la.toFixed(6)}, ${lo.toFixed(6)}`, err: "" };
  }, [lat, lng, mode]);

  const isDms = mode === "toDec";
  return (
    <div className="space-y-4">
      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: "toDms", label: "اعشاری ← DMS" },
          { value: "toDec", label: "DMS ← اعشاری" },
        ]}
      />
      <Grid2>
        <Field label="عرض جغرافیایی (Latitude)" hint={isDms ? "مثلاً 35 41 21 N" : "مثلاً 35.6892"}>
          <TextInput
            mono
            dir="ltr"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder={isDms ? `35° 41' 21" N` : "35.6892"}
          />
        </Field>
        <Field label="طول جغرافیایی (Longitude)" hint={isDms ? "مثلاً 51 23 20 E" : "مثلاً 51.3890"}>
          <TextInput
            mono
            dir="ltr"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            placeholder={isDms ? `51° 23' 20" E` : "51.3890"}
          />
        </Field>
      </Grid2>
      {err && <ErrorNote>{err}</ErrorNote>}
      <Output label="خروجی" value={out} mono />
    </div>
  );
}

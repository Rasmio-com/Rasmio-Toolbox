"use client";

import { useMemo, useState } from "react";
import { CopyButton, ErrorNote, Field, Panel, TextInput } from "@/components/tool/kit";
import { toAsciiDigits } from "@/lib/utils";

/* ── Jalaali ↔ Gregorian (ported from jalaali-js, MIT) ───── */
const breaks = [
  -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097,
  2192, 2262, 2324, 2394, 2456, 3178,
];
const div = (a: number, b: number) => ~~(a / b);
const mod = (a: number, b: number) => a - ~~(a / b) * b;

function jalCal(jy: number) {
  const bl = breaks.length;
  const gy = jy + 621;
  let leapJ = -14;
  let jp = breaks[0];
  let jm = 0;
  let jump = 0;
  for (let i = 1; i < bl; i += 1) {
    jm = breaks[i];
    jump = jm - jp;
    if (jy < jm) break;
    leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
    jp = jm;
  }
  let n = jy - jp;
  leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
  if (mod(jump, 33) === 4 && jump - n === 4) leapJ += 1;
  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;
  if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33;
  let leap = mod(mod(n + 1, 33) - 1, 4);
  if (leap === -1) leap = 4;
  return { leap, gy, march };
}

function g2d(gy: number, gm: number, gd: number) {
  let d =
    div((gy + div(gm - 8, 6) + 100100) * 1461, 4) +
    div(153 * mod(gm + 9, 12) + 2, 5) +
    gd -
    34840408;
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
  return d;
}
function d2g(jdn: number) {
  let j = 4 * jdn + 139361631;
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div(mod(j, 1461), 4) * 5 + 308;
  const gd = div(mod(i, 153), 5) + 1;
  const gm = mod(div(i, 153), 12) + 1;
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6);
  return { gy, gm, gd };
}
function j2d(jy: number, jm: number, jd: number) {
  const r = jalCal(jy);
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
}
function d2j(jdn: number) {
  const gy = d2g(jdn).gy;
  let jy = gy - 621;
  const r = jalCal(jy);
  const jdn1f = g2d(gy, 3, r.march);
  let k = jdn - jdn1f;
  let jm: number;
  let jd: number;
  if (k >= 0) {
    if (k <= 185) {
      jm = 1 + div(k, 31);
      jd = mod(k, 31) + 1;
      return { jy, jm, jd };
    }
    k -= 186;
  } else {
    jy -= 1;
    k += 179;
    if (r.leap === 1) k += 1;
  }
  jm = 7 + div(k, 30);
  jd = mod(k, 30) + 1;
  return { jy, jm, jd };
}
function toJalaali(gy: number, gm: number, gd: number) {
  return d2j(g2d(gy, gm, gd));
}
function toGregorian(jy: number, jm: number, jd: number) {
  return d2g(j2d(jy, jm, jd));
}
function jLen(jy: number, jm: number) {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return jalCal(jy).leap === 0 ? 30 : 29;
}
function validJ(jy: number, jm: number, jd: number) {
  return jm >= 1 && jm <= 12 && jd >= 1 && jd <= jLen(jy, jm);
}
function validG(gy: number, gm: number, gd: number) {
  const d = new Date(gy, gm - 1, gd);
  return d.getFullYear() === gy && d.getMonth() === gm - 1 && d.getDate() === gd;
}

const FA_MONTHS = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
];
const pad = (n: number) => String(n).padStart(2, "0");
function weekday(gy: number, gm: number, gd: number) {
  return new Date(gy, gm - 1, gd).toLocaleDateString("fa-IR", { weekday: "long" });
}

function Result({ jLabel, gLabel, wd }: { jLabel: string; gLabel: string; wd: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 rounded-xl border border-border bg-bg-soft px-3 py-2.5">
        <span className="w-16 shrink-0 text-xs text-saffron">شمسی</span>
        <code dir="ltr" className="flex-1 font-mono text-fg">{jLabel}</code>
        <CopyButton value={jLabel} />
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-border bg-bg-soft px-3 py-2.5">
        <span className="w-16 shrink-0 text-xs text-saffron">میلادی</span>
        <code dir="ltr" className="flex-1 font-mono text-fg">{gLabel}</code>
        <CopyButton value={gLabel} />
      </div>
      <p className="text-sm text-muted">روز هفته: {wd}</p>
    </div>
  );
}

export default function JalaliConverterTool() {
  const [text, setText] = useState("");
  const [greg, setGreg] = useState("");
  const [jy, setJy] = useState("");
  const [jm, setJm] = useState("");
  const [jd, setJd] = useState("");

  const quick = useMemo(() => {
    const nums = toAsciiDigits(text).split(/[^\d]+/).filter(Boolean).map(Number);
    if (nums.length < 3) return null;
    let [a, b, c] = nums;
    let y: number, m: number, d: number;
    if (a >= 1000) [y, m, d] = [a, b, c];
    else if (c >= 1000) [y, m, d] = [c, b, a];
    else return { err: "سال را با چهار رقم وارد کنید (مثلاً ۱۴۰۳ یا 2024)." };
    if (y >= 1700) {
      if (!validG(y, m, d)) return { err: "تاریخ میلادی نامعتبر است." };
      const j = toJalaali(y, m, d);
      return {
        jLabel: `${j.jy}/${pad(j.jm)}/${pad(j.jd)}`,
        gLabel: `${y}/${pad(m)}/${pad(d)}`,
        wd: weekday(y, m, d),
      };
    }
    if (!validJ(y, m, d)) return { err: "تاریخ شمسی نامعتبر است." };
    const g = toGregorian(y, m, d);
    return {
      jLabel: `${y}/${pad(m)}/${pad(d)}`,
      gLabel: `${g.gy}/${pad(g.gm)}/${pad(g.gd)}`,
      wd: weekday(g.gy, g.gm, g.gd),
    };
  }, [text]);

  const fromGreg = useMemo(() => {
    if (!greg) return null;
    const [y, m, d] = greg.split("-").map(Number);
    if (!y || !m || !d) return null;
    const j = toJalaali(y, m, d);
    return {
      jLabel: `${j.jy}/${pad(j.jm)}/${pad(j.jd)}`,
      gLabel: `${y}/${pad(m)}/${pad(d)}`,
      wd: weekday(y, m, d),
    };
  }, [greg]);

  const fromJalali = useMemo(() => {
    const y = Number(toAsciiDigits(jy));
    const m = Number(toAsciiDigits(jm));
    const d = Number(toAsciiDigits(jd));
    if (!y || !m || !d) return null;
    if (!validJ(y, m, d)) return { err: "تاریخ شمسی نامعتبر است." };
    const g = toGregorian(y, m, d);
    return {
      jLabel: `${y}/${pad(m)}/${pad(d)} (${FA_MONTHS[m - 1]})`,
      gLabel: `${g.gy}/${pad(g.gm)}/${pad(g.gd)}`,
      wd: weekday(g.gy, g.gm, g.gd),
    };
  }, [jy, jm, jd]);

  return (
    <div className="space-y-5">
      <Panel title="تبدیل سریع" subtitle="تاریخ را بنویسید یا بچسبانید (شمسی یا میلادی) — به‌صورت YYYY/MM/DD">
        <TextInput
          dir="ltr"
          mono
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="۱۴۰۳/۰۳/۱۶  یا  2024-06-05"
        />
        {quick && "err" in quick && (
          <div className="mt-3">
            <ErrorNote>{quick.err}</ErrorNote>
          </div>
        )}
        {quick && !("err" in quick) && (
          <div className="mt-3">
            <Result jLabel={quick.jLabel} gLabel={quick.gLabel} wd={quick.wd} />
          </div>
        )}
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="میلادی → شمسی">
          <Field label="تاریخ میلادی">
            <input
              type="date"
              value={greg}
              onChange={(e) => setGreg(e.target.value)}
              className="field"
            />
          </Field>
          {fromGreg && (
            <div className="mt-3">
              <Result jLabel={fromGreg.jLabel} gLabel={fromGreg.gLabel} wd={fromGreg.wd} />
            </div>
          )}
        </Panel>

        <Panel title="شمسی → میلادی">
          <div className="grid grid-cols-3 gap-2">
            <Field label="سال">
              <TextInput dir="ltr" inputMode="numeric" value={jy} onChange={(e) => setJy(e.target.value)} placeholder="۱۴۰۳" />
            </Field>
            <Field label="ماه">
              <TextInput dir="ltr" inputMode="numeric" value={jm} onChange={(e) => setJm(e.target.value)} placeholder="۳" />
            </Field>
            <Field label="روز">
              <TextInput dir="ltr" inputMode="numeric" value={jd} onChange={(e) => setJd(e.target.value)} placeholder="۱۶" />
            </Field>
          </div>
          {fromJalali && "err" in fromJalali && (
            <div className="mt-3">
              <ErrorNote>{fromJalali.err}</ErrorNote>
            </div>
          )}
          {fromJalali && !("err" in fromJalali) && (
            <div className="mt-3">
              <Result jLabel={fromJalali.jLabel} gLabel={fromJalali.gLabel} wd={fromJalali.wd} />
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

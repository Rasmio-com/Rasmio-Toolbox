"use server";

import { readdirSync } from "node:fs";
import { join } from "node:path";
import { headers } from "next/headers";
import maxmind, { type AsnResponse, type CityResponse, type Reader } from "maxmind";

export interface IpInfo {
  ok: boolean;
  ip?: string;
  /** True when the IP was auto-detected from the request instead of typed. */
  autodetected?: boolean;
  /** Request header the auto-detected IP came from. */
  source?: string;
  country?: string;
  countryCode?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  asn?: number;
  org?: string;
  error?: string;
}

// Resolved at request time so a monthly DB refresh (new filename) is picked up
// without a code change. In standalone the cwd is the app root (see Dockerfile).
const GEO_DIR = join(process.cwd(), "data", "geoip");

function newestDb(prefix: string): string {
  const files = readdirSync(GEO_DIR)
    .filter((f) => f.startsWith(prefix) && f.endsWith(".mmdb"))
    .sort(); // names end in YYYY-MM → lexical sort puts the newest last
  if (files.length === 0) throw new Error(`no ${prefix}*.mmdb in ${GEO_DIR}`);
  return join(GEO_DIR, files[files.length - 1]);
}

// Open each ~MaxMind-DB once and reuse it across requests (the reader holds the
// file in memory). Reset to null on failure so a later request can retry.
let cityP: Promise<Reader<CityResponse>> | null = null;
let asnP: Promise<Reader<AsnResponse>> | null = null;

async function ipFromRequest(): Promise<{ ip: string; source: string }> {
  const h = await headers();
  const order = [
    "cf-connecting-ip",
    "true-client-ip",
    "x-real-ip",
    "x-vercel-forwarded-for",
    "x-forwarded-for",
    "fastly-client-ip",
    "x-client-ip",
  ];
  for (const name of order) {
    const val = h.get(name);
    if (val) return { ip: val.split(",")[0].trim(), source: name };
  }
  return { ip: "", source: "" };
}

/**
 * Look up geolocation + ASN for an IP using the local DB-IP Lite databases.
 * Pass an empty/undefined `raw` to resolve the caller's own IP from request
 * headers. Only the IP string reaches this server; nothing is sent off-box.
 */
export async function lookupIp(raw?: string): Promise<IpInfo> {
  let ip = (raw ?? "").trim();
  let autodetected = false;
  let source = "";

  if (!ip) {
    const found = await ipFromRequest();
    ip = found.ip;
    source = found.source;
    autodetected = true;
    if (!ip)
      return {
        ok: false,
        error:
          "آی‌پی شما قابل تشخیص نبود (احتمالاً پشت پراکسی نیستید یا در محیط توسعه‌اید). یک آدرس را دستی وارد کنید.",
      };
  }

  if (!maxmind.validate(ip)) return { ok: false, error: "آدرس IP نامعتبر است." };

  try {
    const [city, asn] = await Promise.all([
      (cityP ??= maxmind.open<CityResponse>(newestDb("dbip-city-lite-"))),
      (asnP ??= maxmind.open<AsnResponse>(newestDb("dbip-asn-lite-"))),
    ]);
    const c = city.get(ip);
    const a = asn.get(ip);

    if (!c && !a)
      return {
        ok: true,
        ip,
        autodetected,
        source,
        error: "اطلاعاتی برای این آدرس یافت نشد (ممکن است خصوصی یا رزروشده باشد).",
      };

    return {
      ok: true,
      ip,
      autodetected,
      source,
      country: c?.country?.names?.en,
      countryCode: c?.country?.iso_code,
      region: c?.subdivisions?.[0]?.names?.en,
      city: c?.city?.names?.en,
      latitude: c?.location?.latitude,
      longitude: c?.location?.longitude,
      timezone: c?.location?.time_zone,
      asn: a?.autonomous_system_number,
      org: a?.autonomous_system_organization,
    };
  } catch {
    cityP = null;
    asnP = null;
    return { ok: false, error: "پایگاه‌دادهٔ مکان‌یابی در دسترس نیست." };
  }
}

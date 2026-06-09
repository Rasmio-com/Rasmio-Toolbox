// Ensure the current month's DB-IP Lite GeoIP databases exist in data/geoip/.
// Downloads City + ASN only when this month's file is missing, then removes
// older months. No npm deps — Node built-ins only. Runs as the `prebuild` hook.
//
//   GEOIP_MONTH=YYYY-MM   override the month (used for reproducible builds)
//   GEOIP_SKIP=1          do nothing (set inside Docker, where files are baked in)

import { createWriteStream, existsSync, mkdirSync, readdirSync, unlinkSync } from "node:fs";
import { get } from "node:https";
import { dirname, join } from "node:path";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";
import { createGunzip } from "node:zlib";

const DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "data", "geoip");
const KINDS = ["city", "asn"];

if (process.env.GEOIP_SKIP) {
  console.log("[geoip] GEOIP_SKIP set — skipping (files are provided by the build).");
  process.exit(0);
}

const month = /^\d{4}-\d{2}$/.test(process.env.GEOIP_MONTH ?? "")
  ? process.env.GEOIP_MONTH
  : new Date().toISOString().slice(0, 7); // UTC YYYY-MM

mkdirSync(DIR, { recursive: true });

/** Download `url`, gunzip on the fly, and stream into `dest`. Follows redirects. */
function download(url, dest, hops = 5) {
  return new Promise((resolve, reject) => {
    get(url, (res) => {
      const { statusCode = 0, headers } = res;
      if (statusCode >= 300 && statusCode < 400 && headers.location) {
        res.resume();
        if (hops <= 0) return reject(new Error("too many redirects"));
        return resolve(download(new URL(headers.location, url).toString(), dest, hops - 1));
      }
      if (statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${statusCode}`));
      }
      pipeline(res, createGunzip(), createWriteStream(dest)).then(resolve, reject);
    }).on("error", reject);
  });
}

function existing(kind) {
  return readdirSync(DIR)
    .filter((f) => f.includes(`-${kind}-lite-`) && f.endsWith(".mmdb"))
    .sort();
}

let changed = 0;
for (const kind of KINDS) {
  const name = `dbip-${kind}-lite-${month}.mmdb`;
  const dest = join(DIR, name);

  if (existsSync(dest)) {
    console.log(`[geoip] ${name} already present.`);
    continue;
  }

  process.stdout.write(`[geoip] fetching ${name}.gz … `);
  try {
    await download(`https://download.db-ip.com/free/${name}.gz`, dest);
    console.log("ok");
    // prune older months once the new file is safely written
    for (const old of existing(kind)) {
      if (old !== name) unlinkSync(join(DIR, old));
    }
    changed++;
  } catch (err) {
    if (existsSync(dest)) unlinkSync(dest); // drop any partial file
    const have = existing(kind);
    if (have.length > 0) {
      console.warn(`failed (${err.message}); keeping ${have[have.length - 1]}.`);
    } else {
      console.error(`failed (${err.message}); no ${kind} DB available — cannot continue.`);
      process.exit(1);
    }
  }
}

console.log(`[geoip] ${changed ? `updated ${changed} file(s)` : "up to date"} for ${month}.`);

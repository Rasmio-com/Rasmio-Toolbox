// ─── iban-validator.tsx: chunked mod97 ───
function mod97(s) {
  let rem = 0;
  for (let i = 0; i < s.length; i += 7) {
    rem = Number(String(rem) + s.slice(i, i + 7)) % 97;
  }
  return rem;
}
function ibanCheck(iban) {
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  const numeric = rearranged.replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));
  return mod97(numeric) === 1;
}
console.log("IBAN DE89370400440532013000 (valid):", ibanCheck("DE89370400440532013000"));
console.log("IBAN GB29NWBK60161331926819 (valid):", ibanCheck("GB29NWBK60161331926819"));
console.log("IBAN IR062960000000100324200001 (valid):", ibanCheck("IR062960000000100324200001"));
console.log("IBAN DE89370400440532013001 (invalid):", ibanCheck("DE89370400440532013001"));
// worst case chunk safety: max rem 96 + 7 digits
console.log("mod97 max chunk safe:", Number("969999999") < Number.MAX_SAFE_INTEGER);

// ─── isbn-validator.tsx ───
function isbn10Valid(s) {
  if (!/^\d{9}[\dX]$/.test(s)) return false;
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    const d = s[i] === "X" ? 10 : s.charCodeAt(i) - 48;
    sum += d * (10 - i);
  }
  return sum % 11 === 0;
}
function isbn13Valid(s) {
  if (!/^\d{13}$/.test(s)) return false;
  let sum = 0;
  for (let i = 0; i < 13; i++) sum += (s.charCodeAt(i) - 48) * (i % 2 === 0 ? 1 : 3);
  return sum % 10 === 0;
}
function check13(twelve) {
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += (twelve.charCodeAt(i) - 48) * (i % 2 === 0 ? 1 : 3);
  return String((10 - (sum % 10)) % 10);
}
function check10(nine) {
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += (nine.charCodeAt(i) - 48) * (10 - i);
  const r = (11 - (sum % 11)) % 11;
  return r === 10 ? "X" : String(r);
}
console.log("\nISBN10 0306406152 (valid):", isbn10Valid("0306406152"));
console.log("ISBN10 080442957X (valid):", isbn10Valid("080442957X"));
console.log("ISBN13 9783161484100 (valid):", isbn13Valid("9783161484100"));
console.log("ISBN13 9780306406157 (valid):", isbn13Valid("9780306406157"));
console.log("to13(0306406152):", "978" + "030640615" + check13("978030640615"), "(expect 9780306406157)");
console.log("to10 core for 9780306406157:", "030640615" + check10("030640615"), "(expect 0306406152)");

// ─── validators.ts: isinValid (used by isin-validator.tsx) ───
function luhnValid(s) {
  if (s.length < 2) return false;
  let sum = 0, alt = false;
  for (let i = s.length - 1; i >= 0; i--) {
    let d = +s[i];
    if (alt) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
    alt = !alt;
  }
  return sum % 10 === 0;
}
function isinValid(input) {
  const s = input.toUpperCase().replace(/\s/g, "");
  if (!/^[A-Z]{2}[A-Z0-9]{9}\d$/.test(s)) return false;
  let digits = "";
  for (const ch of s) digits += /[0-9]/.test(ch) ? ch : (ch.charCodeAt(0) - 55).toString();
  return luhnValid(digits);
}
console.log("\nISIN US0378331005 (Apple, valid):", isinValid("US0378331005"));
console.log("ISIN US5949181045 (MSFT, valid):", isinValid("US5949181045"));
console.log("ISIN GB0002634946 (BAE, valid):", isinValid("GB0002634946"));
console.log("ISIN IRO1MSMI0001 (valid?):", isinValid("IRO1MSMI0001"));
console.log("ISIN US0378331006 (invalid):", isinValid("US0378331006"));

// ─── jalali-converter.tsx ───
const breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];
const div = (a, b) => ~~(a / b);
const mod = (a, b) => a - ~~(a / b) * b;
function jalCal(jy) {
  const bl = breaks.length;
  const gy = jy + 621;
  let leapJ = -14, jp = breaks[0], jm = 0, jump = 0;
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
function g2d(gy, gm, gd) {
  let d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4) + div(153 * mod(gm + 9, 12) + 2, 5) + gd - 34840408;
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
  return d;
}
function d2g(jdn) {
  let j = 4 * jdn + 139361631;
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div(mod(j, 1461), 4) * 5 + 308;
  const gd = div(mod(i, 153), 5) + 1;
  const gm = mod(div(i, 153), 12) + 1;
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6);
  return { gy, gm, gd };
}
function j2d(jy, jm, jd) {
  const r = jalCal(jy);
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
}
function d2j(jdn) {
  const gy = d2g(jdn).gy;
  let jy = gy - 621;
  const r = jalCal(jy);
  const jdn1f = g2d(gy, 3, r.march);
  let k = jdn - jdn1f;
  let jm, jd;
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
const toJalaali = (gy, gm, gd) => d2j(g2d(gy, gm, gd));
const toGregorian = (jy, jm, jd) => d2g(j2d(jy, jm, jd));
function jLen(jy, jm) {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return jalCal(jy).leap === 0 ? 30 : 29;
}
console.log("\n2024-03-20 -> jalali (expect 1403/1/1):", JSON.stringify(toJalaali(2024, 3, 20)));
console.log("2025-03-21 -> jalali (expect 1404/1/1):", JSON.stringify(toJalaali(2025, 3, 21)));
console.log("1403/12/30 -> greg (expect 2025/3/20):", JSON.stringify(toGregorian(1403, 12, 30)));
console.log("jLen(1403,12) (expect 30, leap):", jLen(1403, 12));
console.log("jLen(1402,12) (expect 29):", jLen(1402, 12));
console.log("2026-06-10 -> jalali (expect 1405/3/20):", JSON.stringify(toJalaali(2026, 6, 10)));
// full round-trip sweep over ~600 years of days
let bad = 0;
for (let jdn = g2d(1900, 1, 1); jdn < g2d(2200, 1, 1); jdn++) {
  const g = d2g(jdn);
  const j = d2j(jdn);
  const back = toGregorian(j.jy, j.jm, j.jd);
  if (back.gy !== g.gy || back.gm !== g.gm || back.gd !== g.gd) { bad++; if (bad < 4) console.log("MISMATCH", g, j); }
}
console.log("roundtrip mismatches 1900-2200:", bad);

// ─── ipv6-cidr.tsx: parseIPv6 ───
function parseIPv6(s) {
  if (s.indexOf("::") !== s.lastIndexOf("::")) return null;
  const dbl = s.includes("::");
  let head = [], tail = [];
  if (dbl) {
    const [h, t] = s.split("::");
    head = h ? h.split(":") : [];
    tail = t ? t.split(":") : [];
  } else {
    head = s.split(":");
  }
  const expand = (g) => g.filter((x) => x !== "");
  head = expand(head);
  tail = expand(tail);
  const all = [...head, ...tail];
  const groups = [];
  for (let i = 0; i < all.length; i++) {
    const g = all[i];
    if (!/^[0-9a-fA-F]{1,4}$/.test(g)) return null;
    groups.push(parseInt(g, 16));
  }
  if (dbl) {
    if (groups.length > 8) return null;
    const zeros = new Array(8 - groups.length).fill(0);
    return [...head.map((g) => parseInt(g, 16)), ...zeros, ...tail.map((g) => parseInt(g, 16))];
  }
  return groups.length === 8 ? groups : null;
}
console.log("\nparseIPv6('2001:db8::1') ok:", !!parseIPv6("2001:db8::1"));
console.log("parseIPv6(':1:2:3:4:5:6:7:8') accepts INVALID leading-colon:", parseIPv6(":1:2:3:4:5:6:7:8"));
console.log("parseIPv6('1:2:3:4:5:6:7:8:') accepts INVALID trailing-colon:", parseIPv6("1:2:3:4:5:6:7:8:"));
console.log("parseIPv6('1::2:3:4:5:6:7:8') accepts INVALID (:: = zero groups):", parseIPv6("1::2:3:4:5:6:7:8"));
console.log("parseIPv6('::ffff:192.0.2.1') rejects VALID v4-embedded:", parseIPv6("::ffff:192.0.2.1"));

// ─── ip-validator.tsx: isIPv6 sanity ───
function isIPv4(s) {
  const parts = s.split(".");
  if (parts.length !== 4) return false;
  return parts.every((p) => {
    if (!/^\d{1,3}$/.test(p)) return false;
    if (p.length > 1 && p[0] === "0") return false;
    const n = Number(p);
    return n >= 0 && n <= 255;
  });
}
function isIPv6(s) {
  if (s.indexOf("::") !== s.lastIndexOf("::")) return false;
  const hasDouble = s.includes("::");
  let groups = s.split(":");
  if (hasDouble) {
    groups = groups.filter((g, i) => !(g === "" && i !== 0 && i !== groups.length - 1));
    if (groups[0] === "") groups = groups.slice(1);
    if (groups[groups.length - 1] === "") groups = groups.slice(0, -1);
  }
  let count = 0;
  for (let i = 0; i < groups.length; i++) {
    const g = groups[i];
    if (g.includes(".")) {
      if (i !== groups.length - 1 || !isIPv4(g)) return false;
      count += 2;
      continue;
    }
    if (!/^[0-9a-fA-F]{1,4}$/.test(g)) return false;
    count += 1;
  }
  return hasDouble ? count <= 7 : count === 8;
}
const v6cases = [
  ["::", true], ["::1", true], ["1::", true], ["2001:db8::1", true],
  ["1:2:3:4:5:6:7:8", true], ["::ffff:192.168.1.1", true],
  ["1:2:3:4:5:6:192.168.1.1", true],
  ["1::2:3:4:5:6:7:8", false], [":1:2:3:4:5:6:7:8", false],
  ["1:2:3:4:5:6:7:8:", false], ["1:2:3:4:5:6:7", false], [":", false],
  ["fe80::1%eth0", false], ["12345::", false], ["g::1", false],
];
console.log("\nisIPv6 cases:");
for (const [s, want] of v6cases) {
  const got = isIPv6(s);
  if (got !== want) console.log(`  WRONG: isIPv6('${s}') = ${got}, want ${want}`);
}
console.log("  (silence = all pass)");

// ─── json-log-viewer.tsx: levelOf on null row ───
function levelOf(row) {
  const raw = row.level ?? row.lvl ?? row.severity ?? row.loglevel;
  return String(raw ?? "").toLowerCase();
}
try {
  // rows from input "[null]" — JSON.parse gives [null], render calls levelOf(null)
  const rows = JSON.parse("[null]");
  levelOf(rows[0]);
  console.log("\nlevelOf(null): no crash");
} catch (e) {
  console.log("\nlevelOf(null) CRASHES:", e.constructor.name + ": " + e.message);
}

// ─── ip-to-int.tsx ───
function parseIPv4b(s) {
  const parts = s.split(".");
  if (parts.length !== 4) return null;
  let v = 0;
  for (const p of parts) {
    if (!/^\d{1,3}$/.test(p)) return null;
    const n = Number(p);
    if (n > 255) return null;
    v = v * 256 + n;
  }
  return v >>> 0;
}
console.log("\nip-to-int 192.168.1.1 ->", parseIPv4b("192.168.1.1"), "(expect 3232235777)");
console.log("ip-to-int 255.255.255.255 ->", parseIPv4b("255.255.255.255"), "(expect 4294967295)");

// ─── ipv4-subnet.tsx core ───
{
  const addr = parseIPv4b("192.168.1.10"), p = 24;
  const mask = p === 0 ? 0 : (0xffffffff << (32 - p)) >>> 0;
  const network = (addr & mask) >>> 0;
  const broadcast = (network | ((~mask) >>> 0)) >>> 0;
  const toIPv4 = (n) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
  console.log("subnet 192.168.1.10/24: net", toIPv4(network), "bcast", toIPv4(broadcast));
  const p0mask = 0; // p=0 branch
  console.log("subnet /0 mask:", toIPv4(p0mask), "total:", Math.pow(2, 32));
}

// ─── json-flatten.tsx: parseKey/unflatten edge ───
function flatten(value, prefix, out) {
  const isObj = (v) => typeof v === "object" && v !== null && !Array.isArray(v);
  if (isObj(value)) {
    const entries = Object.entries(value);
    if (entries.length === 0 && prefix) out[prefix] = {};
    for (const [k, v] of entries) flatten(v, prefix ? `${prefix}.${k}` : k, out);
  } else if (Array.isArray(value)) {
    if (value.length === 0 && prefix) out[prefix] = [];
    value.forEach((v, i) => flatten(v, `${prefix}[${i}]`, out));
  } else {
    out[prefix] = value;
  }
}
const flat1 = {};
flatten({ a: { b: [1, { c: 2 }] } }, "", flat1);
console.log("\nflatten nested:", JSON.stringify(flat1));
const flat2 = {};
flatten(5, "", flat2);
console.log("flatten(5) top-level scalar:", JSON.stringify(flat2));

// ─── json-ld-generator.tsx: </script> injection ───
const userAnswer = "</script><img src=x onerror=alert(1)>";
const obj = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [{ "@type": "Question", name: "q", acceptedAnswer: { "@type": "Answer", text: userAnswer } }] };
const outHtml = `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n</script>`;
console.log("\njson-ld output contains raw </script> inside string:", outHtml.includes('</script><img'));

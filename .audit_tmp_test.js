// Temp audit tests — delete after use.

// === regex-tester parts, verbatim from src/tools/regex-tester.tsx ===
function partsOf(pattern, flags, test) {
  const re = new RegExp(pattern, flags);
  const ms = [];
  if (flags.includes('g')) { for (const m of test.matchAll(re)) ms.push(m); }
  else { const m = re.exec(test); if (m) ms.push(m); }
  const parts = [];
  let last = 0;
  for (const m of ms) {
    const start = m.index ?? 0;
    if (start > last) parts.push({ t: test.slice(last, start), hit: false });
    parts.push({ t: m[0], hit: true });
    last = start + m[0].length;
    if (m[0].length === 0) last++;
  }
  if (last < test.length) parts.push({ t: test.slice(last), hit: false });
  return parts.map(p => p.t).join('');
}
console.log('regex-tester highlight, pattern \\b g on "hello world":', JSON.stringify(partsOf('\\b', 'g', 'hello world')));
console.log('regex-tester highlight, pattern ^ gm on "ab\\ncd":', JSON.stringify(partsOf('^', 'gm', 'ab\ncd')));

// === number-base parseInBase, verbatim ===
function parseInBase(input, base) {
  let s = input.trim().toLowerCase().replace(/\s+/g, '');
  if (!s) return null;
  let neg = false;
  if (s[0] === '-') { neg = true; s = s.slice(1); }
  const digits = '0123456789abcdefghijklmnopqrstuvwxyz'.slice(0, base);
  let v = 0n;
  for (const ch of s) {
    const d = digits.indexOf(ch);
    if (d < 0) return null;
    v = v * BigInt(base) + BigInt(d);
  }
  return neg ? -v : v;
}
console.log('number-base parseInBase("۲۵۵", 10) =', parseInBase('۲۵۵', 10), '(null = rejected as invalid)');
console.log('number-base parseInBase("255", 10) =', parseInBase('255', 10));

// === percentage-calculator with empty inputs ===
const toAsciiDigits = (input) => input.replace(/[۰-۹٠-٩]/g, (d) => {
  const fa = '۰۱۲۳۴۵۶۷۸۹', ar = '٠١٢٣٤٥٦٧٨٩';
  const i = fa.indexOf(d);
  return i > -1 ? String(i) : String(ar.indexOf(d));
});
const num = (s) => Number(toAsciiDigits(s).trim());
const a = num(''), b = num('');
console.log('percentage-calculator empty inputs: a =', a, ', b =', b, ', isFinite both =', Number.isFinite(a) && Number.isFinite(b), '-> renders "0% of 0 = 0" stats on empty form');

// === regex-validator: is the "v" flag actually valid? ===
try { new RegExp('[\\p{L}]', 'v'); console.log('new RegExp(..., "v") works in this runtime -> tool wrongly reports "unknown flag v"'); }
catch (e) { console.log('v flag unsupported here:', e.message); }

// === relative-time relative() sanity ===
function relative(dateMs, now) {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const diff = (dateMs - now) / 1000;
  const units = [
    [60, 'second'], [3600, 'minute'], [86400, 'hour'], [604800, 'day'],
    [2629800, 'week'], [31557600, 'month'], [Infinity, 'year'],
  ];
  let prev = 1;
  for (const [limit, unit] of units) {
    if (Math.abs(diff) < limit) return rtf.format(Math.round(diff / prev), unit);
    prev = limit;
  }
  return rtf.format(Math.round(diff / 31557600), 'year');
}
const NOW = Date.now();
console.log('relative-time: +90s =', relative(NOW + 90e3, NOW), '| -3d =', relative(NOW - 3 * 86400e3, NOW), '| +20d =', relative(NOW + 20 * 86400e3, NOW), '| -400d =', relative(NOW - 400 * 86400e3, NOW));

// === quoted-printable round trip, verbatim ===
function qpEncode(s) {
  const bytes = new TextEncoder().encode(s);
  let line = '';
  const lines = [];
  const push = (chunk) => {
    if (line.length + chunk.length > 75) { lines.push(line + '='); line = ''; }
    line += chunk;
  };
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i];
    if (b === 13) continue;
    if (b === 10) { lines.push(line); line = ''; continue; }
    if (b === 9 || b === 32) {
      const next = bytes[i + 1];
      if (next === 10 || next === undefined) push('=' + b.toString(16).toUpperCase().padStart(2, '0'));
      else push(String.fromCharCode(b));
    } else if (b >= 33 && b <= 126 && b !== 61) {
      push(String.fromCharCode(b));
    } else {
      push('=' + b.toString(16).toUpperCase().padStart(2, '0'));
    }
  }
  lines.push(line);
  return lines.join('\r\n');
}
function qpDecode(s) {
  const joined = s.replace(/=\r?\n/g, '');
  const out = [];
  for (let i = 0; i < joined.length; i++) {
    const c = joined[i];
    if (c === '=') {
      const hex = joined.substr(i + 1, 2);
      if (!/^[0-9A-Fa-f]{2}$/.test(hex)) throw new Error('invalid');
      out.push(parseInt(hex, 16));
      i += 2;
    } else {
      out.push(c.charCodeAt(0));
    }
  }
  return new TextDecoder().decode(new Uint8Array(out));
}
const samples = ['Héllo', 'سلام دنیا', 'a'.repeat(200), 'line1\nline2 ', 'tab\tend\t', 'emoji 😀 test'];
for (const s of samples) {
  const enc = qpEncode(s);
  const dec = qpDecode(enc);
  const maxLine = Math.max(...enc.split('\r\n').map(l => l.length));
  console.log('qp round-trip', JSON.stringify(s.slice(0, 20)), dec === s ? 'OK' : 'FAIL got ' + JSON.stringify(dec), 'maxline=' + maxLine);
}

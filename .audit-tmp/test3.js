// === 7. text-diff: O(n*m) DP matrix — time & memory on big paste ===
function diffLines(a, b) {
  const n = a.length;
  const m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const ops = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { ops.push({ type: "eq", line: a[i] }); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) ops.push({ type: "del", line: a[i++] });
    else ops.push({ type: "add", line: b[j++] });
  }
  while (i < n) ops.push({ type: "del", line: a[i++] });
  while (j < m) ops.push({ type: "add", line: b[j++] });
  return ops;
}
function bench(lines) {
  const a = Array.from({ length: lines }, (_, i) => "line " + i + " some content here");
  const b = a.map((l, i) => (i % 7 === 0 ? l + " changed" : l));
  const t0 = process.hrtime.bigint();
  diffLines(a, b);
  const t1 = process.hrtime.bigint();
  const mem = process.memoryUsage().heapUsed / 1048576;
  console.log(`7 ${lines} lines: ${Number(t1 - t0) / 1e6} ms, heapUsed ${mem.toFixed(0)} MB`);
}
bench(2000);
bench(5000);
bench(10000);

// === 8. reverse-text: grapheme clusters (flag emoji, combining marks) ===
const rev = (text) => Array.from(text).reverse().join("");
console.log("8a reverse('ab🇮🇷'):", JSON.stringify(rev("ab🇮🇷")), "— flag split into", Array.from("🇮🇷").length, "code points");
console.log("8b reverse('cafe\\u0301'):", JSON.stringify(rev("café")));

// === 9. sheba-validator: Persian digits ===
function ibanMod97(s) {
  const rearranged = s.slice(4) + s.slice(0, 4);
  const expanded = rearranged.replace(/[A-Z]/g, (ch) => String(ch.charCodeAt(0) - 55));
  let remainder = 0;
  for (const ch of expanded) remainder = (remainder * 10 + Number(ch)) % 97;
  return remainder;
}
function normalizeSheba(input) {
  let s = input.toUpperCase().replace(/\s/g, "");
  if (/^\d{24}$/.test(s)) s = "IR" + s;
  return s;
}
function shebaValid(input) {
  const s = normalizeSheba(input);
  return /^IR\d{24}$/.test(s) && ibanMod97(s) === 1;
}
const ascii = "IR062960000000100324200001";
const fa = "IR" + ascii.slice(2).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);
console.log("9 ascii sheba valid:", shebaValid(ascii));
console.log("9 persian-digit sheba:", fa, "valid:", shebaValid(fa));

// === 10. svg-optimizer: significant space between text spans removed ===
function optimizeSvg(svg) {
  return svg
    .replace(/<\?xml[\s\S]*?\?>/gi, "")
    .replace(/<!DOCTYPE[\s\S]*?>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<metadata[\s\S]*?<\/metadata>/gi, "")
    .replace(/<\?[\s\S]*?\?>/g, "")
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+\/>/g, "/>")
    .trim();
}
console.log("10 optimizeSvg tspans:", optimizeSvg('<svg><text><tspan>Hello</tspan> <tspan>World</tspan></text></svg>'));

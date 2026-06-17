// Temporary benchmark for the finding review — replicates bulk-runner's md5 path.
import { md5 } from "./src/lib/hash/md5.ts";

const enc = new TextEncoder();

function bench(lineLen, count, label) {
  const lines = Array.from({ length: count }, (_, i) =>
    (String(i) + "x".repeat(lineLen)).slice(0, lineLen),
  );
  // warmup
  for (let i = 0; i < 200; i++) md5(enc.encode(lines[i % lines.length]));
  const t0 = performance.now();
  // Mirror the component: Promise.all(lines.map(async (line) => op.run(line)))
  const rows = lines.map((line) => {
    const t = line.trim();
    return { input: t, ok: true, value: md5(enc.encode(t)) };
  });
  const t1 = performance.now();
  console.log(`${label}: ${count} lines x ${lineLen} chars -> ${(t1 - t0).toFixed(0)} ms (rows=${rows.length})`);
}

bench(80, 5000, "short");
bench(1000, 5000, "long");
bench(1000, 5000, "long-2nd-run");

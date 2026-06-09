import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a self-contained server bundle for a small Docker runtime image.
  output: "standalone",
  // `maxmind` (IP Info tool) reads .mmdb files from disk; keep it as a runtime
  // require instead of bundling it, which also makes the standalone tracer pull
  // it (and its deps) into the output.
  serverExternalPackages: ["maxmind"],
  // Belt-and-suspenders: guarantee the GeoIP reader + its deps land in the
  // standalone node_modules even if tracing misses the server action's graph.
  outputFileTracingIncludes: {
    "/tools/[slug]": [
      "./node_modules/maxmind/**/*",
      "./node_modules/mmdb-lib/**/*",
      "./node_modules/tiny-lru/**/*",
    ],
  },
  experimental: {
    // Server Actions are used by a small number of tools; cap body size hard
    // at 5 MB so any file/payload sent to an action is rejected above that.
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;

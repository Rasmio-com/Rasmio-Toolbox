# syntax=docker/dockerfile:1

# ── Dependencies ──────────────────────────────────────────
FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ── Build ─────────────────────────────────────────────────
FROM node:22-bookworm-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# GeoIP DBs are baked in from the build context (kept current on the host by the
# `prebuild` script); don't re-download them during the image build.
ENV GEOIP_SKIP=1
RUN npm run build

# ── Runtime (standalone) ──────────────────────────────────
FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN groupadd -g 1001 nodejs && useradd -u 1001 -g nodejs -m nextjs

# Large GeoIP databases (~130 MB) in their own layer, copied BEFORE the app
# output so this layer stays cached across normal source changes and is only
# re-copied when the monthly DB files actually change. Read at runtime by the
# IP Info tool's server action via <cwd>/data/geoip.
COPY --from=builder --chown=nextjs:nodejs /app/data/geoip ./data/geoip

# Standalone output: server.js + minimal traced node_modules
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]

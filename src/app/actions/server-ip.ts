"use server";

import { headers } from "next/headers";

export interface ServerSeenIp {
  /** Best-guess client IP as seen by this app's server (empty if unknown). */
  ip: string;
  /** Which request header it came from. */
  source: string;
  /** Raw X-Forwarded-For chain, if any. */
  forwardedFor: string;
}

/**
 * Returns the client IP as observed by THIS site's server, read from the
 * incoming request headers (set by proxies/CDNs). This can differ from a
 * client-side lookup (different IP family, proxy, VPN split tunneling). It only
 * reads request metadata the browser already sends — no user content is uploaded.
 * Behind no proxy (e.g. local dev) the IP may be empty.
 */
export async function getServerSeenIp(): Promise<ServerSeenIp> {
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
    if (val) {
      return {
        ip: val.split(",")[0].trim(),
        source: name,
        forwardedFor: h.get("x-forwarded-for") ?? "",
      };
    }
  }
  return { ip: "", source: "", forwardedFor: "" };
}

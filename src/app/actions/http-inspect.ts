"use server";

import { isBlockedHost } from "@/lib/server/limits";

export interface InspectResult {
  ok: boolean;
  status?: number;
  statusText?: string;
  finalUrl?: string;
  headers?: [string, string][];
  error?: string;
}

/**
 * Fetch a URL on the server and return its status + response headers.
 * This needs a server action because the browser cannot read cross-origin
 * headers (CORS). The action is intentionally limited: http/https only, an
 * SSRF host denylist, an 8s timeout, and the response body is discarded.
 */
export async function inspectUrl(raw: string): Promise<InspectResult> {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return { ok: false, error: "آدرس نامعتبر است." };
  }

  if (url.protocol !== "http:" && url.protocol !== "https:")
    return { ok: false, error: "فقط پروتکل‌های http و https پشتیبانی می‌شوند." };

  if (isBlockedHost(url.hostname))
    return { ok: false, error: "دسترسی به این میزبان مجاز نیست." };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "RasmioToolbox/1.0 (+headers-inspector)" },
    });

    const headers: [string, string][] = [];
    res.headers.forEach((v, k) => headers.push([k, v]));

    // We only need headers — never download the body.
    try {
      await res.body?.cancel();
    } catch {
      /* ignore */
    }

    return {
      ok: true,
      status: res.status,
      statusText: res.statusText,
      finalUrl: res.url,
      headers: headers.sort((a, b) => a[0].localeCompare(b[0])),
    };
  } catch (e) {
    return {
      ok: false,
      error:
        (e as Error).name === "AbortError"
          ? "زمان درخواست به پایان رسید."
          : "دریافت پاسخ ناموفق بود.",
    };
  } finally {
    clearTimeout(timer);
  }
}

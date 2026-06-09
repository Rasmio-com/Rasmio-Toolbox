/**
 * Hard limits for the few tools that must use a server action.
 * The platform-level cap is set in next.config.ts
 * (experimental.serverActions.bodySizeLimit). These helpers enforce the same
 * policy inside actions and give friendly Persian errors.
 */

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_UPLOAD_LABEL = "۵ مگابایت";

/** Returns a Persian error string if too large, otherwise null. */
export function checkSize(bytes: number): string | null {
  if (bytes > MAX_UPLOAD_BYTES)
    return `حجم ورودی بیش از حد مجاز (${MAX_UPLOAD_LABEL}) است.`;
  return null;
}

/**
 * Basic SSRF guard: block obviously-internal hosts so a server-side fetch
 * cannot be pointed at the local network or cloud metadata endpoints.
 * Note: this does not resolve DNS, so it is a best-effort guard for a dev tool.
 */
export function isBlockedHost(host: string): boolean {
  const h = host.toLowerCase().replace(/^\[|\]$/g, "");
  if (
    h === "localhost" ||
    h === "::1" ||
    h === "0.0.0.0" ||
    h === "169.254.169.254" ||
    h.endsWith(".local") ||
    h.endsWith(".internal") ||
    h.endsWith(".localhost")
  )
    return true;

  const m = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (m) {
    const a = +m[1];
    const b = +m[2];
    if (a === 0 || a === 10 || a === 127) return true;
    if (a === 169 && b === 254) return true;
    if (a === 192 && b === 168) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
  }
  // IPv6 unique-local / link-local
  if (/^f[cd][0-9a-f]{2}:/i.test(h) || /^fe80:/i.test(h)) return true;
  return false;
}

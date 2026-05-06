/**
 * Normalize a stored slug (may be a full URL or encoded) for use in /itcertifications/[cat]/[slug].
 */
export function slugSegmentForUrl(raw) {
  if (raw == null || raw === "") return "";
  let s = String(raw).trim();
  try {
    s = decodeURIComponent(s);
  } catch {
    /* ignore */
  }
  s = s.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
  const parts = s.split(/[/\\?#]+/).filter(Boolean);
  const last = parts.length ? parts[parts.length - 1] : s;
  return encodeURIComponent(last);
}

export function categoryPathSegment(name) {
  if (!name) return "sap";
  return String(name).trim().toLowerCase().replace(/\s+/g, "-");
}

export const bookmarkStorageKey = "xr-signal-bookmarks";

const bookmarkIdPattern = /^(?:[a-f0-9]{16}|demo-[a-z0-9-]+)$/;

export function parseBookmarkIds(value: string | null): string[] {
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return [...new Set(parsed.filter((id): id is string => typeof id === "string" && bookmarkIdPattern.test(id)))];
  } catch {
    return [];
  }
}

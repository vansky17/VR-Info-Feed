import type { FeedItem } from "./types";

function fingerprint(value: string): string {
  return value
    .toLowerCase()
    .replace(/^https?:\/\/(www\.)?/, "")
    .replace(/[?#].*$/, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function deduplicate(items: FeedItem[]): FeedItem[] {
  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();

  return items.filter((item) => {
    const url = fingerprint(item.url);
    const title = fingerprint(item.title);
    if (seenUrls.has(url) || seenTitles.has(title)) return false;
    seenUrls.add(url);
    seenTitles.add(title);
    return true;
  });
}


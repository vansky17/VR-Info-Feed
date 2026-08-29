import type { FeedItem } from "./types";

function youtubeVideoId(value: string): string | undefined {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase().replace(/^(?:www\.|m\.)/, "");

    if (hostname === "youtube.com" && url.pathname === "/watch") {
      return url.searchParams.get("v") || undefined;
    }

    if (hostname === "youtu.be") {
      return url.pathname.split("/").filter(Boolean)[0];
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function fingerprint(value: string): string {
  const videoId = youtubeVideoId(value);
  if (videoId) return `youtube.com/watch?v=${videoId}`;

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

import { createHash } from "node:crypto";
import { XMLParser } from "fast-xml-parser";
import { calculateRelevance, classify } from "./classify";
import { deduplicate } from "./dedupe";
import { sources } from "./sources";
import { decodeHtmlEntities, truncateExcerpt } from "./text";
import type { FeedItem, SourceDefinition } from "./types";

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });

function asArray<T>(value: T | T[] | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function text(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "#text" in value) return String(value["#text" as keyof typeof value]);
  return "";
}

function authorName(value: unknown): string {
  if (value && typeof value === "object" && "name" in value) {
    return text(value.name);
  }
  return text(value);
}

function stripMarkup(value: string): string {
  return decodeHtmlEntities(value).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function linkUrl(value: unknown): string {
  if (Array.isArray(value)) {
    const alternate = value.find((link) => link?.["@_rel"] === "alternate") ?? value[0];
    return linkUrl(alternate);
  }
  if (value && typeof value === "object") {
    return String((value as Record<string, unknown>)["@_href"] ?? "");
  }
  return text(value);
}

function idFor(url: string): string {
  return createHash("sha256").update(url).digest("hex").slice(0, 16);
}

async function fetchRss(source: SourceDefinition): Promise<FeedItem[]> {
  if (!source.feedUrl) return [];
  const response = await fetch(source.feedUrl, {
    headers: { "User-Agent": "XR-Signal/2.0 (+https://github.com/vansky17/VR-Info-Feed)" },
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) throw new Error(`${source.name}: HTTP ${response.status}`);
  const xml = parser.parse(await response.text());
  const entries = asArray(xml?.rss?.channel?.item ?? xml?.feed?.entry);

  return entries.slice(0, source.itemLimit ?? 12).flatMap((entry: Record<string, unknown>) => {
    const title = decodeHtmlEntities(text(entry.title));
    const url = decodeHtmlEntities(linkUrl(entry.link));
    if (!title || !url) return [];
    const media = entry["media:group"] as Record<string, unknown> | undefined;
    const rawExcerpt = text(entry.description ?? entry.summary ?? entry.content ?? media?.["media:description"]);
    const excerpt = truncateExcerpt(stripMarkup(rawExcerpt));
    const author = stripMarkup(authorName(entry["dc:creator"] ?? entry.author)) || undefined;
    const publishedAt = new Date(text(entry.pubDate ?? entry.published ?? entry.updated) || Date.now()).toISOString();
    const combined = `${title} ${excerpt}`;
    const kind = source.kind ?? "article";
    return [{
      id: idFor(url), title, url, excerpt, author, publishedAt,
      source: source.name, sourceUrl: source.homepage, kind,
      topics: classify(combined), relevance: calculateRelevance(title, excerpt, publishedAt),
      readingMinutes: kind === "video" ? undefined : Math.max(2, Math.round(excerpt.length / 180)),
    }];
  });
}

async function fetchYouTube(source: SourceDefinition): Promise<FeedItem[]> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!source.query) return [];
  if (!key) throw new Error(`${source.name}: YOUTUBE_API_KEY is not configured`);
  const params = new URLSearchParams({
    key, q: source.query, part: "snippet", type: "video", maxResults: "3",
  });
  const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`, {
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) throw new Error(`${source.name}: HTTP ${response.status}`);
  const payload = await response.json() as { items?: Array<{ id: { videoId: string }; snippet: { title: string; description: string; publishedAt: string; channelTitle: string } }> };
  return (payload.items ?? []).map(({ id, snippet }) => {
    const url = `https://www.youtube.com/watch?v=${id.videoId}`;
    const excerpt = truncateExcerpt(snippet.description);
    return {
      id: idFor(url), title: snippet.title, url, excerpt, publishedAt: snippet.publishedAt,
      source: snippet.channelTitle, sourceUrl: source.homepage, kind: "video" as const,
      topics: classify(`${snippet.title} ${excerpt}`),
      relevance: calculateRelevance(snippet.title, excerpt, snippet.publishedAt),
    };
  });
}

export async function ingestSources(): Promise<{ items: FeedItem[]; warnings: string[] }> {
  const enabled = sources.filter((source) => source.enabled);
  const settled = await Promise.allSettled(enabled.map((source) => source.type === "rss" ? fetchRss(source) : fetchYouTube(source)));
  const warnings: string[] = [];
  const items = settled.flatMap((result, index) => {
    if (result.status === "fulfilled") return result.value;
    warnings.push(result.reason instanceof Error ? result.reason.message : `${enabled[index].name} could not be refreshed.`);
    return [];
  });
  return {
    items: deduplicate(items).sort((a, b) => b.relevance - a.relevance || Date.parse(b.publishedAt) - Date.parse(a.publishedAt)),
    warnings,
  };
}

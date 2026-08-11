export const xrTopics = ["VR", "AR", "MR", "AI + XR", "Hardware", "Industry"] as const;
export type XrTopic = (typeof xrTopics)[number];

export type FeedKind = "article" | "video" | "research";

export interface FeedItem {
  id: string;
  title: string;
  url: string;
  source: string;
  sourceUrl: string;
  author?: string;
  publishedAt: string;
  excerpt: string;
  kind: FeedKind;
  topics: XrTopic[];
  relevance: number;
  readingMinutes?: number;
  featured?: boolean;
}

export interface FeedResponse {
  items: FeedItem[];
  generatedAt: string;
  mode: "live" | "demo";
  warnings: string[];
}

export interface SourceDefinition {
  id: string;
  name: string;
  homepage: string;
  type: "rss" | "youtube";
  feedUrl?: string;
  query?: string;
  kind?: FeedKind;
  itemLimit?: number;
  enabled: boolean;
}

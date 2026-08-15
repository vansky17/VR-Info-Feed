import assert from "node:assert/strict";
import test from "node:test";
import { parseBookmarkIds } from "../lib/bookmarks.ts";
import { classify } from "../lib/classify.ts";
import { deduplicate } from "../lib/dedupe.ts";
import { sources } from "../lib/sources.ts";
import { decodeHtmlEntities, truncateExcerpt } from "../lib/text.ts";
import type { FeedItem } from "../lib/types.ts";

test("classifies overlapping XR signals", () => {
  const topics = classify("AI agents power augmented reality smart glasses hardware");
  assert.deepEqual(topics, ["AI + XR", "AR", "Hardware"]);
});

test("deduplicates canonical-equivalent URLs and titles", () => {
  const base: FeedItem = {
    id: "one", title: "A New XR Headset", url: "https://example.com/story?utm_source=x",
    source: "Example", sourceUrl: "https://example.com", publishedAt: new Date().toISOString(),
    excerpt: "Excerpt", kind: "article", topics: ["VR"], relevance: 80,
  };
  const duplicate = { ...base, id: "two", url: "https://www.example.com/story#top" };
  assert.equal(deduplicate([base, duplicate]).length, 1);
});

test("decodes numeric and named HTML entities from feed text", () => {
  assert.equal(
    decodeHtmlEntities("&#8216;Zelda&#8217; &amp; &#x27;Mario Kart&#x27;"),
    "‘Zelda’ & 'Mario Kart'",
  );
});

test("uses only server-side RSS and direct YouTube channel feeds", () => {
  assert.ok(sources.every((source) => source.type === "rss" && source.feedUrl));
  assert.equal(sources.filter((source) => source.feedUrl?.includes("youtube.com/feeds/videos.xml")).length, 7);
  assert.equal(sources.find((source) => source.id === "the-ghost-howls")?.feedUrl, "https://skarredghost.com/feed/");
});

test("accepts only intended bookmark identifier formats", () => {
  assert.deepEqual(
    parseBookmarkIds(JSON.stringify(["0123456789abcdef", "demo-openxr", "<script>", 42, "demo-openxr"])),
    ["0123456789abcdef", "demo-openxr"],
  );
  assert.deepEqual(parseBookmarkIds("not-json"), []);
});

test("limits excerpts to 100 characters before adding an ellipsis", () => {
  const exact = "x".repeat(100);
  assert.equal(truncateExcerpt(exact), exact);
  assert.equal(truncateExcerpt(`${exact}more`), `${exact}...`);
});

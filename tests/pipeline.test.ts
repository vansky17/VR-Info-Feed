import assert from "node:assert/strict";
import test from "node:test";
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

test("keeps broad YouTube API search disabled", () => {
  const broadSearch = sources.find((source) => source.id === "youtube-xr");
  assert.equal(broadSearch?.enabled, false);
});

test("limits excerpts to 100 characters before adding an ellipsis", () => {
  const exact = "x".repeat(100);
  assert.equal(truncateExcerpt(exact), exact);
  assert.equal(truncateExcerpt(`${exact}more`), `${exact}...`);
});

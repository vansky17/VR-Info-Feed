import assert from "node:assert/strict";
import test from "node:test";
import { classify } from "../lib/classify.ts";
import { deduplicate } from "../lib/dedupe.ts";
import type { FeedItem } from "../lib/types.ts";

test("classifies overlapping XR signals", () => {
  const topics = classify("AI agents power augmented reality smart glasses hardware");
  assert.deepEqual(topics, ["AI + XR", "AR", "Hardware"]);
});

test("deduplicates canonical-equivalent URLs and titles", () => {
  const base: FeedItem = {
    id: "one", title: "A New XR Headset", url: "https://example.com/story?utm_source=x",
    source: "Example", sourceUrl: "https://example.com", publishedAt: new Date().toISOString(),
    summary: "Summary", kind: "article", topics: ["VR"], relevance: 80,
  };
  const duplicate = { ...base, id: "two", url: "https://www.example.com/story#top" };
  assert.equal(deduplicate([base, duplicate]).length, 1);
});

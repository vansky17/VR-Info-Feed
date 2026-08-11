import type { XrTopic } from "./types";

const rules: Array<[XrTopic, RegExp]> = [
  ["AI + XR", /\b(ai|artificial intelligence|agent|multimodal|computer vision|machine learning)\b/i],
  ["AR", /\b(ar|augmented reality|smart glasses|spatial overlay)\b/i],
  ["MR", /\b(mr|mixed reality|passthrough)\b/i],
  ["VR", /\b(vr|virtual reality|headset|immersive)\b/i],
  ["Hardware", /\b(hardware|display|optics|lens|chip|headset|glasses|controller|sensor)\b/i],
  ["Industry", /\b(industry|enterprise|market|business|standard|openxr|training|manufacturing)\b/i],
];

export function classify(text: string): XrTopic[] {
  const matches = rules.filter(([, pattern]) => pattern.test(text)).map(([topic]) => topic);
  return matches.length ? [...new Set(matches)] : ["Industry"];
}

export function calculateRelevance(title: string, summary: string, publishedAt: string): number {
  const text = `${title} ${summary}`;
  const topicSignal = Math.min(classify(text).length * 8, 24);
  const hoursOld = Math.max(0, (Date.now() - new Date(publishedAt).getTime()) / 3_600_000);
  const freshness = Math.max(0, 36 - Math.log2(hoursOld + 1) * 6);
  const depth = Math.min(summary.length / 12, 20);
  return Math.round(Math.min(99, 20 + topicSignal + freshness + depth));
}


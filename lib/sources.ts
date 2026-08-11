import type { SourceDefinition } from "./types";

export const sources: SourceDefinition[] = [
  {
    id: "road-to-vr",
    name: "Road to VR",
    homepage: "https://www.roadtovr.com/",
    type: "rss",
    feedUrl: "https://www.roadtovr.com/feed/",
    enabled: true,
  },
  {
    id: "uploadvr",
    name: "UploadVR",
    homepage: "https://www.uploadvr.com/",
    type: "rss",
    feedUrl: "https://www.uploadvr.com/rss/",
    enabled: true,
  },
  {
    id: "youtube-xr",
    name: "YouTube XR",
    homepage: "https://www.youtube.com/",
    type: "youtube",
    query: "(virtual reality OR augmented reality OR mixed reality) technology",
    enabled: true,
  },
];


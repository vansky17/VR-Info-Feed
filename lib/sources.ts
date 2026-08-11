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
    id: "youtube-mrtv-rss",
    name: "MRTV",
    homepage: "https://www.youtube.com/@mixedrealityTV",
    type: "rss",
    feedUrl: "https://www.youtube.com/feeds/videos.xml?channel_id=UC2mgZjuHRDW02mx_ok4wfPw",
    kind: "video",
    enabled: true,
  },
  {
    id: "youtube-thrillseeker-rss",
    name: "ThrillSeeker",
    homepage: "https://www.youtube.com/@ThrillSeekerVR",
    type: "rss",
    feedUrl: "https://www.youtube.com/feeds/videos.xml?channel_id=UCSbdMXOI_3HGiFviLZO6kNA",
    kind: "video",
    enabled: true,
  },
  {
    id: "youtube-xr",
    name: "YouTube XR",
    homepage: "https://www.youtube.com/",
    type: "youtube",
    query: "virtual reality|augmented reality|mixed reality|spatial computing",
    enabled: true,
  },
];

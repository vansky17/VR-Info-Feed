"use client";

import {
  ArrowUpRight, Bookmark, Boxes, ChevronRight, CircleDot, Clock3, ExternalLink,
  Filter, Menu, Play, Radio, RefreshCw, Search, Sparkles, X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { SiteFooter } from "@/components/site-footer";
import { bookmarkStorageKey, parseBookmarkIds } from "@/lib/bookmarks";
import type { FeedItem, FeedResponse, XrTopic } from "@/lib/types";
import { xrTopics } from "@/lib/types";

type TopicFilter = "All signals" | XrTopic;
const topicFilters: TopicFilter[] = ["All signals", ...xrTopics];

function timeAgo(value: string): string {
  const hours = Math.max(0, Math.floor((Date.now() - Date.parse(value)) / 3_600_000));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function sourceInitials(source: string): string {
  return source.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function SignalCard({ item, saved, onSave }: { item: FeedItem; saved: boolean; onSave: () => void }) {
  return (
    <article className={`signal-card ${item.featured ? "featured" : ""}`}>
      <div className="signal-card-top">
        <div className="source-lockup">
          <span className="source-mark">{sourceInitials(item.source)}</span>
          <div>
            <strong>{item.source}</strong>
            <span>{item.author && item.author.toLowerCase() !== item.source.toLowerCase() ? `By ${item.author} · ` : ""}{timeAgo(item.publishedAt)}</span>
          </div>
        </div>
        <button className={`icon-button ${saved ? "saved" : ""}`} onClick={onSave} aria-label={saved ? "Remove bookmark" : "Bookmark signal"}>
          <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      {item.featured && (
        <div className="feature-visual" aria-hidden="true">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="feature-core"><Boxes size={38} strokeWidth={1.25} /></div>
          <span className="coordinate coordinate-a">SPATIAL / 01</span>
          <span className="coordinate coordinate-b">SIGNAL LOCKED</span>
        </div>
      )}

      <div className="topic-row">
        {item.kind === "video" && <span className="kind-pill"><Play size={11} fill="currentColor" /> Video</span>}
        {item.topics.slice(0, 3).map((topic) => <span className="topic-pill" key={topic}>{topic}</span>)}
        <span className="score">{item.relevance}% match</span>
      </div>
      <h2>{item.title}</h2>
      {item.excerpt && <p>{item.excerpt}</p>}
      <div className="card-footer">
        <span>{item.readingMinutes ? <><Clock3 size={14} /> {item.readingMinutes} min</> : <><Play size={14} /> Watch</>}</span>
        <a href={item.url} target="_blank" rel="noreferrer">Open signal <ArrowUpRight size={15} /></a>
      </div>
    </article>
  );
}

export function Dashboard({ initialItems, initialMode }: { initialItems: FeedItem[]; initialMode: "live" | "demo" }) {
  const [items, setItems] = useState(initialItems);
  const [topic, setTopic] = useState<TopicFilter>("All signals");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [showSaved, setShowSaved] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"live" | "demo">(initialMode);
  const [notice, setNotice] = useState(
    initialMode === "live"
      ? `${initialItems.length} live signals · updated automatically`
      : "Curated preview · live feeds unavailable",
  );

  async function refresh() {
    setLoading(true);
    try {
      const response = await fetch("/api/feed");
      if (!response.ok) throw new Error("Feed refresh failed");
      const payload = await response.json() as FeedResponse;
      setItems(payload.items);
      setMode(payload.mode);
      setNotice(payload.mode === "live" ? `${payload.items.length} live signals · refreshed just now` : "Curated preview · live feeds unavailable");
    } catch {
      setNotice("Refresh unavailable · keeping the current feed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const stored = parseBookmarkIds(localStorage.getItem(bookmarkStorageKey));
    if (stored.length) queueMicrotask(() => setSaved(new Set(stored)));
  }, []);

  function toggleSaved(id: string) {
    setSaved((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      localStorage.setItem(bookmarkStorageKey, JSON.stringify([...next]));
      return next;
    });
  }

  const filtered = useMemo(() => items.filter((item) => {
    const matchesTopic = topic === "All signals" || item.topics.includes(topic);
    const needle = query.toLowerCase().trim();
    const matchesQuery = !needle || `${item.title} ${item.excerpt} ${item.source} ${item.author ?? ""}`.toLowerCase().includes(needle);
    const matchesSaved = !showSaved || saved.has(item.id);
    return matchesTopic && matchesQuery && matchesSaved;
  }), [items, topic, query, showSaved, saved]);

  const featured = filtered.find((item) => item.featured) ?? filtered[0];
  const remaining = filtered.filter((item) => item.id !== featured?.id);

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="XR Signal home">
          <Image className="brand-logo" src="/logo_version1.png" alt="" width={40} height={43} priority />
          <span>XR<span>SIGNAL</span></span>
        </a>
        <nav className={menuOpen ? "open" : ""} aria-label="Primary navigation">
          <a className="active" href="#feed">Intelligence</a>
          <a href="#sources">Sources</a>
          <a href="#about">About</a>
        </nav>
        <div className="top-actions">
          <button className={`saved-button ${showSaved ? "active" : ""}`} onClick={() => setShowSaved(!showSaved)}>
            <Bookmark size={16} /> Saved <span>{saved.size}</span>
          </button>
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="eyebrow"><CircleDot size={14} /> XR intelligence layer</div>
          <h1>The signal inside<br /><em>spatial computing.</em></h1>
          <p>A focused stream of developments across virtual, augmented, and mixed reality.</p>
          <div className="hero-meta">
            <span><Radio size={14} /> {mode === "live" ? "Live ingestion" : "Preview mode"}</span>
            <span>{items.length} signals tracked</span>
            <span>11 active source adapters</span>
          </div>
        </section>

        <section className="control-deck" id="feed">
          <div className="search-wrap"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the spatial frontier" aria-label="Search signals" /></div>
          <button className="refresh-button" onClick={refresh} disabled={loading}><RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh</button>
          <div className="filter-row" aria-label="Topic filters">
            <Filter size={15} />
            {topicFilters.map((filter) => <button key={filter} className={topic === filter ? "active" : ""} onClick={() => setTopic(filter)}>{filter}</button>)}
          </div>
        </section>

        <div className="feed-heading">
          <div><span className="pulse" /><strong>{notice}</strong></div>
          <span>Ranked by relevance</span>
        </div>

        {filtered.length ? (
          <section className="signal-grid" aria-live="polite">
            {featured && <SignalCard item={featured} saved={saved.has(featured.id)} onSave={() => toggleSaved(featured.id)} />}
            <div className="secondary-grid">
              {remaining.map((item) => <SignalCard key={item.id} item={item} saved={saved.has(item.id)} onSave={() => toggleSaved(item.id)} />)}
            </div>
          </section>
        ) : (
          <section className="empty-state"><Search size={28} /><h2>No signal found</h2><p>Try another term or widen the topic filter.</p><button onClick={() => { setQuery(""); setTopic("All signals"); setShowSaved(false); }}>Reset filters</button></section>
        )}

        <section className="source-section" id="sources">
          <div><span className="section-index">02 / SOURCES</span><h2>Built for source<br />transparency.</h2></div>
          <div className="source-copy">
            <p>Every signal keeps its original link, publisher, and publication time.</p>
            <div className="source-list">
              <a href="https://www.roadtovr.com/" target="_blank" rel="noreferrer"><span>RT</span><strong>Road to VR<small>RSS · active</small></strong><ExternalLink size={16} /></a>
              <a href="https://www.uploadvr.com/" target="_blank" rel="noreferrer"><span>UV</span><strong>UploadVR<small>RSS · active</small></strong><ExternalLink size={16} /></a>
              <a href="https://thexrbeat.com/" target="_blank" rel="noreferrer"><span>XB</span><strong>The XR Beat<small>RSS · active</small></strong><ExternalLink size={16} /></a>
              <a href="https://skarredghost.com/" target="_blank" rel="noreferrer"><span>GH</span><strong>The Ghost Howls<small>RSS · active</small></strong><ExternalLink size={16} /></a>
              <a href="https://www.youtube.com/" target="_blank" rel="noreferrer"><span>YT</span><strong>YouTube channels<small>RSS · active</small></strong><ExternalLink size={16} /></a>
            </div>
          </div>
        </section>

        <section className="manifesto" id="about">
          <Sparkles size={24} />
          <p>Less feed.<br /><em>More signal.</em></p>
          <div className="manifesto-actions">
            <a className="origin-link" href="https://github.com/vansky17/VR-Info-Feed" target="_blank" rel="noreferrer">From a 2019 experiment to an XR intelligence layer <ChevronRight size={18} /></a>
            <a className="quiz-link" href="https://vansky17.github.io/VR-Quiz-App/" target="_blank" rel="noreferrer">Test your knowledge <ArrowUpRight size={17} /></a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

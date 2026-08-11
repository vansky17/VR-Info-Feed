-- PostgreSQL-ready persistence model for the ingestion milestone.
create table if not exists sources (
  id text primary key,
  name text not null,
  homepage_url text not null,
  feed_url text,
  source_type text not null check (source_type in ('rss', 'youtube')),
  enabled boolean not null default true,
  last_success_at timestamptz,
  last_error text
);

create table if not exists feed_items (
  id text primary key,
  canonical_url text not null unique,
  source_id text not null references sources(id),
  title text not null,
  excerpt text not null,
  author text,
  published_at timestamptz not null,
  kind text not null check (kind in ('article', 'video', 'research')),
  topics text[] not null default '{}',
  relevance smallint not null check (relevance between 0 and 100),
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists feed_items_published_at_idx on feed_items (published_at desc);
create index if not exists feed_items_topics_idx on feed_items using gin (topics);

create table if not exists enrichments (
  feed_item_id text primary key references feed_items(id) on delete cascade,
  model text not null,
  summary text not null,
  why_it_matters text,
  created_at timestamptz not null default now()
);

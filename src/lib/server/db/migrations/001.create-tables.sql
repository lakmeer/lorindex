
-- Main Table

create table if not exists items (
  id integer primary key,
  last_update timestamp default (unixepoch('now')),
  hash text not null unique,
  type text not null check(type in ('text', 'image', 'audio', 'link')),
  desc text,
  content text,
  data blob
);


-- VSS virtual table

create virtual table if not exists vss_items using vss0(
  embedding(1536)
);


-- Tags

create table if not exists tags (
  id integer primary key autoincrement,
  tag text unique not null
);


-- Many-to-many mapping of items to tags

create table if not exists item_tags (
  item_id integer not null,
  tag_id integer not null,
  foreign key (item_id) references items(id),
  foreign key (tag_id) references tags(id),
  primary key (item_id, tag_id)
);


-- Query embedding cache

create table if not exists embedding_cache (
  id integer primary key,
  hash text not null unique,
  embedding text not null
);

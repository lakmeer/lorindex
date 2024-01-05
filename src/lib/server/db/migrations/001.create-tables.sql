
-- Main Table

create table if not exists items (
  id integer primary key autoincrement,
  last_update timestamp default current_timestamp,
  hash text not null,
  type text not null check(type in ('text', 'image', 'audio', 'link')),
  desc text,
  content text,
  embedding text,
  data blob
);


-- Tags

create table if not exists tags (
  id integer primary key autoincrement,
  name text unique not null
);


-- Many-to-many mapping of items to tags

create table if not exists item_tags (
  item_id integer not null,
  tag_id integer not null,
  foreign key (item_id) references items(id),
  foreign key (tag_id) references tags(id),
  primary key (item_id, tag_id)
);


-- VSS virtual table

create virtual table if not exists vss_items using vss0(
  embedding(1536)
);

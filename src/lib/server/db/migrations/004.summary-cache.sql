
-- Summary embedding cache

create table if not exists summary_cache (
  hash text primary key,
  summary text not null
);

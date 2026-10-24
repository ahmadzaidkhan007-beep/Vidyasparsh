-- Run this once in Supabase > SQL Editor. Change the email if your admin email is different.
create table if not exists books (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  author text default '',
  cls text not null,
  subject text not null,
  price integer not null check (price >= 0),
  description text default '',
  cover_url text,
  color text default '#232f6b',
  in_stock boolean default true,
  created_at timestamptz default now()
);
alter table books enable row level security;
create policy "anyone can read books" on books for select using (true);
create policy "only admin can change books" on books for all to authenticated
  using (auth.jwt() ->> 'email' = 'vidyasparsh786@gmail.com')
  with check (auth.jwt() ->> 'email' = 'vidyasparsh786@gmail.com');

insert into storage.buckets (id, name, public) values ('covers', 'covers', true) on conflict do nothing;
create policy "anyone can view covers" on storage.objects for select using (bucket_id = 'covers');
create policy "only admin can manage covers" on storage.objects for all to authenticated
  using (bucket_id = 'covers' and auth.jwt() ->> 'email' = 'vidyasparsh786@gmail.com')
  with check (bucket_id = 'covers' and auth.jwt() ->> 'email' = 'vidyasparsh786@gmail.com');

insert into books (slug, title, author, cls, subject, price, description, color) values
 ('mathematics-made-easy-a1','Mathematics Made Easy','Editorial Team','Class 10','Mathematics',220,'Chapter-wise explanations and solved examples.','#232f6b'),
 ('science-explorer-b2','Science Explorer','Editorial Team','Class 8','Science',195,'Concepts with simple diagrams and practice questions.','#0f8b8d');

-- Supabaseで実行するSQLスキーマ

-- Users テーブル (auth.usersを拡張)
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) を有効化
alter table public.users enable row level security;

-- ユーザーは自分のデータのみ閲覧・更新可能
create policy "Users can view their own data" on public.users
  for select using (auth.uid() = id);

create policy "Users can insert their own data" on public.users
  for insert with check (auth.uid() = id);

create policy "Users can update their own data" on public.users
  for update using (auth.uid() = id);

-- 在庫商品テーブル
create table public.inventory_items (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  category text not null default 'その他',
  quantity decimal(10,1) not null default 0,
  last_updated timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_by uuid references public.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint inventory_items_category_check check (category in ('お酒', 'ソフトドリンク', 'フード', '消耗品', 'その他'))
);

alter table public.inventory_items enable row level security;

-- 認証済みユーザーは全ての在庫を閲覧可能
create policy "Authenticated users can view inventory" on public.inventory_items
  for select using (auth.role() = 'authenticated');

-- 認証済みユーザーは在庫を追加・更新可能
create policy "Authenticated users can insert inventory" on public.inventory_items
  for insert with check (auth.role() = 'authenticated');

create policy "Authenticated users can update inventory" on public.inventory_items
  for update using (auth.role() = 'authenticated');

create policy "Authenticated users can delete inventory" on public.inventory_items
  for delete using (auth.role() = 'authenticated');

-- 在庫履歴テーブル
create table public.inventory_history (
  id uuid default uuid_generate_v4() primary key,
  item_id uuid references public.inventory_items(id) on delete cascade not null,
  quantity decimal(10,1) not null,
  inventory_date timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_by uuid references public.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.inventory_history enable row level security;

create policy "Authenticated users can view inventory history" on public.inventory_history
  for select using (auth.role() = 'authenticated');

create policy "Authenticated users can insert inventory history" on public.inventory_history
  for insert with check (auth.role() = 'authenticated');

-- Todoテーブル
create table public.todos (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  completed boolean default false not null,
  is_shared boolean default false not null,
  created_by uuid references public.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.todos enable row level security;

-- 全体共有のTodoは全員が閲覧可能、自分用のTodoは自分のみ閲覧可能
create policy "Users can view shared todos" on public.todos
  for select using (is_shared = true or created_by = auth.uid());

-- ユーザーは自分のTodoを作成可能
create policy "Users can create their own todos" on public.todos
  for insert with check (created_by = auth.uid());

-- ユーザーは自分のTodoを更新可能
create policy "Users can update their own todos" on public.todos
  for update using (created_by = auth.uid());

-- ユーザーは自分のTodoを削除可能
create policy "Users can delete their own todos" on public.todos
  for delete using (created_by = auth.uid());

-- 共有リストテーブル
create table public.shared_lists (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  content text not null,
  created_by uuid references public.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 急ぎ買い出しリストテーブル
create table public.shopping_lists (
  id uuid default uuid_generate_v4() primary key,
  content text not null,
  created_by uuid references public.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.shared_lists enable row level security;

-- 全員が共有リストを閲覧可能
create policy "Authenticated users can view shared lists" on public.shared_lists
  for select using (auth.role() = 'authenticated');

-- ユーザーは共有リストを作成可能
create policy "Authenticated users can create shared lists" on public.shared_lists
  for insert with check (auth.role() = 'authenticated');

-- ユーザーは自分が作成した共有リストを更新可能
create policy "Users can update their own shared lists" on public.shared_lists
  for update using (created_by = auth.uid());

-- ユーザーは自分が作成した共有リストを削除可能
create policy "Users can delete their own shared lists" on public.shared_lists
  for delete using (created_by = auth.uid());

-- 急ぎ買い出しリストのRLSポリシー
alter table public.shopping_lists enable row level security;

-- 全員が急ぎ買い出しリストを閲覧可能
create policy "Authenticated users can view shopping lists" on public.shopping_lists
  for select using (auth.role() = 'authenticated');

-- ユーザーは急ぎ買い出しリストを作成可能
create policy "Authenticated users can create shopping lists" on public.shopping_lists
  for insert with check (auth.role() = 'authenticated');

-- ユーザーは自分が作成した急ぎ買い出しリストを削除可能
create policy "Users can delete their own shopping lists" on public.shopping_lists
  for delete using (created_by = auth.uid());

-- インデックスの作成
create index inventory_items_name_idx on public.inventory_items(name);
create index inventory_items_category_idx on public.inventory_items(category);
create index inventory_history_item_id_idx on public.inventory_history(item_id);
create index todos_created_by_idx on public.todos(created_by);
create index shared_lists_title_idx on public.shared_lists(title);
create index shopping_lists_created_at_idx on public.shopping_lists(created_at);

-- トリガー関数: 新規ユーザー作成時に自動的にusersテーブルにレコードを作成
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
exception
  when others then
    -- エラーが発生してもユーザー作成は続行
    raise warning 'handle_new_user failed: %', sqlerrm;
    return new;
end;
$$ language plpgsql security definer;

-- トリガー: auth.usersに新規ユーザーが作成されたときに実行
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 既存のauth.usersのユーザーをpublic.usersに移行
-- （スキーマ作成後に既にauth.usersにユーザーがいる場合に必要）
insert into public.users (id, email, name)
select 
  id, 
  email, 
  coalesce(raw_user_meta_data->>'name', split_part(email, '@', 1))
from auth.users
on conflict (id) do nothing;


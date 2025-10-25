-- 急ぎ買い出しリスト機能を追加するマイグレーション
-- Supabaseの SQL Editor で実行してください

-- ステップ1: 急ぎ買い出しリストテーブルを作成
create table if not exists public.shopping_lists (
  id uuid default uuid_generate_v4() primary key,
  content text not null,
  created_by uuid references public.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ステップ2: RLSを有効化
alter table public.shopping_lists enable row level security;

-- ステップ3: RLSポリシーを作成
-- 全員が急ぎ買い出しリストを閲覧可能
create policy "Authenticated users can view shopping lists" on public.shopping_lists
  for select using (auth.role() = 'authenticated');

-- ユーザーは急ぎ買い出しリストを作成可能
create policy "Authenticated users can create shopping lists" on public.shopping_lists
  for insert with check (auth.role() = 'authenticated');

-- ユーザーは自分が作成した急ぎ買い出しリストを削除可能
create policy "Users can delete their own shopping lists" on public.shopping_lists
  for delete using (created_by = auth.uid());

-- ステップ4: インデックスを作成
create index if not exists shopping_lists_created_at_idx on public.shopping_lists(created_at);

-- ステップ5: 確認 - テーブルが作成されたことを確認
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'shopping_lists'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- ステップ6: 確認 - ポリシーが作成されたことを確認
SELECT 
  tablename,
  policyname,
  cmd as command_type
FROM pg_policies
WHERE tablename = 'shopping_lists'
  AND schemaname = 'public'
ORDER BY policyname;

-- ステップ7: テスト - サンプルデータを挿入（任意）
-- INSERT INTO public.shopping_lists (content, created_by)
-- VALUES ('ビール 2ケース、氷 1袋', (SELECT id FROM auth.users LIMIT 1));

-- ステップ8: 確認 - サンプルデータが挿入されたことを確認
-- SELECT * FROM public.shopping_lists ORDER BY created_at DESC;

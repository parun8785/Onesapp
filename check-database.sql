-- Supabaseのテーブルが正しく作成されているか確認するSQL
-- このファイルをSupabaseのSQL Editorで実行してください

-- ===== テーブルの存在確認 =====
SELECT 
  'テーブル確認' as check_type,
  table_name,
  CASE 
    WHEN table_name IN ('users', 'inventory_items', 'inventory_history', 'todos', 'shared_lists') 
    THEN '✅ 存在' 
    ELSE '❌ 未作成' 
  END as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('users', 'inventory_items', 'inventory_history', 'todos', 'shared_lists')
ORDER BY table_name;

-- ===== RLSポリシーの確認 =====
SELECT 
  'RLSポリシー確認' as check_type,
  tablename as table_name,
  policyname as policy_name,
  cmd as command_type,
  '✅ 設定済み' as status
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ===== トリガーの確認 =====
SELECT 
  'トリガー確認' as check_type,
  trigger_name,
  event_object_table as table_name,
  action_timing,
  event_manipulation,
  '✅ 設定済み' as status
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY trigger_name;

-- ===== 関数の確認 =====
SELECT 
  '関数確認' as check_type,
  routine_name as function_name,
  '✅ 存在' as status
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'handle_new_user';

-- ===== 各テーブルのレコード数確認 =====
SELECT 'users' as table_name, COUNT(*) as record_count FROM public.users
UNION ALL
SELECT 'inventory_items', COUNT(*) FROM public.inventory_items
UNION ALL
SELECT 'inventory_history', COUNT(*) FROM public.inventory_history
UNION ALL
SELECT 'todos', COUNT(*) FROM public.todos
UNION ALL
SELECT 'shared_lists', COUNT(*) FROM public.shared_lists
ORDER BY table_name;


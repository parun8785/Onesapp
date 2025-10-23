-- ユーザーテーブルの問題を修正するSQL
-- Supabaseの SQL Editor で実行してください

-- ===== ステップ1: 現在の状況を確認 =====

-- auth.users のユーザー数
SELECT 'auth.users' as table_name, COUNT(*) as user_count 
FROM auth.users;

-- public.users のユーザー数
SELECT 'public.users' as table_name, COUNT(*) as user_count 
FROM public.users;

-- どのユーザーが public.users に存在しないか確認
SELECT 
  au.id,
  au.email,
  CASE 
    WHEN pu.id IS NULL THEN '❌ 未登録'
    ELSE '✅ 登録済み'
  END as status
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
ORDER BY au.created_at;

-- ===== ステップ2: 欠けているユーザーを public.users に追加 =====

-- auth.users から public.users に全ユーザーを移行
INSERT INTO public.users (id, email, name)
SELECT 
  id, 
  email, 
  COALESCE(
    raw_user_meta_data->>'name',  -- メタデータから名前を取得
    split_part(email, '@', 1)      -- なければメールアドレスの@前を使用
  ) as name
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM public.users WHERE public.users.id = auth.users.id
);

-- ===== ステップ3: トリガーの確認 =====

-- トリガーが存在するか確認
SELECT 
  trigger_name,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- トリガー関数が存在するか確認
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_name = 'handle_new_user';

-- ===== ステップ4: 結果の確認 =====

-- 再度ユーザー数を確認
SELECT 'auth.users' as table_name, COUNT(*) as user_count FROM auth.users
UNION ALL
SELECT 'public.users', COUNT(*) FROM public.users;

-- すべてのユーザーが移行されたか確認
SELECT 
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ すべてのユーザーが移行されました！'
    ELSE '❌ ' || COUNT(*) || ' 人のユーザーが未移行です'
  END as migration_status
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;


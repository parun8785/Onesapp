-- ソフトドリンクカテゴリーを追加するマイグレーション
-- Supabaseの SQL Editor で実行してください

-- ステップ1: 既存のカテゴリー制約を削除
ALTER TABLE public.inventory_items
DROP CONSTRAINT IF EXISTS inventory_items_category_check;

-- ステップ2: ソフトドリンクを含む新しい制約を追加
ALTER TABLE public.inventory_items
ADD CONSTRAINT inventory_items_category_check 
CHECK (category IN ('お酒', 'ソフトドリンク', 'フード', '消耗品', 'その他'));

-- ステップ3: 確認 - 制約が更新されたことを確認
SELECT
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conname = 'inventory_items_category_check';

-- ステップ4: 確認 - 既存のカテゴリーを表示
SELECT 
  category,
  COUNT(*) as item_count
FROM public.inventory_items
GROUP BY category
ORDER BY category;

-- ステップ5: テスト - ソフトドリンクが追加できることを確認（任意）
-- INSERT INTO public.inventory_items (name, category, quantity, updated_by)
-- VALUES ('コカ・コーラ', 'ソフトドリンク', 0, (SELECT id FROM auth.users LIMIT 1));


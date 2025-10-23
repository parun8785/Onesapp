-- 在庫管理にカテゴリー機能を追加するマイグレーション
-- Supabaseの SQL Editor で実行してください

-- ステップ1: カテゴリーカラムを追加
ALTER TABLE public.inventory_items 
ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'その他';

-- ステップ2: カテゴリーの制約を追加（指定されたカテゴリーのみ許可）
ALTER TABLE public.inventory_items
DROP CONSTRAINT IF EXISTS inventory_items_category_check;

ALTER TABLE public.inventory_items
ADD CONSTRAINT inventory_items_category_check 
CHECK (category IN ('お酒', 'ソフトドリンク', 'フード', '消耗品', 'その他'));

-- ステップ3: カテゴリー用のインデックスを作成（検索を高速化）
CREATE INDEX IF NOT EXISTS inventory_items_category_idx 
ON public.inventory_items(category);

-- ステップ4: 確認 - テーブル構造を表示
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'inventory_items'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- ステップ5: 確認 - 既存データを確認
SELECT 
  id,
  name,
  category,
  quantity
FROM public.inventory_items
ORDER BY category, name;


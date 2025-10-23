# 🔧 トラブルシューティングガイド

「商品の追加エラー: Object」というエラーが出た場合の診断・解決方法

## 📊 現在の状況

✅ **環境変数**: 正しく設定されています  
❓ **データベース**: 確認が必要です

---

## 🔍 ステップ1: エラーの詳細を確認

コードを更新したので、**開発サーバーを再起動**してください：

```bash
# ターミナルで Ctrl+C を押してサーバーを停止
# 再起動
npm run dev
```

### 再度、商品を追加してみる

1. ブラウザで http://localhost:3000 を開く
2. 「在庫管理」タブを開く
3. 「商品を追加」をクリック
4. 商品名を入力（例：「テストビール」）
5. 「追加」をクリック

### ブラウザのコンソールを確認

1. **F12キー**を押して開発者ツールを開く
2. **Console**タブを選択
3. エラーメッセージを確認

#### 期待されるログ（成功時）:
```
商品追加開始: テストビール
ユーザーID: xxxxx-xxxxx-xxxxx-xxxxx
商品追加成功: [...]
```

#### エラーが出る場合:
```
Supabaseエラー詳細:
- メッセージ: [エラーメッセージ]
- コード: [エラーコード]
- 詳細: [詳細情報]
- ヒント: [解決のヒント]
```

**このエラーメッセージを確認してください！**

---

## 🗄️ ステップ2: Supabaseのテーブルを確認

### 2-1. Supabaseダッシュボードを開く

1. [https://app.supabase.com/](https://app.supabase.com/) を開く
2. プロジェクトを選択
3. 左メニューの **Table Editor** をクリック

### 2-2. 必要なテーブルがあるか確認

以下の5つのテーブルが存在するか確認：

- ✅ `users`
- ✅ `inventory_items`
- ✅ `inventory_history`
- ✅ `todos`
- ✅ `shared_lists`

**すべてのテーブルが存在する場合** → ステップ3へ  
**テーブルが不足している場合** → ステップ2-3へ

### 2-3. データベーススキーマを実行

1. Supabaseダッシュボードの **SQL Editor** を開く
2. **New query** をクリック
3. 以下のSQLを実行して既存のテーブルを削除：

```sql
-- 既存のテーブルとトリガーを削除（データが失われます）
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user() cascade;
drop table if exists public.inventory_history cascade;
drop table if exists public.inventory_items cascade;
drop table if exists public.todos cascade;
drop table if exists public.shared_lists cascade;
drop table if exists public.users cascade;
```

4. **Run** をクリック
5. 新しいクエリを作成
6. `supabase-schema.sql` ファイルの内容を**全て**コピー＆ペースト
7. **Run** をクリック

### 2-4. テーブル作成の確認

SQL Editorで以下を実行：

```sql
-- テーブルが正しく作成されたか確認
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
  AND table_name IN ('users', 'inventory_items', 'inventory_history', 'todos', 'shared_lists')
ORDER BY table_name;
```

**結果**: 5つのテーブルが表示されればOK

---

## 🔐 ステップ3: RLSポリシーを確認

### 3-1. ポリシーの存在確認

SQL Editorで以下を実行：

```sql
-- RLSポリシーを確認
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

**期待される結果**:
- `inventory_items` に4つのポリシー（select, insert, update, delete）
- `todos` に4つのポリシー
- `shared_lists` に4つのポリシー
- `users` に3つのポリシー
- `inventory_history` に2つのポリシー

**ポリシーが不足している場合** → `supabase-schema.sql` を再実行

---

## 🔄 ステップ4: トリガーを確認

### 4-1. トリガーの存在確認

SQL Editorで以下を実行：

```sql
-- トリガーを確認
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';
```

**期待される結果**:
- `on_auth_user_created` トリガーが存在する

**トリガーがない場合** → `supabase-schema.sql` を再実行

---

## 🧪 ステップ5: 手動でテストレコードを挿入

### 5-1. 現在のユーザーIDを確認

SQL Editorで実行：

```sql
-- 自分のユーザーIDを確認
SELECT id, email FROM auth.users;
```

ユーザーIDをコピーしてください（例：`12345678-abcd-1234-abcd-123456789012`）

### 5-2. 手動で商品を追加

```sql
-- テスト商品を追加（YOUR_USER_ID を実際のIDに置き換え）
INSERT INTO public.inventory_items (name, quantity, updated_by)
VALUES ('テスト商品', 1.0, 'YOUR_USER_ID');
```

**成功した場合**: 
```
Success. Rows affected: 1
```
→ アプリをリロードして、商品が表示されるか確認

**エラーが出た場合**: 
エラーメッセージを確認してください

---

## 📋 よくあるエラーと解決方法

### エラー1: `relation "inventory_items" does not exist`

**原因**: テーブルが作成されていない

**解決**: ステップ2-3を実行

---

### エラー2: `new row violates row-level security policy`

**原因**: RLSポリシーが正しく設定されていない

**解決**:
1. SQL Editorで以下を実行：

```sql
-- RLSを一時的に無効化してテスト（開発環境のみ）
ALTER TABLE public.inventory_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_lists DISABLE ROW LEVEL SECURITY;
```

2. 商品追加を試す
3. 成功した場合、RLSポリシーが問題
4. `supabase-schema.sql` を再実行してRLSを再設定

---

### エラー3: `insert or update on table "inventory_items" violates foreign key constraint`

**原因**: `users` テーブルにユーザーが登録されていない

**解決**:
1. SQL Editorで確認：

```sql
-- usersテーブルを確認
SELECT * FROM public.users;
```

2. ユーザーがいない場合、手動で追加：

```sql
-- YOUR_USER_ID と YOUR_EMAIL を置き換え
INSERT INTO public.users (id, email, name)
SELECT id, email, COALESCE(raw_user_meta_data->>'name', email)
FROM auth.users
WHERE id = 'YOUR_USER_ID';
```

---

### エラー4: `JWT expired` または `Invalid API key`

**原因**: Supabaseのセッションが期限切れ、またはAPIキーが間違っている

**解決**:
1. ブラウザをリロード（F5）
2. ログアウトして再ログイン
3. `.env.local` のAPIキーを再確認

---

## 🎯 最終チェック

すべてのステップを実行した後：

### ✅ チェックリスト

- [ ] `.env.local` ファイルが存在し、正しい値が設定されている
- [ ] 開発サーバーを再起動した
- [ ] Supabaseに5つのテーブルが存在する
- [ ] RLSポリシーが設定されている
- [ ] トリガーが設定されている
- [ ] `users` テーブルにユーザーが登録されている
- [ ] 手動でのレコード挿入が成功する

### 動作確認

1. アプリをリロード（F5）
2. 必要に応じてログアウト→再ログイン
3. 商品追加を試す

**成功したら**: 🎉 完了です！

**まだエラーが出る場合**: 
- ブラウザのコンソールのエラーメッセージをスクリーンショット
- Supabaseの SQL Editor で `check-database.sql` を実行した結果をスクリーンショット
- 両方を確認して、さらに診断します

---

## 📞 サポートが必要な場合

以下の情報を用意してください：

1. ブラウザのコンソールのエラーメッセージ
2. Supabaseのテーブル一覧のスクリーンショット
3. SQL Editorで実行したクエリとその結果

これらがあれば、問題を特定しやすくなります！


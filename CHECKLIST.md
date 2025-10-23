# トラブルシューティング チェックリスト

「作成・追加ができない」問題を解決するための診断チェックリストです。

## ✅ チェックリスト

### 1. 環境変数の確認

- [ ] `.env.local` ファイルが存在する
- [ ] ファイルに以下の2つの変数が設定されている：
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] 値が `your_supabase_url` のままになっていない
- [ ] 開発サーバーを再起動した（環境変数を変更した後）

**確認方法**:
```bash
# .env.local ファイルの内容を確認
cat .env.local

# または Windows PowerShell の場合
Get-Content .env.local
```

### 2. Supabaseプロジェクトの確認

- [ ] Supabaseでプロジェクトが作成されている
- [ ] プロジェクトのステータスが「Active」になっている
- [ ] Project URLとAnon Keyを正しくコピーした

**確認方法**:
1. [Supabase Dashboard](https://app.supabase.com/) にアクセス
2. プロジェクトを開く
3. Settings → API を確認

### 3. データベーススキーマの確認

- [ ] `supabase-schema.sql` を実行した
- [ ] エラーなく完了した
- [ ] 以下のテーブルが作成されている：
  - `users`
  - `inventory_items`
  - `inventory_history`
  - `todos`
  - `shared_lists`

**確認方法**:
1. Supabaseダッシュボードの「Table Editor」を開く
2. 左側にテーブル一覧が表示される

### 4. 認証の確認

- [ ] アカウントを作成できた
- [ ] ログインできた
- [ ] ダッシュボードが表示されている

**確認方法**:
1. Supabaseダッシュボードの「Authentication」→「Users」を開く
2. ユーザーが表示されている

### 5. ブラウザコンソールの確認

- [ ] ブラウザの開発者ツールを開いた（F12キー）
- [ ] 「Console」タブを開いた
- [ ] エラーメッセージを確認した

**よくあるエラー**:

| エラーメッセージ | 原因 | 解決方法 |
|---|---|---|
| `Failed to fetch` | 環境変数が未設定 | `.env.local`を確認 |
| `Invalid API key` | APIキーが間違っている | Supabaseから正しいキーをコピー |
| `relation "users" does not exist` | スキーマが作成されていない | `supabase-schema.sql`を実行 |
| `new row violates row-level security policy` | RLSポリシーの問題 | `supabase-schema.sql`を再実行 |

## 🔧 修正手順

### 問題: 環境変数が設定されていない

1. プロジェクトのルートディレクトリに `.env.local` ファイルを作成
2. 以下の内容を追加（実際の値に置き換える）:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
3. 開発サーバーを再起動:
```bash
# Ctrl+C で停止
npm run dev
```

### 問題: スキーマが作成されていない

1. Supabaseダッシュボードの「SQL Editor」を開く
2. 「New query」をクリック
3. `supabase-schema.sql` の内容を**全て**コピーして貼り付け
4. 「Run」をクリック
5. 成功したら、ブラウザをリロード

### 問題: RLSポリシーのエラー

1. 既存のテーブルを削除する（データが失われます）:
```sql
-- Supabaseの SQL Editor で実行
drop table if exists inventory_history cascade;
drop table if exists inventory_items cascade;
drop table if exists todos cascade;
drop table if exists shared_lists cascade;
drop table if exists users cascade;
drop function if exists public.handle_new_user() cascade;
```
2. `supabase-schema.sql` を再実行

## 📞 サポート

すべて確認しても問題が解決しない場合：

1. **エラーログを確認**:
   - ブラウザの開発者ツール（F12）→ Console タブ
   - ブラウザの開発者ツール（F12）→ Network タブ

2. **Supabaseのログを確認**:
   - Supabaseダッシュボード → Logs → API Logs

3. **スクリーンショットを撮る**:
   - エラーメッセージ
   - ブラウザのコンソール
   - Supabaseの設定画面

---

## ✨ 動作確認

すべて修正したら、以下の順番で動作確認：

1. **在庫管理**:
   - 「商品を追加」→ 商品名入力 → 「追加」
   - 追加した商品が表示される ✅

2. **To-doリスト**:
   - タスク入力 → 「追加」
   - Todoが表示される ✅

3. **共有リスト**:
   - 「リストを作成」→ タイトルと内容を入力 → 「作成」
   - リストが表示される ✅

すべて動作すれば成功です！🎉


# Vercelデプロイエラーの修正

## 🔧 修正内容

以下のファイルを修正しました：

### 1. `lib/supabase.ts`
環境変数のエラーハンドリングを追加し、ビルド時にエラーが発生しないようにしました。

### 2. `vercel.json`
Vercel用の設定ファイルを追加しました。

---

## 🚀 今すぐやること

### ステップ1: 変更をGitHubにプッシュ

```bash
# 変更をステージング
git add .

# コミット
git commit -m "Fix: Vercel deployment error - add environment variable handling"

# GitHubにプッシュ
git push
```

⚠️ **重要**: GitHubにプッシュすると、Vercelが自動的に再デプロイを開始します。

---

### ステップ2: Vercelで環境変数を設定

**まだ設定していない場合**、以下を実行してください：

1. [Vercelダッシュボード](https://vercel.com/dashboard) を開く
2. プロジェクトを選択
3. **Settings** → **Environment Variables** を開く
4. 以下の2つを追加：

#### 環境変数1

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: あなたのSupabase Project URL（例：https://xxxxx.supabase.co）
Environment: ✅ Production ✅ Preview ✅ Development
```

#### 環境変数2

```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: あなたのSupabase anon public key（eyJで始まる長い文字列）
Environment: ✅ Production ✅ Preview ✅ Development
```

5. **Add** をクリック

---

### ステップ3: 確認

1. Vercel → **Deployments** タブを開く
2. 最新のデプロイ（GitHubへのプッシュで自動開始）を確認
3. ビルドが成功するまで待つ（2-3分）
4. 成功したら「**Visit**」ボタンをクリック

---

## ✅ 成功の確認

アプリが開いて、以下が動作すれば成功：
- ✅ ログイン/サインアップができる
- ✅ 在庫管理で商品を追加できる
- ✅ To-doリストが使える
- ✅ 共有リストが使える

---

## 📖 詳細ガイド

- 環境変数の設定方法 → [VERCEL-ENV-SETUP.md](VERCEL-ENV-SETUP.md)
- 完全なデプロイガイド → [VERCEL-DEPLOY.md](VERCEL-DEPLOY.md)

---

## 🔍 まだエラーが出る場合

### エラーが続く場合

1. **環境変数を再確認**
   - Vercel → Settings → Environment Variables
   - 2つの変数が正しく設定されているか確認

2. **手動で再デプロイ**
   - Vercel → Deployments → 最新のデプロイ
   - 右上の「...」→「Redeploy」

3. **ログを確認**
   - デプロイの詳細ページでエラーログを確認
   - エラーメッセージを読んで原因を特定

---

## 💡 今回の修正のポイント

### 修正前
```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
```
→ 環境変数が未定義だとビルドエラー

### 修正後
```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('環境変数が設定されていません')
}
```
→ ビルドは成功、実行時に警告表示

---

これで、環境変数が設定されていない状態でもビルドが通るようになりました！


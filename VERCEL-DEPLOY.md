# Vercelへのデプロイガイド

このガイドでは、「Ones」アプリをVercelにデプロイする手順を説明します。

## 📋 前提条件

- GitHubアカウント
- Vercelアカウント（GitHubでサインインできます）
- Supabaseプロジェクトが作成済み
- データベーススキーマが設定済み

---

## 🚀 デプロイ手順

### ステップ1: GitHubにプッシュ

プロジェクトをGitHubにプッシュします。

```bash
# Gitの初期化（まだの場合）
git init

# .gitignoreの確認（.env.localが除外されていることを確認）
cat .gitignore

# ファイルを追加
git add .

# コミット
git commit -m "Initial commit: Ones Bar Management System"

# GitHubリポジトリを作成して、リモートを追加
# GitHubで新しいリポジトリを作成後：
git remote add origin https://github.com/your-username/ones-bar-app.git

# プッシュ
git branch -M main
git push -u origin main
```

⚠️ **重要**: `.env.local`ファイルはGitHubにプッシュされません（.gitignoreに含まれています）

---

### ステップ2: Vercelにログイン

1. [https://vercel.com/](https://vercel.com/) にアクセス
2. 「Sign Up」または「Log In」をクリック
3. GitHubアカウントでサインイン

---

### ステップ3: 新しいプロジェクトを作成

1. Vercelダッシュボードで「Add New...」→「Project」をクリック
2. GitHubリポジトリの一覧から、プッシュしたリポジトリを選択
3. 「Import」をクリック

---

### ステップ4: 環境変数を設定 ⭐重要

「Configure Project」画面で：

1. **Environment Variables**セクションを開く
2. 以下の2つの環境変数を追加：

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | あなたのSupabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | あなたのSupabase Anon Key |

#### 環境変数の値を取得する方法

1. [Supabaseダッシュボード](https://app.supabase.com/) を開く
2. プロジェクトを選択
3. **Settings** → **API** を開く
4. 以下をコピー：
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGci...`

#### Vercelでの設定方法

1. **Name**: `NEXT_PUBLIC_SUPABASE_URL`
2. **Value**: Supabaseの Project URL を貼り付け
3. **Add** をクリック

4. **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. **Value**: Supabaseの anon public key を貼り付け
6. **Add** をクリック

⚠️ **注意**: 
- 環境変数名は正確に入力してください（大文字小文字を区別）
- 値にスペースや改行が入らないように注意

---

### ステップ5: デプロイ

1. 環境変数を設定したら、「Deploy」ボタンをクリック
2. ビルドとデプロイが開始されます（2-3分程度）
3. 成功すると「Congratulations!」画面が表示されます

---

## ✅ デプロイ成功の確認

### 1. アプリにアクセス

デプロイが完了すると、以下のようなURLが発行されます：
```
https://ones-bar-app-xxxxx.vercel.app
```

「Visit」ボタンをクリックしてアプリを開きます。

### 2. 動作確認

1. ログイン/サインアップが動作する
2. 在庫管理で商品が追加できる
3. To-doリストが動作する
4. 共有リストが動作する

---

## 🔄 アップデート（再デプロイ）

コードを更新した場合：

```bash
# 変更をコミット
git add .
git commit -m "Update: 機能の説明"

# GitHubにプッシュ
git push
```

**自動的にVercelが再デプロイします**（約2-3分）

---

## 🔧 トラブルシューティング

### エラー1: ビルドが失敗する

**原因**: 環境変数が設定されていない

**解決方法**:
1. Vercelダッシュボードでプロジェクトを開く
2. **Settings** → **Environment Variables** を開く
3. 2つの環境変数が正しく設定されているか確認
4. 不足している場合は追加
5. **Deployments** タブから最新のデプロイを選択
6. 右上の「...」→「Redeploy」をクリック

### エラー2: アプリは開くが機能が動作しない

**原因**: 環境変数の値が間違っている

**解決方法**:
1. ブラウザの開発者ツール（F12）→ Consoleを開く
2. エラーメッセージを確認
3. Supabaseの環境変数を再確認
4. Vercelで環境変数を修正
5. 再デプロイ

### エラー3: 「Failed to fetch」エラー

**原因**: SupabaseのURLが間違っている

**解決方法**:
1. Supabaseダッシュボードで正しいURLを確認
2. Vercelの環境変数を更新
3. 再デプロイ

### エラー4: 認証が動作しない

**原因**: Supabaseの認証設定

**解決方法**:
1. Supabaseダッシュボード → **Authentication** → **URL Configuration**
2. **Site URL** に Vercel の URL を追加:
   ```
   https://ones-bar-app-xxxxx.vercel.app
   ```
3. **Redirect URLs** に以下を追加:
   ```
   https://ones-bar-app-xxxxx.vercel.app/**
   ```
4. 保存

---

## 🌐 カスタムドメインの設定（オプション）

独自ドメインを使いたい場合：

1. Vercelダッシュボードでプロジェクトを開く
2. **Settings** → **Domains** を開く
3. 「Add」ボタンをクリック
4. ドメイン名を入力（例：`ones-bar.com`）
5. DNS設定の指示に従う

---

## 📊 環境変数の確認方法

Vercelで設定した環境変数を確認：

1. Vercelダッシュボードでプロジェクトを開く
2. **Settings** → **Environment Variables**
3. 以下が設定されているか確認：
   - ✅ `NEXT_PUBLIC_SUPABASE_URL`
   - ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🔒 セキュリティ

### やってはいけないこと

❌ `.env.local` をGitHubにプッシュする  
❌ 環境変数をコードに直接書く  
❌ Supabase service_role key を公開する（anon keyのみ使用）

### やるべきこと

✅ `.gitignore` に `.env*.local` が含まれていることを確認  
✅ Vercelで環境変数を設定  
✅ Supabase RLSポリシーを正しく設定

---

## 📝 チェックリスト

デプロイ前の最終チェック：

- [ ] GitHubにコードがプッシュされている
- [ ] `.env.local` がGitHubにプッシュされていない
- [ ] Supabaseでデータベーススキーマが作成されている
- [ ] Vercelで2つの環境変数が設定されている
- [ ] ローカル環境で正常に動作している

---

## 🎉 完了！

デプロイが完了したら、世界中どこからでもアプリにアクセスできます！

URLを共有して、チームメンバーを招待しましょう。

---

## 💡 ヒント

- Vercelの無料プランで十分に使えます
- GitHubにプッシュするだけで自動デプロイされます
- デプロイのログはVercelダッシュボードで確認できます
- 環境変数の変更後は必ず再デプロイが必要です


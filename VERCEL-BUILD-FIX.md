# Vercelビルドエラーの完全修正ガイド

## 🔧 修正内容

以下の修正を行いました：

### 1. `lib/supabase.ts`
- プレースホルダーを使用して、環境変数が未設定でもビルドが通るようにしました
- ブラウザでのみ警告を表示するようにしました

### 2. `app/page.tsx`
- 環境変数のチェックを追加
- 環境変数が未設定の場合は、ユーザーフレンドリーなエラー画面を表示

---

## 🚀 解決方法

### オプション1: 環境変数を設定して再デプロイ（推奨）

最も確実な方法です。

#### ステップ1: コードをプッシュ

```bash
git add .
git commit -m "Fix: Vercel build error with proper environment variable handling"
git push
```

#### ステップ2: Vercelで環境変数を設定

1. [Vercelダッシュボード](https://vercel.com/dashboard) を開く
2. プロジェクトを選択
3. **Settings** → **Environment Variables**
4. 以下を追加：

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://あなたのプロジェクトID.supabase.co
Environment: ✅ Production ✅ Preview ✅ Development
```

```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY  
Value: eyJ... （あなたのSupabase anon key）
Environment: ✅ Production ✅ Preview ✅ Development
```

#### ステップ3: 再デプロイ

- GitHubにプッシュすると自動的に再デプロイされます
- または、Vercel → Deployments → 最新のデプロイ → 「...」 → 「Redeploy」

---

### オプション2: vercel.jsonを削除（シンプル）

Vercelのデフォルト設定を使用する方法です。

```bash
# vercel.jsonを削除
rm vercel.json

# コミット
git add .
git commit -m "Remove vercel.json to use default settings"
git push
```

その後、オプション1のステップ2と3を実行してください。

---

## ✅ ビルド成功の確認

ビルドが成功すると：

1. Vercel → Deployments → 最新のデプロイ
2. ステータスが「Ready」になる
3. 「Visit」ボタンをクリックしてアプリが開ける

---

## 🔍 環境変数の取得方法

### Supabaseから取得

1. [Supabaseダッシュボード](https://app.supabase.com/) にログイン
2. プロジェクトを選択
3. 左サイドバーの **Settings**（⚙️アイコン）をクリック
4. **API** をクリック
5. 以下の2つをコピー：

```
Project URL:
https://xxxxxxxxxxxxx.supabase.co
↑ これをコピー

Project API keys:
anon public:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...（とても長い文字列）
↑ これをコピー
```

⚠️ **注意**: 
- `service_role` キーは**使用しないでください**（セキュリティリスク）
- `anon public` キーのみを使用してください

---

## 📊 トラブルシューティング

### エラー1: 「Export encountered errors」

**原因**: 環境変数が未設定

**解決**: オプション1を実行

---

### エラー2: ビルドは成功するが、アプリに「環境変数が設定されていません」と表示される

**原因**: Vercelで環境変数が設定されていない

**解決**:
1. Vercel → Settings → Environment Variables を確認
2. 2つの環境変数が設定されているか確認
3. 値が正しいか確認
4. 再デプロイ

---

### エラー3: 「Failed to fetch」エラー

**原因**: Supabase URLが間違っている

**解決**:
1. Supabaseダッシュボードで正しいURLを再確認
2. Vercelの環境変数を更新
3. 再デプロイ

---

## 🎯 環境変数設定の完全チェックリスト

Vercel → Settings → Environment Variables で確認：

- [ ] `NEXT_PUBLIC_SUPABASE_URL` が設定されている
- [ ] 値が `https://` で始まり `.supabase.co` で終わる
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` が設定されている
- [ ] 値が `eyJ` で始まる（約200文字以上）
- [ ] 両方の変数で「Production」「Preview」「Development」がチェックされている
- [ ] スペースや改行が入っていない

---

## 🌐 デプロイ後の動作確認

1. デプロイされたURLにアクセス
2. 環境変数が正しく設定されていれば、ログイン画面が表示される
3. 環境変数が未設定の場合、エラー画面が表示される（設定方法も表示されます）

---

## 💡 ベストプラクティス

### ローカル開発

```bash
# .env.localファイルを作成
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### Vercel

- 環境変数はVercelの管理画面で設定
- `.env.local`ファイルはGitにコミットしない（.gitignoreに含まれています）

### 本番環境

- 環境変数を定期的に確認
- Supabaseのキーが漏洩していないか確認
- RLSポリシーが正しく設定されているか確認

---

## 📖 関連ドキュメント

- [VERCEL-ENV-SETUP.md](VERCEL-ENV-SETUP.md) - 環境変数設定の詳細
- [VERCEL-DEPLOY.md](VERCEL-DEPLOY.md) - 完全なデプロイガイド
- [ENV-SETUP.md](ENV-SETUP.md) - ローカル環境の設定

---

これで、Vercelでのビルドが成功するはずです！🎉


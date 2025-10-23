# Vercel環境変数の設定（クイックガイド）

ビルドエラーが出た場合の最速解決方法！

## 🚨 エラーの原因

```
Error: Command "npm run build" exited with 1
```

このエラーは**環境変数が設定されていない**ために発生しています。

---

## ⚡ 3ステップで解決

### ステップ1: Supabaseの情報を取得

1. [Supabaseダッシュボード](https://app.supabase.com/) を開く
2. プロジェクトを選択
3. **Settings** → **API** を開く
4. 以下を**メモ帳にコピー**：
   - **Project URL** （例：`https://xxxxx.supabase.co`）
   - **anon public key** （`eyJ`で始まる長い文字列）

### ステップ2: Vercelで環境変数を設定

1. [Vercelダッシュボード](https://vercel.com/dashboard) を開く
2. デプロイしたプロジェクトをクリック
3. **Settings**タブを開く
4. 左メニューから**Environment Variables**をクリック
5. 以下の2つを追加：

#### 1つ目の環境変数

- **Name (Key)**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: Supabaseの Project URL を貼り付け
- **Environment**: Production, Preview, Development すべてチェック
- 「**Add**」をクリック

#### 2つ目の環境変数

- **Name (Key)**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: Supabaseの anon public key を貼り付け
- **Environment**: Production, Preview, Development すべてチェック
- 「**Add**」をクリック

⚠️ **重要**: 
- 変数名は**正確に**入力してください（コピー＆ペースト推奨）
- スペースや改行が入らないように注意

### ステップ3: 再デプロイ

1. Vercelダッシュボードで **Deployments** タブを開く
2. 最新のデプロイ（一番上）をクリック
3. 右上の「**...**」（3点メニュー）をクリック
4. 「**Redeploy**」を選択
5. 「**Redeploy**」ボタンをクリック

ビルドが開始されます（2-3分）

---

## ✅ 成功の確認

ビルドが成功すると：
- ✅ 「Build completed」と表示される
- ✅ 「Visit」ボタンが表示される

「Visit」をクリックしてアプリが開けば成功！

---

## 🔍 環境変数の確認

正しく設定されているか確認：

1. Vercel → プロジェクト → **Settings** → **Environment Variables**
2. 以下の2つが表示されているか確認：

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

各変数の右側に「Production」「Preview」「Development」のタグが表示されていればOK

---

## 🎯 よくある間違い

### ❌ 間違った変数名

```
SUPABASE_URL  ← 間違い
NEXT_PUBLIC_SUPABASE_URL  ← 正しい
```

### ❌ 値にスペースが入っている

```
https://xxxxx.supabase.co   ← 後ろにスペース（間違い）
https://xxxxx.supabase.co ← スペースなし（正しい）
```

### ❌ 環境が選択されていない

- 最低でも「Production」にチェックを入れる
- 推奨：すべての環境（Production, Preview, Development）にチェック

---

## 📸 スクリーンショット付きガイド

### Supabaseで値を取得

```
Settings → API
├── Project URL: https://xxxxx.supabase.co
└── anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Vercelで設定

```
Settings → Environment Variables → Add New

Name: NEXT_PUBLIC_SUPABASE_URL
Value: [SupabaseのProject URLを貼り付け]
Environment: ✅ Production ✅ Preview ✅ Development
[Add]

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: [Supabaseのanon public keyを貼り付け]
Environment: ✅ Production ✅ Preview ✅ Development
[Add]
```

---

## 🔄 まだエラーが出る場合

### 1. ログを確認

Vercel → Deployments → 最新のデプロイ → **View Function Logs**

エラーメッセージを確認してください。

### 2. 環境変数を再確認

```bash
# 正しい変数名
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY

# 値の形式
URL: https://で始まり.supabase.coで終わる
Key: eyJで始まる長い文字列（200文字以上）
```

### 3. 値を再取得

Supabaseで値を再度コピーして、Vercelで更新：

1. Vercel → Settings → Environment Variables
2. 既存の変数の右側の「**...**」→「**Edit**」
3. 値を貼り直す
4. 「**Save**」
5. 再デプロイ

---

## 💡 ヒント

- 環境変数を追加・変更した後は**必ず再デプロイ**が必要
- GitHubにプッシュするだけでは環境変数は反映されない
- 環境変数は大文字小文字を区別する
- `NEXT_PUBLIC_`プレフィックスは必須（ブラウザから使用するため）

---

完了したら、再度デプロイを試してください！🚀


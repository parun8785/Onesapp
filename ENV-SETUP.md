# 環境変数の設定ガイド

このガイドでは、`.env.local`ファイルを作成し、Supabaseの接続情報を設定する手順を説明します。

## 🚨 エラーメッセージ

以下のようなエラーが出る場合、このガイドに従ってください：
- 「環境変数が正しく設定されているか確認してください」
- 「Failed to fetch」
- 「Invalid API key」

## 📋 必要なもの

- Supabaseアカウント（無料）
- Supabaseプロジェクト

---

## ステップ1: Supabaseプロジェクトの作成・確認

### プロジェクトがまだない場合

1. **ブラウザで** [https://app.supabase.com/](https://app.supabase.com/) を開く

2. **サインアップ/ログイン**
   - GitHubアカウントでサインインが簡単です

3. **新しいプロジェクトを作成**
   - 「New Project」ボタンをクリック
   - **Organization**: 既存のものを選択、または新規作成
   - **Name**: `ones-bar` （任意の名前でOK）
   - **Database Password**: 強力なパスワードを設定（メモしておく）
   - **Region**: `Northeast Asia (Tokyo)` を選択（日本の場合）
   - **Pricing Plan**: `Free` を選択
   - 「Create new project」ボタンをクリック

4. **待機**
   - プロジェクトの作成には1-2分かかります
   - 画面に「Setting up project...」と表示されます
   - 完了するまで待ちます

### プロジェクトがある場合

1. [https://app.supabase.com/](https://app.supabase.com/) を開く
2. 使用したいプロジェクトをクリック

---

## ステップ2: APIキーの取得

プロジェクトダッシュボードで：

1. **左サイドバー**の下の方にある ⚙️ **Settings**（設定）をクリック

2. **API** メニューをクリック

3. 以下の2つの値をコピーしてメモ帳に保存：

   ### ① Project URL
   - 「Project URL」の下に表示されている
   - 形式: `https://xxxxxxxxxxxxxxxx.supabase.co`
   - 右側の📋アイコンをクリックしてコピー

   ### ② anon public key
   - 「Project API keys」セクション
   - 「anon」「public」と書かれているキー
   - `eyJ` で始まる長い文字列（約200文字以上）
   - 右側の📋アイコンをクリックしてコピー

---

## ステップ3: .env.localファイルの作成

### 方法1: Cursor/VSCodeで作成（推奨）

1. **Cursorで** プロジェクトフォルダを開く
   - `C:\Users\parun\Desktop\Ones\app` を開く

2. **新規ファイルを作成**
   - エクスプローラー（左サイドバー）で右クリック
   - 「新規ファイル」を選択
   - ファイル名: `.env.local` と入力（ドットを忘れずに！）

3. **以下の内容を貼り付け**

```env
NEXT_PUBLIC_SUPABASE_URL=ここにProject URLを貼り付け
NEXT_PUBLIC_SUPABASE_ANON_KEY=ここにanon public keyを貼り付け
```

4. **実際の値に置き換え**

   例：
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODM1NjcwMTAsImV4cCI6MTk5OTE0MzAxMH0.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

5. **ファイルを保存** (Ctrl+S)

### 方法2: PowerShellで作成

```powershell
# プロジェクトディレクトリに移動
cd C:\Users\parun\Desktop\Ones\app

# .env.localファイルを作成
New-Item -Path ".env.local" -ItemType File

# ファイルを編集
notepad .env.local
```

メモ帳が開くので、以下をコピー&ペーストして値を置き換え：

```env
NEXT_PUBLIC_SUPABASE_URL=ここにProject URLを貼り付け
NEXT_PUBLIC_SUPABASE_ANON_KEY=ここにanon public keyを貼り付け
```

---

## ステップ4: 設定の確認

### 診断スクリプトを実行

```bash
node check-env.js
```

**成功の場合**:
```
🎉 環境変数は正しく設定されています！
```

**失敗の場合**:
```
❌ 環境変数の設定に問題があります
```
→ エラーメッセージに従って修正

---

## ステップ5: 開発サーバーの再起動

環境変数を変更した場合、**必ず**開発サーバーを再起動してください：

```bash
# 現在のサーバーを停止（Ctrl+Cを押す）

# 再度起動
npm run dev
```

---

## ✅ 動作確認

1. **ブラウザで** [http://localhost:3000](http://localhost:3000) を開く

2. **ログイン/サインアップ**
   - 新規アカウントを作成
   - ログイン

3. **商品追加を試す**
   - 「在庫管理」タブ
   - 「商品を追加」ボタン
   - 商品名を入力して「追加」

✅ エラーが出なければ成功！

---

## 🔍 トラブルシューティング

### エラー: 「環境変数が正しく設定されているか確認してください」

**原因**: `.env.local`ファイルが存在しないか、値が正しくない

**確認**:
```bash
# ファイルが存在するか確認
dir .env.local

# または
ls .env.local
```

**解決**:
1. ファイルが存在しない → ステップ3を実行
2. ファイルが存在する → 診断スクリプトを実行: `node check-env.js`

### エラー: 「Failed to fetch」

**原因**: Project URLが間違っている

**解決**:
1. Supabaseダッシュボードで正しいURLを再コピー
2. `.env.local`を修正
3. 開発サーバーを再起動

### エラー: 「Invalid API key」

**原因**: anon public keyが間違っている

**解決**:
1. Supabaseダッシュボードで正しいキーを再コピー
2. キー全体がコピーされているか確認（とても長い文字列です）
3. `.env.local`を修正
4. 開発サーバーを再起動

### 環境変数が反映されない

**原因**: 開発サーバーを再起動していない

**解決**:
```bash
# サーバーを停止（ターミナルで Ctrl+C）
# 再起動
npm run dev
```

---

## 📝 .env.local ファイルの例

正しく設定された`.env.local`の例：

```env
NEXT_PUBLIC_SUPABASE_URL=https://xkzlmnopqrst.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhremxtbm9wcXJzdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzAwMTIzNDU2LCJleHAiOjIwMTU2OTk0NTZ9.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

⚠️ **注意**:
- URLは必ず `https://` で始まり `.supabase.co` で終わる
- anon keyは必ず `eyJ` で始まる
- = の前後にスペースを入れない
- 引用符（`"`や`'`）は不要

---

完了したら、アプリを使い始めることができます！🎉


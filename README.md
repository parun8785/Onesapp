# Ones - Bar Management System

バー「Ones」のための管理システムです。在庫管理、To-doリスト、共有リスト機能を備えています。

## 機能

### 1. 急ぎ買い出しリスト 🛒
- 買い出し内容の投稿
- 投稿日時・作成者の表示
- 個別削除機能（作成者のみ）
- リアルタイム更新

### 2. 在庫管理
- 商品名の登録
- **カテゴリー分け**（お酒・ソフトドリンク・フード・消耗品・その他）
- カテゴリー別のフィルタリング
- 棚卸日に個数を入力して在庫管理（小数点第1位まで対応）
- 在庫履歴の自動記録
- 商品の検索機能

### 3. To-doリスト
- やるべきことをメモ
- **全体共有用**: チーム全員に表示されるTodo
- **自分用**: 自分だけが見れるTodo
- 完了/未完了の切り替え
- フィルター機能

### 4. 共有リスト
- 誰かが共有したものを誰でも閲覧可能
- タイトル一覧表示
- 詳細表示機能
- 検索機能

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **データベース**: Supabase
- **認証**: Supabase Auth

## セットアップ

⚠️ **重要**: 詳細なセットアップ手順は [`SETUP.md`](SETUP.md) をご覧ください。

### クイックスタート

1. **依存関係のインストール**
   ```bash
   npm install
   ```

2. **Supabaseの設定**
   - [Supabase](https://supabase.com/)でプロジェクトを作成
   - `.env.local`ファイルを作成して環境変数を設定
   - `supabase-schema.sql`をSQL Editorで実行

3. **開発サーバーの起動**
   ```bash
   npm run dev
   ```

**デプロイ**:
- 🌐 Vercelにデプロイする → [VERCEL-DEPLOY.md](VERCEL-DEPLOY.md) ⭐NEW⭐

**アップデート情報**:
- 🛒 急ぎ買い出しリスト機能を追加 → [SHOPPING-LIST-UPDATE.md](SHOPPING-LIST-UPDATE.md) ⭐NEW⭐
- 🆕 カテゴリー機能を追加 → [CATEGORY-UPDATE.md](CATEGORY-UPDATE.md)

**トラブルシューティング**: 
- 🚨 「商品の追加エラー」が出る場合 → [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- 🔧 環境変数エラーが出る場合 → [ENV-SETUP.md](ENV-SETUP.md)
- ✅ 作成・追加ができない場合 → [CHECKLIST.md](CHECKLIST.md)
- 📚 セットアップで困った場合 → [SETUP.md](SETUP.md)

## プロジェクト構造

```
app/
├── layout.tsx          # ルートレイアウト
├── page.tsx           # メインページ（認証チェック）
└── globals.css        # グローバルスタイル

components/
├── AuthForm.tsx       # ログイン/サインアップフォーム
├── Dashboard.tsx      # メインダッシュボード
├── InventoryManagement.tsx  # 在庫管理
├── TodoList.tsx       # To-doリスト
└── SharedLists.tsx    # 共有リスト

lib/
└── supabase.ts        # Supabaseクライアント設定
```

## UIデザイン

黒を基調とした洗練されたUIデザイン：
- **背景色**: ダークブラック (#0a0a0a)
- **アクセントカラー**: ゴールド (#d4af37)
- **テキスト**: ホワイト/グレー

## データベーススキーマ

### users
ユーザー情報

### inventory_items
在庫商品情報

### inventory_history
在庫変更履歴

### todos
To-doリスト

### shared_lists
共有リスト

詳細は`supabase-schema.sql`を参照してください。

## 使い方

### 初回セットアップ
1. アカウントを作成
2. ログイン

### 在庫管理
1. 「在庫管理」タブを開く
2. 「商品を追加」ボタンで新しい商品を登録
3. 各商品の「棚卸」ボタンで個数を更新

### To-doリスト
1. 「To-doリスト」タブを開く
2. タスクを入力
3. 「全体共有にする」をチェックすると全員に表示されます
4. チェックボックスで完了/未完了を切り替え

### 共有リスト
1. 「共有リスト」タブを開く
2. 「リストを作成」ボタンで新しいリストを作成
3. 左側のリスト一覧から選択して詳細を表示
4. 検索バーで検索可能

## ライセンス

Private Project


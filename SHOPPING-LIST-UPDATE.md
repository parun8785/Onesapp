# 急ぎ買い出しリスト機能の追加

在庫管理の上に「急ぎ買い出しリスト」タブを追加しました！

## 🛒 新機能

### 1. 急ぎ買い出しリストタブ
- 在庫管理の上に新しいタブとして配置
- 🛒 アイコン付きで分かりやすく表示

### 2. 買い出し内容の投稿
- 買い出し内容を自由に記入
- 複数行対応（例：「ビール 2ケース、氷 1袋、レモン 5個」）
- リアルタイムで他のメンバーにも表示

### 3. 投稿情報の表示
- **投稿日時**: 日付と時刻を表示
- **作成者**: 投稿した人を表示（「あなた」または「他のメンバー」）
- 最新の投稿が上に表示

### 4. 個別削除機能
- 自分が投稿したもののみ削除可能
- 他のメンバーの投稿は削除できない
- 確認ダイアログで誤削除を防止

---

## 🚀 セットアップ手順

### ステップ1: Supabaseでマイグレーションを実行

既にデータベースが作成されている場合、以下のSQLを実行してテーブルを追加します。

1. **Supabaseダッシュボード**を開く
2. **SQL Editor** → **New query** をクリック
3. 以下のSQLをコピー＆ペースト：

```sql
-- 急ぎ買い出しリストテーブルを作成
create table if not exists public.shopping_lists (
  id uuid default uuid_generate_v4() primary key,
  content text not null,
  created_by uuid references public.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLSを有効化
alter table public.shopping_lists enable row level security;

-- ポリシーを作成
create policy "Authenticated users can view shopping lists" on public.shopping_lists
  for select using (auth.role() = 'authenticated');

create policy "Authenticated users can create shopping lists" on public.shopping_lists
  for insert with check (auth.role() = 'authenticated');

create policy "Users can delete their own shopping lists" on public.shopping_lists
  for delete using (created_by = auth.uid());

-- インデックスを作成
create index if not exists shopping_lists_created_at_idx on public.shopping_lists(created_at);
```

4. **Run** をクリック

### ステップ2: 開発サーバーを再起動

```bash
# ターミナルで Ctrl+C を押してサーバーを停止
# 再起動
npm run dev
```

### ステップ3: 動作確認

1. ブラウザで http://localhost:3000 を開く
2. ログイン
3. **「🛒 急ぎ買い出し」**タブが表示されることを確認
4. タブをクリックして機能をテスト

---

## 🎨 実装された機能

### 1. タブナビゲーション

ダッシュボードの上部に以下のタブが表示されます：
- **🛒 急ぎ買い出し** - 新機能（最上位）
- **在庫管理** - 既存機能
- **To-doリスト** - 既存機能
- **共有リスト** - 既存機能

### 2. 買い出しアイテムの表示

各アイテムには以下が表示されます：
- **買い出し内容**: 投稿された内容
- **📅 日付**: 投稿日（例：2024/01/15）
- **🕐 時刻**: 投稿時刻（例：14:30）
- **👤 作成者**: 投稿者（「あなた」または「他のメンバー」）
- **削除ボタン**: 自分の投稿のみ表示

### 3. 買い出しアイテムの追加

「+ 買い出しアイテムを追加」ボタンで：
- モーダルが開く
- テキストエリアで内容を入力
- 複数行対応（例：複数の商品を一度に記入）

### 4. 削除機能

- 自分の投稿のみ削除可能
- 削除ボタンをクリックすると確認ダイアログが表示
- 確認後、該当アイテムのみ削除

---

## 📊 データベース構造

### 新しいテーブル: `shopping_lists`

| カラム名 | 型 | 説明 |
|---------|----|----|
| `id` | uuid | 主キー（自動生成） |
| `content` | text | 買い出し内容 |
| `created_by` | uuid | 作成者のユーザーID |
| `created_at` | timestamp | 作成日時 |

### セキュリティ（RLS）

- **閲覧**: 認証済みユーザー全員
- **作成**: 認証済みユーザー全員
- **削除**: 作成者のみ

---

## 🎯 使用例

### 買い出しアイテムの追加

1. 「🛒 急ぎ買い出し」タブをクリック
2. 「+ 買い出しアイテムを追加」をクリック
3. 内容を入力：
   ```
   ビール 2ケース
   氷 1袋
   レモン 5個
   オレンジ 3個
   ```
4. 「追加」をクリック

### 買い出しアイテムの削除

1. 自分の投稿の右側にある「削除」ボタンをクリック
2. 確認ダイアログで「OK」をクリック
3. アイテムが削除される

---

## ✨ 特徴

### 1. リアルタイム更新
- 他のメンバーが追加したアイテムが即座に表示
- 削除も即座に反映

### 2. 個別管理
- 複数のアイテムを一度に投稿可能
- 1つずつ個別に削除可能

### 3. ユーザーフレンドリー
- 日時が分かりやすく表示
- 作成者が明確に表示
- 誤操作を防ぐ確認ダイアログ

### 4. レスポンシブ対応
- モバイルでも使いやすい
- タブが横スクロール対応

---

## 🔄 今後の拡張予定

- 買い出し完了のチェック機能
- カテゴリー分け（お酒、フードなど）
- 優先度設定
- 通知機能

---

## ✨ 完了！

急ぎ買い出しリスト機能が正常に動作していることを確認してください！

問題が発生した場合は、以下を確認：
1. SQLマイグレーションが正常に実行されたか
2. 開発サーバーが再起動されたか
3. ブラウザのキャッシュをクリア（Ctrl+F5）

---

## 📖 関連ドキュメント

- [VERCEL-DEPLOY.md](VERCEL-DEPLOY.md) - Vercelへのデプロイ方法
- [CATEGORY-UPDATE.md](CATEGORY-UPDATE.md) - 在庫管理のカテゴリー機能
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - トラブルシューティング


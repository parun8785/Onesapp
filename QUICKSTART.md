# 🚀 クイックスタートガイド

「環境変数エラー」が出ている場合の最速解決方法！

## ⚡ 3ステップで解決

### ステップ1: Supabaseの情報を取得 (2分)

1. [https://app.supabase.com/](https://app.supabase.com/) を開く
2. プロジェクトを選択（なければ作成）
3. **Settings** → **API** を開く
4. 以下をコピー：
   - **Project URL**
   - **anon public** key

### ステップ2: .env.localファイルを作成 (1分)

**Cursorで：**
1. プロジェクトフォルダで右クリック → 新規ファイル
2. ファイル名: `.env.local`
3. 以下を貼り付けて、値を置き換え：

```env
NEXT_PUBLIC_SUPABASE_URL=ここにProject URLを貼り付け
NEXT_PUBLIC_SUPABASE_ANON_KEY=ここにanon public keyを貼り付け
```

**PowerShellで：**
```powershell
cd C:\Users\parun\Desktop\Ones\app
New-Item -Path ".env.local" -ItemType File
notepad .env.local
```

### ステップ3: 確認と再起動 (1分)

```bash
# 環境変数を確認
npm run check-env

# 開発サーバーを再起動（Ctrl+C で停止後）
npm run dev
```

---

## ✅ 成功したら

ブラウザで http://localhost:3000 を開いて、商品追加を試してください！

---

## ❌ まだエラーが出る場合

詳細ガイドを参照：
- [ENV-SETUP.md](ENV-SETUP.md) - 環境変数の詳しい設定方法
- [CHECKLIST.md](CHECKLIST.md) - トラブルシューティング


# 今すぐデプロイ！

## 🚀 3ステップで解決

### ステップ1: コードをプッシュ（1分）

```bash
git add .
git commit -m "Fix: Vercel build error with environment variable handling"
git push
```

これで、環境変数が未設定でもビルドが通るようになりました！

---

### ステップ2: Vercelで環境変数を設定（2分）

**必ずこのステップを実行してください！**

1. [https://vercel.com/dashboard](https://vercel.com/dashboard) を開く
2. プロジェクトをクリック
3. **Settings** タブ
4. **Environment Variables** を選択
5. 以下の2つを追加：

#### 1つ目
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: [Supabaseダッシュボード → Settings → API → Project URL]
Environment: すべてチェック ✅
[Add]
```

#### 2つ目
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: [Supabaseダッシュボード → Settings → API → anon public]
Environment: すべてチェック ✅
[Add]
```

---

### ステップ3: 確認（1分）

1. Vercel → **Deployments** タブ
2. 最新のデプロイが「Ready」になるまで待つ
3. **Visit** をクリック

---

## ✅ 成功パターン

### パターンA: 環境変数を設定した場合
→ アプリが正常に動作します！

### パターンB: 環境変数を設定していない場合
→ 親切なエラー画面が表示されます（設定方法も表示）

**どちらの場合でも、ビルドは成功します！**

---

## 🎯 Supabaseの値を取得

1. [https://app.supabase.com/](https://app.supabase.com/)
2. プロジェクト選択
3. Settings → API
4. **Project URL** と **anon public** をコピー

---

## 💡 重要ポイント

- ✅ コードの修正でビルドエラーは解消されます
- ✅ アプリを動作させるには環境変数の設定が必要です
- ✅ 環境変数を設定しなくても、ビルドは成功します

---

すぐにステップ1を実行してください！🚀


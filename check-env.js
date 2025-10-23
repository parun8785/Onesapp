// 環境変数確認スクリプト
// 使い方: node check-env.js

const fs = require('fs');
const path = require('path');

console.log('=== 環境変数チェック ===\n');

// 1. .env.localファイルの存在確認
const envPath = path.join(__dirname, '.env.local');
const envExists = fs.existsSync(envPath);

console.log('✓ .env.localファイルの存在確認');
if (envExists) {
  console.log('  ✅ ファイルが存在します\n');
} else {
  console.log('  ❌ ファイルが存在しません！');
  console.log('  → .env.localファイルを作成してください\n');
  process.exit(1);
}

// 2. ファイル内容の確認
console.log('✓ 環境変数の内容確認');
const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');

let hasUrl = false;
let hasKey = false;
let urlValue = '';
let keyValue = '';

lines.forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
    hasUrl = true;
    urlValue = line.split('=')[1]?.trim() || '';
  }
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
    hasKey = true;
    keyValue = line.split('=')[1]?.trim() || '';
  }
});

// URL確認
if (hasUrl) {
  if (urlValue && urlValue !== 'your_supabase_url' && urlValue.includes('supabase.co')) {
    console.log('  ✅ NEXT_PUBLIC_SUPABASE_URL: 設定されています');
    console.log(`     値: ${urlValue.substring(0, 30)}...`);
  } else {
    console.log('  ❌ NEXT_PUBLIC_SUPABASE_URL: 値が正しくありません');
    console.log(`     現在の値: ${urlValue}`);
    console.log('  → Supabaseの Project URL を設定してください');
  }
} else {
  console.log('  ❌ NEXT_PUBLIC_SUPABASE_URL: 設定されていません');
}

// Key確認
if (hasKey) {
  if (keyValue && keyValue !== 'your_supabase_anon_key' && keyValue.startsWith('eyJ')) {
    console.log('  ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: 設定されています');
    console.log(`     値: ${keyValue.substring(0, 30)}...`);
  } else {
    console.log('  ❌ NEXT_PUBLIC_SUPABASE_ANON_KEY: 値が正しくありません');
    console.log(`     現在の値: ${keyValue.substring(0, 30)}...`);
    console.log('  → Supabaseの anon public key を設定してください');
  }
} else {
  console.log('  ❌ NEXT_PUBLIC_SUPABASE_ANON_KEY: 設定されていません');
}

console.log('\n');

// 3. 最終判定
if (hasUrl && hasKey && 
    urlValue && urlValue !== 'your_supabase_url' && urlValue.includes('supabase.co') &&
    keyValue && keyValue !== 'your_supabase_anon_key' && keyValue.startsWith('eyJ')) {
  console.log('🎉 環境変数は正しく設定されています！');
  console.log('\n次のステップ:');
  console.log('1. 開発サーバーを再起動してください（Ctrl+C → npm run dev）');
  console.log('2. ブラウザでアプリを開いてください (http://localhost:3000)');
} else {
  console.log('❌ 環境変数の設定に問題があります');
  console.log('\n修正方法:');
  console.log('1. Supabaseダッシュボード (https://app.supabase.com/) を開く');
  console.log('2. Settings → API を開く');
  console.log('3. Project URL と anon public key をコピー');
  console.log('4. .env.local ファイルに貼り付け');
  console.log('5. このスクリプトを再度実行: node check-env.js');
  process.exit(1);
}


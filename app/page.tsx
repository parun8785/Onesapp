'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import AuthForm from '@/components/AuthForm'
import Dashboard from '@/components/Dashboard'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [envError, setEnvError] = useState(false)

  useEffect(() => {
    // 環境変数のチェック
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setEnvError(true)
      setLoading(false)
      return
    }

    // セッションの確認
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    }).catch((error) => {
      console.error('認証エラー:', error)
      setLoading(false)
    })

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (envError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="card max-w-2xl">
          <h1 className="text-2xl font-bold text-accent mb-4">⚠️ 環境変数が設定されていません</h1>
          <div className="space-y-4 text-secondary">
            <p>Supabaseの環境変数が設定されていないため、アプリを起動できません。</p>
            
            <div className="bg-background-tertiary p-4 rounded">
              <p className="font-semibold text-primary mb-2">ローカル環境の場合：</p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>プロジェクトルートに <code className="bg-background px-2 py-1 rounded">.env.local</code> ファイルを作成</li>
                <li>以下の環境変数を設定：
                  <pre className="bg-background p-2 rounded mt-2 text-xs overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key`}
                  </pre>
                </li>
                <li>開発サーバーを再起動</li>
              </ol>
            </div>

            <div className="bg-background-tertiary p-4 rounded">
              <p className="font-semibold text-primary mb-2">Vercelの場合：</p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Vercelダッシュボードを開く</li>
                <li>Settings → Environment Variables</li>
                <li>上記の2つの環境変数を追加</li>
                <li>再デプロイ</li>
              </ol>
            </div>

            <p className="text-sm">
              詳細は <code className="bg-background px-2 py-1 rounded">ENV-SETUP.md</code> または{' '}
              <code className="bg-background px-2 py-1 rounded">VERCEL-ENV-SETUP.md</code> を参照してください。
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-accent text-xl">読み込み中...</div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  return <Dashboard user={user} />
}


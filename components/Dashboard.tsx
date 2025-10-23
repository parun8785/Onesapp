'use client'

import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import InventoryManagement from './InventoryManagement'
import TodoList from './TodoList'
import SharedLists from './SharedLists'

type Tab = 'inventory' | 'todos' | 'shared'

interface DashboardProps {
  user: User
}

export default function Dashboard({ user }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('inventory')

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <header className="bg-background-secondary border-b border-background-tertiary">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-accent">Ones</h1>
            <button
              onClick={handleSignOut}
              className="btn-secondary text-sm"
            >
              ログアウト
            </button>
          </div>
        </div>
      </header>

      {/* タブナビゲーション */}
      <nav className="bg-background-secondary border-b border-background-tertiary sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'inventory'
                  ? 'text-accent border-b-2 border-accent'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              在庫管理
            </button>
            <button
              onClick={() => setActiveTab('todos')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'todos'
                  ? 'text-accent border-b-2 border-accent'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              To-doリスト
            </button>
            <button
              onClick={() => setActiveTab('shared')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'shared'
                  ? 'text-accent border-b-2 border-accent'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              共有リスト
            </button>
          </div>
        </div>
      </nav>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'inventory' && <InventoryManagement user={user} />}
        {activeTab === 'todos' && <TodoList user={user} />}
        {activeTab === 'shared' && <SharedLists user={user} />}
      </main>
    </div>
  )
}


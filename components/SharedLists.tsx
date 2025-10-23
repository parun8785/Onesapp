'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface SharedList {
  id: string
  title: string
  content: string
  created_by: string
  created_at: string
}

interface SharedListsProps {
  user: User
}

export default function SharedLists({ user }: SharedListsProps) {
  const [lists, setLists] = useState<SharedList[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedList, setSelectedList] = useState<SharedList | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadLists()
  }, [])

  const loadLists = async () => {
    try {
      const { data, error } = await supabase
        .from('shared_lists')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setLists(data || [])
    } catch (error) {
      console.error('共有リストの読み込みエラー:', error)
    } finally {
      setLoading(false)
    }
  }

  const createList = async () => {
    if (!newTitle.trim() || !newContent.trim()) return

    try {
      console.log('リスト作成開始:', newTitle)
      
      const { data, error } = await supabase
        .from('shared_lists')
        .insert([
          {
            title: newTitle,
            content: newContent,
            created_by: user.id,
          },
        ])
        .select()

      if (error) {
        console.error('Supabaseエラー詳細:')
        console.error('- メッセージ:', error.message)
        console.error('- コード:', error.code)
        console.error('- 詳細:', error.details)
        console.error('- ヒント:', error.hint)
        
        let errorMsg = `エラーが発生しました\n\n`
        errorMsg += `メッセージ: ${error.message}\n`
        if (error.code) errorMsg += `コード: ${error.code}\n`
        if (error.hint) errorMsg += `ヒント: ${error.hint}\n`
        
        alert(errorMsg)
        return
      }

      console.log('リスト作成成功:', data)
      setNewTitle('')
      setNewContent('')
      setShowCreateModal(false)
      loadLists()
    } catch (error: any) {
      console.error('予期しないエラー:', error)
      alert(`予期しないエラーが発生しました: ${error?.message || JSON.stringify(error)}`)
    }
  }

  const deleteList = async (id: string) => {
    if (!confirm('このリストを削除してもよろしいですか？')) return

    try {
      const { error } = await supabase
        .from('shared_lists')
        .delete()
        .eq('id', id)

      if (error) throw error

      if (selectedList?.id === id) {
        setSelectedList(null)
      }
      loadLists()
    } catch (error) {
      console.error('リストの削除エラー:', error)
    }
  }

  const filteredLists = lists.filter((list) =>
    list.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    list.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return <div className="text-center">読み込み中...</div>
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">共有リスト</h2>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary">
          + リストを作成
        </button>
      </div>

      {/* 検索バー */}
      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="タイトルや内容で検索..."
          className="input-field w-full"
        />
      </div>

      {/* リスト表示 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* リスト一覧 */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-secondary">リスト一覧</h3>
          <div className="space-y-2">
            {filteredLists.map((list) => (
              <div
                key={list.id}
                onClick={() => setSelectedList(list)}
                className={`card cursor-pointer hover:bg-background-tertiary transition-colors ${
                  selectedList?.id === list.id ? 'border-accent border-2' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-1">{list.title}</h4>
                    <p className="text-sm text-secondary line-clamp-2">
                      {list.content}
                    </p>
                    <p className="text-xs text-secondary mt-2">
                      {new Date(list.created_at).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                  {list.created_by === user.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteList(list.id)
                      }}
                      className="text-red-500 hover:text-red-400 text-sm ml-2"
                    >
                      削除
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredLists.length === 0 && (
            <div className="text-center text-secondary py-12">
              {searchQuery ? '検索結果がありません' : '共有リストがありません'}
            </div>
          )}
        </div>

        {/* 詳細表示 */}
        <div>
          <h3 className="text-lg font-semibold text-secondary mb-3">詳細</h3>
          {selectedList ? (
            <div className="card">
              <h4 className="text-2xl font-bold mb-4">{selectedList.title}</h4>
              <div className="whitespace-pre-wrap text-primary mb-4">
                {selectedList.content}
              </div>
              <div className="text-sm text-secondary border-t border-background-tertiary pt-4">
                作成日: {new Date(selectedList.created_at).toLocaleString('ja-JP')}
              </div>
            </div>
          ) : (
            <div className="card text-center text-secondary py-12">
              リストを選択してください
            </div>
          )}
        </div>
      </div>

      {/* 作成モーダル */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">新しいリストを作成</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">タイトル</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="リストのタイトル"
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">内容</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="リストの内容を入力..."
                  className="input-field w-full"
                  rows={10}
                />
              </div>
              <div className="flex space-x-2">
                <button onClick={createList} className="btn-primary flex-1">
                  作成
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    setNewTitle('')
                    setNewContent('')
                  }}
                  className="btn-secondary flex-1"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


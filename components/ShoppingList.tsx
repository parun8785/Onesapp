'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface ShoppingItem {
  id: string
  content: string
  created_by: string
  created_at: string
}

interface ShoppingItemWithProducts {
  id: string
  content: string
  created_by: string
  created_at: string
  products: string[]
}

interface ShoppingListProps {
  user: User
}

export default function ShoppingList({ user }: ShoppingListProps) {
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [newContent, setNewContent] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState<string | null>(null)

  useEffect(() => {
    loadShoppingList()
  }, [])

  const loadShoppingList = async () => {
    try {
      const { data, error } = await supabase
        .from('shopping_lists')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error('買い出しリストの読み込みエラー:', error)
    } finally {
      setLoading(false)
    }
  }

  // 商品リストを解析して配列に変換
  const parseProducts = (content: string): string[] => {
    return content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.replace(/^[-•]\s*/, '')) // リスト記号を削除
  }

  // 商品を個別に削除
  const removeProduct = async (itemId: string, productIndex: number) => {
    const item = items.find(i => i.id === itemId)
    if (!item) return

    const products = parseProducts(item.content)
    if (productIndex < 0 || productIndex >= products.length) return

    // 該当の商品を削除
    const updatedProducts = products.filter((_, index) => index !== productIndex)
    
    if (updatedProducts.length === 0) {
      // 商品が全て削除された場合は、アイテム自体を削除
      await deleteItem(itemId)
      return
    }

    // 更新された商品リストを文字列に変換
    const updatedContent = updatedProducts.join('\n')

    try {
      const { error } = await supabase
        .from('shopping_lists')
        .update({ content: updatedContent })
        .eq('id', itemId)

      if (error) throw error
      loadShoppingList()
    } catch (error) {
      console.error('商品の削除エラー:', error)
    }
  }

  const addItem = async () => {
    if (!newContent.trim()) return

    try {
      console.log('買い出しアイテム追加開始:', newContent)
      
      const { data, error } = await supabase
        .from('shopping_lists')
        .insert([
          {
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

      console.log('買い出しアイテム追加成功:', data)
      setNewContent('')
      setShowAddModal(false)
      loadShoppingList()
    } catch (error: any) {
      console.error('予期しないエラー:', error)
      alert(`予期しないエラーが発生しました: ${error?.message || JSON.stringify(error)}`)
    }
  }

  const deleteItem = async (id: string) => {
    if (!confirm('この買い出しアイテムを削除してもよろしいですか？')) return

    try {
      const { error } = await supabase
        .from('shopping_lists')
        .delete()
        .eq('id', id)

      if (error) throw error
      loadShoppingList()
    } catch (error) {
      console.error('買い出しアイテムの削除エラー:', error)
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
      time: date.toLocaleTimeString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }
  }

  if (loading) {
    return <div className="text-center">読み込み中...</div>
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">急ぎ買い出しリスト</h2>
        <button onClick={() => setShowAddModal(true)} className="btn-primary">
          + 買い出しアイテムを追加
        </button>
      </div>

      {/* 買い出しリスト */}
      <div className="space-y-4">
        {items.map((item) => {
          const { date, time } = formatDateTime(item.created_at)
          const products = parseProducts(item.content)
          const isOwner = item.created_by === user.id
          
          return (
            <div key={item.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 text-sm text-secondary mb-3">
                    <span>📅 {date}</span>
                    <span>🕐 {time}</span>
                    <span>👤 {isOwner ? 'あなた' : '他のメンバー'}</span>
                    <span>📦 {products.length}個の商品</span>
                  </div>
                </div>
                {isOwner && (
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-red-500 hover:text-red-400 text-sm"
                  >
                    全体削除
                  </button>
                )}
              </div>
              
              {/* 商品リスト */}
              <div className="space-y-2">
                {products.map((product, index) => (
                  <div key={index} className="flex items-center justify-between bg-background-tertiary rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-accent font-medium">•</span>
                      <span className="text-primary">{product}</span>
                    </div>
                    {isOwner && (
                      <button
                        onClick={() => removeProduct(item.id, index)}
                        className="text-red-500 hover:text-red-400 text-sm px-2 py-1 rounded hover:bg-red-500/10 transition-colors"
                        title="この商品を削除"
                      >
                        削除
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {items.length === 0 && (
        <div className="text-center text-secondary py-12">
          買い出しアイテムがありません
        </div>
      )}

      {/* 買い出しアイテム追加モーダル */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">買い出しアイテムを追加</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">買い出し内容</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder={`例：
ビール 2ケース
氷 1袋
レモン 5個
オレンジ 3個`}
                  className="input-field w-full"
                  rows={6}
                  autoFocus
                />
                <p className="text-xs text-secondary mt-2">
                  💡 ヒント: 1行に1つの商品を入力してください。複数行で複数の商品を一度に追加できます。
                </p>
              </div>
            </div>
            <div className="flex space-x-2 mt-6">
              <button onClick={addItem} className="btn-primary flex-1">
                追加
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setNewContent('')
                }}
                className="btn-secondary flex-1"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

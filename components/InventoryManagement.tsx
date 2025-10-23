'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface InventoryItem {
  id: string
  name: string
  category: string
  quantity: number
  last_updated: string
}

type Category = 'お酒' | 'ソフトドリンク' | 'フード' | '消耗品' | 'その他'

const CATEGORIES: Category[] = ['お酒', 'ソフトドリンク', 'フード', '消耗品', 'その他']

interface InventoryManagementProps {
  user: User
}

export default function InventoryManagement({ user }: InventoryManagementProps) {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [newItemName, setNewItemName] = useState('')
  const [newItemCategory, setNewItemCategory] = useState<Category>('その他')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editQuantity, setEditQuantity] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all')

  useEffect(() => {
    loadInventory()
  }, [])

  const loadInventory = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('category')
        .order('name')

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error('在庫の読み込みエラー:', error)
    } finally {
      setLoading(false)
    }
  }

  const addItem = async () => {
    if (!newItemName.trim()) return

    try {
      console.log('商品追加開始:', newItemName)
      console.log('ユーザーID:', user.id)
      
      const { data, error } = await supabase
        .from('inventory_items')
        .insert([
          {
            name: newItemName,
            category: newItemCategory,
            quantity: 0,
            updated_by: user.id,
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

      console.log('商品追加成功:', data)
      setNewItemName('')
      setNewItemCategory('その他')
      setShowAddModal(false)
      loadInventory()
    } catch (error: any) {
      console.error('予期しないエラー:')
      console.error('- タイプ:', typeof error)
      console.error('- 内容:', error)
      console.error('- メッセージ:', error?.message)
      console.error('- スタック:', error?.stack)
      alert(`予期しないエラーが発生しました: ${error?.message || JSON.stringify(error)}`)
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      // 在庫数を更新
      const { error: updateError } = await supabase
        .from('inventory_items')
        .update({
          quantity,
          last_updated: new Date().toISOString(),
          updated_by: user.id,
        })
        .eq('id', itemId)

      if (updateError) throw updateError

      // 在庫履歴を追加
      const { error: historyError } = await supabase
        .from('inventory_history')
        .insert([
          {
            item_id: itemId,
            quantity,
            updated_by: user.id,
          },
        ])

      if (historyError) throw historyError

      setEditingItem(null)
      setEditQuantity('')
      loadInventory()
    } catch (error) {
      console.error('在庫更新エラー:', error)
    }
  }

  const deleteItem = async (itemId: string) => {
    if (!confirm('この商品を削除してもよろしいですか？')) return

    try {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', itemId)

      if (error) throw error
      loadInventory()
    } catch (error) {
      console.error('商品の削除エラー:', error)
    }
  }

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // カテゴリー別の商品数を計算
  const getCategoryCount = (category: Category | 'all') => {
    if (category === 'all') return items.length
    return items.filter(item => item.category === category).length
  }

  if (loading) {
    return <div className="text-center">読み込み中...</div>
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">在庫管理</h2>
        <button onClick={() => setShowAddModal(true)} className="btn-primary">
          + 商品を追加
        </button>
      </div>

      {/* カテゴリータブ */}
      <div className="card">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-accent text-black'
                : 'bg-background-tertiary text-primary hover:bg-background-tertiary/80'
            }`}
          >
            すべて ({getCategoryCount('all')})
          </button>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-accent text-black'
                  : 'bg-background-tertiary text-primary hover:bg-background-tertiary/80'
              }`}
            >
              {category} ({getCategoryCount(category)})
            </button>
          ))}
        </div>
      </div>

      {/* 検索バー */}
      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="商品名で検索..."
          className="input-field w-full"
        />
      </div>

      {/* 在庫リスト */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <div key={item.id} className="card">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
              </div>
              <button
                onClick={() => deleteItem(item.id)}
                className="text-red-500 hover:text-red-400 text-sm"
              >
                削除
              </button>
            </div>

            {editingItem === item.id ? (
              <div className="space-y-2">
                <input
                  type="number"
                  step="0.1"
                  value={editQuantity}
                  onChange={(e) => setEditQuantity(e.target.value)}
                  className="input-field w-full"
                  placeholder="個数を入力"
                  autoFocus
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => updateQuantity(item.id, parseFloat(editQuantity))}
                    className="btn-primary flex-1"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => {
                      setEditingItem(null)
                      setEditQuantity('')
                    }}
                    className="btn-secondary flex-1"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-3xl font-bold text-accent mb-2">
                  {item.quantity.toFixed(1)}
                </div>
                <div className="text-sm text-secondary mb-3">
                  最終更新: {new Date(item.last_updated).toLocaleDateString('ja-JP')}
                </div>
                <button
                  onClick={() => {
                    setEditingItem(item.id)
                    setEditQuantity(item.quantity.toString())
                  }}
                  className="btn-secondary w-full"
                >
                  棚卸
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center text-secondary py-12">
          {searchQuery ? '検索結果がありません' : '商品が登録されていません'}
        </div>
      )}

      {/* 商品追加モーダル */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">商品を追加</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">商品名</label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="例：アサヒスーパードライ"
                  className="input-field w-full"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">カテゴリー</label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => setNewItemCategory(category)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        newItemCategory === category
                          ? 'bg-accent text-black'
                          : 'bg-background-tertiary text-primary hover:bg-background-tertiary/80'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex space-x-2 mt-6">
              <button onClick={addItem} className="btn-primary flex-1">
                追加
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setNewItemName('')
                  setNewItemCategory('その他')
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


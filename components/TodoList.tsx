'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface Todo {
  id: string
  title: string
  completed: boolean
  is_shared: boolean
  created_by: string
  created_at: string
}

interface TodoListProps {
  user: User
}

export default function TodoList({ user }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [newTodoTitle, setNewTodoTitle] = useState('')
  const [isShared, setIsShared] = useState(false)
  const [filter, setFilter] = useState<'all' | 'shared' | 'personal'>('all')

  useEffect(() => {
    loadTodos()
  }, [])

  const loadTodos = async () => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setTodos(data || [])
    } catch (error) {
      console.error('Todoの読み込みエラー:', error)
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async () => {
    if (!newTodoTitle.trim()) return

    try {
      console.log('Todo追加開始:', newTodoTitle, 'is_shared:', isShared)
      
      const { data, error } = await supabase
        .from('todos')
        .insert([
          {
            title: newTodoTitle,
            is_shared: isShared,
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

      console.log('Todo追加成功:', data)
      setNewTodoTitle('')
      setIsShared(false)
      loadTodos()
    } catch (error: any) {
      console.error('予期しないエラー:', error)
      alert(`予期しないエラーが発生しました: ${error?.message || JSON.stringify(error)}`)
    }
  }

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !completed })
        .eq('id', id)

      if (error) throw error
      loadTodos()
    } catch (error) {
      console.error('Todoの更新エラー:', error)
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)

      if (error) throw error
      loadTodos()
    } catch (error) {
      console.error('Todoの削除エラー:', error)
    }
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'shared') return todo.is_shared
    if (filter === 'personal') return !todo.is_shared && todo.created_by === user.id
    return true
  })

  if (loading) {
    return <div className="text-center">読み込み中...</div>
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div>
        <h2 className="text-2xl font-bold mb-4">To-doリスト</h2>

        {/* フィルター */}
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${
              filter === 'all'
                ? 'bg-accent text-black'
                : 'bg-background-tertiary text-primary'
            }`}
          >
            すべて
          </button>
          <button
            onClick={() => setFilter('shared')}
            className={`px-4 py-2 rounded ${
              filter === 'shared'
                ? 'bg-accent text-black'
                : 'bg-background-tertiary text-primary'
            }`}
          >
            全体共有
          </button>
          <button
            onClick={() => setFilter('personal')}
            className={`px-4 py-2 rounded ${
              filter === 'personal'
                ? 'bg-accent text-black'
                : 'bg-background-tertiary text-primary'
            }`}
          >
            自分用
          </button>
        </div>
      </div>

      {/* 新規Todo追加 */}
      <div className="card">
        <div className="space-y-3">
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="新しいタスクを入力..."
            className="input-field w-full"
          />
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isShared}
                onChange={(e) => setIsShared(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">全体共有にする</span>
            </label>
            <button onClick={addTodo} className="btn-primary ml-auto">
              追加
            </button>
          </div>
        </div>
      </div>

      {/* Todoリスト */}
      <div className="space-y-2">
        {filteredTodos.map((todo) => (
          <div
            key={todo.id}
            className="card flex items-center space-x-3 hover:bg-background-tertiary transition-colors"
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id, todo.completed)}
              className="w-5 h-5 cursor-pointer"
            />
            <div className="flex-1">
              <p
                className={`${
                  todo.completed
                    ? 'line-through text-secondary'
                    : 'text-primary'
                }`}
              >
                {todo.title}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                {todo.is_shared && (
                  <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded">
                    全体共有
                  </span>
                )}
                <span className="text-xs text-secondary">
                  {new Date(todo.created_at).toLocaleDateString('ja-JP')}
                </span>
              </div>
            </div>
            {todo.created_by === user.id && (
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 hover:text-red-400 text-sm"
              >
                削除
              </button>
            )}
          </div>
        ))}
      </div>

      {filteredTodos.length === 0 && (
        <div className="text-center text-secondary py-12">
          Todoがありません
        </div>
      )}
    </div>
  )
}


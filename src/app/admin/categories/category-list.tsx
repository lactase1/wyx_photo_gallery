'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react'
import { addCategory, deleteCategory, updateCategory } from './actions'
import { cn } from '@/lib/utils'

interface Category {
  id: string
  name: string
  slug: string
  created_at: string
}

interface CategoryListProps {
  initialCategories: Category[]
}

export default function CategoryList({ initialCategories }: CategoryListProps) {
  const [categories, setCategories] = useState(initialCategories)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // 处理添加
  async function handleAdd(formData: FormData) {
    const result = await addCategory(formData)
    if (result.error) {
      setError(result.error)
    } else {
      setIsAdding(false)
      setError(null)
      // 这里的 revalidatePath 会自动更新服务器数据，但为了即时交互，
      // 我们在 Client Side 也可以刷新页面或由 Server Component 重新拉取
      window.location.reload()
    }
  }

  // 处理编辑
  async function handleUpdate(id: string, formData: FormData) {
    const result = await updateCategory(id, formData)
    if (result.error) {
      setError(result.error)
    } else {
      setEditingId(null)
      setError(null)
      window.location.reload()
    }
  }

  // 处理删除
  async function handleDelete(id: string) {
    if (!confirm('确定要删除这个分类吗？这可能会影响到该分类下的所有照片。')) return

    const result = await deleteCategory(id)
    if (result.error) {
      alert(result.error)
    } else {
      window.location.reload()
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium tracking-tight">分类管理</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-900 rounded-md hover:bg-white transition-colors text-sm"
        >
          {isAdding ? <X size={16} /> : <Plus size={16} />}
          {isAdding ? '取消' : '添加分类'}
        </button>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-400 bg-red-900/20 border border-red-900/50 rounded-md">
          {error}
        </div>
      )}

      {/* 添加表单 */}
      {isAdding && (
        <form action={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-slate-800 rounded-lg bg-slate-900/50 animate-in fade-in slide-in-from-top-4 duration-300">
          <input
            name="name"
            placeholder="分类名称 (如：风光)"
            required
            className="px-3 py-2 bg-black border border-slate-800 rounded focus:border-slate-500 focus:outline-none text-sm"
          />
          <input
            name="slug"
            placeholder="URL 标识 (如：landscapes)"
            required
            className="px-3 py-2 bg-black border border-slate-800 rounded focus:border-slate-500 focus:outline-none text-sm"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-900 rounded-md hover:bg-white transition-colors text-sm font-medium"
          >
            确认创建
          </button>
        </form>
      )}

      {/* 分类列表 */}
      <div className="grid gap-4">
        {categories.length === 0 ? (
          <div className="text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-lg">
            暂无分类，请点击右上角添加。
          </div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between p-4 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors bg-slate-900/20 group"
            >
              {editingId === cat.id ? (
                <form
                  action={(fd) => handleUpdate(cat.id, fd)}
                  className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <input
                    name="name"
                    defaultValue={cat.name}
                    required
                    className="px-3 py-1.5 bg-black border border-slate-800 rounded focus:border-slate-500 focus:outline-none text-sm"
                  />
                  <input
                    name="slug"
                    defaultValue={cat.slug}
                    required
                    className="px-3 py-1.5 bg-black border border-slate-800 rounded focus:border-slate-500 focus:outline-none text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="p-2 bg-slate-100 text-slate-900 rounded hover:bg-white transition-colors"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="p-2 border border-slate-800 text-slate-400 rounded hover:text-white transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div>
                    <h3 className="text-sm font-medium">{cat.name}</h3>
                    <p className="text-xs text-slate-500">/{cat.slug}</p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingId(cat.id)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

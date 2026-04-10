'use client'

import { useState } from 'react'
import { uploadPhoto } from './actions'
import { useRouter } from 'next/navigation'

export default function UploadPhotoPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget // 先捕获表单引用
    const formData = new FormData(form)
    
    setLoading(true)
    setMessage('')
    setError('')
    
    try {
      const result = await uploadPhoto(formData)
      if (result.success) {
        setMessage(result.message || '上传成功！')
        form.reset() // 使用捕获的引用
        router.refresh()
      } else {
        setError(result.error || '上传失败')
      }
    } catch (err: any) {
      setError(err.message || '发生未知错误')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-8">上传摄影作品 (Step 8 测试)</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 border border-zinc-800 p-6 rounded-lg">
        <div>
          <label className="block text-sm font-medium mb-2">选择照片 (JPG/PNG)</label>
          <input 
            type="file" 
            name="file" 
            accept="image/*" 
            required 
            className="w-full bg-zinc-900 border border-zinc-700 p-2 rounded text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-zinc-700 file:text-white hover:file:bg-zinc-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">照片标题</label>
          <input 
            type="text" 
            name="title" 
            placeholder="例如：阿尔卑斯的日落"
            className="w-full bg-zinc-900 border border-zinc-700 p-2 rounded text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">分类 ID (可选)</label>
          <input 
            type="text" 
            name="categoryId" 
            placeholder="粘贴分类的 UUID"
            className="w-full bg-zinc-900 border border-zinc-700 p-2 rounded text-sm focus:outline-none focus:border-blue-500"
          />
          <p className="text-xs text-zinc-500 mt-1">可在 /admin/categories 页面查看已创建的分类 ID</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">描述</label>
          <textarea 
            name="description" 
            rows={3}
            className="w-full bg-zinc-900 border border-zinc-700 p-2 rounded text-sm focus:outline-none focus:border-blue-500"
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-3 rounded font-bold transition-colors ${loading ? 'bg-zinc-700 cursor-not-allowed' : 'bg-white text-black hover:bg-zinc-200'}`}
        >
          {loading ? '处理中...' : '开始上传'}
        </button>

        {message && <p className="text-green-500 text-sm mt-4">{message}</p>}
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </form>
    </div>
  )
}

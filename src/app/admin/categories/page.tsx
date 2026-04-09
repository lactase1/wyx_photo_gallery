import { getCategories } from './actions'
import CategoryList from './category-list'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-black text-slate-100 p-8">
      <div className="max-w-4xl mx-auto mb-12">
        <Link 
          href="/admin" 
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors mb-6"
        >
          <ChevronLeft size={16} />
          返回仪表盘
        </Link>
        <h1 className="text-3xl font-light tracking-widest uppercase">CMS Admin</h1>
        <p className="text-slate-500 mt-2">管理作品分类与展示逻辑</p>
      </div>

      <CategoryList initialCategories={categories} />
    </div>
  )
}

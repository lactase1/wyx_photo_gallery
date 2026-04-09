import Link from 'next/link'
import { FolderTree, Image as ImageIcon, Settings } from 'lucide-react'

export default function AdminDashboard() {
  const menuItems = [
    {
      title: '分类管理',
      description: '新增、修改或删除摄影作品分类',
      href: '/admin/categories',
      icon: FolderTree,
    },
    {
      title: '照片管理',
      description: '上传新照片，编辑 EXIF 信息与分类 (Step 8 待开发)',
      href: '/admin/photos',
      icon: ImageIcon,
      disabled: true,
    },
  ]

  return (
    <div className="min-h-screen bg-black text-slate-100 p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <h1 className="text-3xl font-light tracking-widest uppercase">CMS Admin Dashboard</h1>
          <p className="text-slate-500 mt-2">欢迎回来，管理员。请选择要管理的内容。</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.disabled ? '#' : item.href}
              className={`block p-6 border border-slate-800 rounded-lg transition-all group ${
                item.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-slate-500 hover:bg-slate-900/50'
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg group-hover:border-slate-600 transition-colors">
                  <item.icon size={24} className="text-slate-100" />
                </div>
                <h3 className="text-lg font-medium">{item.title}</h3>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                {item.description}
              </p>
            </Link>
          ))}
        </div>

        <div className="pt-8 border-t border-slate-900 flex justify-between items-center text-xs text-slate-600 tracking-wider uppercase">
          <span>WYX Photo Gallery v0.1</span>
          <Link href="/" className="hover:text-white transition-colors">查看前台首页</Link>
        </div>
      </div>
    </div>
  )
}

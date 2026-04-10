import { createClient } from '@/lib/supabase/server'
import { Gallery } from '@/components/gallery'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  const supabase = await createClient()
  
  // 获取所有照片，按创建时间降序排列
  const { data: photos, error, count } = await supabase
    .from('photos')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Fetch photos error:', error)
  }

  return (
    <main className="min-h-screen bg-black text-zinc-100 flex flex-col">
      {/* 调试信息 (仅在开发环境或排查时显示) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-zinc-900 text-[10px] p-2 text-zinc-500 font-mono text-center">
          Debug: Found {photos?.length || 0} photos. Error: {error?.message || 'None'}. Count: {count}
        </div>
      )}

      {/* 极简页头 */}
      <header className="py-12 px-6 flex flex-col items-center text-center">
        <h1 className="text-3xl font-light tracking-[0.2em] uppercase mb-4">
          WYX Photo Gallery
        </h1>
        <div className="h-[1px] w-12 bg-zinc-800 mb-6"></div>
        <p className="text-zinc-500 text-sm max-w-md font-light leading-relaxed">
          影像之美，见于极简。
        </p>
      </header>

      {/* 画廊区域 */}
      <section className="flex-1">
        <Gallery photos={photos || []} />
      </section>

      {/* 页脚 */}
      <footer className="py-12 text-center text-zinc-600 text-xs font-light">
        &copy; {new Date().getFullYear()} WYX PHOTO. ALL RIGHTS RESERVED.
      </footer>
    </main>
  )
}

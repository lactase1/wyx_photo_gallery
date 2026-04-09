import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * 在服务端（Server Components, Server Actions, Route Handlers）中使用。
 * 此客户端可以处理用户会话（Session）并支持中间件鉴权。
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // 在服务端组件（Server Components）中，如果调用 `cookies().set()` 会报错，
            // 除非它被包装在 Server Action 或 Route Handler 中。
            // 此时可以忽略此错误，因为中间件（Middleware）会负责同步状态。
          }
        },
      },
    }
  )
}

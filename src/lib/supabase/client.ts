import { createBrowserClient } from '@supabase/ssr'

/**
 * 在客户端组件（Client Components）中使用。
 * 此客户端由于暴露在浏览器中，必须仅用于访问由 RLS 策略保护的数据。
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

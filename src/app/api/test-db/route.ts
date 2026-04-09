import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * 这是一个简单的数据库连接测试接口。
 * 访问 /api/test-db 将尝试从 Supabase 数据库中读取 'categories' 表（Step 4 已创建）。
 */
export async function GET() {
  try {
    const supabase = await createClient()

    // 简单地查询一次 'categories' 表
    const { data, error } = await supabase.from('categories').select('*').limit(1)

    if (error) {
      return NextResponse.json(
        { message: 'Database query failed', error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Successfully connected to Supabase!',
      data,
    })
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    )
  }
}

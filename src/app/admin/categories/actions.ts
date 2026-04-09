'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * 获取所有分类，按名称排序。
 */
export async function getCategories() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data
}

/**
 * 新增分类。
 */
export async function addCategory(formData: FormData) {
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string

  if (!name || !slug) {
    return { error: '名称和 Slug 是必填项' }
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('categories')
    .insert([{ name, slug }])

  if (error) {
    console.error('Error adding category:', error)
    return { error: '创建分类失败: ' + error.message }
  }

  revalidatePath('/admin/categories')
  return { success: true }
}

/**
 * 更新分类。
 */
export async function updateCategory(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string

  if (!name || !slug) {
    return { error: '名称和 Slug 是必填项' }
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('categories')
    .update({ name, slug })
    .eq('id', id)

  if (error) {
    console.error('Error updating category:', error)
    return { error: '更新分类失败: ' + error.message }
  }

  revalidatePath('/admin/categories')
  return { success: true }
}

/**
 * 删除分类。
 */
export async function deleteCategory(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting category:', error)
    return { error: '删除分类失败: ' + error.message }
  }

  revalidatePath('/admin/categories')
  return { success: true }
}

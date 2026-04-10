'use server'

import { createClient } from '@/lib/supabase/server'
import { extractExif, generateBlurPlaceholder } from '@/lib/image-processing'
import { revalidatePath } from 'next/cache'

export interface UploadPhotoResponse {
  success: boolean
  message?: string
  error?: string
}

/**
 * 上传图片 Server Action
 * 1. 验证文件
 * 2. 提取 EXIF 和 生成模糊图 (并行)
 * 3. 上传原图到 Supabase Storage
 * 4. 写入元数据到数据库
 */
export async function uploadPhoto(formData: FormData): Promise<UploadPhotoResponse> {
  try {
    const supabase = await createClient()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const categoryId = formData.get('categoryId') as string
    const description = formData.get('description') as string

    if (!file) {
      return { success: false, error: '未选择文件' }
    }

    // 将文件转换为 Buffer 以便处理
    const buffer = Buffer.from(await file.arrayBuffer())

    // 并行处理：提取 EXIF、生成模糊图、上传到存储
    // 生成唯一的文件路径
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
    const storagePath = `uploads/${fileName}`

    const [exif, blurDataUrl, uploadResult] = await Promise.all([
      // 1. 提取 EXIF
      Promise.resolve(extractExif(buffer)),
      // 2. 生成占位图
      generateBlurPlaceholder(buffer),
      // 3. 上传到 Supabase Storage (假设存储桶名为 'photos')
      supabase.storage.from('photos').upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false
      })
    ])

    if (uploadResult.error) {
      console.error('Storage Upload Error:', uploadResult.error)
      return { success: false, error: `存储上传失败: ${uploadResult.error.message}` }
    }

    // 4. 将所有元数据写入 photos 表
    const { error: dbError } = await supabase.from('photos').insert({
      title: title || file.name,
      category_id: categoryId || null,
      storage_path: storagePath,
      exif: exif as any, // 确保与 JSONB 格式兼容
      blur_data_url: blurDataUrl,
      description: description || ''
    })

    if (dbError) {
      console.error('Database Insert Error:', dbError)
      // 如果数据库记录失败，应考虑清理存储中已上传的文件 (可选)
      return { success: false, error: `数据库保存失败: ${dbError.message}` }
    }

    revalidatePath('/')
    revalidatePath('/admin/photos')
    
    return { success: true, message: '照片上传成功' }
  } catch (error: any) {
    console.error('Upload Process Error:', error)
    return { success: false, error: error.message || '未知错误' }
  }
}

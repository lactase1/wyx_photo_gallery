import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 构建 Supabase 图片 URL
 * @param path 存储路径 (例如: uploads/xxx.jpg)
 * @param options 转换选项 (暂时仅在确认服务可用时使用)
 * @returns 完整的图片 URL
 */
export function getSupabaseImageUrl(path: string, options?: { width?: number; quality?: number }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return "";

  const bucket = "photos";
  
  // 如果你需要使用 Supabase 的 Image Transformation (Pro 功能)，可以使用下面的 URL
  // 为了确保通用性，我们默认返回直接访问的 URL
  /*
  if (options && (options.width || options.quality)) {
    const params = new URLSearchParams();
    if (options.width) params.append("width", options.width.toString());
    if (options.quality) params.append("quality", (options.quality || 75).toString());
    return `${supabaseUrl}/storage/v1/render/image/public/${bucket}/${path}?${params.toString()}`;
  }
  */

  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

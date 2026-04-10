'use client'

import Image from 'next/image'
import { getSupabaseImageUrl } from '@/lib/utils'
import { useState } from 'react'

interface PhotoCardProps {
  photo: {
    id: string
    title?: string
    storage_path: string
    blur_data_url?: string
    exif?: {
      width?: number
      height?: number
      [key: string]: any
    }
  }
}

export function PhotoCard({ photo }: PhotoCardProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  
  // 核心瀑布流逻辑：使用原图宽高比来预留占位空间
  const width = photo.exif?.width || 800
  const height = photo.exif?.height || 600
  const aspectRatio = width / height

  return (
    <div className="break-inside-avoid mb-4 group cursor-pointer relative overflow-hidden rounded-lg bg-zinc-900 transition-all duration-300 hover:opacity-90 active:scale-[0.98]">
      <div 
        className="relative w-full overflow-hidden" 
        style={{ aspectRatio: `${aspectRatio}` }}
      >
        <Image
          src={getSupabaseImageUrl(photo.storage_path)}
          alt={photo.title || 'Untitled'}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`
            object-cover transition-all duration-700
            ${isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-xl'}
          `}
          onLoad={() => setIsLoaded(true)}
          placeholder={photo.blur_data_url ? 'blur' : 'empty'}
          blurDataURL={photo.blur_data_url}
        />
        
        {/* 悬浮遮罩 (仅 PC 端显示) */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <p className="text-white font-medium truncate">{photo.title || '无题'}</p>
          {photo.exif?.model && (
            <p className="text-zinc-300 text-xs mt-1">{photo.exif.model}</p>
          )}
        </div>
      </div>
    </div>
  )
}

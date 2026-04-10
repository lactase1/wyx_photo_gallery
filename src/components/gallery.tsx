'use client'

import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/captions.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'

import { Photo, PhotoCard } from './photo-card'
import { getSupabaseImageUrl } from '@/lib/utils'

interface GalleryProps {
  photos: Photo[]
}

export function Gallery({ photos }: GalleryProps) {
  const [index, setIndex] = useState(-1)

  if (!photos || photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
        <p>暂无作品，请在后台上传。</p>
      </div>
    )
  }

  // 格式化幻灯片数据
  const slides = photos.map((photo) => {
    const exif = photo.exif || {}
    
    // 构建 EXIF 描述字符串
    const exifParts = []
    if (exif.model) exifParts.push(exif.model)
    if (exif.focalLength) exifParts.push(exif.focalLength)
    if (exif.fNumber) exifParts.push(`f/${exif.fNumber}`)
    if (exif.exposureTime) exifParts.push(`${exif.exposureTime}s`)
    if (exif.iso) exifParts.push(`ISO ${exif.iso}`)
    
    const exifString = exifParts.join(' | ')

    return {
      src: getSupabaseImageUrl(photo.storage_path),
      title: photo.title || '无题',
      description: exifString || (photo.description || ''),
    }
  })

  return (
    <>
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 lg:gap-8 w-full max-w-7xl mx-auto px-6 py-12">
        {photos.map((photo, i) => (
          <PhotoCard 
            key={photo.id} 
            photo={photo} 
            onClick={() => setIndex(i)} 
          />
        ))}
      </div>

      <Lightbox
        index={index}
        slides={slides}
        open={index >= 0}
        close={() => setIndex(-1)}
        plugins={[Captions, Fullscreen, Zoom, Thumbnails]}
        captions={{
          descriptionTextAlign: 'center',
          descriptionMaxLines: 1,
        }}
        // 键盘控制（默认开启，但可以通过 controller 配置微调）
        controller={{ closeOnBackdropClick: true }}
      />
    </>
  )
}

'use client'

import { PhotoCard } from './photo-card'

interface GalleryProps {
  photos: any[]
}

export function Gallery({ photos }: GalleryProps) {
  if (!photos || photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
        <p>暂无作品，请在后台上传。</p>
      </div>
    )
  }

  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-4 w-full max-w-7xl mx-auto px-4 py-8">
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} />
      ))}
    </div>
  )
}

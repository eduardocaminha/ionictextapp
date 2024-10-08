import Image from 'next/image'

interface ImageGalleryProps {
  images: string[]
}

export function ImageGallery({ images }: ImageGalleryProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
      {images.map((src, index) => (
        <div key={index} className="relative h-40">
          <Image
            src={`/images/${src}`}
            alt={`Gallery image ${index + 1}`}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
      ))}
    </div>
  )
}
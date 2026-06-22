import Image from 'next/image'
import { getSeededMediaFallbackUrl } from '@/lib/media'

type MediaImageProps = {
  src?: string | null
  alt?: string | null
  className?: string
  sizes?: string
  priority?: boolean
}

function normalizeImageSrc(src: string) {
  try {
    const url = new URL(src)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
      ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
      : new URL('http://localhost:3000')

    if (url.origin === siteUrl.origin || url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
      return `${url.pathname}${url.search}`
    }
  } catch {
    return src
  }

  return src
}

export default function MediaImage({ src, alt, className, sizes = '100vw', priority = false }: MediaImageProps) {
  if (!src) return null
  const imageSrc = getSeededMediaFallbackUrl(src) || normalizeImageSrc(src)

  return (
    <Image
      src={imageSrc}
      alt={alt || ''}
      fill
      sizes={sizes}
      priority={priority}
      className={className || 'object-cover'}
    />
  )
}

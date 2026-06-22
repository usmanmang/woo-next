export type MediaUrl = string | null | undefined

export type MediaLike = {
  url?: MediaUrl
  alt?: string | null
}

import { getOriginalFilename, getSeededPexelsUrl } from './seeded-media'

function getFilenameFromMediaUrl(url: string) {
  const pathname = url.startsWith('http') ? new URL(url).pathname : url
  const filename = pathname.split('/').pop()

  return filename ? getOriginalFilename(filename) : undefined
}

export function getSeededMediaFallbackUrl(url: MediaUrl): string | undefined {
  const safeUrl = getSafeMediaUrl(url)
  if (!safeUrl || !safeUrl.includes('/api/media/file/')) return undefined

  try {
    const filename = getFilenameFromMediaUrl(safeUrl)

    return filename ? getSeededPexelsUrl(filename) : undefined
  } catch {
    return undefined
  }
}

export function getSafeMediaUrl(url: MediaUrl): string | undefined {
  if (typeof url !== 'string') return undefined
  const trimmed = url.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

export function getBackgroundImage(url: MediaUrl): string | undefined {
  const safeUrl = getSafeMediaUrl(url)
  return safeUrl ? `url(${safeUrl})` : undefined
}

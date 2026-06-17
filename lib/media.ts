export type MediaUrl = string | null | undefined

export type MediaLike = {
  url?: MediaUrl
  alt?: string | null
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

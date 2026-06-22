import { strict as assert } from 'node:assert'
import { test } from 'node:test'

import { getBackgroundImage, getSafeMediaUrl, getSeededMediaFallbackUrl } from './media'

test('getSafeMediaUrl returns undefined for missing values', () => {
  assert.strictEqual(getSafeMediaUrl(undefined), undefined)
  assert.strictEqual(getSafeMediaUrl(null), undefined)
})

test('getSafeMediaUrl trims and rejects blank strings', () => {
  assert.strictEqual(getSafeMediaUrl('   '), undefined)
  assert.strictEqual(getSafeMediaUrl(''), undefined)
  assert.strictEqual(getSafeMediaUrl('  https://example.com/image.jpg  '), 'https://example.com/image.jpg')
})

test('getBackgroundImage returns undefined when url is invalid', () => {
  assert.strictEqual(getBackgroundImage(undefined), undefined)
  assert.strictEqual(getBackgroundImage(''), undefined)
  assert.strictEqual(getBackgroundImage('   '), undefined)
})

test('getBackgroundImage returns a CSS background URL when valid', () => {
  assert.strictEqual(getBackgroundImage('https://example.com/a.jpg'), 'url(https://example.com/a.jpg)')
})

test('getBackgroundImage trims valid URLs before building the style value', () => {
  assert.strictEqual(
    getBackgroundImage('  https://example.com/a.jpg?size=large  '),
    'url(https://example.com/a.jpg?size=large)'
  )
})

test('getSeededMediaFallbackUrl maps seeded Payload media to Pexels', () => {
  assert.strictEqual(
    getSeededMediaFallbackUrl('https://woo-next-puce.vercel.app/api/media/file/hero-bg-1.jpg'),
    'https://images.pexels.com/photos/5998040/pexels-photo-5998040.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop'
  )
})

test('getSeededMediaFallbackUrl maps generated image sizes to the original seeded image', () => {
  assert.strictEqual(
    getSeededMediaFallbackUrl('/api/media/file/living-room-1-400x300.jpg'),
    'https://images.pexels.com/photos/5998040/pexels-photo-5998040.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop'
  )
})

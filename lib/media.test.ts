import { strict as assert } from 'node:assert'
import { test } from 'node:test'

import { getBackgroundImage, getSafeMediaUrl } from './media'

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

import { describe, it, expect } from 'vitest'
import { slugify } from '@/lib/utils/slugify'

describe('slugify', () => {
  it('keeps plain ASCII slugs unchanged', () => {
    expect(slugify('Fissler Bräter')).toBe('fissler-braeter')
    expect(slugify('WMF Gourmet Plus Topfset 5-tlg')).toBe('wmf-gourmet-plus-topfset-5-tlg')
  })

  // The bug this guards: the old implementation used `[^\w\s-]`, where `\w`
  // is `[A-Za-z0-9_]`, so umlauts were DELETED instead of transliterated and
  // the server rejected the result with an opaque 400.
  it.each([
    ['Schöpfkelle', 'schoepfkelle'],
    ['Bräter', 'braeter'],
    ['Größe', 'groesse'],
    ['Kasserolle 20 cm', 'kasserolle-20-cm'],
    ['Messer-Set (3-teilig)', 'messer-set-3-teilig'],
    ['Zwilling Pro S Kochmesser 26 cm', 'zwilling-pro-s-kochmesser-26-cm'],
  ])('transliterates %s instead of dropping characters', (input, expected) => {
    expect(slugify(input)).toBe(expected)
  })

  it('folds accented characters from other languages', () => {
    expect(slugify('Crêpe-Pfannen')).toBe('crepe-pfannen')
    expect(slugify('Café Crème')).toBe('cafe-creme')
  })

  it('always produces a server-acceptable slug', () => {
    const serverRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    const inputs = [
      'Bräter',
      'Schöpfkelle',
      '  Größe  20 cm ',
      'Messer-Set (3-teilig)',
      'Fissler Ersatzgriff-Set OPC',
      '---',
      '',
      'ÄÖÜ äöü ß',
    ]
    for (const input of inputs) {
      const slug = slugify(input)
      // Empty is allowed (the form shows "Slug ist erforderlich"); non-empty
      // must match the admin schema.
      if (slug.length > 0) {
        expect(slug, `"${input}" -> "${slug}"`).toMatch(serverRegex)
      }
    }
  })

  it('never emits leading, trailing or repeated hyphens', () => {
    expect(slugify('---Bräter---')).toBe('braeter')
    expect(slugify('a  b   c')).toBe('a-b-c')
    expect(slugify('  ')).toBe('')
  })

  it('drops symbols that have no ASCII equivalent', () => {
    expect(slugify('Tefal • Paella Pfanne')).toBe('tefal-paella-pfanne')
    expect(slugify('50% Rabatt')).toBe('50-rabatt')
  })
})

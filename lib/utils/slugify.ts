/**
 * URL slug generator shared by the admin product and blog forms.
 *
 * German product names are full of umlauts and ß ("Bräter", "Schöpfkelle",
 * "Größe"). The previous implementation used `[^\w\s-]`, where `\w` is
 * `[A-Za-z0-9_]` — so those characters were *deleted* rather than transliterated
 * ("Schöpfkelle" → "schpfkelle"), and the server rejected the result with an
 * opaque 400 because its slug regex only allows `[a-z0-9-]`.
 */

/** Transliterate common German/European special characters to ASCII. */
function foldSpecialChars(input: string): string {
  return input
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/Ä/g, 'Ae')
    .replace(/Ö/g, 'Oe')
    .replace(/Ü/g, 'Ue')
    .replace(/ß/g, 'ss')
    .replace(/ẞ/g, 'SS')
}

export function slugify(input: string): string {
  return foldSpecialChars(input)
    .normalize('NFD')
    // strip remaining combining diacritics (é, à, ñ, ç, …)
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

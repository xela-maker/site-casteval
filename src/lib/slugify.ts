/**
 * Converte texto em slug URL-friendly
 * Remove acentos, caracteres especiais e converte espaços em hífens
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // Normaliza caracteres Unicode
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .trim()
    .replace(/\s+/g, '-') // Espaços → hífens
    .replace(/-+/g, '-'); // Múltiplos hífens → único
}

/**
 * Valida se um slug contém apenas caracteres permitidos
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug);
}

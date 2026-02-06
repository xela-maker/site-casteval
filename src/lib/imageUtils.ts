/**
 * Normaliza diferentes formatos de dados de imagem para uma URL string
 * Lida com: strings, objetos {url, alt}, JSONs stringificados, paths locais
 */
export function getImageUrl(imageData: string | { url: string; alt?: string } | null | undefined): string {
  if (!imageData) return '';
  
  // Se é string
  if (typeof imageData === 'string') {
    // Se começa com http, é URL válida do Supabase
    if (imageData.startsWith('http')) {
      return imageData;
    }
    
    // Se começa com /src/assets, avisar (não funciona em produção)
    if (imageData.startsWith('/src/assets/')) {
      console.warn(`⚠️ Caminho local detectado: ${imageData}. Use URLs do Supabase Storage.`);
      return '';
    }
    
    // Tentar parsear como JSON (formato {url: "...", alt: "..."})
    try {
      const parsed = JSON.parse(imageData);
      if (parsed && typeof parsed === 'object' && 'url' in parsed) {
        return parsed.url || '';
      }
    } catch {
      // Não é JSON, retorna string direta se não for path local
      return imageData;
    }
    
    return imageData;
  }
  
  // Se é objeto com propriedade url
  if (typeof imageData === 'object' && 'url' in imageData) {
    return imageData.url || '';
  }
  
  return '';
}

/**
 * Extrai alt text de dados de imagem
 */
export function getImageAlt(imageData: string | { url: string; alt?: string } | null | undefined, fallback: string = ''): string {
  if (!imageData) return fallback;
  
  // Se é objeto com alt
  if (typeof imageData === 'object' && 'alt' in imageData) {
    return imageData.alt || fallback;
  }
  
  // Se é string JSON
  if (typeof imageData === 'string') {
    try {
      const parsed = JSON.parse(imageData);
      if (parsed && typeof parsed === 'object' && 'alt' in parsed) {
        return parsed.alt || fallback;
      }
    } catch {
      // Não é JSON
    }
  }
  
  return fallback;
}

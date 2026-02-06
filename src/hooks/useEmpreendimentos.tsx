import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Empreendimento {
  id: string;
  nome: string;
  slug: string;
  status: string;
  localizacao: string;
  endereco_cidade: string;
  endereco_bairro: string;
  endereco_uf: string;
  endereco_rua: string;
  preco_inicial: number;
  metragem_inicial: number;
  metragem_final: number;
  quartos_min: number;
  quartos_max: number;
  suites_min: number;
  previsao_entrega: string;
  hero_image: string;
  hero_video_url: string;
  card_image: string;
  logo_image: string;
  descricao: string;
  descricao_curta: string;
  slogan_subtitulo: string;
  amenidades: any;
  galeria: any;
  implantacao_imagem: string;
  mostrar_implantacao: boolean;
  mapa_google_embed: string;
  destaque: boolean;
  ordem: number;
  seo_title: string;
  seo_description: string;
  seo_keywords: string[];
}

export interface UseEmpreendimentosOptions {
  page?: number;
  pageSize?: number;
  destaque?: boolean;
}

export function useEmpreendimentos(options: UseEmpreendimentosOptions = {}) {
  const { page = 1, pageSize = 12, destaque } = options;

  return useQuery({
    queryKey: ['empreendimentos-public', page, pageSize, destaque],
    queryFn: async () => {
      let query = supabase
        .from('st_empreendimentos')
        .select('*', { count: 'exact' })
        .eq('is_active', true)
        .eq('status', 'publicado')
        .not('tags', 'cs', '{"sistema"}'); // Exclui empreendimentos do sistema

      if (destaque !== undefined) {
        query = query.eq('destaque', destaque);
      }

      query = query
        .order('ordem', { ascending: true })
        .range((page - 1) * pageSize, page * pageSize - 1);

      const { data, error, count } = await query;

      if (error) throw error;
      
      return {
        data: (data || []) as Empreendimento[],
        count: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize)
      };
    },
    staleTime: 60000, // Cache de 60s
  });
}

export function useEmpreendimento(slug: string) {
  return useQuery({
    queryKey: ['empreendimento-public', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('st_empreendimentos')
        .select(`
          *,
          casas:st_casas!left(*)
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .eq('status', 'publicado')
        .not('tags', 'cs', '{"sistema"}') // Exclui empreendimentos do sistema
        .maybeSingle();

      if (error) throw error;
      
      // Ordenar casas por preço (menor para maior)
      if (data?.casas) {
        data.casas = data.casas.sort((a: any, b: any) => {
          if (!a.preco && !b.preco) return 0;
          if (!a.preco) return 1;
          if (!b.preco) return -1;
          return Number(a.preco) - Number(b.preco);
        });
      }
      
      return data as Empreendimento & { casas: any[] };
    },
    staleTime: 60000,
  });
}

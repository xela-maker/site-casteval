import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CasaBySlugDetail {
  id: string;
  nome: string;
  slug: string;
  tipo: string;
  status: string;
  destaque: boolean;
  foto_capa: string;
  hero_image: string;
  descricao_curta: string;
  descricao_detalhada: string;
  preco: number;
  metragem: number;
  quartos: number;
  suites: number;
  banheiros: number;
  vagas: number;
  pavimentos: number;
  tem_lavabo: boolean;
  area_privativa: number | null;
  area_terreno: number | null;
  galeria: any;
  plantas: any;
  comodidades: any;
  video_url: string;
  tour_360_url: string;
  mapa_google_embed: string;
  tags: string[];
  empreendimento: {
    id: string;
    nome: string;
    slug: string;
    endereco_cidade: string | null;
    endereco_bairro: string | null;
    endereco_uf: string | null;
    endereco_rua: string | null;
    mapa_google_embed: string | null;
  };
}

export function useCasaBySlug(slug: string) {
  return useQuery({
    queryKey: ['casa-by-slug', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('st_casas')
        .select(`
          *,
          empreendimento:st_empreendimentos!inner(
            id,
            nome,
            slug,
            endereco_cidade,
            endereco_bairro,
            endereco_uf,
            endereco_rua,
            mapa_google_embed
          )
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      return data as CasaBySlugDetail | null;
    },
    staleTime: 60000,
  });
}

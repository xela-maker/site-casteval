import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface BusinessCasaWithEmpreendimento {
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
  galeria: any;
  plantas: any;
  comodidades: any;
  video_url: string;
  tour_360_url: string;
  mapa_google_embed: string;
  ordem_business: number;
  tags: string[];
  is_active: boolean;
  empreendimento: {
    id: string;
    nome: string;
    slug: string;
    endereco_cidade: string | null;
    endereco_bairro: string | null;
    endereco_uf: string | null;
  };
}

export interface UseBusinessCasasOptions {
  tipo?: string;
  cidade?: string;
  bairro?: string;
  metragemMin?: number;
  metragemMax?: number;
  quartosMin?: number;
  banheirosMin?: number;
  vagasMin?: number;
  page?: number;
  pageSize?: number;
}

export function useBusinessCasas(filters: UseBusinessCasasOptions = {}) {
  const {
    tipo,
    cidade,
    bairro,
    metragemMin,
    metragemMax,
    quartosMin,
    banheirosMin,
    vagasMin,
    page = 1,
    pageSize = 12,
  } = filters;

  return useQuery({
    queryKey: ['business-casas', filters],
    queryFn: async () => {
      let query = supabase
        .from('st_casas')
        .select(`
          *,
          empreendimento:st_empreendimentos!inner(
            id,
            nome,
            slug,
            endereco_cidade,
            endereco_bairro,
            endereco_uf
          )
        `, { count: 'exact' })
        .eq('is_active', true)
        .contains('tags', ['business']);

      // Aplicar filtros
      if (tipo) {
        query = query.eq('tipo', tipo);
      }

      if (cidade) {
        query = query.eq('empreendimento.endereco_cidade', cidade);
      }

      if (bairro) {
        query = query.eq('empreendimento.endereco_bairro', bairro);
      }

      if (metragemMin) {
        query = query.gte('metragem', metragemMin);
      }

      if (metragemMax) {
        query = query.lte('metragem', metragemMax);
      }

      if (quartosMin) {
        query = query.gte('quartos', quartosMin);
      }

      if (banheirosMin) {
        query = query.gte('banheiros', banheirosMin);
      }

      if (vagasMin) {
        query = query.gte('vagas', vagasMin);
      }

      // Paginação
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      query = query
        .order('ordem_business', { ascending: true })
        .order('created_at', { ascending: false })
        .range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      const totalPages = count ? Math.ceil(count / pageSize) : 0;

      return {
        casas: (data || []) as BusinessCasaWithEmpreendimento[],
        count: count || 0,
        page,
        pageSize,
        totalPages,
      };
    },
    staleTime: 60000,
  });
}

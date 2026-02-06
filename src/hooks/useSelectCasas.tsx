import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Casa } from './useCasa';

export interface SelectCasaWithEmpreendimento extends Casa {
  empreendimento: {
    id: string;
    nome: string;
    slug: string;
    endereco_cidade: string | null;
    endereco_bairro: string | null;
    endereco_uf: string | null;
  };
}

export interface UseSelectCasasOptions {
  tipo?: string[];
  cidade?: string;
  bairro?: string;
  metragemMin?: number;
  metragemMax?: number;
  quartos?: number[];
  banheiros?: number[];
  vagas?: number[];
  page?: number;
  pageSize?: number;
}

export function useSelectCasas(filters: UseSelectCasasOptions = {}) {
  const {
    tipo,
    cidade,
    bairro,
    metragemMin,
    metragemMax,
    quartos,
    banheiros,
    vagas,
    page = 1,
    pageSize = 12,
  } = filters;

  return useQuery({
    queryKey: ['select-casas', filters],
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
        .contains('tags', ['select']);

      // Aplicar filtros
      if (tipo && tipo.length > 0) {
        query = query.in('tipo', tipo);
      }

      if (cidade) {
        query = query.eq('empreendimento.endereco_cidade', cidade);
      }

      if (bairro) {
        query = query.eq('empreendimento.endereco_bairro', bairro);
      }

      if (metragemMin !== undefined) {
        query = query.gte('metragem', metragemMin);
      }

      if (metragemMax !== undefined) {
        query = query.lte('metragem', metragemMax);
      }

      if (quartos && quartos.length > 0) {
        query = query.in('quartos', quartos);
      }

      if (banheiros && banheiros.length > 0) {
        query = query.in('banheiros', banheiros);
      }

      if (vagas && vagas.length > 0) {
        query = query.in('vagas', vagas);
      }

      // Ordenação e paginação
      query = query
        .order('ordem_select', { ascending: true })
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        data: (data || []) as SelectCasaWithEmpreendimento[],
        count: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
      };
    },
    staleTime: 60000,
  });
}

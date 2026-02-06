import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SelectCasaWithEmpreendimento } from './useSelectCasas';

export function useSelectSimilar(casaId: string | undefined, limit: number = 3) {
  return useQuery({
    queryKey: ['select-similar', casaId, limit],
    queryFn: async () => {
      if (!casaId) return [];

      // Primeiro buscar a casa atual para pegar critérios
      const { data: currentCasa } = await supabase
        .from('st_casas')
        .select('empreendimento_id, preco, quartos, tipo')
        .eq('id', casaId)
        .single();

      if (!currentCasa) return [];

      // Buscar casas similares
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
        `)
        .eq('is_active', true)
        .contains('tags', ['select'])
        .neq('id', casaId);

      // Priorizar: mesmo empreendimento > mesma faixa de preço > mesma quantidade de quartos
      if (currentCasa.empreendimento_id) {
        query = query.eq('empreendimento_id', currentCasa.empreendimento_id);
      }

      if (currentCasa.preco) {
        const precoMin = currentCasa.preco * 0.7;
        const precoMax = currentCasa.preco * 1.3;
        query = query.gte('preco', precoMin).lte('preco', precoMax);
      }

      if (currentCasa.quartos) {
        query = query.eq('quartos', currentCasa.quartos);
      }

      query = query
        .order('ordem_select', { ascending: true })
        .limit(limit);

      const { data, error } = await query;

      if (error) throw error;
      return (data || []) as SelectCasaWithEmpreendimento[];
    },
    enabled: !!casaId,
    staleTime: 60000,
  });
}

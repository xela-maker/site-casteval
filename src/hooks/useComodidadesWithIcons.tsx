import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ComodidadeWithIcon {
  id: string;
  nome: string;
  slug: string;
  icone: string | null;
  ordem: number;
}

export function useComodidadesWithIcons(comodidadeIds: string[]) {
  return useQuery({
    queryKey: ['comodidades-with-icons', comodidadeIds],
    queryFn: async () => {
      if (!comodidadeIds || comodidadeIds.length === 0) {
        return [];
      }

      const { data, error } = await supabase
        .from('st_taxonomia_comodidades')
        .select('id, nome, slug, icone, ordem')
        .in('nome', comodidadeIds)
        .eq('is_active', true)
        .order('ordem');

      if (error) throw error;
      return (data || []) as ComodidadeWithIcon[];
    },
    staleTime: 60000,
    enabled: comodidadeIds && comodidadeIds.length > 0,
  });
}

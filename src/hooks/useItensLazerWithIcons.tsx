import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ItemLazerWithIcon {
  id: string;
  nome: string;
  slug: string;
  icone: string | null;
  ordem: number;
}

export function useItensLazerWithIcons(itemIds: string[]) {
  return useQuery({
    queryKey: ['itens-lazer-with-icons', itemIds],
    queryFn: async () => {
      if (!itemIds || itemIds.length === 0) {
        return [];
      }

      // Detecta se os valores são UUIDs (formato: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
      const isUUID = itemIds[0] && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(itemIds[0]);

      const { data, error } = await supabase
        .from('st_taxonomia_itens_lazer')
        .select('id, nome, slug, icone, ordem')
        .in(isUUID ? 'id' : 'nome', itemIds)
        .eq('is_active', true)
        .order('ordem');

      if (error) throw error;
      return (data || []) as ItemLazerWithIcon[];
    },
    staleTime: 60000,
    enabled: itemIds && itemIds.length > 0,
  });
}

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Casa } from './useCasa';

export interface SelectCasaDetail extends Casa {
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

export function useSelectCasa(slug: string) {
  return useQuery({
    queryKey: ['select-casa', slug],
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
        .contains('tags', ['select'])
        .maybeSingle();

      if (error) throw error;
      return data as SelectCasaDetail | null;
    },
    staleTime: 60000,
  });
}

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Casa {
  id: string;
  nome: string;
  slug: string;
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
  tipo: string;
  area_privativa: number | null;
  area_terreno: number | null;
  galeria: any;
  plantas: any;
  comodidades: any;
  video_url: string;
  tour_360_url: string;
  mapa_google_embed: string;
  empreendimento_id: string | null;
  tags: string[];
}

export function useCasa(empreendimentoSlug: string, casaSlug: string) {
  return useQuery({
    queryKey: ['casa-public', empreendimentoSlug, casaSlug],
    queryFn: async () => {
      // Buscar empreendimento primeiro
      const { data: emp, error: empError } = await supabase
        .from('st_empreendimentos')
        .select('id, nome, slug, endereco_cidade, endereco_bairro, endereco_uf, endereco_rua, mapa_google_embed')
        .eq('slug', empreendimentoSlug)
        .eq('is_active', true)
        .maybeSingle();

      if (empError) throw empError;
      if (!emp) return null;

      // Buscar casa
      const { data: casa, error: casaError } = await supabase
        .from('st_casas')
        .select('*')
        .eq('empreendimento_id', emp.id)
        .eq('slug', casaSlug)
        .eq('is_active', true)
        .maybeSingle();

      if (casaError) throw casaError;
      if (!casa) return null;

      return {
        casa: casa as Casa,
        empreendimento: emp,
      };
    },
    staleTime: 60000,
  });
}

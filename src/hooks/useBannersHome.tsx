import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface BannerHome {
  id: string;
  ordem: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  titulo: string;
  subtitulo: string | null;
  logo_image: string | null;
  background_image: string;
  link_destino: string;
  texto_botao: string;
  logo_alt: string | null;
}

export function useBannersHome(includeInactive = false) {
  return useQuery({
    queryKey: ['banners-home', includeInactive],
    queryFn: async () => {
      let query = supabase
        .from('st_banners_home')
        .select('*')
        .order('ordem', { ascending: true });

      if (!includeInactive) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []) as BannerHome[];
    },
  });
}

export function useBanner(id?: string) {
  return useQuery({
    queryKey: ['banner-home', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('st_banners_home')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as BannerHome;
    },
    enabled: !!id,
  });
}

export function useCreateBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<BannerHome>) => {
      const { error } = await supabase
        .from('st_banners_home')
        .insert([data as any]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners-home'] });
      toast.success('Banner criado com sucesso');
    },
    onError: (error) => {
      console.error('Erro ao criar banner:', error);
      toast.error('Erro ao criar banner');
    },
  });
}

export function useUpdateBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<BannerHome> }) => {
      const { error } = await supabase
        .from('st_banners_home')
        .update(data)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners-home'] });
      queryClient.invalidateQueries({ queryKey: ['banner-home'] });
      toast.success('Banner atualizado com sucesso');
    },
    onError: (error) => {
      console.error('Erro ao atualizar banner:', error);
      toast.error('Erro ao atualizar banner');
    },
  });
}

export function useDeleteBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('st_banners_home')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners-home'] });
      toast.success('Banner excluído com sucesso');
    },
    onError: (error) => {
      console.error('Erro ao excluir banner:', error);
      toast.error('Erro ao excluir banner');
    },
  });
}

export function useReorderBanners() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (banners: Array<{ id: string; ordem: number }>) => {
      const promises = banners.map(({ id, ordem }) =>
        supabase
          .from('st_banners_home')
          .update({ ordem })
          .eq('id', id)
      );
      
      const results = await Promise.all(promises);
      const error = results.find(r => r.error)?.error;
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners-home'] });
      toast.success('Ordem atualizada com sucesso');
    },
    onError: (error) => {
      console.error('Erro ao reordenar banners:', error);
      toast.error('Erro ao reordenar banners');
    },
  });
}

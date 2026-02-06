import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface BlogPost {
  id: string;
  titulo: string;
  slug: string;
  resumo: string;
  conteudo: string;
  categoria: string;
  tags: string[];
  imagem_destaque: string;
  imagem_card: string;
  autor_nome: string;
  autor_id: string;
  data_publicacao: string;
  is_published: boolean;
  is_destaque: boolean;
  visualizacoes: number;
  seo_title: string;
  seo_description: string;
  seo_keywords: string[];
  created_at: string;
  updated_at: string;
}

export interface UseBlogPostsOptions {
  page?: number;
  pageSize?: number;
  categoria?: string;
  is_published?: boolean;
  is_destaque?: boolean;
  search?: string;
}

export function useBlogPosts(options: UseBlogPostsOptions = {}) {
  const { page = 1, pageSize = 20, categoria, is_published, is_destaque, search } = options;

  return useQuery({
    queryKey: ['blog-posts', page, pageSize, categoria, is_published, is_destaque, search],
    queryFn: async () => {
      let query = supabase
        .from('st_blog_posts')
        .select('*', { count: 'exact' });

      if (categoria) {
        query = query.eq('categoria', categoria);
      }

      if (is_published !== undefined) {
        query = query.eq('is_published', is_published);
      }

      if (is_destaque !== undefined) {
        query = query.eq('is_destaque', is_destaque);
      }

      if (search) {
        query = query.or(`titulo.ilike.%${search}%,resumo.ilike.%${search}%,slug.ilike.%${search}%`);
      }

      query = query
        .order('data_publicacao', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        data: (data || []) as BlogPost[],
        count: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize)
      };
    },
  });
}

export function useBlogPost(id?: string) {
  return useQuery({
    queryKey: ['blog-post', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('st_blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as BlogPost;
    },
    enabled: !!id,
  });
}

export function useCreateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<BlogPost>) => {
      const { error } = await supabase
        .from('st_blog_posts')
        .insert([data as any]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast.success('Post criado com sucesso');
    },
    onError: (error) => {
      console.error('Erro ao criar post:', error);
      toast.error('Erro ao criar post');
    },
  });
}

export function useUpdateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<BlogPost> }) => {
      const { error } = await supabase
        .from('st_blog_posts')
        .update(data)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog-post'] });
      toast.success('Post atualizado com sucesso');
    },
    onError: (error) => {
      console.error('Erro ao atualizar post:', error);
      toast.error('Erro ao atualizar post');
    },
  });
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('st_blog_posts')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast.success('Post excluído com sucesso');
    },
    onError: (error) => {
      console.error('Erro ao excluir post:', error);
      toast.error('Erro ao excluir post');
    },
  });
}

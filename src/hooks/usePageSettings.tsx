import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePageSettings = (pageType: string) => {
  return useQuery({
    queryKey: ['page-settings', pageType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('st_page_settings')
        .select('*')
        .eq('page_type', pageType)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
};

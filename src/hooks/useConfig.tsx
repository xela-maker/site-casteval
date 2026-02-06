import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SiteConfig {
  // Informações da empresa
  nome_empresa?: string;
  telefone?: string;
  whatsapp?: string;
  email_contato?: string;
  
  // Endereço estruturado
  endereco_rua?: string;
  endereco_bairro?: string;
  endereco_cidade?: string;
  endereco_uf?: string;
  endereco_cep?: string;
  
  // Horários diferenciados
  horario_segunda_sexta?: string;
  horario_sabado?: string;
  
  // Redes sociais
  facebook_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  youtube_url?: string;
  twitter_url?: string;
  exibir_redes_rodape?: boolean;
  
  // SEO
  site_title_default?: string;
  site_description_default?: string;
  site_keywords_default?: string;
  google_analytics_id?: string;
  
  // WhatsApp
  whatsapp_numero?: string;
  whatsapp_mensagem_padrao?: string;
  whatsapp_msg_select?: string;
  whatsapp_msg_business?: string;
  whatsapp_msg_consulta?: string;
  exibir_botao_whatsapp?: boolean;
  
  // Newsletter e manutenção
  newsletter_ativa?: boolean;
  modo_manutencao?: boolean;
  mensagem_manutencao?: string;
  
  // Campos legados (manter compatibilidade)
  endereco?: string;
  horario_funcionamento?: string;
}

export const useConfig = () => {
  return useQuery<SiteConfig>({
    queryKey: ['site-config'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('st_config')
        .select('*');
      
      if (error) throw error;
      
      // Converter array para objeto, filtrando valores vazios
      const config: Record<string, any> = {};
      data?.forEach(item => {
        // Apenas adicionar se o valor não for null, undefined ou string vazia
        if (item.value !== null && item.value !== undefined) {
          const stringValue = String(item.value).trim();
          if (stringValue !== '' && stringValue !== '""' && stringValue !== "''") {
            config[item.key] = item.value;
          }
        }
      });
      
      return config as SiteConfig;
    },
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
  });
};

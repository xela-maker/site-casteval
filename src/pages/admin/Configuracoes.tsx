import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Building, Globe, Search, MessageCircle, Mail, AlertTriangle, Database, Code, Settings } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface ConfigData {
  nome_empresa: string;
  telefone: string;
  whatsapp: string;
  email_contato: string;
  endereco: string;
  horario_funcionamento: string;
  // Novos: Endereço estruturado
  endereco_rua: string;
  endereco_bairro: string;
  endereco_cidade: string;
  endereco_uf: string;
  endereco_cep: string;
  // Novos: Horários diferenciados
  horario_segunda_sexta: string;
  horario_sabado: string;
  // Redes sociais
  facebook_url: string;
  instagram_url: string;
  linkedin_url: string;
  youtube_url: string;
  twitter_url: string;
  exibir_redes_rodape: boolean;
  // SEO
  site_title_default: string;
  site_description_default: string;
  site_keywords_default: string;
  google_analytics_id: string;
  gtm_container_id: string;
  meta_pixel_id: string;
  custom_head_scripts: string;
  custom_body_scripts: string;
  // WhatsApp
  whatsapp_numero: string;
  whatsapp_mensagem_padrao: string;
  whatsapp_msg_select: string;
  whatsapp_msg_business: string;
  whatsapp_msg_consulta: string;
  exibir_botao_whatsapp: boolean;
  // Newsletter e manutenção
  newsletter_ativa: boolean;
  modo_manutencao: boolean;
  mensagem_manutencao: string;
}

const initialData: ConfigData = {
  nome_empresa: 'Casteval',
  telefone: '',
  whatsapp: '',
  email_contato: '',
  endereco: '',
  horario_funcionamento: '',
  endereco_rua: '',
  endereco_bairro: '',
  endereco_cidade: '',
  endereco_uf: '',
  endereco_cep: '',
  horario_segunda_sexta: '8h às 12h e 13:30h às 18h',
  horario_sabado: '8h às 13h',
  facebook_url: '',
  instagram_url: '',
  linkedin_url: '',
  youtube_url: '',
  twitter_url: '',
  exibir_redes_rodape: true,
  site_title_default: '',
  site_description_default: '',
  site_keywords_default: '',
  google_analytics_id: '',
  gtm_container_id: '',
  meta_pixel_id: '',
  custom_head_scripts: '',
  custom_body_scripts: '',
  whatsapp_numero: '',
  whatsapp_mensagem_padrao: 'Olá! Gostaria de saber mais sobre a Casteval.',
  whatsapp_msg_select: 'Olá! Tenho interesse nos empreendimentos da linha Casteval Select.',
  whatsapp_msg_business: 'Olá! Gostaria de conhecer as oportunidades de investimento da Casteval Business.',
  whatsapp_msg_consulta: 'Olá! Gostaria de agendar uma consulta com um especialista da Casteval.',
  exibir_botao_whatsapp: true,
  newsletter_ativa: false,
  modo_manutencao: false,
  mensagem_manutencao: 'Site em manutenção. Voltaremos em breve.',
};

// ✅ Componente movido para fora para evitar perda de foco
const ConfigCard = ({ title, icon: Icon, children }: any) => (
  <div
    className="p-6 rounded-lg space-y-4"
    style={{
      background: 'hsl(var(--admin-surface))',
      border: '1px solid hsl(var(--admin-line))',
    }}
  >
    <div className="flex items-center gap-2 mb-4">
      <Icon className="admin-icon-md" style={{ color: 'hsl(var(--admin-text))' }} />
      <h2 className="text-xl font-bold" style={{ color: 'hsl(var(--admin-text))' }}>
        {title}
      </h2>
    </div>
    {children}
  </div>
);

export default function Configuracoes() {
  const queryClient = useQueryClient();
  const [configs, setConfigs] = useState<ConfigData>(initialData);

  // Carregar configs
  const { data: configsData, isLoading } = useQuery({
    queryKey: ['st_config'],
    queryFn: async () => {
      const { data, error } = await supabase.from('st_config').select('*');
      if (error) throw error;
      return data;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  // Popular estado inicial quando os dados chegarem
  useEffect(() => {
    if (configsData && configsData.length > 0) {
      const configMap: any = {};
      configsData.forEach((item: any) => {
        configMap[item.key] = item.value;
      });
      setConfigs({ ...initialData, ...configMap });
    }
  }, [configsData]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const entries = Object.entries(configs);
      
      for (const [key, value] of entries) {
        const { error } = await supabase
          .from('st_config')
          .upsert({ key, value, description: '' }, { onConflict: 'key' });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success('Configurações salvas com sucesso');
    },
    onError: () => {
      toast.error('Erro ao salvar configurações');
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div style={{ color: 'hsl(var(--admin-muted))' }}>Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl pb-32">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'hsl(var(--admin-text))' }}>
            Configurações
          </h1>
          <p className="text-sm mt-1" style={{ color: 'hsl(var(--admin-muted))' }}>
            Configure informações gerais do site
          </p>
        </div>

        <button
          onClick={() => saveMutation.mutate()}
          className="admin-btn admin-btn-primary"
          disabled={saveMutation.isPending}
        >
          Salvar Todas
        </button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="empresa" className="w-full">
        <TabsList
          className="w-full justify-start gap-1 rounded-lg p-1 flex-wrap h-auto"
          style={{
            background: 'hsl(var(--admin-surface))',
            border: '1px solid hsl(var(--admin-line))',
          }}
        >
          <TabsTrigger value="empresa" className="gap-1.5 data-[state=active]:bg-white/10">
            <Building className="w-4 h-4" />
            Empresa
          </TabsTrigger>
          <TabsTrigger value="redes-seo" className="gap-1.5 data-[state=active]:bg-white/10">
            <Globe className="w-4 h-4" />
            Redes & SEO
          </TabsTrigger>
          <TabsTrigger value="tags" className="gap-1.5 data-[state=active]:bg-white/10">
            <Code className="w-4 h-4" />
            Tags & Rastreamento
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="gap-1.5 data-[state=active]:bg-white/10">
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </TabsTrigger>
          <TabsTrigger value="sistema" className="gap-1.5 data-[state=active]:bg-white/10">
            <Settings className="w-4 h-4" />
            Sistema
          </TabsTrigger>
        </TabsList>

        {/* ═══════════════════════════════════════════ */}
        {/* Tab: Empresa                               */}
        {/* ═══════════════════════════════════════════ */}
        <TabsContent value="empresa" className="space-y-6 mt-6">
          <ConfigCard title="Informações da Empresa" icon={Building}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nome da Empresa</Label>
                <Input
                  value={configs.nome_empresa}
                  onChange={(e) => setConfigs({ ...configs, nome_empresa: e.target.value })}
                />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input
                  value={configs.telefone}
                  onChange={(e) => setConfigs({ ...configs, telefone: e.target.value })}
                  placeholder="(41) 3333-3333"
                />
              </div>
              <div>
                <Label>WhatsApp</Label>
                <Input
                  value={configs.whatsapp}
                  onChange={(e) => setConfigs({ ...configs, whatsapp: e.target.value })}
                  placeholder="(41) 99999-9999"
                />
              </div>
              <div>
                <Label>Email de Contato</Label>
                <Input
                  type="email"
                  value={configs.email_contato}
                  onChange={(e) => setConfigs({ ...configs, email_contato: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Endereço (Legado - use os campos abaixo)</Label>
              <Textarea
                value={configs.endereco}
                onChange={(e) => setConfigs({ ...configs, endereco: e.target.value })}
                rows={2}
                placeholder="Mantenha por compatibilidade"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Endereço Estruturado</Label>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  value={configs.endereco_rua}
                  onChange={(e) => setConfigs({ ...configs, endereco_rua: e.target.value })}
                  placeholder="Rua e número"
                />
                <Input
                  value={configs.endereco_bairro}
                  onChange={(e) => setConfigs({ ...configs, endereco_bairro: e.target.value })}
                  placeholder="Bairro"
                />
                <Input
                  value={configs.endereco_cidade}
                  onChange={(e) => setConfigs({ ...configs, endereco_cidade: e.target.value })}
                  placeholder="Cidade"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={configs.endereco_uf}
                    onChange={(e) => setConfigs({ ...configs, endereco_uf: e.target.value })}
                    placeholder="UF"
                    maxLength={2}
                  />
                  <Input
                    value={configs.endereco_cep}
                    onChange={(e) => setConfigs({ ...configs, endereco_cep: e.target.value })}
                    placeholder="CEP"
                  />
                </div>
              </div>
              {(configs.endereco_rua || configs.endereco_bairro) && (
                <div 
                  className="mt-2 p-3 rounded text-sm"
                  style={{ background: 'hsl(var(--admin-surface-2))', color: 'hsl(var(--admin-muted))' }}
                >
                  <strong>Preview:</strong> {configs.endereco_rua} - {configs.endereco_bairro}, {configs.endereco_cidade} - {configs.endereco_uf}, {configs.endereco_cep}
                </div>
              )}
            </div>

            <div>
              <Label>Horário de Funcionamento (Legado - use os campos abaixo)</Label>
              <Input
                value={configs.horario_funcionamento}
                onChange={(e) => setConfigs({ ...configs, horario_funcionamento: e.target.value })}
                placeholder="Mantenha por compatibilidade"
              />
            </div>

            <div className="space-y-2">
              <Label>Horários Diferenciados</Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Segunda à Sexta</Label>
                  <Input
                    value={configs.horario_segunda_sexta}
                    onChange={(e) => setConfigs({ ...configs, horario_segunda_sexta: e.target.value })}
                    placeholder="8h às 12h e 13:30h às 18h"
                  />
                </div>
                <div>
                  <Label className="text-xs">Sábado</Label>
                  <Input
                    value={configs.horario_sabado}
                    onChange={(e) => setConfigs({ ...configs, horario_sabado: e.target.value })}
                    placeholder="8h às 13h"
                  />
                </div>
              </div>
            </div>
          </ConfigCard>
        </TabsContent>

        {/* ═══════════════════════════════════════════ */}
        {/* Tab: Redes & SEO                           */}
        {/* ═══════════════════════════════════════════ */}
        <TabsContent value="redes-seo" className="space-y-6 mt-6">
          <ConfigCard title="Redes Sociais" icon={Globe}>
            <div className="space-y-3">
              <div>
                <Label>Facebook</Label>
                <Input
                  value={configs.facebook_url}
                  onChange={(e) => setConfigs({ ...configs, facebook_url: e.target.value })}
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div>
                <Label>Instagram</Label>
                <Input
                  value={configs.instagram_url}
                  onChange={(e) => setConfigs({ ...configs, instagram_url: e.target.value })}
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div>
                <Label>LinkedIn</Label>
                <Input
                  value={configs.linkedin_url}
                  onChange={(e) => setConfigs({ ...configs, linkedin_url: e.target.value })}
                  placeholder="https://linkedin.com/..."
                />
              </div>
              <div>
                <Label>YouTube</Label>
                <Input
                  value={configs.youtube_url}
                  onChange={(e) => setConfigs({ ...configs, youtube_url: e.target.value })}
                  placeholder="https://youtube.com/..."
                />
              </div>
              <div>
                <Label>Twitter</Label>
                <Input
                  value={configs.twitter_url}
                  onChange={(e) => setConfigs({ ...configs, twitter_url: e.target.value })}
                  placeholder="https://twitter.com/..."
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                <Label>Exibir redes sociais no rodapé</Label>
                <Switch
                  checked={configs.exibir_redes_rodape}
                  onCheckedChange={(v) => setConfigs({ ...configs, exibir_redes_rodape: v })}
                />
              </div>
            </div>
          </ConfigCard>

          <ConfigCard title="SEO Global" icon={Search}>
            <div className="space-y-3">
              <div>
                <Label>Título Padrão do Site</Label>
                <Input
                  value={configs.site_title_default}
                  onChange={(e) => setConfigs({ ...configs, site_title_default: e.target.value })}
                  placeholder="Casteval - Empreendimentos de Alto Padrão"
                />
              </div>
              <div>
                <Label>Descrição Padrão</Label>
                <Textarea
                  value={configs.site_description_default}
                  onChange={(e) => setConfigs({ ...configs, site_description_default: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label>Keywords Padrão</Label>
                <Input
                  value={configs.site_keywords_default}
                  onChange={(e) => setConfigs({ ...configs, site_keywords_default: e.target.value })}
                  placeholder="Separe por vírgula"
                />
              </div>
            </div>
          </ConfigCard>
        </TabsContent>

        {/* ═══════════════════════════════════════════ */}
        {/* Tab: Tags & Rastreamento                   */}
        {/* ═══════════════════════════════════════════ */}
        <TabsContent value="tags" className="space-y-6 mt-6">
          <ConfigCard title="Tags & Rastreamento" icon={Code}>
            <div
              className="p-3 rounded text-sm mb-2"
              style={{ background: 'hsl(var(--admin-surface-2))', color: 'hsl(var(--admin-muted))' }}
            >
              Cole os IDs das suas ferramentas de rastreamento. Os scripts serão injetados automaticamente em todas as páginas do site.
            </div>
            <div className="space-y-3">
              <div>
                <Label>Google Analytics ID</Label>
                <Input
                  value={configs.google_analytics_id}
                  onChange={(e) => setConfigs({ ...configs, google_analytics_id: e.target.value })}
                  placeholder="G-XXXXXXXXXX"
                />
                <p className="text-xs mt-1" style={{ color: 'hsl(var(--admin-muted))' }}>
                  Encontre em: Google Analytics → Admin → Data Streams → Measurement ID
                </p>
              </div>
              <div>
                <Label>Google Tag Manager (GTM) Container ID</Label>
                <Input
                  value={configs.gtm_container_id}
                  onChange={(e) => setConfigs({ ...configs, gtm_container_id: e.target.value })}
                  placeholder="GTM-XXXXXXX"
                />
                <p className="text-xs mt-1" style={{ color: 'hsl(var(--admin-muted))' }}>
                  Encontre em: tagmanager.google.com → seu container → ID no topo da página
                </p>
              </div>
              <div>
                <Label>Meta Pixel ID (Facebook / Instagram)</Label>
                <Input
                  value={configs.meta_pixel_id}
                  onChange={(e) => setConfigs({ ...configs, meta_pixel_id: e.target.value })}
                  placeholder="123456789012345"
                />
                <p className="text-xs mt-1" style={{ color: 'hsl(var(--admin-muted))' }}>
                  Encontre em: Meta Business Suite → Eventos → Fontes de dados → Pixel ID
                </p>
              </div>
            </div>
          </ConfigCard>

          <ConfigCard title="Scripts Personalizados" icon={Code}>
            <div
              className="p-3 rounded text-sm mb-2"
              style={{ background: 'hsl(var(--admin-surface-2))', color: 'hsl(var(--admin-muted))' }}
            >
              Cole qualquer código HTML, script ou tag que precise ser inserido no site. Ideal para ferramentas de chat, remarketing, verificação de domínio, etc.
            </div>
            <div className="space-y-4">
              <div>
                <Label>Scripts no Header (dentro do &lt;head&gt;)</Label>
                <Textarea
                  value={configs.custom_head_scripts}
                  onChange={(e) => setConfigs({ ...configs, custom_head_scripts: e.target.value })}
                  rows={6}
                  placeholder={'<!-- Cole aqui tags que devem ir no <head> -->\n<script>...</script>\n<meta name="verification" content="..." />'}
                  className="font-mono text-xs"
                />
                <p className="text-xs mt-1" style={{ color: 'hsl(var(--admin-muted))' }}>
                  Ideal para: meta tags de verificação, scripts de chat, CSS customizado, etc.
                </p>
              </div>
              <div>
                <Label>Scripts no Footer (antes do &lt;/body&gt;)</Label>
                <Textarea
                  value={configs.custom_body_scripts}
                  onChange={(e) => setConfigs({ ...configs, custom_body_scripts: e.target.value })}
                  rows={6}
                  placeholder={'<!-- Cole aqui tags que devem ir antes do </body> -->\n<script src="..."></script>'}
                  className="font-mono text-xs"
                />
                <p className="text-xs mt-1" style={{ color: 'hsl(var(--admin-muted))' }}>
                  Ideal para: widgets, scripts de remarketing, chatbots, etc.
                </p>
              </div>
            </div>
          </ConfigCard>
        </TabsContent>

        {/* ═══════════════════════════════════════════ */}
        {/* Tab: WhatsApp                              */}
        {/* ═══════════════════════════════════════════ */}
        <TabsContent value="whatsapp" className="space-y-6 mt-6">
          <ConfigCard title="WhatsApp" icon={MessageCircle}>
            <div className="space-y-3">
              <div>
                <Label>Número WhatsApp</Label>
                <Input
                  value={configs.whatsapp_numero}
                  onChange={(e) => setConfigs({ ...configs, whatsapp_numero: e.target.value })}
                  placeholder="5541999999999"
                />
                <p className="text-xs mt-1" style={{ color: 'hsl(var(--admin-muted))' }}>
                  Formato internacional sem pontuação: 55 + DDD + número
                </p>
              </div>
              <div>
                <Label>Mensagem Padrão (Geral)</Label>
                <Textarea
                  value={configs.whatsapp_mensagem_padrao}
                  onChange={(e) => setConfigs({ ...configs, whatsapp_mensagem_padrao: e.target.value })}
                  rows={2}
                  placeholder="Mensagem padrão para todos os contextos"
                />
              </div>
              <div>
                <Label>Mensagem Select</Label>
                <Textarea
                  value={configs.whatsapp_msg_select}
                  onChange={(e) => setConfigs({ ...configs, whatsapp_msg_select: e.target.value })}
                  rows={2}
                  placeholder="Mensagem específica para Select"
                />
              </div>
              <div>
                <Label>Mensagem Business</Label>
                <Textarea
                  value={configs.whatsapp_msg_business}
                  onChange={(e) => setConfigs({ ...configs, whatsapp_msg_business: e.target.value })}
                  rows={2}
                  placeholder="Mensagem específica para Business"
                />
              </div>
              <div>
                <Label>Mensagem Consulta</Label>
                <Textarea
                  value={configs.whatsapp_msg_consulta}
                  onChange={(e) => setConfigs({ ...configs, whatsapp_msg_consulta: e.target.value })}
                  rows={2}
                  placeholder="Mensagem para agendar consulta"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Exibir botão flutuante</Label>
                <Switch
                  checked={configs.exibir_botao_whatsapp}
                  onCheckedChange={(v) => setConfigs({ ...configs, exibir_botao_whatsapp: v })}
                />
              </div>
            </div>
          </ConfigCard>
        </TabsContent>

        {/* ═══════════════════════════════════════════ */}
        {/* Tab: Sistema                               */}
        {/* ═══════════════════════════════════════════ */}
        <TabsContent value="sistema" className="space-y-6 mt-6">
          <ConfigCard title="Newsletter" icon={Mail}>
            <div className="flex items-center justify-between">
              <div>
                <Label>Ativar Newsletter</Label>
                <p className="text-xs" style={{ color: 'hsl(var(--admin-muted))' }}>
                  Formulário de inscrição na home
                </p>
              </div>
              <Switch
                checked={configs.newsletter_ativa}
                onCheckedChange={(v) => setConfigs({ ...configs, newsletter_ativa: v })}
              />
            </div>
          </ConfigCard>

          <ConfigCard title="Manutenção" icon={AlertTriangle}>
            <div className="space-y-3">
              <div
                className="p-3 rounded"
                style={{ background: 'hsl(var(--admin-surface-2))' }}
              >
                <p className="text-sm" style={{ color: 'hsl(var(--admin-warning))' }}>
                  ⚠️ Ativar modo manutenção tornará o site indisponível para visitantes
                </p>
              </div>
              <div className="flex items-center justify-between">
                <Label>Modo Manutenção</Label>
                <Switch
                  checked={configs.modo_manutencao}
                  onCheckedChange={(v) => setConfigs({ ...configs, modo_manutencao: v })}
                />
              </div>
              <div>
                <Label>Mensagem de Manutenção</Label>
                <Textarea
                  value={configs.mensagem_manutencao}
                  onChange={(e) => setConfigs({ ...configs, mensagem_manutencao: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          </ConfigCard>
        </TabsContent>
      </Tabs>

      {/* Botão flutuante */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 border-t"
        style={{
          background: 'hsl(var(--admin-surface))',
          borderColor: 'hsl(var(--admin-line))',
          boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="admin-container py-4 flex items-center justify-end max-w-5xl">
          <button
            onClick={() => saveMutation.mutate()}
            className="admin-btn admin-btn-primary"
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? 'Salvando...' : 'Salvar Todas as Configurações'}
          </button>
        </div>
      </div>
    </div>
  );
}

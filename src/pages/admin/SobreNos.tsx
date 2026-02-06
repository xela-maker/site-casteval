import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FormBase } from '@/components/admin/FormBase';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { toast } from 'sonner';

interface SobreNosData {
  // Hero
  hero_titulo: string;
  hero_subtitulo: string;
  hero_descricao: string;
  hero_imagem: string;

  // História
  historia_titulo: string;
  historia_conteudo: string;
  historia_imagem1: string;
  historia_imagem2: string;
  ano_fundacao: number;

  // Missão, Visão, Valores
  missao: string;
  visao: string;
  valores: string[];

  // Números
  anos_mercado: number;
  empreendimentos_entregues: number;
  familias_atendidas: number;
  m2_construidos: number;
}

const initialData: SobreNosData = {
  hero_titulo: 'Sobre a Casteval',
  hero_subtitulo: '',
  hero_descricao: '',
  hero_imagem: '',
  historia_titulo: 'Nossa História',
  historia_conteudo: '',
  historia_imagem1: '',
  historia_imagem2: '',
  ano_fundacao: 2000,
  missao: '',
  visao: '',
  valores: [],
  anos_mercado: 0,
  empreendimentos_entregues: 0,
  familias_atendidas: 0,
  m2_construidos: 0,
};

export default function SobreNos() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<SobreNosData>(initialData);
  const [valoresInput, setValoresInput] = useState('');

  // Carregar configurações
  const { data: pageSettings, isLoading } = useQuery({
    queryKey: ['page-settings', 'sobre-nos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('st_page_settings')
        .select('*')
        .eq('page_type', 'sobre-nos')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        const sections = (data.sections as any) || {};
        setFormData({
          hero_titulo: data.hero_title || 'Sobre a Casteval',
          hero_subtitulo: data.hero_subtitle || '',
          hero_descricao: data.hero_description || '',
          hero_imagem: data.hero_image || '',
          historia_titulo: sections.historia?.titulo || 'Nossa História',
          historia_conteudo: sections.historia?.conteudo || '',
          historia_imagem1: sections.historia?.imagem1 || '',
          historia_imagem2: sections.historia?.imagem2 || '',
          ano_fundacao: sections.historia?.ano_fundacao || 2000,
          missao: sections.mvv?.missao || '',
          visao: sections.mvv?.visao || '',
          valores: Array.isArray(sections.mvv?.valores) ? sections.mvv.valores : [],
          anos_mercado: sections.numeros?.anos_mercado || 0,
          empreendimentos_entregues: sections.numeros?.empreendimentos_entregues || 0,
          familias_atendidas: sections.numeros?.familias_atendidas || 0,
          m2_construidos: sections.numeros?.m2_construidos || 0,
        });
        setValoresInput(
          Array.isArray(sections.mvv?.valores) ? sections.mvv.valores.join(', ') : ''
        );
      }

      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (status: 'rascunho' | 'publicado') => {
      const payload = {
        page_type: 'sobre-nos',
        hero_title: formData.hero_titulo,
        hero_subtitle: formData.hero_subtitulo,
        hero_description: formData.hero_descricao,
        hero_image: formData.hero_imagem,
        is_active: status === 'publicado',
        sections: {
          historia: {
            titulo: formData.historia_titulo,
            conteudo: formData.historia_conteudo,
            imagem1: formData.historia_imagem1,
            imagem2: formData.historia_imagem2,
            ano_fundacao: formData.ano_fundacao,
          },
          mvv: {
            missao: formData.missao,
            visao: formData.visao,
            valores: formData.valores,
          },
          numeros: {
            anos_mercado: formData.anos_mercado,
            empreendimentos_entregues: formData.empreendimentos_entregues,
            familias_atendidas: formData.familias_atendidas,
            m2_construidos: formData.m2_construidos,
          },
        },
      };

      if (pageSettings?.id) {
        const { error } = await supabase
          .from('st_page_settings')
          .update(payload)
          .eq('id', pageSettings.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('st_page_settings').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-settings', 'sobre-nos'] });
      toast.success('Salvo com sucesso');
    },
    onError: () => {
      toast.error('Erro ao salvar');
    },
  });

  const updateField = (field: keyof SobreNosData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleValoresChange = (value: string) => {
    setValoresInput(value);
    const valores = value.split(',').map((v) => v.trim()).filter(Boolean);
    updateField('valores', valores);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div style={{ color: 'hsl(var(--admin-muted))' }}>Carregando...</div>
      </div>
    );
  }

  const tabs = [
    {
      value: 'hero',
      label: 'Hero',
      content: (
        <div className="space-y-4 max-w-3xl">
          <div>
            <Label>Título</Label>
            <Input
              value={formData.hero_titulo}
              onChange={(e) => updateField('hero_titulo', e.target.value)}
              placeholder="Sobre a Casteval"
            />
          </div>

          <div>
            <Label>Subtítulo</Label>
            <Input
              value={formData.hero_subtitulo}
              onChange={(e) => updateField('hero_subtitulo', e.target.value)}
              placeholder="Construindo sonhos desde..."
            />
          </div>

          <div>
            <Label>Descrição</Label>
            <Textarea
              value={formData.hero_descricao}
              onChange={(e) => updateField('hero_descricao', e.target.value)}
              placeholder="Breve descrição sobre a empresa"
              rows={4}
            />
          </div>

          <ImageUploader
            label="Imagem Hero"
            value={formData.hero_imagem}
            onChange={(v) => {
              const url = typeof v === 'string' ? v : (v as any)?.url || '';
              updateField('hero_imagem', url);
            }}
            aspectRatio="16:9"
          />
        </div>
      ),
    },
    {
      value: 'historia',
      label: 'História',
      content: (
        <div className="space-y-4 max-w-3xl">
          <div>
            <Label>Título da Seção</Label>
            <Input
              value={formData.historia_titulo}
              onChange={(e) => updateField('historia_titulo', e.target.value)}
              placeholder="Nossa História"
            />
          </div>

          <RichTextEditor
            label="Conteúdo"
            value={formData.historia_conteudo}
            onChange={(v) => updateField('historia_conteudo', v)}
            placeholder="Conte a história da Casteval..."
            minHeight={300}
          />

          <div>
            <Label>Ano de Fundação</Label>
            <Input
              type="number"
              value={formData.ano_fundacao}
              onChange={(e) => updateField('ano_fundacao', parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ImageUploader
              label="Imagem 1"
              value={formData.historia_imagem1}
              onChange={(v) => {
                const url = typeof v === 'string' ? v : (v as any)?.url || '';
                updateField('historia_imagem1', url);
              }}
            />

            <ImageUploader
              label="Imagem 2"
              value={formData.historia_imagem2}
              onChange={(v) => {
                const url = typeof v === 'string' ? v : (v as any)?.url || '';
                updateField('historia_imagem2', url);
              }}
            />
          </div>
        </div>
      ),
    },
    {
      value: 'mvv',
      label: 'Missão, Visão e Valores',
      content: (
        <div className="space-y-4 max-w-3xl">
          <div>
            <Label>Missão</Label>
            <Textarea
              value={formData.missao}
              onChange={(e) => updateField('missao', e.target.value)}
              placeholder="Nossa missão é..."
              rows={3}
            />
          </div>

          <div>
            <Label>Visão</Label>
            <Textarea
              value={formData.visao}
              onChange={(e) => updateField('visao', e.target.value)}
              placeholder="Nossa visão é..."
              rows={3}
            />
          </div>

          <div>
            <Label>Valores</Label>
            <Input
              value={valoresInput}
              onChange={(e) => handleValoresChange(e.target.value)}
              placeholder="Separe os valores por vírgula"
            />
            <p className="text-xs mt-1" style={{ color: 'hsl(var(--admin-muted))' }}>
              Ex: Qualidade, Transparência, Inovação, Compromisso
            </p>
            {formData.valores.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.valores.map((valor) => (
                  <span key={valor} className="admin-badge admin-badge-secondary">
                    {valor}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      value: 'numeros',
      label: 'Números',
      content: (
        <div className="space-y-4 max-w-3xl">
          <p className="text-sm" style={{ color: 'hsl(var(--admin-muted))' }}>
            Estes números aparecerão com animações de contador na página
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Anos no Mercado</Label>
              <Input
                type="number"
                value={formData.anos_mercado}
                onChange={(e) =>
                  updateField('anos_mercado', parseInt(e.target.value) || 0)
                }
              />
            </div>

            <div>
              <Label>Empreendimentos Entregues</Label>
              <Input
                type="number"
                value={formData.empreendimentos_entregues}
                onChange={(e) =>
                  updateField('empreendimentos_entregues', parseInt(e.target.value) || 0)
                }
              />
            </div>

            <div>
              <Label>Famílias Atendidas</Label>
              <Input
                type="number"
                value={formData.familias_atendidas}
                onChange={(e) =>
                  updateField('familias_atendidas', parseInt(e.target.value) || 0)
                }
              />
            </div>

            <div>
              <Label>M² Construídos</Label>
              <Input
                type="number"
                value={formData.m2_construidos}
                onChange={(e) =>
                  updateField('m2_construidos', parseInt(e.target.value) || 0)
                }
              />
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-32">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'hsl(var(--admin-text))' }}>
            Sobre Nós
          </h1>
          <p className="text-sm mt-1" style={{ color: 'hsl(var(--admin-muted))' }}>
            Gerencie o conteúdo da página Sobre Nós
          </p>
        </div>
      </div>

      <FormBase
        tabs={tabs}
        onSaveDraft={() => saveMutation.mutate('rascunho')}
        onPublish={() => saveMutation.mutate('publicado')}
        onPreview={() => window.open('/sobre-nos', '_blank')}
        isLoading={saveMutation.isPending}
        showPreview
      />
    </div>
  );
}

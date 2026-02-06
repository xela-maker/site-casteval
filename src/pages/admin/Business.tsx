import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, GripVertical, Eye, Edit } from 'lucide-react';
import { TableBase } from '@/components/admin/TableBase';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { toast } from 'sonner';

export default function Business() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [heroData, setHeroData] = useState({
    titulo: 'Casteval Business',
    subtitulo: '',
    imagem: '',
  });

  // Carregar configurações da página Business
  const { data: pageSettings } = useQuery({
    queryKey: ['page-settings', 'business'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('st_page_settings')
        .select('*')
        .eq('page_type', 'business')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setHeroData({
          titulo: data.hero_title || 'Casteval Business',
          subtitulo: data.hero_subtitle || '',
          imagem: data.hero_image || '',
        });
      }

      return data;
    },
  });

  // Carregar casas Business
  const { data: casas, isLoading } = useQuery({
    queryKey: ['casas-business'],
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
            endereco_uf
          )
        `)
        .eq('is_active', true)
        .contains('tags', ['business'])
        .order('ordem_business', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  const saveHeroMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        page_type: 'business',
        hero_title: heroData.titulo,
        hero_subtitle: heroData.subtitulo,
        hero_image: heroData.imagem,
        is_active: true,
      };

      if (pageSettings?.id) {
        const { error } = await supabase
          .from('st_page_settings')
          .update(payload)
          .eq('id', pageSettings.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('st_page_settings')
          .insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-settings', 'business'] });
      toast.success('Hero atualizado com sucesso');
    },
    onError: () => {
      toast.error('Erro ao salvar hero');
    },
  });

  const toggleBusinessMutation = useMutation({
    mutationFn: async ({ id, isBusiness }: { id: string; isBusiness: boolean }) => {
      const { data: casa } = await supabase
        .from('st_casas')
        .select('tags')
        .eq('id', id)
        .single();

      let newTags = Array.isArray(casa?.tags) ? [...casa.tags] : [];

      if (isBusiness) {
        if (!newTags.includes('business')) {
          newTags.push('business');
        }
      } else {
        newTags = newTags.filter((t) => t !== 'business');
      }

      const { error } = await supabase
        .from('st_casas')
        .update({ tags: newTags })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['casas-business'] });
      toast.success('Atualizado com sucesso');
    },
    onError: () => {
      toast.error('Erro ao atualizar');
    },
  });

  const columns = [
    {
      key: 'drag',
      label: '',
      render: () => (
        <GripVertical className="admin-icon-sm" style={{ color: 'hsl(var(--admin-muted))' }} />
      ),
    },
    {
      key: 'foto_capa',
      label: '',
      render: (casa: any) => (
        <img
          src={casa.foto_capa || casa.hero_image || '/placeholder.svg'}
          alt={casa.nome}
          className="w-16 h-12 object-cover rounded"
          style={{ border: '1px solid hsl(var(--admin-line))' }}
        />
      ),
    },
    {
      key: 'nome',
      label: 'Nome',
      render: (casa: any) => (
        <div>
          <div className="font-medium" style={{ color: 'hsl(var(--admin-text))' }}>
            {casa.nome}
          </div>
          <div className="flex gap-1 mt-1">
            {casa.empreendimento?.nome && (
              <span className="text-xs" style={{ color: 'hsl(var(--admin-muted))' }}>
                {casa.empreendimento.nome}
              </span>
            )}
            {Array.isArray(casa.tags) && casa.tags.includes('business') && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-white">
                Business
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (casa: any) => (
        <span style={{ color: 'hsl(var(--admin-text))' }}>
          {casa.tipo || '-'}
        </span>
      ),
    },
    {
      key: 'metragem',
      label: 'Metragem',
      render: (casa: any) => (
        <span style={{ color: 'hsl(var(--admin-text))' }}>
          {casa.metragem ? `${casa.metragem}m²` : '-'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (casa: any) => <StatusBadge status={casa.status} />,
    },
    {
      key: 'active',
      label: 'Ativo no Business',
      render: (casa: any) => {
        const isBusiness = Array.isArray(casa.tags) && casa.tags.includes('business');
        return (
          <Switch
            checked={isBusiness}
            onCheckedChange={(checked) =>
              toggleBusinessMutation.mutate({ id: casa.id, isBusiness: checked })
            }
          />
        );
      },
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (casa: any) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/admin/business/edit/${casa.id}`)}
            className="admin-btn-icon admin-btn-ghost"
            title="Editar"
          >
            <Edit className="admin-icon-sm" />
          </button>
          <button
            onClick={() => window.open(`/business/${casa.slug}`, '_blank')}
            className="admin-btn-icon admin-btn-ghost"
            title="Ver no Site"
          >
            <Eye className="admin-icon-sm" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'hsl(var(--admin-text))' }}>
            Business
          </h1>
          <p className="text-sm mt-1" style={{ color: 'hsl(var(--admin-muted))' }}>
            Gerencie pontos comerciais e empreendimentos business
          </p>
        </div>

        <button
          onClick={() => navigate('/admin/empreendimentos?filtro=business')}
          className="admin-btn admin-btn-outline"
        >
          <Plus className="admin-icon-sm" />
          Gerenciar Empreendimentos
        </button>
      </div>

      {/* Card Hero */}
      <div
        className="p-6 rounded-lg space-y-4"
        style={{
          background: 'hsl(var(--admin-surface))',
          border: '1px solid hsl(var(--admin-line))',
        }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold" style={{ color: 'hsl(var(--admin-text))' }}>
            Hero da Página Business
          </h2>
          <button
            onClick={() => saveHeroMutation.mutate()}
            className="admin-btn admin-btn-primary"
            disabled={saveHeroMutation.isPending}
          >
            Salvar Hero
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Título</Label>
            <Input
              value={heroData.titulo}
              onChange={(e) => setHeroData({ ...heroData, titulo: e.target.value })}
              placeholder="Casteval Business"
            />
          </div>

          <div>
            <Label>Subtítulo</Label>
            <Textarea
              value={heroData.subtitulo}
              onChange={(e) => setHeroData({ ...heroData, subtitulo: e.target.value })}
              placeholder="Pontos comerciais estratégicos"
              rows={2}
            />
          </div>
        </div>

        <ImageUploader
          label="Imagem Hero"
          value={heroData.imagem}
          onChange={(v) => {
            const url = typeof v === 'string' ? v : (v as any)?.url || '';
            setHeroData({ ...heroData, imagem: url });
          }}
          aspectRatio="16:9"
        />
      </div>

      {/* Tabela de Empreendimentos */}
      <div
        className="p-6 rounded-lg"
        style={{
          background: 'hsl(var(--admin-surface))',
          border: '1px solid hsl(var(--admin-line))',
        }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: 'hsl(var(--admin-text))' }}>
          Casas Business
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div style={{ color: 'hsl(var(--admin-muted))' }}>Carregando...</div>
          </div>
        ) : casas && casas.length > 0 ? (
          <TableBase
            columns={columns}
            data={casas}
          />
        ) : (
          <div className="text-center py-8" style={{ color: 'hsl(var(--admin-muted))' }}>
            <p>Nenhuma casa Business ainda</p>
            <p className="text-sm mt-2">
              Adicione a tag "business" nas casas para exibi-las aqui
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

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

export default function Select() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [heroData, setHeroData] = useState({
    titulo: 'Casteval Select',
    subtitulo: '',
    imagem: '',
  });

  // Carregar configurações da página Select
  const { data: pageSettings } = useQuery({
    queryKey: ['page-settings', 'select'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('st_page_settings')
        .select('*')
        .eq('page_type', 'select')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setHeroData({
          titulo: data.hero_title || 'Casteval Select',
          subtitulo: data.hero_subtitle || '',
          imagem: data.hero_image || '',
        });
      }

      return data;
    },
  });

  // Carregar casas Select
  const { data: casas, isLoading } = useQuery({
    queryKey: ['casas-select'],
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
            endereco_bairro
          )
        `)
        .contains('tags', ['select'])
        .order('ordem_select', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  const saveHeroMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        page_type: 'select',
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
      queryClient.invalidateQueries({ queryKey: ['page-settings', 'select'] });
      toast.success('Hero atualizado com sucesso');
    },
    onError: () => {
      toast.error('Erro ao salvar hero');
    },
  });

  const toggleSelectMutation = useMutation({
    mutationFn: async ({ id, tags }: { id: string; tags: string[] }) => {
      const currentTags = Array.isArray(tags) ? [...tags] : [];
      const isSelect = currentTags.includes('select');

      let newTags;
      if (isSelect) {
        newTags = currentTags.filter((t) => t !== 'select');
      } else {
        newTags = [...currentTags, 'select'];
      }

      const { error } = await supabase
        .from('st_casas')
        .update({ tags: newTags })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['casas-select'] });
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
            <span className="text-xs" style={{ color: 'hsl(var(--admin-muted))' }}>
              {casa.tipo || 'Sem tipo'}
            </span>
            {Array.isArray(casa.tags) && casa.tags.includes('select') && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500 text-white">
                Select
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'empreendimento',
      label: 'Empreendimento',
      render: (casa: any) => (
        <div>
          <div className="font-medium text-sm" style={{ color: 'hsl(var(--admin-text))' }}>
            {casa.empreendimento?.nome || 'N/A'}
          </div>
          <div className="text-xs" style={{ color: 'hsl(var(--admin-muted))' }}>
            {casa.empreendimento?.endereco_bairro}, {casa.empreendimento?.endereco_cidade}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (casa: any) => <StatusBadge status={casa.status || 'disponivel'} />,
    },
    {
      key: 'ordem',
      label: 'Ordem',
      render: (casa: any) => (
        <span style={{ color: 'hsl(var(--admin-text))' }}>
          {casa.ordem_select || 0}
        </span>
      ),
    },
    {
      key: 'active',
      label: 'Ativo no Select',
      render: (casa: any) => {
        const isSelect = Array.isArray(casa.tags) && casa.tags.includes('select');
        return (
          <Switch
            checked={isSelect}
            onCheckedChange={(checked) =>
              toggleSelectMutation.mutate({ id: casa.id, tags: casa.tags })
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
            onClick={() => navigate(`/admin/casas/edit/${casa.id}`)}
            className="admin-btn-icon admin-btn-ghost"
            title="Editar"
          >
            <Edit className="admin-icon-sm" />
          </button>
          <button
            onClick={() => window.open(`/select/${casa.slug}`, '_blank')}
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
            Select
          </h1>
          <p className="text-sm mt-1" style={{ color: 'hsl(var(--admin-muted))' }}>
            Gerencie a curadoria de casas Select
          </p>
        </div>

        <button
          onClick={() => navigate('/admin/casas')}
          className="admin-btn admin-btn-outline"
        >
          <Plus className="admin-icon-sm" />
          Gerenciar Casas
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
            Hero da Página Select
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
              placeholder="Casteval Select"
            />
          </div>

          <div>
            <Label>Subtítulo</Label>
            <Textarea
              value={heroData.subtitulo}
              onChange={(e) => setHeroData({ ...heroData, subtitulo: e.target.value })}
              placeholder="Descrição da linha Select"
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

      {/* Tabela de Casas */}
      <div
        className="p-6 rounded-lg"
        style={{
          background: 'hsl(var(--admin-surface))',
          border: '1px solid hsl(var(--admin-line))',
        }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: 'hsl(var(--admin-text))' }}>
          Casas Select
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
            <p>Nenhuma casa Select ainda</p>
            <p className="text-sm mt-2">
              Adicione a tag "select" nos empreendimentos para exibi-los aqui
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

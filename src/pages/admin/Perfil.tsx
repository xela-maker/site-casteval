import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Camera, Mail, Lock, Activity } from 'lucide-react';

export default function Perfil() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [profileData, setProfileData] = useState({
    full_name: '',
    username: '',
    avatar_url: '',
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  // Carregar perfil
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfileData({
        full_name: data.full_name || '',
        username: data.username || '',
        avatar_url: data.avatar_url || '',
      });

      return data;
    },
    enabled: !!user?.id,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Perfil atualizado com sucesso');
    },
    onError: () => {
      toast.error('Erro ao atualizar perfil');
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async () => {
      if (passwordData.new !== passwordData.confirm) {
        throw new Error('As senhas não coincidem');
      }

      if (passwordData.new.length < 8) {
        throw new Error('A senha deve ter no mínimo 8 caracteres');
      }

      const { error } = await supabase.auth.updateUser({
        password: passwordData.new,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Senha atualizada com sucesso');
      setPasswordData({ current: '', new: '', confirm: '' });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar senha');
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
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: 'hsl(var(--admin-text))' }}>
          Meu Perfil
        </h1>
        <p className="text-sm mt-1" style={{ color: 'hsl(var(--admin-muted))' }}>
          Gerencie suas informações pessoais e configurações de conta
        </p>
      </div>

      {/* Avatar e Info Principal */}
      <div
        className="p-6 rounded-lg"
        style={{
          background: 'hsl(var(--admin-surface))',
          border: '1px solid hsl(var(--admin-line))',
        }}
      >
        <div className="flex items-start gap-6">
          <div className="relative">
            {profileData.avatar_url ? (
              <img
                src={profileData.avatar_url}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover"
                style={{ border: '2px solid hsl(var(--admin-line))' }}
              />
            ) : (
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{
                  background: 'hsl(var(--admin-surface-2))',
                  border: '2px solid hsl(var(--admin-line))',
                }}
              >
                <Camera className="admin-icon" style={{ color: 'hsl(var(--admin-muted))' }} />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold" style={{ color: 'hsl(var(--admin-text))' }}>
                {profileData.full_name || 'Sem nome'}
              </h2>
              <Badge variant="secondary">{profile?.role || 'user'}</Badge>
            </div>
            <p className="text-sm flex items-center gap-2" style={{ color: 'hsl(var(--admin-muted))' }}>
              <Mail className="admin-icon-sm" />
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Card: Informações Pessoais */}
      <div
        className="p-6 rounded-lg space-y-4"
        style={{
          background: 'hsl(var(--admin-surface))',
          border: '1px solid hsl(var(--admin-line))',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold" style={{ color: 'hsl(var(--admin-text))' }}>
            Informações Pessoais
          </h2>
          <button
            onClick={() => updateProfileMutation.mutate()}
            className="admin-btn admin-btn-primary"
            disabled={updateProfileMutation.isPending}
          >
            Salvar Alterações
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Nome Completo</Label>
            <Input
              value={profileData.full_name}
              onChange={(e) =>
                setProfileData({ ...profileData, full_name: e.target.value })
              }
              placeholder="Seu nome completo"
            />
          </div>

          <div>
            <Label>Nome de Usuário</Label>
            <Input
              value={profileData.username}
              onChange={(e) =>
                setProfileData({ ...profileData, username: e.target.value })
              }
              placeholder="nome_usuario"
            />
          </div>
        </div>

        <ImageUploader
          label="Avatar"
          description="Imagem de perfil (200x200px)"
          value={profileData.avatar_url}
          onChange={(v) => {
            const url = typeof v === 'string' ? v : (v as any)?.url || '';
            setProfileData({ ...profileData, avatar_url: url });
          }}
          aspectRatio="1:1"
        />
      </div>

      {/* Card: Segurança */}
      <div
        className="p-6 rounded-lg space-y-4"
        style={{
          background: 'hsl(var(--admin-surface))',
          border: '1px solid hsl(var(--admin-line))',
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Lock className="admin-icon-md" style={{ color: 'hsl(var(--admin-text))' }} />
          <h2 className="text-xl font-bold" style={{ color: 'hsl(var(--admin-text))' }}>
            Segurança
          </h2>
        </div>

        <div>
          <Label>Email</Label>
          <Input value={user?.email || ''} disabled />
          <p className="text-xs mt-1" style={{ color: 'hsl(var(--admin-muted))' }}>
            Entre em contato com um administrador para alterar o email
          </p>
        </div>

        <div className="border-t pt-4" style={{ borderColor: 'hsl(var(--admin-line))' }}>
          <h3 className="font-medium mb-3" style={{ color: 'hsl(var(--admin-text))' }}>
            Alterar Senha
          </h3>

          <div className="space-y-3">
            <div>
              <Label>Nova Senha</Label>
              <Input
                type="password"
                value={passwordData.new}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, new: e.target.value })
                }
                placeholder="Mínimo 8 caracteres"
              />
            </div>

            <div>
              <Label>Confirmar Nova Senha</Label>
              <Input
                type="password"
                value={passwordData.confirm}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirm: e.target.value })
                }
                placeholder="Digite novamente"
              />
            </div>

            <button
              onClick={() => updatePasswordMutation.mutate()}
              className="admin-btn admin-btn-secondary"
              disabled={updatePasswordMutation.isPending || !passwordData.new}
            >
              Atualizar Senha
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

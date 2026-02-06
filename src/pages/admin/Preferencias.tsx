import { useState } from 'react';
import { useAdminPreferences } from '@/contexts/AdminPreferencesContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Palette, Maximize, Globe, Bell, Accessibility, Keyboard } from 'lucide-react';

export default function Preferencias() {
  const { preferences, updateTheme, updateDensity } = useAdminPreferences();

  const handleResetPreferences = () => {
    updateTheme('light');
    updateDensity('default');
    toast.success('Preferências restauradas para o padrão');
  };

  const atalhos = [
    { keys: ['Ctrl', 'N'], descricao: 'Novo item' },
    { keys: ['Ctrl', 'S'], descricao: 'Salvar' },
    { keys: ['Ctrl', '/'], descricao: 'Buscar' },
    { keys: ['Ctrl', 'K'], descricao: 'Comandos rápidos' },
    { keys: ['Esc'], descricao: 'Fechar modal/drawer' },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'hsl(var(--admin-text))' }}>
            Preferências
          </h1>
          <p className="text-sm mt-1" style={{ color: 'hsl(var(--admin-muted))' }}>
            Personalize a aparência e comportamento do painel administrativo
          </p>
        </div>

        <button onClick={handleResetPreferences} className="admin-btn admin-btn-outline">
          Restaurar Padrões
        </button>
      </div>

      {/* Card: Aparência */}
      <div
        className="p-6 rounded-lg space-y-4"
        style={{
          background: 'hsl(var(--admin-surface))',
          border: '1px solid hsl(var(--admin-line))',
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Palette className="admin-icon-md" style={{ color: 'hsl(var(--admin-text))' }} />
          <h2 className="text-xl font-bold" style={{ color: 'hsl(var(--admin-text))' }}>
            Aparência
          </h2>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Tema</Label>
            <p className="text-sm" style={{ color: 'hsl(var(--admin-muted))' }}>
              Escolha entre tema claro ou escuro
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => updateTheme('light')}
              className={`px-4 py-2 rounded-lg border transition-all ${
                preferences.theme === 'light'
                  ? 'admin-btn-primary'
                  : 'admin-btn-outline'
              }`}
            >
              Claro
            </button>
            <button
              onClick={() => updateTheme('dark')}
              className={`px-4 py-2 rounded-lg border transition-all ${
                preferences.theme === 'dark'
                  ? 'admin-btn-primary'
                  : 'admin-btn-outline'
              }`}
            >
              Escuro
            </button>
          </div>
        </div>
      </div>

      {/* Card: Densidade das Tabelas */}
      <div
        className="p-6 rounded-lg space-y-4"
        style={{
          background: 'hsl(var(--admin-surface))',
          border: '1px solid hsl(var(--admin-line))',
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Maximize className="admin-icon-md" style={{ color: 'hsl(var(--admin-text))' }} />
          <h2 className="text-xl font-bold" style={{ color: 'hsl(var(--admin-text))' }}>
            Densidade das Tabelas
          </h2>
        </div>

        <RadioGroup value={preferences.density} onValueChange={updateDensity}>
          <div className="flex items-center justify-between p-3 rounded" style={{ background: 'hsl(var(--admin-surface-2))' }}>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="comfortable" id="comfortable" />
              <Label htmlFor="comfortable" className="cursor-pointer">
                <div className="font-medium">Confortável</div>
                <div className="text-xs" style={{ color: 'hsl(var(--admin-muted))' }}>
                  Mais espaçamento entre linhas
                </div>
              </Label>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded" style={{ background: 'hsl(var(--admin-surface-2))' }}>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="default" id="default" />
              <Label htmlFor="default" className="cursor-pointer">
                <div className="font-medium">Padrão</div>
                <div className="text-xs" style={{ color: 'hsl(var(--admin-muted))' }}>
                  Espaçamento equilibrado
                </div>
              </Label>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded" style={{ background: 'hsl(var(--admin-surface-2))' }}>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="compact" id="compact" />
              <Label htmlFor="compact" className="cursor-pointer">
                <div className="font-medium">Densa</div>
                <div className="text-xs" style={{ color: 'hsl(var(--admin-muted))' }}>
                  Menos espaçamento, mais dados visíveis
                </div>
              </Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Card: Idioma (futuro) */}
      <div
        className="p-6 rounded-lg space-y-4 opacity-50"
        style={{
          background: 'hsl(var(--admin-surface))',
          border: '1px solid hsl(var(--admin-line))',
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Globe className="admin-icon-md" style={{ color: 'hsl(var(--admin-text))' }} />
          <h2 className="text-xl font-bold" style={{ color: 'hsl(var(--admin-text))' }}>
            Idioma
          </h2>
          <span className="admin-badge admin-badge-muted">Em breve</span>
        </div>

        <p className="text-sm" style={{ color: 'hsl(var(--admin-muted))' }}>
          Suporte a múltiplos idiomas será adicionado em breve
        </p>
      </div>

      {/* Card: Notificações (futuro) */}
      <div
        className="p-6 rounded-lg space-y-4 opacity-50"
        style={{
          background: 'hsl(var(--admin-surface))',
          border: '1px solid hsl(var(--admin-line))',
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Bell className="admin-icon-md" style={{ color: 'hsl(var(--admin-text))' }} />
          <h2 className="text-xl font-bold" style={{ color: 'hsl(var(--admin-text))' }}>
            Notificações
          </h2>
          <span className="admin-badge admin-badge-muted">Em breve</span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Notificações no navegador</Label>
            <Switch disabled />
          </div>
          <div className="flex items-center justify-between">
            <Label>Sons de notificação</Label>
            <Switch disabled />
          </div>
          <div className="flex items-center justify-between">
            <Label>Emails de resumo diário</Label>
            <Switch disabled />
          </div>
        </div>
      </div>

      {/* Card: Atalhos de Teclado */}
      <div
        className="p-6 rounded-lg space-y-4"
        style={{
          background: 'hsl(var(--admin-surface))',
          border: '1px solid hsl(var(--admin-line))',
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Keyboard className="admin-icon-md" style={{ color: 'hsl(var(--admin-text))' }} />
          <h2 className="text-xl font-bold" style={{ color: 'hsl(var(--admin-text))' }}>
            Atalhos de Teclado
          </h2>
        </div>

        <div className="space-y-2">
          {atalhos.map((atalho, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded"
              style={{ background: 'hsl(var(--admin-surface-2))' }}
            >
              <span style={{ color: 'hsl(var(--admin-text))' }}>{atalho.descricao}</span>
              <div className="flex gap-1">
                {atalho.keys.map((key) => (
                  <kbd
                    key={key}
                    className="px-2 py-1 text-xs font-mono rounded"
                    style={{
                      background: 'hsl(var(--admin-surface))',
                      border: '1px solid hsl(var(--admin-line))',
                      color: 'hsl(var(--admin-text))',
                    }}
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

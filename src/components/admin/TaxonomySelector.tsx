import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Search, Edit2, X, Check, Upload, Trash2, AlertTriangle } from 'lucide-react';
import * as icons from 'lucide-react';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

type TaxonomyType = 'itens_lazer' | 'comodidades';

interface TaxonomyItem {
  id: string;
  nome: string;
  slug: string;
  icone?: string;
  ordem: number;
}

interface TaxonomySelectorProps {
  type: TaxonomyType;
  value: string[];
  onChange: (ids: string[]) => void;
  label: string;
  required?: boolean;
  description?: string;
}

const taxonomyTables = {
  itens_lazer: 'st_taxonomia_itens_lazer',
  comodidades: 'st_taxonomia_comodidades',
};

export function TaxonomySelector({
  type,
  value,
  onChange,
  label,
  required = false,
  description,
}: TaxonomySelectorProps) {
  const [search, setSearch] = useState('');
  const [showAddNew, setShowAddNew] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemIcon, setNewItemIcon] = useState('');
  const [newItemSvg, setNewItemSvg] = useState('');
  const [addingNew, setAddingNew] = useState(false);
  const [showIconModal, setShowIconModal] = useState(false);
  const [modalItemId, setModalItemId] = useState<string | null>(null);
  const [modalItemName, setModalItemName] = useState('');
  const [modalIconValue, setModalIconValue] = useState('');
  const [uploadedSvg, setUploadedSvg] = useState('');
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [duplicateError, setDuplicateError] = useState('');

  const queryClient = useQueryClient();
  const tableName = taxonomyTables[type];

  // Theme colors
  const theme = document.documentElement.getAttribute("data-admin-theme") || "dark";
  const isDark = theme === "dark";
  const bg = isDark ? "#0a0e13" : "#f5f7fa";
  const surface = isDark ? "#141920" : "#ffffff";
  const surface2 = isDark ? "#1d2633" : "#f8fafc";
  const text = isDark ? "#ffffff" : "#0f172a";
  const textMuted = isDark ? "#94a3b8" : "#64748b";
  const border = isDark ? "#2a3543" : "#e2e8f0";
  const brand = "#FFB000";
  const brandLight = "#FFCC4D";
  const brand600 = "#D89200";

  const { data: items = [], isLoading } = useQuery<TaxonomyItem[]>({
    queryKey: ['taxonomy', type],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(tableName as any)
        .select('*')
        .eq('is_active', true)
        .order('ordem');

      if (error) throw error;
      return (data || []) as unknown as TaxonomyItem[];
    },
  });

  // Validação de nome duplicado
  const checkDuplicateName = (name: string, excludeId?: string): boolean => {
    return items.some(item => 
      item.nome.toLowerCase().trim() === name.toLowerCase().trim() && 
      item.id !== excludeId
    );
  };

  const updateIconMutation = useMutation({
    mutationFn: async ({ id, icone, nome }: { id: string; icone: string; nome?: string }) => {
      const updateData: any = { icone };
      if (nome !== undefined) {
        updateData.nome = nome;
      }

      const { error } = await supabase
        .from(tableName as any)
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taxonomy', type] });
      toast.success('Item atualizado com sucesso');
    },
    onError: () => {
      toast.error('Erro ao atualizar item');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error} = await supabase
        .from(tableName as any)
        .update({ is_active: false })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taxonomy', type] });
      toast.success('Item excluído com sucesso');
      setShowDeleteConfirm(false);
      setShowIconModal(false);
    },
    onError: () => {
      toast.error('Erro ao excluir item');
    }
  });

  const filteredItems = items.filter(item =>
    item.nome.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter(v => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  const handleAddNew = async () => {
    if (!newItemName.trim()) {
      toast.error('Digite um nome para o item');
      return;
    }

    if (checkDuplicateName(newItemName)) {
      toast.error('Já existe um item com este nome');
      setDuplicateError('Nome duplicado');
      return;
    }

    setAddingNew(true);
    try {
      const slug = newItemName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');

      const maxOrdem = Math.max(...items.map(i => i.ordem), 0);

      const finalIcon = newItemSvg || newItemIcon.trim() || null;

      const { data, error } = await supabase
        .from(tableName as any)
        .insert({
          nome: newItemName.trim(),
          slug,
          ordem: maxOrdem + 1,
          icone: finalIcon,
        })
        .select()
        .single();

      if (error) throw error;

      const newItem = data as unknown as TaxonomyItem;

      toast.success('Item adicionado com sucesso');
      setNewItemName('');
      setNewItemIcon('');
      setNewItemSvg('');
      setShowAddNew(false);
      queryClient.invalidateQueries({ queryKey: ['taxonomy', type] });

      // Auto-selecionar o novo item
      if (newItem) {
        onChange([...value, newItem.id]);
      }
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      toast.error('Erro ao adicionar item');
    } finally {
      setAddingNew(false);
    }
  };

  const handleNewItemFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const svgContent = event.target?.result as string;
        setNewItemSvg(svgContent);
        setNewItemIcon('');
      };
      reader.readAsText(file);
    } else {
      toast.error('Por favor, selecione um arquivo SVG válido');
    }
  };

  const handleUpdateIcon = async (id: string, icone: string, nome?: string) => {
    updateIconMutation.mutate({ id, icone: icone.trim(), nome });
  };

  const handleOpenIconModal = (item: TaxonomyItem) => {
    setModalItemId(item.id);
    setModalItemName(item.nome);
    setModalIconValue(item.icone || '');
    setUploadedSvg('');
    setShowIconModal(true);
  };

  const handleSaveIconFromModal = () => {
    if (modalItemId && modalItemName.trim()) {
      const finalIcon = uploadedSvg || modalIconValue;
      handleUpdateIcon(modalItemId, finalIcon, modalItemName.trim());
      setShowIconModal(false);
      setModalItemId(null);
      setModalItemName('');
      setModalIconValue('');
      setUploadedSvg('');
    } else if (!modalItemName.trim()) {
      toast.error('O nome do item não pode estar vazio');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const svgContent = event.target?.result as string;
        setUploadedSvg(svgContent);
      };
      reader.readAsText(file);
    } else {
      toast.error('Por favor, selecione um arquivo SVG válido');
    }
  };

  const renderIcon = (iconName: string | null | undefined, size: number = 24) => {
    if (!iconName) {
      return <icons.Box style={{ width: size, height: size, color: textMuted }} />;
    }

    // Se for SVG custom
    if (iconName.startsWith('<svg')) {
      return (
        <div
          dangerouslySetInnerHTML={{ __html: iconName }}
          style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        />
      );
    }

    // Se for nome do lucide-react
    const IconComponent = (icons as any)[iconName];
    if (IconComponent) {
      return <IconComponent style={{ width: size, height: size, color: brand }} />;
    }

    return <icons.Box style={{ width: size, height: size, color: textMuted }} />;
  };

  if (isLoading) {
    return (
      <div style={{ padding: '16px 0' }}>
        <div style={{ color: text, fontWeight: 500, fontSize: '14px', marginBottom: '8px' }}>
          {label}
          {required && <span style={{ color: '#EF4444', marginLeft: '4px' }}>*</span>}
        </div>
        <div style={{ color: textMuted, fontSize: '14px' }}>Carregando...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px 0' }}>
      {/* Label */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ color: text, fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
          {label}
          {required && <span style={{ color: '#EF4444', marginLeft: '4px' }}>*</span>}
        </div>
        {description && (
          <p style={{ color: textMuted, fontSize: '13px', margin: 0 }}>{description}</p>
        )}
      </div>

      {/* Busca */}
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <Search
          size={16}
          color={textMuted}
          style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }}
        />
        <input
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 14px 10px 42px',
            borderRadius: '10px',
            background: surface2,
            border: `1px solid ${border}`,
            color: text,
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.2s ease',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = brand;
            e.target.style.boxShadow = `0 0 0 3px ${brand}20`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = border;
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* Grid de Seleção */}
      <div
        style={{
          border: `1px solid ${border}`,
          borderRadius: '14px',
          padding: '20px',
          maxHeight: '420px',
          overflowY: 'auto',
          background: surface2,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '14px',
          }}
        >
          {filteredItems.map((item) => {
            const isSelected = value.includes(item.id);

            return (
              <div
                key={item.id}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px 12px',
                  minHeight: '110px',
                  borderRadius: '12px',
                  border: isSelected ? `2px solid ${brand}` : `1px solid ${border}`,
                  background: isSelected
                    ? `linear-gradient(135deg, rgba(255, 176, 0, 0.15), rgba(255, 204, 77, 0.15))`
                    : surface,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  overflow: 'hidden',
                }}
                onClick={() => handleToggle(item.id)}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'rgba(255, 176, 0, 0.08)';
                    e.currentTarget.style.borderColor = brand;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = surface;
                    e.currentTarget.style.borderColor = border;
                  }
                }}
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={isSelected}
                  readOnly
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '18px',
                    height: '18px',
                    accentColor: brand,
                    cursor: 'pointer',
                  }}
                />

                {/* Ícone */}
                <>
                  <div style={{ marginBottom: '10px' }}>
                    {renderIcon(item.icone, 28)}
                  </div>

                  {/* Nome */}
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: text,
                      textAlign: 'center',
                      lineHeight: '1.3',
                      wordBreak: 'break-word',
                    }}
                  >
                    {item.nome}
                  </span>

                  {/* Botão editar ícone */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenIconModal(item);
                    }}
                    style={{
                        position: 'absolute',
                        bottom: '6px',
                        right: '6px',
                        padding: '4px',
                        borderRadius: '6px',
                        background: `${brand}20`,
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `${brand}35`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = `${brand}20`;
                      }}
                      title="Editar ícone"
                    >
                      <Edit2 size={14} color={brand} />
                    </button>
                  </>

              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: textMuted,
              fontSize: '14px',
            }}
          >
            Nenhum item encontrado
          </div>
        )}
      </div>

      {/* Adicionar Novo */}
      {showAddNew ? (
        <div
          style={{
            marginTop: '16px',
            padding: '16px',
            borderRadius: '12px',
            background: surface2,
            border: `1px solid ${border}`,
          }}
        >
          <div style={{ fontSize: '14px', fontWeight: 600, color: text, marginBottom: '12px' }}>
            Adicionar Novo Item
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              placeholder="Nome do item"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleAddNew()}
              disabled={addingNew}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                background: surface,
                border: `1px solid ${border}`,
                color: text,
                fontSize: '14px',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = brand;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = border;
              }}
            />

            <input
              placeholder="Nome lucide ou deixe vazio para upload"
              value={newItemSvg ? '' : newItemIcon}
              onChange={(e) => {
                setNewItemIcon(e.target.value);
                setNewItemSvg('');
              }}
              disabled={addingNew || !!newItemSvg}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                background: newItemSvg ? surface2 : surface,
                border: `1px solid ${border}`,
                color: newItemSvg ? textMuted : text,
                fontSize: '14px',
                outline: 'none',
              }}
              onFocus={(e) => {
                if (!newItemSvg) e.target.style.borderColor = brand;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = border;
              }}
            />

            {/* Upload de SVG para novo item */}
            <div
              style={{
                border: `2px dashed ${newItemSvg ? brand : border}`,
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center',
                background: newItemSvg ? `${brand}08` : surface,
                transition: 'all 0.2s',
                cursor: 'pointer',
              }}
              onClick={() => !addingNew && document.getElementById('new-item-svg-upload')?.click()}
            >
              <input
                id="new-item-svg-upload"
                type="file"
                accept=".svg,image/svg+xml"
                onChange={handleNewItemFileUpload}
                disabled={addingNew}
                style={{ display: 'none' }}
              />
              {newItemSvg ? (
                <div style={{ color: brand, fontSize: '13px' }}>
                  <Check size={24} style={{ margin: '0 auto 4px' }} />
                  <p style={{ margin: 0, fontWeight: 600 }}>SVG Carregado!</p>
                </div>
              ) : (
                <div style={{ color: textMuted, fontSize: '13px' }}>
                  <Plus size={24} style={{ margin: '0 auto 4px' }} />
                  <p style={{ margin: 0 }}>Clique para fazer upload de SVG</p>
                </div>
              )}
            </div>

            {newItemSvg && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setNewItemSvg('');
                  const input = document.getElementById('new-item-svg-upload') as HTMLInputElement;
                  if (input) input.value = '';
                }}
                disabled={addingNew}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  background: 'transparent',
                  border: `1px solid ${border}`,
                  color: textMuted,
                  fontSize: '12px',
                  cursor: addingNew ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!addingNew) {
                    e.currentTarget.style.background = surface2;
                    e.currentTarget.style.borderColor = brand;
                    e.currentTarget.style.color = brand;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = border;
                  e.currentTarget.style.color = textMuted;
                }}
              >
                Remover SVG
              </button>
            )}

            {/* Preview do ícone */}
            {(newItemIcon || newItemSvg) && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px',
                  background: surface,
                  borderRadius: '8px',
                  border: `1px solid ${border}`,
                }}
              >
                <span style={{ fontSize: '12px', color: textMuted }}>Preview:</span>
                {renderIcon(newItemSvg || newItemIcon, 20)}
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleAddNew}
                disabled={addingNew}
                style={{
                  flex: 1,
                  padding: '10px 20px',
                  borderRadius: '8px',
                  background: `linear-gradient(135deg, ${brand}, ${brand600})`,
                  color: '#fff',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: addingNew ? 'not-allowed' : 'pointer',
                  opacity: addingNew ? 0.6 : 1,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!addingNew) {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = `0 4px 12px ${brand}40`;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {addingNew ? 'Adicionando...' : 'Adicionar'}
              </button>
              <button
                onClick={() => {
                  setShowAddNew(false);
                  setNewItemName('');
                  setNewItemIcon('');
                  setNewItemSvg('');
                }}
                disabled={addingNew}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  background: 'transparent',
                  border: `1px solid ${border}`,
                  color: textMuted,
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: addingNew ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!addingNew) {
                    e.currentTarget.style.background = surface2;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddNew(true)}
          style={{
            width: '100%',
            marginTop: '16px',
            padding: '12px',
            borderRadius: '10px',
            background: 'transparent',
            border: `2px dashed ${border}`,
            color: textMuted,
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = brand;
            e.currentTarget.style.color = brand;
            e.currentTarget.style.background = `${brand}08`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = border;
            e.currentTarget.style.color = textMuted;
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <Plus size={18} />
          Adicionar Novo Item
        </button>
      )}

      {/* Contador de Selecionados */}
      {value.length > 0 && (
        <div
          style={{
            marginTop: '12px',
            padding: '10px 14px',
            borderRadius: '8px',
            background: `${brand}15`,
            border: `1px solid ${brand}30`,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Check size={16} color={brand} />
          <span style={{ fontSize: '13px', color: text, fontWeight: 500 }}>
            {value.length} {value.length === 1 ? 'item selecionado' : 'itens selecionados'}
          </span>
        </div>
      )}

      {/* Modal de Edição de Ícone */}
      {showIconModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
          onClick={() => setShowIconModal(false)}
        >
          <div
            style={{
              background: surface,
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: text, margin: 0 }}>
                Editar Item
              </h3>
              <button
                onClick={() => setShowIconModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = surface2}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <X size={24} color={textMuted} />
              </button>
            </div>

            {/* Campo de texto para o nome do item */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: text, marginBottom: '8px' }}>
                Nome do Item
              </label>
              <input
                placeholder="Ex: Área Gourmet, Piscina..."
                value={modalItemName}
                onChange={(e) => setModalItemName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: surface,
                  border: `1px solid ${border}`,
                  color: text,
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = brand;
                  e.target.style.boxShadow = `0 0 0 3px ${brand}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = border;
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Campo de texto para nome Lucide-React */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: text, marginBottom: '8px' }}>
                Nome do Ícone Lucide-React
              </label>
              <input
                placeholder="Ex: Home, Utensils, Tv, Waves..."
                value={uploadedSvg ? '' : modalIconValue}
                onChange={(e) => {
                  setModalIconValue(e.target.value);
                  setUploadedSvg('');
                }}
                disabled={!!uploadedSvg}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: uploadedSvg ? surface2 : surface,
                  border: `1px solid ${border}`,
                  color: uploadedSvg ? textMuted : text,
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => {
                  if (!uploadedSvg) {
                    e.target.style.borderColor = brand;
                    e.target.style.boxShadow = `0 0 0 3px ${brand}20`;
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = border;
                  e.target.style.boxShadow = 'none';
                }}
              />
              <p style={{ fontSize: '12px', color: textMuted, margin: '6px 0 0 0' }}>
                Digite o nome de um ícone do lucide-react (ex: "Home", "Flame", "UtensilsCrossed")
              </p>
            </div>

            {/* Separador */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{ flex: 1, height: '1px', background: border }}></div>
              <span style={{ fontSize: '12px', color: textMuted, fontWeight: 600 }}>OU</span>
              <div style={{ flex: 1, height: '1px', background: border }}></div>
            </div>

            {/* Upload de SVG */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: text, marginBottom: '8px' }}>
                Fazer Upload de SVG Custom
              </label>
              <div
                style={{
                  border: `2px dashed ${uploadedSvg ? brand : border}`,
                  borderRadius: '10px',
                  padding: '24px',
                  textAlign: 'center',
                  background: uploadedSvg ? `${brand}08` : surface2,
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onClick={() => document.getElementById('svg-upload-input')?.click()}
              >
                <input
                  id="svg-upload-input"
                  type="file"
                  accept=".svg,image/svg+xml"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                {uploadedSvg ? (
                  <div style={{ color: brand }}>
                    <Check size={32} style={{ margin: '0 auto 8px' }} />
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>SVG Carregado!</p>
                  </div>
                ) : (
                  <div style={{ color: textMuted }}>
                    <Plus size={32} style={{ margin: '0 auto 8px' }} />
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>Clique para selecionar um arquivo SVG</p>
                  </div>
                )}
              </div>
              {uploadedSvg && (
                <button
                  onClick={() => {
                    setUploadedSvg('');
                    const input = document.getElementById('svg-upload-input') as HTMLInputElement;
                    if (input) input.value = '';
                  }}
                  style={{
                    marginTop: '8px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: 'transparent',
                    border: `1px solid ${border}`,
                    color: textMuted,
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = surface2;
                    e.currentTarget.style.borderColor = brand;
                    e.currentTarget.style.color = brand;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = border;
                    e.currentTarget.style.color = textMuted;
                  }}
                >
                  Remover SVG
                </button>
              )}
            </div>

            {/* Preview */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: text, marginBottom: '8px' }}>
                Preview do Ícone
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '32px',
                  background: surface2,
                  borderRadius: '10px',
                  border: `1px solid ${border}`,
                  minHeight: '120px',
                }}
              >
                {renderIcon(uploadedSvg || modalIconValue, 48)}
              </div>
            </div>

            {/* Botões de Ação */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleSaveIconFromModal}
                disabled={updateIconMutation.isPending || !modalItemName.trim()}
                style={{
                  flex: 1,
                  padding: '14px 24px',
                  borderRadius: '10px',
                  background: !modalItemName.trim() || updateIconMutation.isPending
                    ? textMuted
                    : `linear-gradient(135deg, ${brand}, ${brand600})`,
                  color: '#fff',
                  border: 'none',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: !modalItemName.trim() || updateIconMutation.isPending ? 'not-allowed' : 'pointer',
                  opacity: !modalItemName.trim() || updateIconMutation.isPending ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (modalItemName.trim() && !updateIconMutation.isPending) {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = `0 8px 20px ${brand}40`;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Check size={18} />
                {updateIconMutation.isPending ? 'Salvando...' : 'Salvar Item'}
              </button>
              <button
                onClick={() => setShowIconModal(false)}
                disabled={updateIconMutation.isPending}
                style={{
                  padding: '14px 24px',
                  borderRadius: '10px',
                  background: 'transparent',
                  border: `1px solid ${border}`,
                  color: textMuted,
                  fontSize: '15px',
                  fontWeight: 500,
                  cursor: updateIconMutation.isPending ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!updateIconMutation.isPending) {
                    e.currentTarget.style.background = surface2;
                    e.currentTarget.style.borderColor = brand;
                    e.currentTarget.style.color = brand;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = border;
                  e.currentTarget.style.color = textMuted;
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

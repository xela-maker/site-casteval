import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { DraggableGallery } from '@/components/admin/DraggableGallery';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { SlugField } from '@/components/admin/SlugField';
import { FormBase } from '@/components/admin/FormBase';
import { ArrowLeft, Star, CheckCircle2, Trophy, Briefcase, MapPin, Video, Image as ImageIcon, FileText, Map, TrashIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ================== ESTILOS PREMIUM ==================
const colors = {
  primary: '#FF9500',      // Laranja vibrante (tema do site)
  secondary: '#F57C00',    // Laranja escuro
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  light: '#f8fafc',
  lightGray: '#f1f5f9',
  border: '#e2e8f0',
  text: '#1a202c',
  textMuted: '#64748b',
  orange: '#FF9500',
  orangeBg: '#FFF8F0',
  darkBusiness: '#1F2937',
  darkBusinessBg: '#F3F4F6',
};

const globalStyles = `
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  input, textarea, select {
    transition: all 0.3s ease;
  }
  input:focus, textarea:focus, select:focus {
    outline: none;
  }
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = globalStyles;
  document.head.appendChild(style);
}

const styleSheet = {
  globalContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '40px 24px',
    background: `linear-gradient(135deg, ${colors.light} 0%, #FFF3E0 100%)`,
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '40px',
    paddingBottom: '28px',
    borderBottom: `3px solid ${colors.border}`,
    animation: 'slideIn 0.5s ease',
  },
  backButton: {
    padding: '10px 16px',
    background: 'white',
    border: `2px solid ${colors.border}`,
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: colors.text,
    transition: 'all 0.3s ease',
  },
  headerTitle: {
    fontSize: '36px',
    fontWeight: '800',
    color: colors.text,
    margin: 0,
    letterSpacing: '-0.5px',
    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  tabsContainer: {
    display: 'flex',
    gap: '8px',
    marginBottom: '32px',
    overflowX: 'auto' as const,
    paddingBottom: '16px',
    borderBottom: `2px solid ${colors.border}`,
  },
  tabButton: (isActive: boolean) => ({
    padding: '12px 24px',
    background: isActive ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` : 'white',
    color: isActive ? 'white' : colors.textMuted,
    border: isActive ? 'none' : `2px solid ${colors.border}`,
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: isActive ? '700' : '600',
    fontSize: '14px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    whiteSpace: 'nowrap',
    boxShadow: isActive ? `0 8px 24px rgba(255, 149, 0, 0.3)` : 'none',
  }),
  cardContainer: {
    background: 'white',
    borderRadius: '16px',
    padding: '40px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
    border: `1px solid ${colors.light}`,
    animation: 'fadeIn 0.4s ease',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '800',
    color: colors.text,
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    paddingBottom: '16px',
    borderBottom: `3px solid rgba(255, 149, 0, 0.15)`,
  },
  contextBadge: (isSelect: boolean) => ({
    padding: '14px 24px',
    background: isSelect ? colors.orangeBg : colors.darkBusinessBg,
    border: `3px solid ${isSelect ? colors.orange : colors.darkBusiness}`,
    borderRadius: '12px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '15px',
    fontWeight: '700',
    color: isSelect ? colors.orange : colors.darkBusiness,
    marginBottom: '28px',
    animation: 'slideIn 0.5s ease',
  }),
  gridLayout: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    marginBottom: '28px',
  },
  gridLayoutFull: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '24px',
    marginBottom: '28px',
  },
  inputGroup: {
    marginBottom: '24px',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '15px',
    fontWeight: '700',
    color: colors.text,
    marginBottom: '10px',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    border: `2px solid ${colors.border}`,
    borderRadius: '10px',
    fontSize: '14px',
    background: colors.light,
    color: colors.text,
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
  },
  inputHover: {
    borderColor: colors.primary,
    background: 'white',
    boxShadow: `0 0 0 4px rgba(255, 149, 0, 0.1)`,
  },
  textarea: {
    width: '100%',
    padding: '14px 16px',
    border: `2px solid ${colors.border}`,
    borderRadius: '10px',
    fontSize: '14px',
    background: colors.light,
    color: colors.text,
    fontFamily: 'inherit',
    resize: 'vertical',
    minHeight: '120px',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
  },
  checkboxWrapper: (isActive: boolean, color: string) => ({
    padding: '16px 18px',
    border: isActive ? `3px solid ${color}` : `2px solid ${colors.border}`,
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    cursor: 'pointer',
    background: isActive ? `${color}08` : colors.light,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: isActive ? `0 8px 16px ${color}20` : 'none',
  }),
  checkboxInput: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    accentColor: colors.primary,
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '15px',
    fontWeight: '600',
    color: colors.text,
    cursor: 'pointer',
    margin: 0,
  },
  sectionBox: {
    padding: '28px',
    background: `linear-gradient(135deg, ${colors.lightGray} 0%, ${colors.light} 100%)`,
    borderRadius: '12px',
    border: `2px solid ${colors.border}`,
    marginBottom: '28px',
  },
  cardBox: {
    padding: '20px',
    border: `2px solid ${colors.border}`,
    borderRadius: '12px',
    background: `linear-gradient(135deg, ${colors.light} 0%, white 100%)`,
    marginBottom: '16px',
    transition: 'all 0.3s ease',
  },
  cardBoxHover: {
    borderColor: colors.primary,
    boxShadow: `0 8px 24px rgba(255, 149, 0, 0.15)`,
  },
  button: {
    padding: '14px 28px',
    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: `0 8px 20px rgba(255, 149, 0, 0.3)`,
    width: '100%',
  },
  buttonSecondary: {
    padding: '10px 16px',
    background: 'white',
    color: colors.text,
    border: `2px solid ${colors.border}`,
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  buttonDanger: {
    padding: '8px 16px',
    background: '#fff5f5',
    color: colors.danger,
    border: `2px solid ${colors.danger}40`,
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  hint: {
    fontSize: '13px',
    color: colors.textMuted,
    marginTop: '8px',
  },
};

// ================== COMPONENTES ==================

interface PlantaItem {
  titulo: string;
  imagem: string;
}

interface CasaData {
  id?: string;
  nome: string;
  slug: string;
  tipo: string;
  status: string;
  destaque: boolean;
  empreendimento_id: string | null;
  foto_capa: string;
  hero_image: string;
  descricao_curta: string;
  descricao_detalhada: string;
  preco: number;
  metragem: number;
  area_privativa: number;
  area_terreno: number;
  quartos: number;
  suites: number;
  banheiros: number;
  vagas: number;
  pavimentos: number;
  galeria: any[];
  plantas: PlantaItem[];
  comodidades: string[];
  video_url: string;
  tour_360_url: string;
  mapa_google_embed: string;
  ordem: number;
  ordem_select: number;
  ordem_business: number;
  tags: string[];
  is_active: boolean;
}

interface CasaFormBaseProps {
  contextType: 'select' | 'business' | 'general';
  casaId?: string;
}

const initialData: CasaData = {
  nome: '',
  slug: '',
  tipo: 'casa',
  status: 'disponivel',
  destaque: false,
  empreendimento_id: null,
  foto_capa: '',
  hero_image: '',
  descricao_curta: '',
  descricao_detalhada: '',
  preco: 0,
  metragem: 0,
  area_privativa: 0,
  area_terreno: 0,
  quartos: 0,
  suites: 0,
  banheiros: 0,
  vagas: 0,
  pavimentos: 1,
  galeria: [],
  plantas: [],
  comodidades: [],
  video_url: '',
  tour_360_url: '',
  mapa_google_embed: '',
  ordem: 0,
  ordem_select: 0,
  ordem_business: 0,
  tags: [],
  is_active: true,
};

// ✅ Componentes movidos para fora para evitar perda de foco
const CustomInput = ({ ...props }: any) => (
  <input
    {...props}
    style={{
      width: '100%',
      padding: '14px 16px',
      border: `2px solid #e2e8f0`,
      borderRadius: '10px',
      fontSize: '14px',
      background: '#f8fafc',
      color: '#1a202c',
      fontFamily: 'inherit',
      boxSizing: 'border-box',
      transition: 'all 0.3s ease',
    }}
    onFocus={(e: any) => {
      e.target.style.borderColor = '#FF9500';
      e.target.style.background = 'white';
      e.target.style.boxShadow = `0 0 0 4px rgba(255, 149, 0, 0.1)`;
    }}
    onBlur={(e: any) => {
      e.target.style.borderColor = '#e2e8f0';
      e.target.style.background = '#f8fafc';
      e.target.style.boxShadow = 'none';
    }}
  />
);

const CustomTextarea = ({ ...props }: any) => (
  <textarea
    {...props}
    style={{
      width: '100%',
      padding: '14px 16px',
      border: `2px solid #e2e8f0`,
      borderRadius: '10px',
      fontSize: '14px',
      background: '#f8fafc',
      color: '#1a202c',
      fontFamily: 'inherit',
      resize: 'vertical',
      minHeight: '120px',
      boxSizing: 'border-box',
      transition: 'all 0.3s ease',
    }}
    onFocus={(e: any) => {
      e.target.style.borderColor = '#FF9500';
      e.target.style.background = 'white';
      e.target.style.boxShadow = `0 0 0 4px rgba(255, 149, 0, 0.1)`;
    }}
    onBlur={(e: any) => {
      e.target.style.borderColor = '#e2e8f0';
      e.target.style.background = '#f8fafc';
      e.target.style.boxShadow = 'none';
    }}
  />
);

export const CasaFormBase = ({ contextType, casaId }: CasaFormBaseProps) => {
  const navigate = useNavigate();
  const isEdit = !!casaId;
  const [formData, setFormData] = useState<CasaData>(initialData);
  const [activeTab, setActiveTab] = useState('geral');
  const [hoveredPlanta, setHoveredPlanta] = useState<number | null>(null);

  const { data: empreendimentos } = useQuery({
    queryKey: ['empreendimentos-select'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('st_empreendimentos')
        .select('id, nome, tags')
        .order('nome');
      if (error) throw error;
      return data || [];
    },
  });

  const { data: casa, isLoading: isLoadingCasa } = useQuery({
    queryKey: ['casa-edit', casaId],
    queryFn: async () => {
      if (!casaId) return null;
      const { data, error } = await supabase
        .from('st_casas')
        .select('*')
        .eq('id', casaId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: isEdit,
  });

  useEffect(() => {
    if (casa) {
      const plantas: PlantaItem[] = Array.isArray(casa.plantas)
        ? casa.plantas.map((p: any) => ({
            titulo: p?.titulo || '',
            imagem: p?.imagem || '',
          }))
        : [];

      const comodidades: string[] = Array.isArray(casa.comodidades)
        ? casa.comodidades.map((c: any) => String(c))
        : [];

      setFormData({
        ...casa,
        galeria: Array.isArray(casa.galeria) ? casa.galeria : [],
        plantas,
        comodidades,
        tags: Array.isArray(casa.tags) ? casa.tags : [],
      });
    }
  }, [casa]);

  const saveMutation = useMutation({
    mutationFn: async (data: CasaData) => {
      const payload: any = {
        nome: data.nome,
        slug: data.slug,
        tipo: data.tipo,
        status: data.status,
        destaque: data.destaque,
        empreendimento_id: data.empreendimento_id || null,
        foto_capa: data.foto_capa,
        hero_image: data.hero_image,
        descricao_curta: data.descricao_curta,
        descricao_detalhada: data.descricao_detalhada,
        galeria: data.galeria,
        plantas: data.plantas,
        comodidades: data.comodidades,
        video_url: data.video_url,
        tour_360_url: data.tour_360_url,
        mapa_google_embed: data.mapa_google_embed,
        is_active: data.is_active,
        tags: data.tags,
        preco: Number(data.preco) || 0,
        metragem: Number(data.metragem) || 0,
        area_privativa: Number(data.area_privativa) || 0,
        area_terreno: Number(data.area_terreno) || 0,
        quartos: Number(data.quartos) || 0,
        suites: Number(data.suites) || 0,
        banheiros: Number(data.banheiros) || 0,
        vagas: Number(data.vagas) || 0,
        pavimentos: Number(data.pavimentos) || 1,
        ordem: Number(data.ordem) || 0,
        ordem_select: Number(data.ordem_select) || 0,
        ordem_business: Number(data.ordem_business) || 0,
      };

      if (isEdit) {
        const { error } = await supabase
          .from('st_casas')
          .update(payload)
          .eq('id', casaId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('st_casas')
          .insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(`Casa ${isEdit ? 'atualizada' : 'criada'} com sucesso!`);
      if (contextType === 'select') {
        navigate('/admin/select');
      } else if (contextType === 'business') {
        navigate('/admin/business');
      } else {
        navigate('/admin/casas');
      }
    },
    onError: (error) => {
      console.error('Erro ao salvar casa:', error);
      toast.error('Erro ao salvar casa');
    },
  });

  const handleSubmit = () => {
    if (!formData.nome?.trim()) {
      toast.error('Nome da casa é obrigatório');
      return;
    }
    if (!formData.slug?.trim()) {
      toast.error('Slug é obrigatório');
      return;
    }
    if (!formData.empreendimento_id) {
      toast.error('Selecione um empreendimento');
      return;
    }
    saveMutation.mutate(formData);
  };

  const updateField = (field: keyof CasaData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleToggleTag = (tag: 'select' | 'business', checked: boolean | string) => {
    const isChecked = checked === true;
    setFormData(prev => {
      let newTags = [...prev.tags];
      if (isChecked) {
        if (!newTags.includes(tag)) {
          newTags.push(tag);
        }
      } else {
        newTags = newTags.filter(t => t !== tag);
      }
      return { ...prev, tags: newTags };
    });
  };

  const addPlanta = () => {
    setFormData(prev => ({
      ...prev,
      plantas: [...prev.plantas, { titulo: '', imagem: '' }],
    }));
  };

  const updatePlanta = (index: number, field: keyof PlantaItem, value: string) => {
    setFormData(prev => ({
      ...prev,
      plantas: prev.plantas.map((p, i) =>
        i === index ? { ...p, [field]: value } : p
      ),
    }));
  };

  const removePlanta = (index: number) => {
    setFormData(prev => ({
      ...prev,
      plantas: prev.plantas.filter((_, i) => i !== index),
    }));
  };

  if (isLoadingCasa) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${colors.light} 0%, #e0e7ff 100%)`,
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: `4px solid ${colors.border}`,
          borderTopColor: colors.primary,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
      </div>
    );
  }

  const getContextInfo = () => {
    switch (contextType) {
      case 'select':
        return {
          title: isEdit ? `Editar Casa Select: ${formData.nome}` : 'Nova Casa Select',
          icon: Trophy,
          isSelect: true,
          orderField: 'ordem_select',
          orderLabel: 'Ordem no Select',
          backPath: '/admin/select',
        };
      case 'business':
        return {
          title: isEdit ? `Editar Casa Business: ${formData.nome}` : 'Nova Casa Business',
          icon: Briefcase,
          isSelect: false,
          orderField: 'ordem_business',
          orderLabel: 'Ordem no Business',
          backPath: '/admin/business',
        };
      default:
        return {
          title: isEdit ? `Editar Casa: ${formData.nome}` : 'Nova Casa',
          icon: null,
          isSelect: null,
          orderField: 'ordem',
          orderLabel: 'Ordem Geral',
          backPath: '/admin/casas',
        };
    }
  };

  const contextInfo = getContextInfo();
  const IconComponent = contextInfo.icon;

  const generalTab = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {contextInfo.icon && (
        <div style={styleSheet.contextBadge(contextInfo.isSelect)}>
          <IconComponent size={22} />
          <span>{contextInfo.isSelect ? 'Casa Select' : 'Casa Business'}</span>
        </div>
      )}

      <div style={styleSheet.gridLayout}>
        <div style={styleSheet.inputGroup}>
          <label style={styleSheet.label}>
            <Map size={18} />
            Empreendimento <span style={{ color: colors.danger }}>*</span>
          </label>
          <Select
            value={formData.empreendimento_id || ''}
            onValueChange={(value) => updateField('empreendimento_id', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um empreendimento" />
            </SelectTrigger>
            <SelectContent>
              {empreendimentos?.map((emp) => (
                <SelectItem key={emp.id} value={emp.id}>
                  {emp.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div style={styleSheet.hint}>
            {formData.empreendimento_id ? 'Empreendimento vinculado' : 'Campo obrigatório'}
          </div>
        </div>

        <div style={styleSheet.inputGroup}>
          <label style={styleSheet.label}>
            <CheckCircle2 size={18} />
            Status
          </label>
          <Select
            value={formData.status}
            onValueChange={(value) => updateField('status', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="disponivel">Disponível</SelectItem>
              <SelectItem value="vendido">Vendido</SelectItem>
              <SelectItem value="reservado">Reservado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div style={styleSheet.inputGroup}>
        <label style={styleSheet.label}>
          <FileText size={18} />
          Nome da Casa *
        </label>
        <CustomInput
          value={formData.nome}
          onChange={(e: any) => updateField('nome', e.target.value)}
          placeholder="Ex: Casa Premium 120m²"
        />
      </div>

      <div style={styleSheet.gridLayout}>
        <div style={styleSheet.inputGroup}>
          <label style={styleSheet.label}>Tipo</label>
          <Select
            value={formData.tipo}
            onValueChange={(value) => updateField('tipo', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="casa">Casa</SelectItem>
              <SelectItem value="apartamento">Apartamento</SelectItem>
              <SelectItem value="cobertura">Cobertura</SelectItem>
              <SelectItem value="comercial">Comercial</SelectItem>
              <SelectItem value="terreno">Terreno</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div style={styleSheet.inputGroup}>
          <label style={styleSheet.label}>Slug</label>
          <SlugField
            value={formData.slug}
            onChange={(value) => updateField('slug', value)}
            basedOn={formData.nome}
            table="st_casas"
            currentId={casaId}
            required
          />
        </div>
      </div>

      {/* CONFIGURAÇÕES E CATEGORIAS */}
      <div style={styleSheet.sectionBox}>
        <div style={styleSheet.sectionTitle}>
          <CheckCircle2 size={22} />
          Configurações da Casa
        </div>

        <div style={styleSheet.gridLayout}>
          <label style={styleSheet.checkboxWrapper(formData.destaque, colors.primary)}>
            <input
              type="checkbox"
              checked={formData.destaque}
              onChange={(e) => updateField('destaque', e.target.checked)}
              style={styleSheet.checkboxInput}
            />
            <span style={styleSheet.checkboxLabel}>
              <Star size={16} />
              Casa Destaque
            </span>
          </label>

          <label style={styleSheet.checkboxWrapper(formData.is_active, colors.success)}>
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => updateField('is_active', e.target.checked)}
              style={styleSheet.checkboxInput}
            />
            <span style={styleSheet.checkboxLabel}>
              <CheckCircle2 size={16} />
              Ativo
            </span>
          </label>
        </div>
      </div>

      {/* CATEGORIAS SELECT/BUSINESS */}
      <div style={styleSheet.sectionBox}>
        <div style={styleSheet.sectionTitle}>
          <Trophy size={22} />
          Categorias
        </div>
        <div style={{ fontSize: '14px', color: colors.textMuted, marginBottom: '16px' }}>
          Marque em quais seções esta casa deve aparecer. Você pode selecionar ambas.
        </div>

        <div style={styleSheet.gridLayout}>
          <label style={styleSheet.checkboxWrapper(formData.tags.includes('select'), colors.orange)}>
            <input
              type="checkbox"
              checked={formData.tags.includes('select')}
              onChange={(e) => handleToggleTag('select', e.target.checked)}
              style={{ ...styleSheet.checkboxInput, accentColor: colors.orange }}
            />
            <span style={styleSheet.checkboxLabel}>
              <Trophy size={16} />
              Select
            </span>
          </label>

          <label style={styleSheet.checkboxWrapper(formData.tags.includes('business'), colors.darkBusiness)}>
            <input
              type="checkbox"
              checked={formData.tags.includes('business')}
              onChange={(e) => handleToggleTag('business', e.target.checked)}
              style={{ ...styleSheet.checkboxInput, accentColor: colors.darkBusiness }}
            />
            <span style={styleSheet.checkboxLabel}>
              <Briefcase size={16} />
              Business
            </span>
          </label>
        </div>
      </div>

      <div style={styleSheet.inputGroup}>
        <label style={styleSheet.label}>
          <FileText size={18} />
          Descrição Curta
        </label>
        <CustomTextarea
          value={formData.descricao_curta}
          onChange={(e: any) => updateField('descricao_curta', e.target.value)}
          placeholder="Breve descrição da casa..."
        />
      </div>

      {/* CARACTERÍSTICAS E VALORES */}
      <div style={styleSheet.sectionBox}>
        <div style={styleSheet.sectionTitle}>
          <ImageIcon size={22} />
          Características e Valores
        </div>

        <div style={styleSheet.gridLayout}>
          <div style={styleSheet.inputGroup}>
            <label style={styleSheet.label}>Preço (R$)</label>
            <CustomInput
              type="number"
              value={formData.preco}
              onChange={(e: any) => updateField('preco', e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Nova seção para as três áreas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          marginBottom: '24px',
        }}>
          <div style={styleSheet.inputGroup}>
            <label style={styleSheet.label}>Área Total (m²)</label>
            <CustomInput
              type="number"
              value={formData.metragem}
              onChange={(e: any) => updateField('metragem', e.target.value)}
              placeholder="0"
              step="0.01"
            />
          </div>
          <div style={styleSheet.inputGroup}>
            <label style={styleSheet.label}>Área Privativa (m²)</label>
            <CustomInput
              type="number"
              value={formData.area_privativa}
              onChange={(e: any) => updateField('area_privativa', e.target.value)}
              placeholder="0"
              step="0.01"
            />
          </div>
          <div style={styleSheet.inputGroup}>
            <label style={styleSheet.label}>Área do Terreno (m²)</label>
            <CustomInput
              type="number"
              value={formData.area_terreno}
              onChange={(e: any) => updateField('area_terreno', e.target.value)}
              placeholder="0"
              step="0.01"
            />
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          marginBottom: '24px',
        }}>
          <div style={styleSheet.inputGroup}>
            <label style={styleSheet.label}>Pavimentos</label>
            <CustomInput
              type="number"
              value={formData.pavimentos}
              onChange={(e: any) => updateField('pavimentos', e.target.value)}
              min="1"
            />
          </div>
          <div style={styleSheet.inputGroup}>
            <label style={styleSheet.label}>Quartos</label>
            <CustomInput
              type="number"
              value={formData.quartos}
              onChange={(e: any) => updateField('quartos', e.target.value)}
              placeholder="0"
            />
          </div>
          <div style={styleSheet.inputGroup}>
            <label style={styleSheet.label}>Suítes</label>
            <CustomInput
              type="number"
              value={formData.suites}
              onChange={(e: any) => updateField('suites', e.target.value)}
              placeholder="0"
            />
          </div>
        </div>

        <div style={styleSheet.gridLayout}>
          <div style={styleSheet.inputGroup}>
            <label style={styleSheet.label}>Banheiros</label>
            <CustomInput
              type="number"
              value={formData.banheiros}
              onChange={(e: any) => updateField('banheiros', e.target.value)}
              placeholder="0"
            />
          </div>
          <div style={styleSheet.inputGroup}>
            <label style={styleSheet.label}>Vagas de Garagem</label>
            <CustomInput
              type="number"
              value={formData.vagas}
              onChange={(e: any) => updateField('vagas', e.target.value)}
              placeholder="0"
            />
          </div>
        </div>

        <div style={styleSheet.gridLayout}>
          <div style={styleSheet.inputGroup}>
            <label style={styleSheet.label}>Ordem Geral</label>
            <CustomInput
              type="number"
              value={formData.ordem}
              onChange={(e: any) => updateField('ordem', e.target.value)}
              placeholder="0"
            />
          </div>
          {contextType !== 'general' && (
            <div style={styleSheet.inputGroup}>
              <label style={styleSheet.label}>
                {contextInfo.isSelect ? 'Ordem Select' : 'Ordem Business'}
              </label>
              <CustomInput
                type="number"
                value={formData[contextInfo.orderField as keyof CasaData] as number}
                onChange={(e: any) => updateField(contextInfo.orderField as keyof CasaData, e.target.value)}
                placeholder="0"
              />
            </div>
          )}
        </div>

        <div style={styleSheet.inputGroup}>
          <label style={styleSheet.label}>Comodidades</label>
          <CustomTextarea
            value={Array.isArray(formData.comodidades) ? formData.comodidades.join(', ') : ''}
            onChange={(e: any) => updateField('comodidades', e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean))}
            placeholder="Ex: Ar condicionado, Armários embutidos, etc. (separados por vírgula)"
          />
          <div style={styleSheet.hint}>Separe as comodidades por vírgula</div>
        </div>
      </div>
    </div>
  );

  const mediasTab = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={styleSheet.inputGroup}>
        <label style={styleSheet.label}>
          <ImageIcon size={18} />
          Foto de Capa
        </label>
        <ImageUploader
          value={formData.foto_capa}
          onChange={(url) => updateField('foto_capa', url)}
          bucket="empreendimentos"
        />
      </div>

      <div style={styleSheet.inputGroup}>
        <label style={styleSheet.label}>
          <ImageIcon size={18} />
          Imagem Hero
        </label>
        <ImageUploader
          value={formData.hero_image}
          onChange={(url) => updateField('hero_image', url)}
          bucket="empreendimentos"
        />
      </div>

      <div style={styleSheet.inputGroup}>
        <DraggableGallery
          label="Galeria de Imagens"
          description="Arraste para reordenar. A primeira imagem será usada como capa."
          value={formData.galeria}
          onChange={(urls) => updateField('galeria', Array.isArray(urls) ? urls : [urls])}
          maxFiles={50}
          bucket="empreendimentos"
        />
      </div>

      {/* PLANTAS */}
      <div style={styleSheet.sectionBox}>
        <div style={styleSheet.sectionTitle}>
          <ImageIcon size={22} />
          Plantas ({formData.plantas.length})
        </div>

        {formData.plantas.map((planta, index) => (
          <div
            key={index}
            style={{
              ...styleSheet.cardBox,
              ...(hoveredPlanta === index ? styleSheet.cardBoxHover : {}),
            }}
            onMouseEnter={() => setHoveredPlanta(index)}
            onMouseLeave={() => setHoveredPlanta(null)}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}>
              <label style={{ fontSize: '15px', fontWeight: '700', color: colors.text }}>
                Planta {index + 1}
              </label>
              <button
                onClick={() => removePlanta(index)}
                style={styleSheet.buttonDanger}
              >
                <TrashIcon size={16} />
                Remover
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={styleSheet.inputGroup}>
                <label style={styleSheet.label}>
                  <FileText size={16} />
                  Título
                </label>
                <CustomInput
                  placeholder="Título da planta"
                  value={planta.titulo}
                  onChange={(e: any) => updatePlanta(index, 'titulo', e.target.value)}
                />
              </div>

              <div style={styleSheet.inputGroup}>
                <label style={styleSheet.label}>
                  <ImageIcon size={16} />
                  Imagem
                </label>
                <ImageUploader
                  value={planta.imagem}
                  onChange={(url) => {
                    let stringUrl = '';
                    if (Array.isArray(url)) {
                      const first = url[0];
                      stringUrl = typeof first === 'string' ? first : (first as any)?.url || '';
                    } else if (typeof url === 'string') {
                      stringUrl = url;
                    } else {
                      stringUrl = (url as any)?.url || '';
                    }
                    updatePlanta(index, 'imagem', stringUrl);
                  }}
                  bucket="empreendimentos"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addPlanta}
          style={{
            ...styleSheet.button,
            background: 'white',
            color: colors.primary,
            border: `2px solid ${colors.primary}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          <Plus size={18} />
          Adicionar Planta
        </button>
      </div>

      <div style={styleSheet.inputGroup}>
        <label style={styleSheet.label}>
          <Video size={18} />
          URL do Vídeo
        </label>
        <CustomInput
          value={formData.video_url}
          onChange={(e: any) => updateField('video_url', e.target.value)}
          placeholder="https://youtube.com/..."
        />
        <div style={styleSheet.hint}>Insira a URL completa do vídeo</div>
      </div>

      <div style={styleSheet.inputGroup}>
        <label style={styleSheet.label}>
          <Video size={18} />
          URL Tour 360
        </label>
        <CustomInput
          value={formData.tour_360_url}
          onChange={(e: any) => updateField('tour_360_url', e.target.value)}
          placeholder="https://..."
        />
      </div>
    </div>
  );

  const detalhesTab = (
    <div style={styleSheet.inputGroup}>
      <label style={styleSheet.label}>
        <FileText size={18} />
        Descrição Detalhada
      </label>
      <RichTextEditor
        value={formData.descricao_detalhada}
        onChange={(value) => updateField('descricao_detalhada', value)}
      />
    </div>
  );

  const localizacaoTab = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={styleSheet.inputGroup}>
        <label style={styleSheet.label}>
          <MapPin size={18} />
          Código Embed do Google Maps
        </label>
        <CustomTextarea
          value={formData.mapa_google_embed}
          onChange={(e: any) => updateField('mapa_google_embed', e.target.value)}
          placeholder='<iframe src="https://www.google.com/maps/embed?..." ...></iframe>'
        />
        <div style={styleSheet.hint}>Cole o código embed do Google Maps aqui</div>
      </div>

      {formData.mapa_google_embed && (
        <div style={{
          padding: '16px',
          background: colors.light,
          borderRadius: '10px',
          border: `2px solid ${colors.border}`,
        }}>
          <label style={styleSheet.label}>
            <MapPin size={18} />
            Pré-visualização do Mapa
          </label>
          <div
            style={{
              marginTop: '16px',
              borderRadius: '10px',
              overflow: 'hidden',
              border: `2px solid ${colors.border}`,
              maxHeight: '400px',
            }}
            dangerouslySetInnerHTML={{ __html: formData.mapa_google_embed }}
          />
        </div>
      )}
    </div>
  );

  const tabs = [
    { value: 'geral', label: 'Geral', content: generalTab },
    { value: 'midias', label: 'Mídias', content: mediasTab },
    { value: 'detalhes', label: 'Detalhes', content: detalhesTab },
    { value: 'localizacao', label: 'Localização', content: localizacaoTab },
  ];

  return (
    <div style={styleSheet.globalContainer}>
      <div style={styleSheet.header}>
        <button
          onClick={() => navigate(contextInfo.backPath)}
          style={styleSheet.backButton}
          onMouseEnter={(e: any) => {
            e.currentTarget.style.borderColor = colors.primary;
            e.currentTarget.style.color = colors.primary;
          }}
          onMouseLeave={(e: any) => {
            e.currentTarget.style.borderColor = colors.border;
            e.currentTarget.style.color = colors.text;
          }}
        >
          <ArrowLeft size={16} />
          Voltar
        </button>
        <h1 style={styleSheet.headerTitle}>{contextInfo.title}</h1>
      </div>

      <div style={styleSheet.tabsContainer}>
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            style={styleSheet.tabButton(activeTab === tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={styleSheet.cardContainer}>
        {tabs.find(t => t.value === activeTab)?.content}

        <div style={{ marginTop: '40px', display: 'flex', gap: '16px' }}>
          <button
            onClick={handleSubmit}
            disabled={saveMutation.isPending}
            style={{
              ...styleSheet.button,
              opacity: saveMutation.isPending ? 0.6 : 1,
              cursor: saveMutation.isPending ? 'not-allowed' : 'pointer',
            }}
          >
            {saveMutation.isPending ? 'Salvando...' : 'Salvar Casa'}
          </button>
          <button
            onClick={() => navigate(contextInfo.backPath)}
            style={{
              ...styleSheet.button,
              background: 'white',
              color: colors.text,
              border: `2px solid ${colors.border}`,
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
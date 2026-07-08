import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Mail, Phone, Calendar, MessageSquare, Search, Filter, X, CheckCircle2, XCircle, Clock, Minus } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { sendLeadToCrm } from '@/lib/sendLeadToCrm';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Contato {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  interesse: string | null;
  mensagem: string | null;
  status: string;
  created_at: string;
  empreendimento_id: string | null;
  origem: string | null;
  crm_status: string | null;
  crm_enviado_em: string | null;
  crm_erro: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  url_origem: string | null;
}

export default function Contatos() {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContato, setSelectedContato] = useState<Contato | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [originTab, setOriginTab] = useState<'formulario' | 'whatsapp' | 'empreendimento'>('formulario');
  const [retryingCrmId, setRetryingCrmId] = useState<string | null>(null);

  // Theme colors
  const theme = typeof document !== 'undefined' ? document.documentElement.getAttribute("data-admin-theme") || "dark" : "dark";
  const isDark = theme === "dark";
  
  const bg = isDark ? "#0f1113" : "#f8f9fa";
  const surface = isDark ? "#1a1d21" : "#ffffff";
  const surface2 = isDark ? "#242830" : "#f1f3f5";
  const text = isDark ? "#ffffff" : "#1a1a1a";
  const textMuted = isDark ? "#94a3b8" : "#64748b";
  const border = isDark ? "#2a2e36" : "#e2e8f0";
  
  const brand = "#FFB000";
  const brandLight = "#FFCC4D";
  const success = "#10B981";
  const danger = "#EF4444";
  const info = "#3B82F6";

  useEffect(() => {
    loadContatos();
  }, []);

  const loadContatos = async () => {
    try {
      const { data, error } = await supabase
        .from('st_contatos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContatos(data || []);
    } catch (error) {
      console.error('Erro ao carregar contatos:', error);
      toast.error('Erro ao carregar contatos');
    } finally {
      setLoading(false);
    }
  };

  const retryCrmSend = async (contato: Contato) => {
    setRetryingCrmId(contato.id);
    try {
      await supabase
        .from('st_contatos')
        .update({ crm_status: 'pending', crm_erro: null, updated_at: new Date().toISOString() })
        .eq('id', contato.id);

      const ok = await sendLeadToCrm({
        contato_id: contato.id,
        nome: contato.nome,
        email: contato.email,
        telefone: contato.telefone,
        mensagem: contato.mensagem,
        interesse: contato.interesse,
        origem: contato.origem,
        url_origem: contato.url_origem,
        utm_source: contato.utm_source,
        utm_medium: contato.utm_medium,
        utm_campaign: contato.utm_campaign,
        utm_term: contato.utm_term,
        utm_content: contato.utm_content,
      });

      await loadContatos();

      if (ok) {
        toast.success('Lead reenviado ao Loft CRM');
      } else {
        toast.error('Falha ao reenviar lead ao Loft CRM');
      }
    } catch (error) {
      console.error('Erro ao reenviar lead ao CRM:', error);
      toast.error('Erro ao reenviar lead ao Loft CRM');
    } finally {
      setRetryingCrmId(null);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('st_contatos')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Status atualizado com sucesso');
      loadContatos();
      
      if (selectedContato?.id === id) {
        setSelectedContato({ ...selectedContato, status: newStatus });
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const filteredContatos = contatos.filter((c) => {
    const isWhatsAppLead = c.origem === 'whatsapp_modal';
    const isEmpreendimentoLead = c.origem === 'empreendimento_interesse_form';
    const matchesOrigin =
      originTab === 'whatsapp'
        ? isWhatsAppLead
        : originTab === 'empreendimento'
          ? isEmpreendimentoLead
          : !isWhatsAppLead && !isEmpreendimentoLead;
    const matchesStatus = statusFilter === 'todos' || c.status === statusFilter;
    const matchesSearch = !searchTerm || 
      c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.telefone && c.telefone.includes(searchTerm)) ||
      (c.interesse && c.interesse.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesOrigin && matchesStatus && matchesSearch;
  });

  const formularioCount = contatos.filter((c) => c.origem !== 'whatsapp_modal' && c.origem !== 'empreendimento_interesse_form').length;
  const whatsappCount = contatos.filter((c) => c.origem === 'whatsapp_modal').length;
  const empreendimentoCount = contatos.filter((c) => c.origem === 'empreendimento_interesse_form').length;

  const getCrmStatusIndicator = (contato: Contato) => {
    const configs: Record<string, { icon: typeof CheckCircle2; color: string; label: string }> = {
      success: { icon: CheckCircle2, color: success, label: 'Enviado ao Loft CRM' },
      error: { icon: XCircle, color: danger, label: 'Falha no envio ao Loft CRM' },
      pending: { icon: Clock, color: brand, label: 'Envio ao Loft CRM pendente' },
    };

    const config = contato.crm_status ? configs[contato.crm_status] : null;
    const Icon = config?.icon ?? Minus;
    const color = config?.color ?? textMuted;
    const label = config?.label ?? 'Sem registro de envio ao Loft CRM';

    const tooltipLines = [label];
    if (contato.crm_enviado_em) {
      tooltipLines.push(
        `Última tentativa: ${format(new Date(contato.crm_enviado_em), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`,
      );
    }
    if (contato.crm_status === 'error' && contato.crm_erro) {
      tooltipLines.push(contato.crm_erro);
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: `${color}15`,
              cursor: 'help',
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <Icon size={16} color={color} />
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs whitespace-pre-wrap">
          {tooltipLines.join('\n')}
        </TooltipContent>
      </Tooltip>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
      novo: { bg: `${brand}20`, color: brand, label: 'Novo' },
      'em-atendimento': { bg: `${info}20`, color: info, label: 'Em Atendimento' },
      resolvido: { bg: `${success}20`, color: success, label: 'Resolvido' },
      arquivado: { bg: `${textMuted}20`, color: textMuted, label: 'Arquivado' },
    };

    const config = statusConfig[status] || { bg: `${textMuted}20`, color: textMuted, label: status };

    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 12px',
        borderRadius: '8px',
        background: config.bg,
        color: config.color,
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'capitalize',
      }}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: `3px solid ${surface2}`,
          borderTop: `3px solid ${brand}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
      </div>
    );
  }

  return (
    <TooltipProvider>
    <div style={{ padding: '0', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
          <div style={{
            width: '4px',
            height: '32px',
            background: `linear-gradient(180deg, ${brand}, ${brandLight})`,
            borderRadius: '2px',
          }} />
          <h1 style={{
            fontSize: '32px',
            fontWeight: 800,
            color: text,
            margin: 0,
            letterSpacing: '-0.02em',
          }}>
            Contatos
          </h1>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: '20px' }}>
          <p style={{ color: textMuted, fontSize: '15px', margin: 0 }}>
            Gerencie os contatos recebidos pelo site
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
      }}>
        <button
          onClick={() => setOriginTab('formulario')}
          style={{
            padding: '10px 14px',
            borderRadius: '10px',
            border: `1px solid ${originTab === 'formulario' ? brand : border}`,
            background: originTab === 'formulario' ? `${brand}20` : surface2,
            color: originTab === 'formulario' ? brand : textMuted,
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          Formulário ({formularioCount})
        </button>
        <button
          onClick={() => setOriginTab('whatsapp')}
          style={{
            padding: '10px 14px',
            borderRadius: '10px',
            border: `1px solid ${originTab === 'whatsapp' ? brand : border}`,
            background: originTab === 'whatsapp' ? `${brand}20` : surface2,
            color: originTab === 'whatsapp' ? brand : textMuted,
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          WhatsApp Modal ({whatsappCount})
        </button>
        <button
          onClick={() => setOriginTab('empreendimento')}
          style={{
            padding: '10px 14px',
            borderRadius: '10px',
            border: `1px solid ${originTab === 'empreendimento' ? brand : border}`,
            background: originTab === 'empreendimento' ? `${brand}20` : surface2,
            color: originTab === 'empreendimento' ? brand : textMuted,
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          Interesse Empreendimento ({empreendimentoCount})
        </button>
      </div>

      <div style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '280px', maxWidth: '400px' }}>
          <Search size={16} color={textMuted} style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }} />
          <input
            type="text"
            placeholder="Buscar por nome, email ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 44px',
              borderRadius: '12px',
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
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
                borderRadius: '4px',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = `${textMuted}20`}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <X size={16} color={textMuted} />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} color={textMuted} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              background: surface2,
              border: `1px solid ${border}`,
              color: text,
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer',
              minWidth: '180px',
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
          >
            <option value="todos">Todos os status</option>
            <option value="novo">Novos</option>
            <option value="em-atendimento">Em Atendimento</option>
            <option value="resolvido">Resolvidos</option>
            <option value="arquivado">Arquivados</option>
          </select>
        </div>

        <div style={{
          padding: '12px 16px',
          borderRadius: '12px',
          background: surface2,
          border: `1px solid ${border}`,
          fontSize: '13px',
          color: textMuted,
          fontWeight: 500,
        }}>
          {filteredContatos.length} {filteredContatos.length === 1 ? 'contato' : 'contatos'}
        </div>
      </div>

      {/* Table */}
      <div style={{
        borderRadius: '20px',
        background: surface,
        border: `1px solid ${border}`,
        overflow: 'hidden',
        boxShadow: isDark 
          ? '0 4px 6px -1px rgba(0, 0, 0, 0.2)' 
          : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: surface2 }}>
                <th style={{
                  padding: '16px 20px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>Data</th>
                <th style={{
                  padding: '16px 20px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>Nome</th>
                <th style={{
                  padding: '16px 20px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>Email</th>
                <th style={{
                  padding: '16px 20px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>Telefone</th>
                <th style={{
                  padding: '16px 20px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>Interesse</th>
                <th style={{
                  padding: '16px 20px',
                  textAlign: 'center',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>Loft CRM</th>
                <th style={{
                  padding: '16px 20px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredContatos.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{
                    padding: '48px 20px',
                    textAlign: 'center',
                    color: textMuted,
                    fontSize: '14px',
                  }}>
                    Nenhum contato encontrado
                  </td>
                </tr>
              ) : (
                filteredContatos.map((contato, index) => (
                  <tr
                    key={contato.id}
                    onClick={() => setSelectedContato(contato)}
                    style={{
                      borderTop: index === 0 ? 'none' : `1px solid ${border}`,
                      cursor: 'pointer',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = surface2}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{
                      padding: '16px 20px',
                      fontSize: '14px',
                      color: text,
                      fontWeight: 500,
                    }}>
                      {format(new Date(contato.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </td>
                    <td style={{
                      padding: '16px 20px',
                      fontSize: '14px',
                      color: text,
                      fontWeight: 500,
                    }}>
                      {contato.nome}
                    </td>
                    <td style={{
                      padding: '16px 20px',
                      fontSize: '14px',
                      color: textMuted,
                    }}>
                      {contato.email}
                    </td>
                    <td style={{
                      padding: '16px 20px',
                      fontSize: '14px',
                      color: textMuted,
                    }}>
                      {contato.telefone || '-'}
                    </td>
                    <td style={{
                      padding: '16px 20px',
                      fontSize: '14px',
                      color: contato.origem === 'empreendimento_interesse_form' ? brand : textMuted,
                      fontWeight: contato.origem === 'empreendimento_interesse_form' ? 700 : 400,
                    }}>
                      {contato.interesse || '-'}
                    </td>
                    <td style={{
                      padding: '16px 20px',
                      textAlign: 'center',
                    }}>
                      {getCrmStatusIndicator(contato)}
                    </td>
                    <td style={{
                      padding: '16px 20px',
                    }}>
                      {getStatusBadge(contato.status)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalhes */}
      <Dialog open={!!selectedContato} onOpenChange={() => setSelectedContato(null)}>
        <DialogContent
          className="!flex max-h-[min(90dvh,820px)] w-[calc(100%-1.5rem)] max-w-[640px] !flex-col gap-0 overflow-hidden p-0 sm:rounded-2xl"
          style={{
            background: surface,
            border: `1px solid ${border}`,
          }}
        >
          <div
            style={{
              height: '3px',
              flexShrink: 0,
              background: `linear-gradient(90deg, ${brand}, ${brandLight}, ${brand})`,
            }}
          />

          <DialogHeader
            className="shrink-0 space-y-1 border-b px-6 py-5 pr-12 text-left"
            style={{ borderColor: border, background: surface2 }}
          >
            <DialogTitle style={{
              fontSize: '20px',
              fontWeight: 700,
              color: text,
              marginBottom: 0,
            }}>
              {selectedContato?.nome || 'Detalhes do Contato'}
            </DialogTitle>
            <DialogDescription style={{
              fontSize: '13px',
              color: textMuted,
            }}>
              {selectedContato
                ? format(new Date(selectedContato.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                : 'Informações completas do contato recebido'}
            </DialogDescription>
          </DialogHeader>

          {selectedContato && (
            <>
              <div
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
              {/* Nome e Status */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '20px',
                marginBottom: '24px',
                paddingBottom: '24px',
                borderBottom: `1px solid ${border}`,
              }}>
                <div>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: textMuted,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '8px',
                  }}>
                    Nome
                  </div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: text,
                  }}>
                    {selectedContato.nome}
                  </div>
                </div>

                <div>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: textMuted,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '8px',
                  }}>
                    Status
                  </div>
                  <select
                    value={selectedContato.status}
                    onChange={(e) => updateStatus(selectedContato.id, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: surface2,
                      border: `1px solid ${border}`,
                      color: text,
                      fontSize: '14px',
                      fontWeight: 500,
                      outline: 'none',
                      cursor: 'pointer',
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
                  >
                    <option value="novo">Novo</option>
                    <option value="em-atendimento">Em Atendimento</option>
                    <option value="resolvido">Resolvido</option>
                    <option value="arquivado">Arquivado</option>
                  </select>
                </div>
              </div>

              {/* Informações de Contato */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '16px',
                }}>
                  Informações de Contato
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Email */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '10px',
                    background: surface2,
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: `${brand}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Mail size={16} color={brand} />
                    </div>
                    <a
                      href={`mailto:${selectedContato.email}`}
                      style={{
                        color: brand,
                        fontSize: '14px',
                        fontWeight: 500,
                        textDecoration: 'none',
                        transition: 'opacity 0.2s ease',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      {selectedContato.email}
                    </a>
                  </div>

                  {/* Telefone */}
                  {selectedContato.telefone && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      borderRadius: '10px',
                      background: surface2,
                    }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: `${success}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Phone size={16} color={success} />
                      </div>
                      <a
                        href={`tel:${selectedContato.telefone}`}
                        style={{
                          color: success,
                          fontSize: '14px',
                          fontWeight: 500,
                          textDecoration: 'none',
                          transition: 'opacity 0.2s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                      >
                        {selectedContato.telefone}
                      </a>
                    </div>
                  )}

                  {/* Data */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '10px',
                    background: surface2,
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: `${info}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Calendar size={16} color={info} />
                    </div>
                    <span style={{
                      color: text,
                      fontSize: '14px',
                      fontWeight: 500,
                    }}>
                      {format(new Date(selectedContato.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Interesse */}
              {selectedContato.interesse && (
                <div style={{
                  marginBottom: '24px',
                  padding: '16px',
                  borderRadius: '12px',
                  background: surface2,
                }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: textMuted,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '8px',
                  }}>
                    Interesse
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: text,
                    fontWeight: 500,
                  }}>
                    {selectedContato.interesse}
                  </div>
                </div>
              )}

              {/* Mensagem */}
              {selectedContato.mensagem && (
                <div style={{
                  marginBottom: '24px',
                  padding: '16px',
                  borderRadius: '12px',
                  background: surface2,
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px',
                  }}>
                    <MessageSquare size={16} color={textMuted} />
                    <div style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: textMuted,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                      Mensagem
                    </div>
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: text,
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                  }}>
                    {selectedContato.mensagem}
                  </div>
                </div>
              )}

              {/* Loft CRM */}
              <div style={{
                marginBottom: '24px',
                padding: '16px',
                borderRadius: '12px',
                background: surface2,
              }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '12px',
                }}>
                  Integração Loft CRM
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {getCrmStatusIndicator(selectedContato)}
                  <div>
                    <div style={{ fontSize: '14px', color: text, fontWeight: 600 }}>
                      {selectedContato.crm_status === 'success'
                        ? 'Lead enviado com sucesso'
                        : selectedContato.crm_status === 'error'
                          ? 'Falha no envio'
                          : selectedContato.crm_status === 'pending'
                            ? 'Envio pendente'
                            : 'Sem registro de envio'}
                    </div>
                    {selectedContato.crm_enviado_em && (
                      <div style={{ fontSize: '12px', color: textMuted, marginTop: '4px' }}>
                        {format(new Date(selectedContato.crm_enviado_em), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </div>
                    )}
                    {selectedContato.crm_status === 'error' && selectedContato.crm_erro && (
                      <div style={{
                        fontSize: '12px',
                        color: danger,
                        marginTop: '8px',
                        lineHeight: 1.5,
                        whiteSpace: 'pre-wrap',
                      }}>
                        {selectedContato.crm_erro}
                      </div>
                    )}
                  </div>
                </div>
                {selectedContato.crm_status !== 'success' && (
                  <button
                    type="button"
                    onClick={() => retryCrmSend(selectedContato)}
                    disabled={retryingCrmId === selectedContato.id}
                    style={{
                      marginTop: '16px',
                      padding: '10px 16px',
                      borderRadius: '10px',
                      border: `1px solid ${brand}`,
                      background: `${brand}15`,
                      color: brand,
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: retryingCrmId === selectedContato.id ? 'wait' : 'pointer',
                      opacity: retryingCrmId === selectedContato.id ? 0.7 : 1,
                    }}
                  >
                    {retryingCrmId === selectedContato.id ? 'Reenviando...' : 'Reenviar ao Loft CRM'}
                  </button>
                )}
              </div>

              {(selectedContato.utm_source ||
                selectedContato.utm_medium ||
                selectedContato.utm_campaign ||
                selectedContato.utm_term ||
                selectedContato.utm_content) && (
                <div style={{
                  marginBottom: '24px',
                  padding: '16px',
                  borderRadius: '12px',
                  background: surface2,
                }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: textMuted,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '12px',
                  }}>
                    Rastreamento UTM
                  </div>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {[
                      ['Source', selectedContato.utm_source],
                      ['Medium', selectedContato.utm_medium],
                      ['Campaign', selectedContato.utm_campaign],
                      ['Term', selectedContato.utm_term],
                      ['Content', selectedContato.utm_content],
                    ]
                      .filter(([, value]) => value)
                      .map(([label, value]) => (
                        <div key={label} style={{ fontSize: '13px', color: text }}>
                          <span style={{ color: textMuted, fontWeight: 600 }}>{label}: </span>
                          {value}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Origem */}
              {selectedContato.origem && (
                <div style={{
                  marginBottom: '24px',
                  padding: '12px',
                  borderRadius: '10px',
                  background: `${textMuted}10`,
                  border: `1px dashed ${border}`,
                }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: textMuted,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '4px',
                  }}>
                    Origem
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: textMuted,
                    fontFamily: 'monospace',
                  }}>
                    {selectedContato.origem}
                  </div>
                </div>
              )}

              </div>

              {/* Botões de Ação — fixos no rodapé */}
              <div style={{
                display: 'flex',
                flexShrink: 0,
                gap: '12px',
                padding: '16px 24px',
                paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
                borderTop: `1px solid ${border}`,
                background: surface,
                flexWrap: 'wrap',
              }}>
                <button
                  onClick={() => window.open(`mailto:${selectedContato.email}`, '_blank')}
                  style={{
                    flex: '1 1 200px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${brand}, ${brandLight})`,
                    color: '#fff',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: `0 4px 14px 0 ${brand}30`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 6px 20px 0 ${brand}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `0 4px 14px 0 ${brand}30`;
                  }}
                >
                  <Mail size={16} />
                  Responder por Email
                </button>
                
                {selectedContato.telefone && (
                  <button
                    onClick={() => window.open(`https://wa.me/55${selectedContato.telefone.replace(/\D/g, '')}`, '_blank')}
                    style={{
                      flex: '1 1 200px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      background: surface2,
                      color: text,
                      border: `1px solid ${border}`,
                      fontWeight: 600,
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = surface;
                      e.currentTarget.style.borderColor = brand;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = surface2;
                      e.currentTarget.style.borderColor = border;
                    }}
                  >
                    <Phone size={16} />
                    WhatsApp
                  </button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
    </TooltipProvider>
  );
}

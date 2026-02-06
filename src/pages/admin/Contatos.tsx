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
import { Mail, Phone, Calendar, MessageSquare, Search, Filter, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
}

export default function Contatos() {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContato, setSelectedContato] = useState<Contato | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');

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
    const matchesStatus = statusFilter === 'todos' || c.status === statusFilter;
    const matchesSearch = !searchTerm || 
      c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.telefone && c.telefone.includes(searchTerm));
    return matchesStatus && matchesSearch;
  });

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
                  <td colSpan={6} style={{
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
                      color: textMuted,
                    }}>
                      {contato.interesse || '-'}
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
        <DialogContent style={{
          maxWidth: '640px',
          background: surface,
          border: `1px solid ${border}`,
          borderRadius: '20px',
          padding: '32px',
        }}>
          <DialogHeader>
            <DialogTitle style={{
              fontSize: '24px',
              fontWeight: 700,
              color: text,
              marginBottom: '8px',
            }}>
              Detalhes do Contato
            </DialogTitle>
            <DialogDescription style={{
              fontSize: '14px',
              color: textMuted,
            }}>
              Informações completas do contato recebido
            </DialogDescription>
          </DialogHeader>

          {selectedContato && (
            <div style={{ marginTop: '24px' }}>
              {/* Nome e Status */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
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

              {/* Botões de Ação */}
              <div style={{
                display: 'flex',
                gap: '12px',
                paddingTop: '24px',
                borderTop: `1px solid ${border}`,
              }}>
                <button
                  onClick={() => window.open(`mailto:${selectedContato.email}`, '_blank')}
                  style={{
                    flex: 1,
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
                      flex: 1,
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
            </div>
          )}
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

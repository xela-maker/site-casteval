import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { toast } from "sonner";
import { Plus, Home, Edit, Copy, Star, ExternalLink, Package, Trash2 } from 'lucide-react';
import { ConfirmModal } from "@/components/admin/ConfirmModal";

interface Casa {
  id: string;
  nome: string;
  slug: string;
  status: string;
  destaque: boolean;
  foto_capa: string;
  preco: number;
  metragem: number;
  quartos: number;
  suites: number;
  ordem: number;
  updated_at: string;
  empreendimento_id: string;
  tags: string[] | null;
}

interface Empreendimento {
  id: string;
  nome: string;
  slug: string;
}

export default function Casas() {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Tema
  const theme = document.documentElement.getAttribute("data-admin-theme") || "dark";
  const isDark = theme === "dark";
  const bg = isDark ? "#0a0e13" : "#f5f7fa";
  const surface = isDark ? "#141920" : "#ffffff";
  const surface2 = isDark ? "#1d2633" : "#f8fafc";
  const text = isDark ? "#ffffff" : "#0f172a";
  const textMuted = isDark ? "#94a3b8" : "#64748b";
  const border = isDark ? "#2a3543" : "#e2e8f0";
  const brand = "#FFB000";
  const brand600 = "#D89200";
  const brandLight = "#FFCC4D";
  const success = "#10B981";
  const info = "#3B82F6";
  const warning = "#F59E0B";
  const danger = "#EF4444";

  // Adicionar estilos globais
  useEffect(() => {
    const styleId = "admin-casas-modern-styles";

    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `
        /* Checkbox styling */
        input[type="checkbox"] {
          width: 20px !important;
          height: 20px !important;
          cursor: pointer !important;
          accent-color: #FFB000 !important;
        }

        /* Search styling */
        [class*="search"] input,
        input[placeholder*="Buscar"] {
          padding-left: 50px !important;
        }

        [class*="search"] svg {
          left: 14px !important;
        }

        /* Toolbar buttons */
        [role="toolbar"] button,
        button[aria-label*="column"],
        button[aria-label*="density"] {
          background-color: rgba(255, 176, 0, 0.12) !important;
          color: #FFB000 !important;
          border-color: rgba(255, 176, 0, 0.3) !important;
          border-radius: 8px !important;
        }

        [role="toolbar"] button:hover,
        button[aria-label*="column"]:hover,
        button[aria-label*="density"]:hover {
          background-color: rgba(255, 176, 0, 0.2) !important;
        }

        /* Select styling */
        select {
          background-color: #1d2633 !important;
          color: #ffffff !important;
          border-color: #2a3543 !important;
        }

        /* Table styling */
        thead th {
          background-color: transparent !important;
          border-bottom: 2px solid rgba(255, 176, 0, 0.2) !important;
          color: #94a3b8 !important;
          font-weight: 600 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
          font-size: 12px !important;
        }

        tbody tr {
          border-bottom: 1px solid #2a3543 !important;
          transition: all 0.2s ease !important;
        }

        tbody tr:hover {
          background-color: rgba(255, 176, 0, 0.05) !important;
        }

        tbody td {
          color: #ffffff !important;
          padding: 14px 8px !important;
        }

        /* Input styling */
        input[type="text"],
        input[type="search"] {
          background-color: #1d2633 !important;
          color: #ffffff !important;
          border-color: #2a3543 !important;
          border-radius: 8px !important;
        }

        input[type="text"]:focus,
        input[type="search"]:focus {
          border-color: #FFB000 !important;
          box-shadow: 0 0 0 3px rgba(255, 176, 0, 0.1) !important;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  const {
    data: casas = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-casas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("st_casas")
        .select(
          `
          *,
          empreendimento:st_empreendimentos!inner(id, nome, slug)
        `,
        )
        .order("ordem", { ascending: true });

      if (error) throw error;
      return data as (Casa & { empreendimento: Empreendimento })[];
    },
  });

  const stats = {
    total: casas.length,
    disponiveis: casas.filter((c) => c.status === "disponivel").length,
    vendidas: casas.filter((c) => c.status === "vendida").length,
    destacadas: casas.filter((c) => c.destaque).length,
  };

  const handleDuplicate = async (id: string) => {
    try {
      const original = casas.find((c) => c.id === id);
      if (!original) return;

      const { empreendimento, ...casaData } = original;

      const { data, error } = await supabase
        .from("st_casas")
        .insert({
          ...casaData,
          id: undefined,
          nome: `${casaData.nome} (Cópia)`,
          slug: `${casaData.slug}-copia-${Date.now()}`,
          status: "disponivel",
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Casa duplicada com sucesso");
      refetch();
      navigate(`/admin/casas/edit/${data.id}`);
    } catch (error) {
      console.error("Erro ao duplicar:", error);
      toast.error("Erro ao duplicar casa");
    }
  };

  const handleToggleDestaque = async (id: string, currentValue: boolean) => {
    try {
      const { error } = await supabase.from("st_casas").update({ destaque: !currentValue }).eq("id", id);

      if (error) throw error;

      toast.success(`Casa ${!currentValue ? "destacada" : "removida do destaque"}`);
      refetch();
    } catch (error) {
      console.error("Erro ao alterar destaque:", error);
      toast.error("Erro ao alterar destaque");
    }
  };

  const handleToggleSelect = async (id: string, tags: string[] | null) => {
    try {
      const currentTags = Array.isArray(tags) ? [...tags] : [];
      const isSelect = currentTags.includes('select');
      
      let newTags;
      if (isSelect) {
        // Remover 'select' das tags
        newTags = currentTags.filter((t) => t !== 'select');
      } else {
        // Adicionar 'select' às tags
        newTags = [...currentTags, 'select'];
      }

      const { error } = await supabase
        .from("st_casas")
        .update({ tags: newTags })
        .eq("id", id);

      if (error) throw error;

      toast.success(`Casa ${!isSelect ? "adicionada ao" : "removida do"} Select`);
      refetch();
    } catch (error) {
      console.error("Erro ao alterar Select:", error);
      toast.error("Erro ao alterar Select");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("st_casas")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("🗑️ Casa excluída com sucesso");
      refetch();
      setDeleteId(null);
    } catch (error) {
      console.error("Erro ao excluir:", error);
      toast.error("Erro ao excluir casa");
    }
  };

  const columns = [
    {
      key: "foto_capa",
      label: "Imagem",
      render: (item: Casa & { empreendimento: Empreendimento }) => (
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "12px",
            overflow: "hidden",
            background: surface2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `1px solid ${border}`,
          }}
        >
          {item.foto_capa ? (
            <img
              src={item.foto_capa}
              alt={item.nome}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={textMuted} strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          )}
        </div>
      ),
    },
    {
      key: "nome",
      label: "Casa",
      render: (item: Casa & { empreendimento: Empreendimento }) => (
        <div>
          <div
            style={{
              fontWeight: 600,
              color: text,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px",
            }}
          >
            {item.nome}
            {item.destaque && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill={warning} stroke={warning} strokeWidth="2">
                <polygon points="12 2 15.09 10.26 24 10.35 17.77 16.01 20.16 24.02 12 18.77 3.84 24.02 6.23 16.01 0 10.35 8.91 10.26 12 2"></polygon>
              </svg>
            )}
          </div>
          <div
            style={{
              fontSize: "12px",
              color: textMuted,
              marginTop: "4px",
              opacity: 0.8,
            }}
          >
            {item.empreendimento.nome}
          </div>
        </div>
      ),
    },
    {
      key: "preco",
      label: "Preço",
      render: (item: Casa) => (
        <span style={{ color: success, fontWeight: 600, fontSize: "14px" }}>
          {item.preco
            ? new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
                minimumFractionDigits: 0,
              }).format(item.preco)
            : "-"}
        </span>
      ),
    },
    {
      key: "metragem",
      label: "m²",
      render: (item: Casa) => (
        <span style={{ color: text, fontSize: "14px" }}>{item.metragem ? `${item.metragem}m²` : "-"}</span>
      ),
    },
    {
      key: "quartos",
      label: "Quartos",
      render: (item: Casa) => (
        <div style={{ textAlign: "center", color: text, fontSize: "14px", fontWeight: 600 }}>{item.quartos || "-"}</div>
      ),
    },
    {
      key: "suites",
      label: "Suítes",
      render: (item: Casa) => (
        <div style={{ textAlign: "center", color: text, fontSize: "14px", fontWeight: 600 }}>{item.suites || "-"}</div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item: Casa) => <StatusBadge status={item.status} />,
    },
    {
      key: "select",
      label: "Select",
      render: (item: Casa) => {
        const isSelect = Array.isArray(item.tags) && item.tags.includes('select');
        return (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleSelect(item.id, item.tags);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "44px",
                height: "24px",
                padding: "0",
                borderRadius: "12px",
                border: "none",
                background: isSelect ? brand : border,
                cursor: "pointer",
                transition: "all 0.2s ease",
                position: "relative",
              }}
              title={isSelect ? "Remover do Select" : "Adicionar ao Select"}
            >
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  background: "#fff",
                  transition: "all 0.2s ease",
                  transform: isSelect ? "translateX(10px)" : "translateX(-10px)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              />
            </button>
          </div>
        );
      },
    },
    {
      key: "actions",
      label: "Ações",
      render: (item: Casa & { empreendimento: Empreendimento }) => (
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/casas/edit/${item.id}`);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "10px",
                border: "none",
                background: `linear-gradient(135deg, ${brand}, ${brand600})`,
                color: "#fff",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
                transition: "all 0.2s ease",
                boxShadow: `0 2px 8px ${brand}30`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 4px 12px ${brand}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = `0 2px 8px ${brand}30`;
              }}
            >
              <Edit size={14} />
              Editar
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDuplicate(item.id);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px 10px",
                borderRadius: "10px",
                border: `1px solid ${border}`,
                background: surface2,
                color: textMuted,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${brand}15`;
                e.currentTarget.style.color = brand;
                e.currentTarget.style.borderColor = brand;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = surface2;
                e.currentTarget.style.color = textMuted;
                e.currentTarget.style.borderColor = border;
              }}
              title="Duplicar"
            >
              <Copy size={16} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleDestaque(item.id, item.destaque);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px 10px",
                borderRadius: "10px",
                border: `1px solid ${item.destaque ? warning : border}`,
                background: item.destaque ? `${warning}20` : surface2,
                color: item.destaque ? warning : textMuted,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${warning}25`;
                e.currentTarget.style.borderColor = warning;
                e.currentTarget.style.color = warning;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = item.destaque ? `${warning}20` : surface2;
                e.currentTarget.style.borderColor = item.destaque ? warning : border;
                e.currentTarget.style.color = item.destaque ? warning : textMuted;
              }}
              title="Destacar"
            >
              <Star size={16} fill={item.destaque ? warning : "none"} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(`/empreendimentos/${item.empreendimento.slug}/${item.slug}`, "_blank");
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px 10px",
                borderRadius: "10px",
                border: `1px solid ${border}`,
                background: surface2,
                color: textMuted,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${info}15`;
                e.currentTarget.style.color = info;
                e.currentTarget.style.borderColor = info;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = surface2;
                e.currentTarget.style.color = textMuted;
                e.currentTarget.style.borderColor = border;
              }}
              title="Ver no site"
            >
              <ExternalLink size={16} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeleteId(item.id);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px 10px",
                borderRadius: "10px",
                border: `1px solid ${border}`,
                background: surface2,
                color: danger,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${danger}15`;
                e.currentTarget.style.borderColor = danger;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = surface2;
                e.currentTarget.style.borderColor = border;
              }}
              title="Excluir"
            >
              <Trash2 size={16} />
            </button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          background: surface,
          borderRadius: "12px",
        }}
      >
        <div style={{ color: textMuted, fontSize: "16px" }}>Carregando casas...</div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: bg,
        padding: "32px 24px",
      }}
    >
      <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
        {/* Hero Section */}
        <div style={{ marginBottom: "48px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "24px",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    width: "4px",
                    height: "44px",
                    background: `linear-gradient(180deg, ${brand}, ${brand600})`,
                    borderRadius: "4px",
                  }}
                />
                <h1
                  style={{
                    fontSize: "40px",
                    fontWeight: 800,
                    margin: 0,
                    color: text,
                    letterSpacing: "-0.5px",
                  }}
                >
                  Casas
                </h1>
              </div>
              <p
                style={{
                  color: textMuted,
                  marginLeft: "24px",
                  fontSize: "15px",
                  margin: "8px 0 0 24px",
                }}
              >
                Gestão completa de unidades e imóveis
              </p>
            </div>

            <button
              onClick={() => navigate("/admin/casas/new")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "14px",
                background: `linear-gradient(135deg, ${brand}, ${brand600})`,
                color: "#0a0e13",
                boxShadow: `0 8px 24px ${brand}30`,
                transition: "all 0.3s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 12px 32px ${brand}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = `0 8px 24px ${brand}30`;
              }}
            >
              <Plus size={20} />
              Nova Casa
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          {/* Total Card */}
          <div
            style={{
              background: surface,
              border: `1px solid ${border}`,
              borderRadius: "16px",
              padding: "24px",
              transition: "all 0.3s ease",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = `0 12px 32px ${isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.08)"}`;
              e.currentTarget.style.borderColor = brand;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = border;
            }}
          >
            <div style={{ position: "absolute", top: "12px", right: "12px", opacity: 0.1 }}>
              <Package size={48} color={brand} strokeWidth={1} />
            </div>
            <div
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}
            >
              <span style={{ color: textMuted, fontSize: "13px", fontWeight: 500 }}>Total</span>
              <div style={{ background: `${brand}20`, padding: "8px", borderRadius: "10px" }}>
                <Package size={18} color={brand} />
              </div>
            </div>
            <div style={{ fontSize: "32px", fontWeight: 800, color: text, marginBottom: "8px" }}>{stats.total}</div>
            <div style={{ fontSize: "12px", color: textMuted }}>Casas cadastradas</div>
          </div>

          {/* Disponíveis Card */}
          <div
            style={{
              background: surface,
              border: `1px solid ${border}`,
              borderRadius: "16px",
              padding: "24px",
              transition: "all 0.3s ease",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = `0 12px 32px ${isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.08)"}`;
              e.currentTarget.style.borderColor = success;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = border;
            }}
          >
            <div style={{ position: "absolute", top: "12px", right: "12px", opacity: 0.1 }}>
              <Home size={48} color={success} strokeWidth={1} />
            </div>
            <div
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}
            >
              <span style={{ color: textMuted, fontSize: "13px", fontWeight: 500 }}>Disponíveis</span>
              <div style={{ background: `${success}20`, padding: "8px", borderRadius: "10px" }}>
                <Home size={18} color={success} />
              </div>
            </div>
            <div style={{ fontSize: "32px", fontWeight: 800, color: text, marginBottom: "8px" }}>
              {stats.disponiveis}
            </div>
            <div style={{ fontSize: "12px", color: textMuted }}>Prontas para venda</div>
          </div>

          {/* Vendidas Card */}
          <div
            style={{
              background: surface,
              border: `1px solid ${border}`,
              borderRadius: "16px",
              padding: "24px",
              transition: "all 0.3s ease",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = `0 12px 32px ${isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.08)"}`;
              e.currentTarget.style.borderColor = info;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = border;
            }}
          >
            <div style={{ position: "absolute", top: "12px", right: "12px", opacity: 0.1 }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={info} strokeWidth="1">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}
            >
              <span style={{ color: textMuted, fontSize: "13px", fontWeight: 500 }}>Vendidas</span>
              <div style={{ background: `${info}20`, padding: "8px", borderRadius: "10px" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={info} strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
            </div>
            <div style={{ fontSize: "32px", fontWeight: 800, color: text, marginBottom: "8px" }}>{stats.vendidas}</div>
            <div style={{ fontSize: "12px", color: textMuted }}>Transações fechadas</div>
          </div>

          {/* Destacadas Card */}
          <div
            style={{
              background: surface,
              border: `1px solid ${border}`,
              borderRadius: "16px",
              padding: "24px",
              transition: "all 0.3s ease",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = `0 12px 32px ${isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.08)"}`;
              e.currentTarget.style.borderColor = warning;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = border;
            }}
          >
            <div style={{ position: "absolute", top: "12px", right: "12px", opacity: 0.1 }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={warning} strokeWidth="1">
                <polygon points="12 2 15.09 10.26 24 10.35 17.77 16.01 20.16 24.02 12 18.77 3.84 24.02 6.23 16.01 0 10.35 8.91 10.26 12 2"></polygon>
              </svg>
            </div>
            <div
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}
            >
              <span style={{ color: textMuted, fontSize: "13px", fontWeight: 500 }}>Destacadas</span>
              <div style={{ background: `${warning}20`, padding: "8px", borderRadius: "10px" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill={warning} stroke={warning} strokeWidth="2">
                  <polygon points="12 2 15.09 10.26 24 10.35 17.77 16.01 20.16 24.02 12 18.77 3.84 24.02 6.23 16.01 0 10.35 8.91 10.26 12 2"></polygon>
                </svg>
              </div>
            </div>
            <div style={{ fontSize: "32px", fontWeight: 800, color: text, marginBottom: "8px" }}>
              {stats.destacadas}
            </div>
            <div style={{ fontSize: "12px", color: textMuted }}>Marcadas em destaque</div>
          </div>
        </div>

        {/* Data Table Card */}
        <div
          style={{
            background: surface,
            borderRadius: "18px",
            border: `1px solid ${border}`,
            boxShadow: isDark ? "0 8px 24px rgba(0, 0, 0, 0.4)" : "0 2px 8px rgba(0, 0, 0, 0.06)",
            padding: "32px",
            overflow: "hidden",
          }}
        >
          <div style={{ marginBottom: "24px", paddingBottom: "24px", borderBottom: `1px solid ${border}` }}>
            <h2
              style={{
                color: text,
                fontSize: "20px",
                fontWeight: 700,
                margin: 0,
              }}
            >
              Lista de Casas
            </h2>
            <p
              style={{
                color: textMuted,
                fontSize: "13px",
                marginTop: "6px",
                margin: "6px 0 0 0",
              }}
            >
              {casas.length} casa(s) encontrada(s)
            </p>
          </div>

          <div style={{ overflowX: "auto" }}>
            <DataTable
              data={casas}
              columns={columns}
              searchPlaceholder="Buscar por nome, empreendimento..."
              emptyMessage="Nenhuma casa encontrada"
              onRowClick={(item) => navigate(`/admin/casas/edit/${item.id}`)}
            />
          </div>
        </div>
      </div>

      <ConfirmModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Excluir Casa"
        description="Tem certeza que deseja excluir esta casa? Esta ação não pode ser desfeita."
        onConfirm={() => deleteId && handleDelete(deleteId)}
        variant="delete"
      />
    </div>
  );
}

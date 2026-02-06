import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { TableBase } from "@/components/admin/TableBase";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import {
  Plus,
  Building2,
  MapPin,
  Eye,
  Copy,
  CheckCircle2,
  FileText,
  Archive,
  Layers3,
  Edit,
  Trash2,
  Search,
  Columns,
  LayoutGrid,
  Check,
  Home,
  Star,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface Empreendimento {
  id: string;
  nome: string;
  slug: string;
  status: string;
  endereco_cidade: string;
  endereco_uf: string;
  preco_inicial: number;
  hero_image: string;
  ordem: number;
  updated_at: string;
  destaque: boolean;
}

export default function Empreendimentos() {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [confirmArchive, setConfirmArchive] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewDensity, setViewDensity] = useState<"comfortable" | "compact">("comfortable");
  const [visibleColumns, setVisibleColumns] = useState({
    checkbox: true,
    destaque: true,
    hero_image: true,
    nome: true,
    status: false,
    localizacao: true,
    preco_inicial: true,
    actions: true,
  });
  const [showColumnMenu, setShowColumnMenu] = useState(false);

  // Tema
  const theme = document.documentElement.getAttribute("data-admin-theme") || "dark";
  const isDark = theme === "dark";

  const bg = isDark ? "#0f1113" : "#f8f9fa";
  const surface = isDark ? "#1a1d21" : "#ffffff";
  const surface2 = isDark ? "#242830" : "#f1f3f5";
  const text = isDark ? "#ffffff" : "#1a1a1a";
  const textMuted = isDark ? "#94a3b8" : "#64748b";
  const border = isDark ? "#2a2e36" : "#e2e8f0";
  const brand = "#FFB000";
  const brandLight = "#FFCC4D";
  const brand600 = "#D89200";
  const success = "#10B981";
  const successLight = "#34D399";
  const info = "#3B82F6";
  const infoLight = "#60A5FA";
  const warning = "#F59E0B";
  const warningLight = "#FCD34D";
  const danger = "#EF4444";
  const dangerLight = "#F87171";

  const {
    data: empreendimentos = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-empreendimentos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("st_empreendimentos").select("*").order("ordem", { ascending: true });

      if (error) throw error;
      return data as Empreendimento[];
    },
  });

  const stats = useMemo(
    () => ({
      total: empreendimentos.length,
      ativos: empreendimentos.filter((e) => e.status === "ativo").length,
      rascunhos: empreendimentos.filter((e) => e.status === "rascunho").length,
      arquivados: empreendimentos.filter((e) => e.status === "arquivado").length,
    }),
    [empreendimentos],
  );

  const handleDuplicate = async (id: string) => {
    try {
      const original = empreendimentos.find((e) => e.id === id);
      if (!original) return;

      const { data, error } = await supabase
        .from("st_empreendimentos")
        .insert({
          ...original,
          id: undefined,
          nome: `${original.nome} (Cópia)`,
          slug: `${original.slug}-copia-${Date.now()}`,
          status: "rascunho",
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("✨ Empreendimento duplicado com sucesso");
      refetch();
      navigate(`/admin/empreendimentos/edit/${data.id}`);
    } catch (error) {
      console.error("Erro ao duplicar:", error);
      toast.error("Erro ao duplicar empreendimento");
    }
  };

  const handleArchive = async () => {
    try {
      const { error } = await supabase.from("st_empreendimentos").update({ status: "arquivado" }).in("id", selectedIds);

      if (error) throw error;

      toast.success(`📦 ${selectedIds.length} empreendimento(s) arquivado(s)`);
      refetch();
      setSelectedIds([]);
      setConfirmArchive(false);
    } catch (error) {
      console.error("Erro ao arquivar:", error);
      toast.error("Erro ao arquivar empreendimentos");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("st_empreendimentos")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("🗑️ Empreendimento excluído com sucesso");
      refetch();
      setDeleteId(null);
    } catch (error) {
      console.error("Erro ao excluir:", error);
      toast.error("Erro ao excluir empreendimento");
    }
  };

  const handleToggleDestaque = async (id: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from("st_empreendimentos")
        .update({ destaque: !currentValue })
        .eq("id", id);

      if (error) throw error;

      toast.success(
        !currentValue 
          ? "⭐ Empreendimento marcado como destaque" 
          : "Destaque removido"
      );
      refetch();
    } catch (error) {
      console.error("Erro ao atualizar destaque:", error);
      toast.error("Erro ao atualizar destaque");
    }
  };

  const filteredData = useMemo(
    () =>
      empreendimentos.filter(
        (item) =>
          item.nome.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.slug.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.endereco_cidade?.toLowerCase().includes(searchValue.toLowerCase()),
      ),
    [empreendimentos, searchValue],
  );

  // Card de Estatística
  const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    bgColor,
    iconColor,
    percentOfTotal,
  }: {
    title: string;
    value: number;
    subtitle: string;
    icon: any;
    bgColor: string;
    iconColor: string;
    percentOfTotal?: number;
  }) => (
    <div
      style={{
        position: "relative",
        background: surface,
        border: `1px solid ${border}`,
        borderRadius: 16,
        padding: 20,
        overflow: "hidden",
        transition: "all 0.2s ease",
      }}
    >
      <div style={{ position: "relative" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
            alignItems: "flex-start",
          }}
        >
          <div>
            <span
              style={{
                color: textMuted,
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {title}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 12,
              background: bgColor,
            }}
          >
            <Icon size={20} color={iconColor} strokeWidth={2} />
          </div>
        </div>

        <div
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: text,
            marginBottom: 8,
            lineHeight: 1,
          }}
        >
          {value}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: textMuted }}>{subtitle}</span>
          {percentOfTotal !== undefined && percentOfTotal > 0 && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "2px 6px",
                borderRadius: 6,
                background: bgColor,
                color: text,
              }}
            >
              {percentOfTotal}%
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const columns = [
    // Checkbox column
    {
      key: "checkbox",
      label: "",
      visible: visibleColumns.checkbox,
      width: "40px",
      render: (item: Empreendimento) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(item.id)}
          onChange={(e) => {
            e.stopPropagation();
            if (e.target.checked) {
              setSelectedIds([...selectedIds, item.id]);
            } else {
              setSelectedIds(selectedIds.filter((id) => id !== item.id));
            }
          }}
          style={{
            width: 18,
            height: 18,
            cursor: "pointer",
            accentColor: brand,
          }}
        />
      ),
    },
    {
      key: "destaque",
      label: "",
      visible: visibleColumns.destaque,
      width: "50px",
      render: (item: Empreendimento) => (
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleToggleDestaque(item.id, item.destaque);
          }}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <Star
            size={20}
            color={brand}
            fill={item.destaque ? brand : "none"}
            strokeWidth={2}
          />
        </div>
      ),
    },
    {
      key: "hero_image",
      label: "",
      visible: visibleColumns.hero_image,
      width: viewDensity === "compact" ? "50px" : "70px",
      render: (item: Empreendimento) => (
        <div
          style={{
            width: viewDensity === "compact" ? 40 : 60,
            height: viewDensity === "compact" ? 40 : 60,
            borderRadius: 10,
            overflow: "hidden",
            background: surface2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `1px solid ${border}`,
            position: "relative",
          }}
        >
          {item.hero_image ? (
            <img
              src={item.hero_image}
              alt={item.nome}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <Building2 size={20} color={textMuted} />
          )}

          {/* Status Indicator */}
          <div
            style={{
              position: "absolute",
              bottom: 2,
              right: 2,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: item.status === "ativo" ? success : item.status === "rascunho" ? warning : danger,
              border: `2px solid ${surface}`,
            }}
          />
        </div>
      ),
    },
    {
      key: "nome",
      label: "EMPREENDIMENTO",
      visible: visibleColumns.nome,
      render: (item: Empreendimento) => (
        <div style={{ padding: viewDensity === "compact" ? "2px 0" : "4px 0" }}>
          <div
            style={{
              fontWeight: 600,
              color: text,
              fontSize: viewDensity === "compact" ? 13 : 14,
              marginBottom: viewDensity === "compact" ? 2 : 4,
            }}
          >
            {item.nome}
          </div>
          <div
            style={{
              fontSize: viewDensity === "compact" ? 11 : 12,
              color: textMuted,
              opacity: 0.8,
            }}
          >
            /{item.slug}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "STATUS",
      visible: visibleColumns.status,
      render: (item: Empreendimento) => <StatusBadge status={item.status} />,
    },
    {
      key: "localizacao",
      label: "LOCALIZAÇÃO",
      visible: visibleColumns.localizacao,
      render: (item: Empreendimento) => (
        <span
          style={{
            color: textMuted,
            fontSize: viewDensity === "compact" ? 12 : 13,
          }}
        >
          {item.endereco_cidade}, {item.endereco_uf}
        </span>
      ),
    },
    {
      key: "preco_inicial",
      label: "PREÇO BASE",
      visible: visibleColumns.preco_inicial,
      render: (item: Empreendimento) => (
        <div>
          <span
            style={{
              color: text,
              fontSize: viewDensity === "compact" ? 13 : 14,
              fontWeight: 600,
            }}
          >
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(item.preco_inicial)}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      label: "",
      visible: visibleColumns.actions,
      width: "auto",
      render: (item: Empreendimento) => (
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/empreendimentos/edit/${item.id}`);
            }}
            style={{
              padding: viewDensity === "compact" ? "6px 10px" : "8px 12px",
              borderRadius: 8,
              border: `1px solid ${border}`,
              background: surface,
              color: text,
              cursor: "pointer",
              fontSize: viewDensity === "compact" ? 11 : 12,
              fontWeight: 500,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = surface2;
              e.currentTarget.style.borderColor = brand;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = surface;
              e.currentTarget.style.borderColor = border;
            }}
          >
            Editar
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDuplicate(item.id);
            }}
            style={{
              padding: viewDensity === "compact" ? "6px 10px" : "8px 12px",
              borderRadius: 8,
              border: `1px solid ${border}`,
              background: surface,
              color: text,
              cursor: "pointer",
              fontSize: viewDensity === "compact" ? 11 : 12,
              fontWeight: 500,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = surface2;
              e.currentTarget.style.borderColor = brand;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = surface;
              e.currentTarget.style.borderColor = border;
            }}
          >
            Duplicar
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteId(item.id);
            }}
            style={{
              padding: viewDensity === "compact" ? "6px 10px" : "8px 12px",
              borderRadius: 8,
              border: `1px solid ${border}`,
              background: surface,
              color: danger,
              cursor: "pointer",
              fontSize: viewDensity === "compact" ? 11 : 12,
              fontWeight: 500,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${danger}15`;
              e.currentTarget.style.borderColor = danger;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = surface;
              e.currentTarget.style.borderColor = border;
            }}
            title="Excluir"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: bg,
        padding: "32px",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* HEADER */}
        <div style={{ marginBottom: 40 }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: 4,
                    height: 40,
                    background: `linear-gradient(180deg, ${brand}, ${brandLight})`,
                    borderRadius: 2,
                  }}
                />
                <h1
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                    margin: 0,
                    color: text,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <Building2 size={32} />
                  Empreendimentos
                </h1>
              </div>
              <p
                style={{
                  color: textMuted,
                  marginLeft: 20,
                  fontSize: 15,
                  marginTop: 4,
                }}
              >
                Gerencie todos os empreendimentos da Casteval
              </p>
            </div>

            <button
              onClick={() => navigate("/admin/empreendimentos/new")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 28px",
                borderRadius: 14,
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 15,
                background: `linear-gradient(135deg, ${brand}, ${brand600})`,
                color: "#fff",
                boxShadow: `0 8px 24px ${brand}40`,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 12px 28px ${brand}50`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = `0 8px 24px ${brand}40`;
              }}
            >
              <Plus size={20} />
              Novo Empreendimento
            </button>
          </div>
        </div>

        {/* CARDS DE ESTATÍSTICAS - 4 COLUNAS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
            marginBottom: 32,
          }}
        >
          <StatCard
            title="TOTAL DE PROJETOS"
            value={stats.total}
            subtitle="Empreendimentos cadastrados"
            icon={Layers3}
            bgColor={`${info}20`}
            iconColor={info}
          />

          <StatCard
            title="PUBLICADOS"
            value={stats.ativos}
            subtitle="Visíveis no site"
            icon={CheckCircle2}
            bgColor={`${success}20`}
            iconColor={success}
            percentOfTotal={stats.total > 0 ? Math.round((stats.ativos / stats.total) * 100) : 0}
          />

          <StatCard
            title="EM DESENVOLVIMENTO"
            value={stats.rascunhos}
            subtitle="Aguardando publicação"
            icon={FileText}
            bgColor={`${warning}20`}
            iconColor={warning}
            percentOfTotal={stats.total > 0 ? Math.round((stats.rascunhos / stats.total) * 100) : 0}
          />

          <StatCard
            title="ARQUIVADOS"
            value={stats.arquivados}
            subtitle="Removidos do site"
            icon={Archive}
            bgColor={`${danger}20`}
            iconColor={danger}
            percentOfTotal={stats.total > 0 ? Math.round((stats.arquivados / stats.total) * 100) : 0}
          />
        </div>

        {/* TABELA */}
        <div
          style={{
            background: surface,
            borderRadius: 20,
            border: `1px solid ${border}`,
            overflow: "hidden",
          }}
        >
          {/* Header da tabela */}
          <div
            style={{
              padding: "20px 24px",
              borderBottom: `1px solid ${border}`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <div>
                <h2
                  style={{
                    color: text,
                    fontSize: 18,
                    fontWeight: 700,
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Home size={20} />
                  Todos os Empreendimentos
                </h2>
                <p
                  style={{
                    color: textMuted,
                    fontSize: 13,
                    marginTop: 4,
                    marginBottom: 0,
                  }}
                >
                  Exibindo todos os {filteredData.length} empreendimentos
                </p>
              </div>

              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                {/* Search Bar */}
                <div
                  style={{
                    position: "relative",
                    width: 300,
                  }}
                >
                  <Search
                    size={18}
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: textMuted,
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Buscar por nome, slug ou cidade..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px 10px 40px",
                      borderRadius: 10,
                      border: `1px solid ${border}`,
                      background: surface,
                      color: text,
                      fontSize: 13,
                      outline: "none",
                      transition: "all 0.2s ease",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = brand;
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${brand}20`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = border;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>

                {/* Controles de Coluna e Densidade */}
                <div style={{ display: "flex", gap: 8 }}>
                  {/* Colunas */}
                  <div style={{ position: "relative" }}>
                    <button
                      onClick={() => setShowColumnMenu(!showColumnMenu)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: `1px solid ${border}`,
                        background: surface,
                        color: textMuted,
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 500,
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = surface2;
                        e.currentTarget.style.color = text;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = surface;
                        e.currentTarget.style.color = textMuted;
                      }}
                    >
                      <Columns size={16} />
                      Colunas
                    </button>

                    {showColumnMenu && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          right: 0,
                          marginTop: 8,
                          background: surface,
                          border: `1px solid ${border}`,
                          borderRadius: 12,
                          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                          padding: 8,
                          minWidth: 200,
                          zIndex: 1000,
                        }}
                      >
                        {Object.entries({
                          hero_image: "Imagem",
                          nome: "Nome",
                          status: "Status",
                          localizacao: "Localização",
                          preco_inicial: "Preço",
                          actions: "Ações",
                        }).map(([key, label]) => (
                          <label
                            key={key}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              padding: "8px 12px",
                              cursor: "pointer",
                              borderRadius: 8,
                              transition: "background 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = surface2;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent";
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={visibleColumns[key as keyof typeof visibleColumns]}
                              onChange={(e) => {
                                setVisibleColumns({
                                  ...visibleColumns,
                                  [key]: e.target.checked,
                                });
                              }}
                              style={{
                                width: 16,
                                height: 16,
                                accentColor: brand,
                              }}
                            />
                            <span style={{ color: text, fontSize: 13 }}>{label}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Densidade */}
                  <button
                    onClick={() => setViewDensity(viewDensity === "comfortable" ? "compact" : "comfortable")}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: `1px solid ${border}`,
                      background: surface,
                      color: textMuted,
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 500,
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = surface2;
                      e.currentTarget.style.color = text;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = surface;
                      e.currentTarget.style.color = textMuted;
                    }}
                  >
                    <LayoutGrid size={16} />
                    Densidade
                  </button>
                </div>

                {selectedIds.length > 0 && (
                  <button
                    onClick={() => setConfirmArchive(true)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 16px",
                      borderRadius: 8,
                      border: "none",
                      background: `${danger}15`,
                      color: danger,
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `${danger}25`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = `${danger}15`;
                    }}
                  >
                    <Archive size={14} />
                    Arquivar ({selectedIds.length})
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Conteúdo da Tabela */}
          <div style={{ padding: 0 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${border}` }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", width: "40px" }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredData.length && filteredData.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds(filteredData.map((item) => item.id));
                        } else {
                          setSelectedIds([]);
                        }
                      }}
                      style={{
                        width: 18,
                        height: 18,
                        cursor: "pointer",
                        accentColor: brand,
                      }}
                    />
                  </th>
                  {columns
                    .filter((col) => col.visible && col.key !== "checkbox")
                    .map((column) => (
                      <th
                        key={column.key}
                        style={{
                          padding: "12px 16px",
                          textAlign: "left",
                          color: textMuted,
                          fontSize: 11,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          width: column.width,
                        }}
                      >
                        {column.label}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => navigate(`/admin/empreendimentos/edit/${item.id}`)}
                    style={{
                      borderBottom: `1px solid ${border}`,
                      cursor: "pointer",
                      transition: "background 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = surface2;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {columns
                      .filter((col) => col.visible)
                      .map((column) => (
                        <td
                          key={column.key}
                          style={{
                            padding: viewDensity === "compact" ? "8px 16px" : "12px 16px",
                          }}
                        >
                          {column.render(item)}
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredData.length === 0 && (
              <div
                style={{
                  padding: 60,
                  textAlign: "center",
                  color: textMuted,
                }}
              >
                <Building2 size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
                <p style={{ fontSize: 16, marginBottom: 8 }}>Nenhum empreendimento encontrado</p>
                <p style={{ fontSize: 14 }}>Tente ajustar os filtros ou adicione um novo empreendimento</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        open={confirmArchive}
        onOpenChange={setConfirmArchive}
        title="Arquivar Empreendimentos"
        description={`Tem certeza que deseja arquivar ${selectedIds.length} empreendimento(s)? Esta ação pode ser revertida editando o status posteriormente.`}
        onConfirm={handleArchive}
        variant="archive"
      />

      <ConfirmModal
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Excluir Empreendimento"
        description="Tem certeza que deseja excluir este empreendimento? Esta ação não pode ser desfeita."
        onConfirm={() => deleteId && handleDelete(deleteId)}
        variant="delete"
      />
    </div>
  );
}

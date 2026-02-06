import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Building2,
  FileText,
  Mail,
  TrendingUp,
  Home,
  CheckCircle2,
  Plus,
  Activity,
  Clock,
  ArrowUpRight,
  Users,
  FileEdit,
  Star,
  Eye,
} from "lucide-react";

type StatState = {
  empreendimentos: number;
  casas: number;
  casasDisponiveis: number;
  casasVendidas: number;
  posts: number;
  postsPublicados: number;
  postsRascunhos: number;
  postsDestaque: number;
  visualizacoesTotais: number;
  contatos: number;
  contatosNovos: number;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatState>({
    empreendimentos: 0,
    casas: 0,
    casasDisponiveis: 0,
    casasVendidas: 0,
    posts: 0,
    postsPublicados: 0,
    postsRascunhos: 0,
    postsDestaque: 0,
    visualizacoesTotais: 0,
    contatos: 0,
    contatosNovos: 0,
  });

  const [latestPosts, setLatestPosts] = useState<any[]>([]);

  // tema (lendo do atributo que o Header grava)
  const theme = document.documentElement.getAttribute("data-admin-theme") || "dark";
  const isDark = theme === "dark";
  const bg = isDark ? "#0f1113" : "#f8f9fa";
  const surface = isDark ? "#1a1d21" : "#ffffff";
  const surface2 = isDark ? "#242830" : "#f1f3f5";
  const text = isDark ? "#ffffff" : "#1a1a1a";
  const muted = isDark ? "#94a3b8" : "#64748b";
  const border = isDark ? "#2a2e36" : "#e2e8f0";
  const brand = "#FFB000";
  const brandLight = "#FFCC4D";
  const brand600 = "#D89200";
  const success = "#10B981";
  const successLight = "#34D399";
  const warn = "#F59E0B";
  const warnLight = "#FCD34D";
  const info = "#3B82F6";
  const infoLight = "#60A5FA";

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const [
      empreendimentosResult,
      casasResult,
      casasDisponiveisResult,
      casasVendidasResult,
      posts,
      postsPublicados,
      postsRascunhos,
      postsDestaque,
      visualizacoes,
      contatos,
      contatosNovos,
      postsRecentes,
    ] = await Promise.all([
      supabase.from("st_empreendimentos").select("id", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("st_casas").select("id", { count: "exact", head: true }).eq("is_active", true),
      supabase
        .from("st_casas")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true)
        .eq("status", "disponivel"),
      supabase.from("st_casas").select("id", { count: "exact", head: true }).eq("status", "vendida"),
      supabase.from("st_blog_posts").select("id", { count: "exact", head: true }),
      supabase.from("st_blog_posts").select("id", { count: "exact", head: true }).eq("is_published", true),
      supabase.from("st_blog_posts").select("id", { count: "exact", head: true }).eq("is_published", false),
      supabase.from("st_blog_posts").select("id", { count: "exact", head: true }).eq("is_destaque", true),
      supabase.from("st_blog_posts").select("visualizacoes"),
      supabase.from("st_contatos").select("id", { count: "exact", head: true }),
      supabase.from("st_contatos").select("id", { count: "exact", head: true }).eq("status", "novo"),
      supabase.from("st_blog_posts").select("id, titulo, imagem_card, is_published, data_publicacao, visualizacoes").order("created_at", { ascending: false }).limit(5),
    ]);

    const totalViews = (visualizacoes.data || []).reduce((sum, post) => sum + (post.visualizacoes || 0), 0);

    setStats({
      empreendimentos: empreendimentosResult.count || 0,
      casas: casasResult.count || 0,
      casasDisponiveis: casasDisponiveisResult.count || 0,
      casasVendidas: casasVendidasResult.count || 0,
      posts: posts.count || 0,
      postsPublicados: postsPublicados.count || 0,
      postsRascunhos: postsRascunhos.count || 0,
      postsDestaque: postsDestaque.count || 0,
      visualizacoesTotais: totalViews,
      contatos: contatos.count || 0,
      contatosNovos: contatosNovos.count || 0,
    });

    setLatestPosts(postsRecentes.data || []);
  };

  // Calcular porcentagens
  const casasDisponiveisPercent = stats.casas > 0 ? Math.round((stats.casasDisponiveis / stats.casas) * 100) : 0;
  const casasVendidasPercent = stats.casas > 0 ? Math.round((stats.casasVendidas / stats.casas) * 100) : 0;
  const contatosNovosPercent = stats.contatos > 0 ? Math.round((stats.contatosNovos / stats.contatos) * 100) : 0;

  // Mini dataset p/ gráfico de barras
  const contactBars = useMemo(() => {
    const novo = stats.contatosNovos;
    const outros = Math.max(stats.contatos - novo, 0);
    const max = Math.max(novo, outros, 1);
    return [
      { label: "Novos", value: novo, color: brand, percent: (novo / max) * 100 },
      { label: "Processados", value: outros, color: muted, percent: (outros / max) * 100 },
    ];
  }, [stats, brand, muted]);

  const blogBars = useMemo(() => {
    const publicados = stats.postsPublicados;
    const rascunhos = stats.postsRascunhos;
    const max = Math.max(publicados, rascunhos, 1);
    return [
      { label: "Publicados", value: publicados, color: success, percent: (publicados / max) * 100 },
      { label: "Rascunhos", value: rascunhos, color: warn, percent: (rascunhos / max) * 100 },
    ];
  }, [stats, success, warn]);

  // KPI Card melhorado
  const KPI = ({
    title,
    value,
    icon: Icon,
    color,
    gradient,
    onClick,
    percent,
    percentColor,
    subtitle,
    trend,
  }: {
    title: string;
    value: number | string;
    icon: any;
    color?: string;
    gradient?: string;
    onClick?: () => void;
    percent?: number;
    percentColor?: string;
    subtitle?: string;
    trend?: "up" | "down" | "neutral";
  }) => (
    <div
      onClick={onClick}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        padding: "24px",
        borderRadius: "20px",
        backgroundColor: surface,
        border: `1px solid ${border}`,
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: isDark
          ? "0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.12)"
          : "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = isDark
            ? "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)"
            : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = isDark
            ? "0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.12)"
            : "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)";
        }
      }}
    >
      {gradient && (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "120px",
            height: "120px",
            background: gradient,
            borderRadius: "50%",
            filter: "blur(60px)",
            opacity: 0.3,
          }}
        />
      )}

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span
              style={{
                color: muted,
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              {title}
            </span>
            {onClick && <ArrowUpRight size={14} color={muted} style={{ opacity: 0.6 }} />}
          </div>
          {subtitle && <span style={{ color: muted, fontSize: "11px", opacity: 0.8 }}>{subtitle}</span>}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "48px",
            height: "48px",
            borderRadius: "14px",
            background: gradient || `linear-gradient(135deg, ${color || brand}, ${color ? color + "cc" : brandLight})`,
            boxShadow: `0 4px 14px 0 ${(color || brand) + "30"}`,
          }}
        >
          <Icon size={24} color="#fff" strokeWidth={2.5} />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
        <span style={{ fontSize: "32px", fontWeight: 800, color: text, lineHeight: 1 }}>{value}</span>
        {percent !== undefined && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "4px 8px",
              borderRadius: "8px",
              backgroundColor: percentColor ? percentColor + "20" : success + "20",
              color: percentColor || success,
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            {trend === "up" && "↑"}
            {trend === "down" && "↓"}
            {percent}%
          </span>
        )}
      </div>
    </div>
  );

  // Botão de ação rápida melhorado
  const QuickAction = ({
    label,
    icon: Icon,
    onClick,
    color = brand,
  }: {
    label: string;
    icon: any;
    onClick: () => void;
    color?: string;
  }) => (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        background: `linear-gradient(135deg, ${color}, ${color}dd)`,
        color: "#fff",
        border: "none",
        padding: "12px 20px",
        borderRadius: "14px",
        fontWeight: 600,
        fontSize: "14px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: `0 4px 14px 0 ${color}30`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = `0 6px 20px 0 ${color}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = `0 4px 14px 0 ${color}30`;
      }}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  // Componente de atividade recente
  const RecentActivity = ({
    icon: Icon,
    title,
    time,
    color,
  }: {
    icon: any;
    title: string;
    time: string;
    color: string;
  }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "16px",
        borderRadius: "12px",
        backgroundColor: surface2,
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = isDark ? "#2a2e36" : "#e8eaed";
        e.currentTarget.style.transform = "translateX(4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = surface2;
        e.currentTarget.style.transform = "translateX(0)";
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "40px",
          height: "40px",
          borderRadius: "10px",
          background: `linear-gradient(135deg, ${color}20, ${color}10)`,
        }}
      >
        <Icon size={20} color={color} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, color: text, fontSize: "14px", fontWeight: 500 }}>{title}</p>
        <p
          style={{
            margin: "4px 0 0",
            color: muted,
            fontSize: "12px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <Clock size={12} />
          {time}
        </p>
      </div>
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: bg,
        padding: "32px",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header Section */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "8px" }}>
            <div
              style={{
                width: "4px",
                height: "32px",
                background: `linear-gradient(180deg, ${brand}, ${brandLight})`,
                borderRadius: "2px",
              }}
            />
            <h1
              style={{
                color: text,
                fontSize: "32px",
                fontWeight: 800,
                margin: 0,
                background: `linear-gradient(135deg, ${text}, ${muted})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Dashboard Administrativo
            </h1>
          </div>
          <p style={{ color: muted, marginLeft: "20px", fontSize: "15px" }}>
            Bem-vindo ao painel de controle da Casteval •{" "}
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Stats Overview Section */}
        <div style={{ marginBottom: "32px" }}>
          <h2
            style={{
              color: text,
              fontSize: "18px",
              fontWeight: 700,
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Activity size={20} />
            Visão Geral
          </h2>

          <div
            style={{
              display: "grid",
              gap: "20px",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            }}
          >
            <KPI
              title="Empreendimentos"
              subtitle="Projetos ativos"
              value={stats.empreendimentos}
              icon={Building2}
              gradient="linear-gradient(135deg, #667eea, #764ba2)"
              onClick={() => navigate("/admin/empreendimentos")}
            />

            <KPI
              title="Total de Casas"
              subtitle="Inventário completo"
              value={stats.casas}
              icon={Home}
              gradient="linear-gradient(135deg, #f093fb, #f5576c)"
              onClick={() => navigate("/admin/casas")}
            />

            <KPI
              title="Disponíveis"
              subtitle="Prontas para venda"
              value={stats.casasDisponiveis}
              icon={CheckCircle2}
              gradient={`linear-gradient(135deg, ${success}, ${successLight})`}
              onClick={() => navigate("/admin/casas")}
              percent={casasDisponiveisPercent}
              percentColor={success}
              trend="up"
            />

            <KPI
              title="Vendidas"
              subtitle="Negócios fechados"
              value={stats.casasVendidas}
              icon={TrendingUp}
              gradient={`linear-gradient(135deg, ${warn}, ${warnLight})`}
              onClick={() => navigate("/admin/casas")}
              percent={casasVendidasPercent}
              percentColor={warn}
            />

            <KPI
              title="Posts Publicados"
              subtitle="Conteúdo ao vivo"
              value={stats.postsPublicados}
              icon={CheckCircle2}
              gradient={`linear-gradient(135deg, ${success}, ${successLight})`}
              onClick={() => navigate("/admin/blog")}
            />

            <KPI
              title="Rascunhos"
              subtitle="Em elaboração"
              value={stats.postsRascunhos}
              icon={FileEdit}
              gradient={`linear-gradient(135deg, ${warn}, ${warnLight})`}
              onClick={() => navigate("/admin/blog")}
            />

            <KPI
              title="Em Destaque"
              subtitle="Posts destacados"
              value={stats.postsDestaque}
              icon={Star}
              gradient={`linear-gradient(135deg, ${info}, ${infoLight})`}
              onClick={() => navigate("/admin/blog")}
            />

            <KPI
              title="Visualizações"
              subtitle="Total de acessos"
              value={stats.visualizacoesTotais}
              icon={Eye}
              gradient="linear-gradient(135deg, #667eea, #764ba2)"
              onClick={() => navigate("/admin/blog")}
            />

            <KPI
              title="Contatos Novos"
              subtitle="Aguardando resposta"
              value={stats.contatosNovos}
              icon={Mail}
              gradient={`linear-gradient(135deg, ${brand}, ${brandLight})`}
              onClick={() => navigate("/admin/contatos")}
              percent={contatosNovosPercent}
              percentColor={brand}
              trend="up"
            />
          </div>
        </div>

        {/* Grid Layout com 2 colunas */}
        <div
          style={{
            display: "grid",
            gap: "24px",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          }}
        >
          {/* Ações Rápidas */}
          <div
            style={{
              background: surface,
              border: `1px solid ${border}`,
              borderRadius: "20px",
              padding: "24px",
              height: "fit-content",
            }}
          >
            <div style={{ marginBottom: "20px" }}>
              <h2
                style={{
                  color: text,
                  fontSize: "18px",
                  fontWeight: 700,
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Plus size={20} />
                Ações Rápidas
              </h2>
              <p style={{ color: muted, fontSize: "13px", margin: "6px 0 0" }}>
                Acesse rapidamente as funcionalidades mais utilizadas
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <QuickAction
                label="Novo Empreendimento"
                icon={Building2}
                onClick={() => navigate("/admin/empreendimentos/new")}
                color="#667eea"
              />
              <QuickAction
                label="Adicionar Casa"
                icon={Home}
                onClick={() => navigate("/admin/casas/new")}
                color="#f5576c"
              />
              <QuickAction
                label="Publicar no Blog"
                icon={FileText}
                onClick={() => navigate("/admin/blog/new")}
                color={info}
              />
            </div>
          </div>

          {/* Análise de Contatos */}
          <div
            style={{
              background: surface,
              border: `1px solid ${border}`,
              borderRadius: "20px",
              padding: "24px",
            }}
          >
            <div style={{ marginBottom: "20px" }}>
              <h2
                style={{
                  color: text,
                  fontSize: "18px",
                  fontWeight: 700,
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Users size={20} />
                Análise de Contatos
              </h2>
              <p style={{ color: muted, fontSize: "13px", margin: "6px 0 0" }}>Status dos contatos recebidos</p>
            </div>

            {/* Gráfico de barras melhorado */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "16px", height: "120px" }}>
                {contactBars.map((bar) => (
                  <div
                    key={bar.label}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: `${bar.percent}%`,
                        background: `linear-gradient(180deg, ${bar.color}, ${bar.color}dd)`,
                        borderRadius: "8px 8px 4px 4px",
                        transition: "all 0.3s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "18px",
                        minHeight: "40px",
                      }}
                    >
                      {bar.value}
                    </div>
                    <span style={{ color: muted, fontSize: "12px", fontWeight: 600 }}>{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumo */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "16px",
                background: surface2,
                borderRadius: "12px",
              }}
            >
              <div>
                <p style={{ margin: 0, color: muted, fontSize: "12px" }}>Total Geral</p>
                <p style={{ margin: "4px 0 0", color: text, fontSize: "20px", fontWeight: 700 }}>{stats.contatos}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, color: muted, fontSize: "12px" }}>Taxa de Novos</p>
                <p style={{ margin: "4px 0 0", color: brand, fontSize: "20px", fontWeight: 700 }}>
                  {contatosNovosPercent}%
                </p>
              </div>
            </div>
          </div>

          {/* Análise de Publicações do Blog */}
          <div
            style={{
              background: surface,
              border: `1px solid ${border}`,
              borderRadius: "20px",
              padding: "24px",
            }}
          >
            <div style={{ marginBottom: "20px" }}>
              <h2
                style={{
                  color: text,
                  fontSize: "18px",
                  fontWeight: 700,
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FileText size={20} />
                Análise de Publicações
              </h2>
              <p style={{ color: muted, fontSize: "13px", margin: "6px 0 0" }}>Status dos posts do blog</p>
            </div>

            {/* Gráfico de barras */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "16px", height: "120px" }}>
                {blogBars.map((bar) => (
                  <div
                    key={bar.label}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: `${bar.percent}%`,
                        background: `linear-gradient(180deg, ${bar.color}, ${bar.color}dd)`,
                        borderRadius: "8px 8px 4px 4px",
                        transition: "all 0.3s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "18px",
                        minHeight: "40px",
                      }}
                    >
                      {bar.value}
                    </div>
                    <span style={{ color: muted, fontSize: "12px", fontWeight: 600 }}>{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumo */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "16px",
                background: surface2,
                borderRadius: "12px",
              }}
            >
              <div>
                <p style={{ margin: 0, color: muted, fontSize: "12px" }}>Total de Posts</p>
                <p style={{ margin: "4px 0 0", color: text, fontSize: "20px", fontWeight: 700 }}>{stats.posts}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, color: muted, fontSize: "12px" }}>Em Destaque</p>
                <p style={{ margin: "4px 0 0", color: info, fontSize: "20px", fontWeight: 700 }}>
                  {stats.postsDestaque}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Últimos Posts do Blog */}
        <div
          style={{
            marginTop: "24px",
            background: surface,
            border: `1px solid ${border}`,
            borderRadius: "20px",
            padding: "24px",
          }}
        >
          <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2
                style={{
                  color: text,
                  fontSize: "18px",
                  fontWeight: 700,
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FileText size={20} />
                Últimos Posts
              </h2>
              <p style={{ color: muted, fontSize: "13px", margin: "6px 0 0" }}>Posts mais recentes do blog</p>
            </div>
            <button
              onClick={() => navigate("/admin/blog")}
              style={{
                background: "transparent",
                border: `1px solid ${border}`,
                borderRadius: "10px",
                padding: "8px 16px",
                color: brand,
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${brand}15`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              Ver todos
              <ArrowUpRight size={16} />
            </button>
          </div>

          {latestPosts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: muted }}>
              <FileText size={48} style={{ margin: "0 auto 16px", opacity: 0.3 }} />
              <p>Nenhum post criado ainda</p>
              <button
                onClick={() => navigate("/admin/blog/novo")}
                style={{
                  marginTop: "16px",
                  background: brand,
                  border: "none",
                  borderRadius: "10px",
                  padding: "10px 20px",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Criar primeiro post
              </button>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${border}` }}>
                    <th style={{ padding: "12px", textAlign: "left", color: muted, fontSize: "12px", fontWeight: 600 }}>
                      Imagem
                    </th>
                    <th style={{ padding: "12px", textAlign: "left", color: muted, fontSize: "12px", fontWeight: 600 }}>
                      Título
                    </th>
                    <th style={{ padding: "12px", textAlign: "left", color: muted, fontSize: "12px", fontWeight: 600 }}>
                      Status
                    </th>
                    <th style={{ padding: "12px", textAlign: "left", color: muted, fontSize: "12px", fontWeight: 600 }}>
                      Data
                    </th>
                    <th style={{ padding: "12px", textAlign: "left", color: muted, fontSize: "12px", fontWeight: 600 }}>
                      Visualizações
                    </th>
                    <th style={{ padding: "12px", textAlign: "center", color: muted, fontSize: "12px", fontWeight: 600 }}>
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {latestPosts.map((post) => (
                    <tr key={post.id} style={{ borderBottom: `1px solid ${border}` }}>
                      <td style={{ padding: "12px" }}>
                        {post.imagem_card ? (
                          <img
                            src={post.imagem_card}
                            alt={post.titulo}
                            style={{ width: "60px", height: "40px", objectFit: "cover", borderRadius: "6px" }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "60px",
                              height: "40px",
                              background: surface2,
                              borderRadius: "6px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <FileText size={20} style={{ color: muted }} />
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "12px", color: text, fontSize: "14px", fontWeight: 500 }}>
                        {post.titulo}
                      </td>
                      <td style={{ padding: "12px" }}>
                        <span
                          style={{
                            padding: "4px 12px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: 600,
                            background: post.is_published ? `${success}20` : `${warn}20`,
                            color: post.is_published ? success : warn,
                          }}
                        >
                          {post.is_published ? "Publicado" : "Rascunho"}
                        </span>
                      </td>
                      <td style={{ padding: "12px", color: muted, fontSize: "13px" }}>
                        {post.data_publicacao
                          ? new Date(post.data_publicacao).toLocaleDateString("pt-BR")
                          : "Não publicado"}
                      </td>
                      <td style={{ padding: "12px", color: text, fontSize: "14px", fontWeight: 600 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <Eye size={14} style={{ color: muted }} />
                          {post.visualizacoes || 0}
                        </div>
                      </td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <button
                          onClick={() => navigate(`/admin/blog/${post.id}`)}
                          style={{
                            background: `${brand}20`,
                            border: "none",
                            borderRadius: "8px",
                            padding: "6px 12px",
                            color: brand,
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Atividades Recentes */}
        <div
          style={{
            marginTop: "24px",
            background: surface,
            border: `1px solid ${border}`,
            borderRadius: "20px",
            padding: "24px",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <h2
              style={{
                color: text,
                fontSize: "18px",
                fontWeight: 700,
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Clock size={20} />
              Atividades Recentes
            </h2>
            <p style={{ color: muted, fontSize: "13px", margin: "6px 0 0" }}>Últimas atualizações do sistema</p>
          </div>

          <div style={{ display: "grid", gap: "12px" }}>
            <RecentActivity
              icon={Home}
              title="Casa 03 foi atualizada no empreendimento Vila Nova"
              time="Há 2 horas"
              color={success}
            />
            <RecentActivity
              icon={FileText}
              title="Novo post publicado: Tendências do Mercado Imobiliário 2025"
              time="Há 5 horas"
              color={info}
            />
            <RecentActivity
              icon={Mail}
              title="3 novos contatos recebidos pelo formulário"
              time="Há 1 dia"
              color={brand}
            />
            <RecentActivity
              icon={Building2}
              title="Empreendimento Jardins do Sul foi adicionado"
              time="Há 2 dias"
              color="#667eea"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

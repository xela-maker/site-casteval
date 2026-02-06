import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, Edit, Trash, Newspaper, Copy } from 'lucide-react';
import { useBlogPosts, useDeleteBlogPost } from '@/hooks/useBlogPosts';
import { TableBase } from '@/components/admin/TableBase';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { EmptyState } from '@/components/admin/EmptyState';
import { FilterDrawer } from '@/components/admin/FilterDrawer';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function Blog() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    categoria: '',
    is_published: undefined as boolean | undefined,
    is_destaque: undefined as boolean | undefined,
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Theme colors
  const theme = document.documentElement.getAttribute("data-admin-theme") || "dark";
  const isDark = theme === "dark";
  const surface = isDark ? "#1a1d21" : "#ffffff";
  const surface2 = isDark ? "#242830" : "#f1f3f5";
  const text = isDark ? "#ffffff" : "#1a1a1a";
  const muted = isDark ? "#94a3b8" : "#64748b";
  const border = isDark ? "#2a2e36" : "#e2e8f0";
  const brand = "#FFB000";
  const brandLight = "#FFCC4D";
  const success = "#10B981";
  const info = "#3B82F6";

  const { data, isLoading } = useBlogPosts({
    page,
    pageSize: 20,
    search,
    ...filters,
  });

  const deleteMutation = useDeleteBlogPost();

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
    setDeleteId(null);
  };

  const handleDuplicate = async (id: string) => {
    try {
      const { data: original, error: fetchError } = await supabase
        .from('st_blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      if (!original) return;

      const { data, error } = await supabase
        .from('st_blog_posts')
        .insert({
          ...original,
          id: undefined,
          titulo: `${original.titulo} (Cópia)`,
          slug: `${original.slug}-copia-${Date.now()}`,
          is_published: false,
          created_at: undefined,
          updated_at: undefined,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('✨ Post duplicado com sucesso');
      navigate(`/admin/blog/${data.id}`);
    } catch (error) {
      console.error('Erro ao duplicar:', error);
      toast.error('Erro ao duplicar post');
    }
  };

  const columns = [
    {
      key: 'imagem_card',
      label: '',
      render: (post: any) => (
        <img
          src={post.imagem_card || '/placeholder.svg'}
          alt={post.titulo}
          style={{
            width: "48px",
            height: "48px",
            objectFit: "cover",
            borderRadius: "8px",
            border: `1px solid ${border}`,
          }}
        />
      ),
    },
    {
      key: 'titulo',
      label: 'Título',
      render: (post: any) => (
        <div>
          <div style={{ color: text, fontSize: "14px", fontWeight: 500 }}>
            {post.titulo}
          </div>
          <div style={{ color: muted, fontSize: "12px", marginTop: "2px" }}>
            /{post.slug}
          </div>
        </div>
      ),
    },
    {
      key: 'categoria',
      label: 'Categoria',
      render: (post: any) => (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "4px 10px",
          borderRadius: "6px",
          background: surface2,
          color: text,
          fontSize: "12px",
          fontWeight: 500,
        }}>
          {post.categoria || 'Sem categoria'}
        </span>
      ),
    },
    {
      key: 'autor',
      label: 'Autor',
      render: (post: any) => (
        <div>
          <div style={{ color: text, fontSize: "14px" }}>
            {post.autor_nome || 'Sem autor'}
          </div>
          {post.data_publicacao && (
            <div style={{ color: muted, fontSize: "12px", marginTop: "2px" }}>
              {format(new Date(post.data_publicacao), "d 'de' MMM, yyyy", { locale: ptBR })}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (post: any) => {
        const isPublished = post.is_published;
        return (
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "4px 12px",
            borderRadius: "8px",
            background: isPublished ? `${success}20` : `${muted}20`,
            color: isPublished ? success : muted,
            fontSize: "12px",
            fontWeight: 600,
          }}>
            {isPublished ? 'Publicado' : 'Rascunho'}
          </span>
        );
      },
    },
    {
      key: 'destaque',
      label: 'Destaque',
      render: (post: any) => (
        post.is_destaque ? (
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "4px 12px",
            borderRadius: "8px",
            background: `${info}20`,
            color: info,
            fontSize: "12px",
            fontWeight: 600,
          }}>
            Destaque
          </span>
        ) : null
      ),
    },
    {
      key: 'visualizacoes',
      label: 'Visualizações',
      render: (post: any) => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Eye size={14} color={muted} />
          <span style={{ color: text, fontSize: "14px" }}>
            {post.visualizacoes || 0}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (post: any) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => navigate(`/admin/blog/${post.id}`)}
            style={{
              padding: "8px 14px",
              borderRadius: "10px",
              background: `linear-gradient(135deg, ${brand}, ${brandLight})`,
              border: "none",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "6px",
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
            onClick={() => handleDuplicate(post.id)}
            style={{
              padding: "8px 10px",
              borderRadius: "10px",
              background: surface2,
              border: `1px solid ${border}`,
              color: muted,
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${brand}15`;
              e.currentTarget.style.color = brand;
              e.currentTarget.style.borderColor = brand;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = surface2;
              e.currentTarget.style.color = muted;
              e.currentTarget.style.borderColor = border;
            }}
            title="Duplicar"
          >
            <Copy size={14} />
          </button>

          <button
            onClick={() => setDeleteId(post.id)}
            style={{
              padding: "8px 10px",
              borderRadius: "10px",
              background: surface2,
              border: `1px solid ${border}`,
              color: "#EF4444",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#EF444420";
              e.currentTarget.style.borderColor = "#EF4444";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = surface2;
              e.currentTarget.style.borderColor = border;
            }}
          >
            <Trash size={14} />
          </button>
        </div>
      ),
    },
  ];

  const handleApplyFilters = () => {
    setPage(1);
    setFilterOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({
      categoria: '',
      is_published: undefined,
      is_destaque: undefined,
    });
  };

  if (isLoading) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "400px",
        gap: "16px",
      }}>
        <div style={{
          width: "48px",
          height: "48px",
          border: `4px solid ${border}`,
          borderTopColor: brand,
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }} />
        <p style={{ color: muted, fontSize: "14px" }}>Carregando posts...</p>
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div>
        {/* Header com Gradiente Amarelo */}
        <div
          style={{
            marginBottom: "32px",
            padding: "32px",
            borderRadius: "20px",
            background: `linear-gradient(135deg, ${brand}, ${brandLight})`,
            boxShadow: `0 8px 24px ${brand}30`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-20px",
              right: "-20px",
              width: "200px",
              height: "200px",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "50%",
              filter: "blur(60px)",
            }}
          />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px" }}>
              <div
                style={{
                  padding: "12px",
                  background: "rgba(255, 255, 255, 0.2)",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Newspaper size={32} color="#fff" />
              </div>
              <div>
                <h1 style={{ fontSize: "36px", fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.5px" }}>
                  Blog
                </h1>
                <p style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "15px", margin: "4px 0 0 0" }}>
                  Gerencie os posts do blog
                </p>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => navigate('/admin/blog/new')}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "14px 28px",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.95)",
                  color: brand,
                  border: "none",
                  fontWeight: 700,
                  fontSize: "15px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.2)";
                  e.currentTarget.style.background = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 14px rgba(0, 0, 0, 0.15)";
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.95)";
                }}
              >
                <Plus size={20} strokeWidth={2.5} />
                Novo Post
              </button>
            </div>
          </div>
        </div>

        <EmptyState
          icon={Plus}
          title="Nenhum post encontrado"
          description="Crie seu primeiro post para começar"
          onAction={() => navigate('/admin/blog/new')}
          actionLabel="Criar Post"
        />
      </div>
    );
  }

  return (
    <div>
      {/* Header com Gradiente Amarelo */}
      <div
        style={{
          marginBottom: "32px",
          padding: "32px",
          borderRadius: "20px",
          background: `linear-gradient(135deg, ${brand}, ${brandLight})`,
          boxShadow: `0 8px 24px ${brand}30`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-20px",
            right: "-20px",
            width: "200px",
            height: "200px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "50%",
            filter: "blur(60px)",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px" }}>
            <div
              style={{
                padding: "12px",
                background: "rgba(255, 255, 255, 0.2)",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Newspaper size={32} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontSize: "36px", fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.5px" }}>
                Blog
              </h1>
              <p style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "15px", margin: "4px 0 0 0" }}>
                Gerencie os posts do blog
              </p>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={() => navigate('/admin/blog/new')}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "14px 28px",
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.95)",
                color: brand,
                border: "none",
                fontWeight: 700,
                fontSize: "15px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.2)";
                e.currentTarget.style.background = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(0, 0, 0, 0.15)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.95)";
              }}
            >
              <Plus size={20} strokeWidth={2.5} />
              Novo Post
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{
        display: "flex",
        gap: "12px",
        marginBottom: "24px",
      }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={16} color={muted} style={{
            position: "absolute",
            left: "14px",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }} />
          <input
            placeholder="Buscar posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px 12px 44px",
              borderRadius: "12px",
              background: surface2,
              border: `1px solid ${border}`,
              color: text,
              fontSize: "14px",
              outline: "none",
              transition: "all 0.2s ease",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = brand;
              e.target.style.boxShadow = `0 0 0 3px ${brand}20`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = border;
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{
        borderRadius: "20px",
        background: surface,
        border: `1px solid ${border}`,
        boxShadow: isDark ? "0 4px 6px -1px rgba(0, 0, 0, 0.2)" : "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
      }}>
        <TableBase
          columns={columns}
          data={data.data}
          onRowClick={(post) => navigate(`/admin/blog/${post.id}`)}
        />
      </div>

      {/* Delete Dialog */}
      {deleteId && (
        <DeleteConfirmDialog
          open={!!deleteId}
          onOpenChange={() => setDeleteId(null)}
          onConfirm={() => handleDelete(deleteId)}
          title="Excluir Post"
          description="Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita."
        />
      )}
    </div>
  );
}

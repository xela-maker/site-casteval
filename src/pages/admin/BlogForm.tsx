import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useBlogPost, useCreateBlogPost, useUpdateBlogPost } from "@/hooks/useBlogPosts";
import { FormBase } from "@/components/admin/FormBase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { TiptapEditor } from "@/components/admin/TiptapEditor";
import { SlugField } from "@/components/admin/SlugField";
import { toast } from "sonner";
import { FileText, Image, Settings, Search, Eye, Tag, User, Calendar, TrendingUp } from "lucide-react";

interface BlogPostData {
  id?: string;
  titulo: string;
  slug: string;
  resumo: string;
  conteudo: string;
  categoria: string;
  tags: string[];
  imagem_destaque: string;
  imagem_card: string;
  autor_nome: string;
  is_destaque: boolean;
  is_published: boolean;
  data_publicacao: string;
  visualizacoes: number;
  seo_title: string;
  seo_description: string;
  seo_keywords: string[];
}

const initialData: BlogPostData = {
  titulo: "",
  slug: "",
  resumo: "",
  conteudo: "",
  categoria: "",
  tags: [],
  imagem_destaque: "",
  imagem_card: "",
  autor_nome: "",
  is_destaque: false,
  is_published: false,
  data_publicacao: new Date().toISOString(),
  visualizacoes: 0,
  seo_title: "",
  seo_description: "",
  seo_keywords: [],
};

const styles = {
  fieldGroup: {
    marginBottom: "28px",
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "10px",
    color: "hsl(var(--admin-text))",
  },
  labelIcon: {
    width: "18px",
    height: "18px",
    color: "hsl(var(--admin-muted))",
  },
  helperText: {
    fontSize: "13px",
    color: "hsl(var(--admin-muted))",
    marginTop: "6px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  section: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "hsl(var(--admin-text))",
    marginBottom: "24px",
    paddingBottom: "12px",
    borderBottom: "2px solid hsl(var(--admin-line))",
  },
  card: {
    background: "hsl(var(--admin-surface-2))",
    border: "1px solid hsl(var(--admin-line))",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "20px",
  },
  switchCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px",
    borderRadius: "12px",
    background: "hsl(var(--admin-surface-2))",
    border: "1px solid hsl(var(--admin-line))",
    marginBottom: "16px",
  },
  switchInfo: {
    flex: "1",
  },
  switchTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "hsl(var(--admin-text))",
    marginBottom: "4px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  switchDescription: {
    fontSize: "13px",
    color: "hsl(var(--admin-muted))",
  },
  tagBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 14px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "500",
    background: "hsl(var(--admin-accent))",
    color: "hsl(var(--admin-accent-foreground))",
    border: "1px solid hsl(var(--admin-line))",
  },
  previewBox: {
    padding: "24px",
    borderRadius: "12px",
    background: "hsl(var(--admin-surface-2))",
    border: "1px solid hsl(var(--admin-line))",
  },
  previewTitle: {
    fontSize: "15px",
    fontWeight: "600",
    marginBottom: "16px",
    color: "hsl(var(--admin-text))",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  imagePreview: {
    width: "100%",
    borderRadius: "8px",
    border: "1px solid hsl(var(--admin-line))",
    marginTop: "12px",
  },
  charCounter: {
    fontSize: "12px",
    color: "hsl(var(--admin-muted))",
    marginTop: "6px",
    textAlign: "right" as const,
  },
  gridTwo: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
  },
};

export default function BlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = !!id;

  const [formData, setFormData] = useState<BlogPostData>(initialData);
  const [tagsInput, setTagsInput] = useState("");
  const [keywordsInput, setKeywordsInput] = useState("");

  const { data: post, isLoading } = useBlogPost(id);
  const createMutation = useCreateBlogPost();
  const updateMutation = useUpdateBlogPost();

  // Adicionar estilos globais para o editor
  useEffect(() => {
    const styleId = "tiptap-toolbar-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        /* Toolbar do TiptapEditor */
        .tiptap-toolbar {
          padding: 12px !important;
          gap: 8px !important;
          border-bottom: 2px solid hsl(var(--admin-line)) !important;
          background: hsl(var(--admin-surface-2)) !important;
        }
        
        /* Botões da toolbar */
        .tiptap-toolbar button {
          min-width: 40px !important;
          min-height: 40px !important;
          padding: 8px !important;
          border-radius: 8px !important;
          transition: all 0.2s !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        
        /* Ícones dentro dos botões */
        .tiptap-toolbar button svg {
          width: 20px !important;
          height: 20px !important;
        }
        
        /* Hover nos botões */
        .tiptap-toolbar button:hover {
          background: hsl(var(--admin-accent)) !important;
          transform: scale(1.05) !important;
        }
        
        /* Botão ativo */
        .tiptap-toolbar button.is-active {
          background: hsl(var(--admin-accent)) !important;
          color: hsl(var(--admin-accent-foreground)) !important;
        }
        
        /* Separadores */
        .tiptap-toolbar .separator {
          width: 2px !important;
          height: 32px !important;
          background: hsl(var(--admin-line)) !important;
          margin: 0 8px !important;
        }
        
        /* Selects e inputs da toolbar */
        .tiptap-toolbar select,
        .tiptap-toolbar input {
          min-height: 40px !important;
          padding: 8px 12px !important;
          font-size: 14px !important;
          border-radius: 8px !important;
        }
        
        /* Área de conteúdo do editor */
        .ProseMirror {
          padding: 20px !important;
          font-size: 15px !important;
          line-height: 1.7 !important;
        }
        
        /* Focus no editor */
        .ProseMirror:focus {
          outline: none !important;
          border: none !important;
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

  useEffect(() => {
    if (post) {
      setFormData({
        ...post,
        tags: Array.isArray(post.tags) ? post.tags : [],
        seo_keywords: Array.isArray(post.seo_keywords) ? post.seo_keywords : [],
      });
      setTagsInput(Array.isArray(post.tags) ? post.tags.join(", ") : "");
      setKeywordsInput(Array.isArray(post.seo_keywords) ? post.seo_keywords.join(", ") : "");
    } else if (user) {
      const profile = user.user_metadata;
      setFormData((prev) => ({
        ...prev,
        autor_nome: profile?.full_name || user.email || "",
      }));
    }
  }, [post, user]);

  const extractImageUrl = (imageData: string | { url: string; alt?: string } | null | undefined): string => {
    if (!imageData) return "";
    if (typeof imageData === "string") return imageData;
    if (typeof imageData === "object" && "url" in imageData) return imageData.url || "";
    return "";
  };

  const handleSubmit = async (status: "rascunho" | "publicado") => {
    if (!formData.titulo) {
      toast.error("Título é obrigatório");
      return;
    }
    if (!formData.slug) {
      toast.error("Slug é obrigatório");
      return;
    }
    if (status === "publicado") {
      if (!formData.conteudo) {
        toast.error("Conteúdo é obrigatório para publicar");
        return;
      }
      if (!formData.imagem_destaque) {
        toast.error("Imagem de destaque é obrigatória para publicar");
        return;
      }
    }

    const dataToSave = {
      ...formData,
      is_published: status === "publicado",
      data_publicacao:
        status === "publicado" && !formData.data_publicacao ? new Date().toISOString() : formData.data_publicacao,
      imagem_destaque: extractImageUrl(formData.imagem_destaque as any),
      imagem_card: extractImageUrl(formData.imagem_card as any),
    };

    if (isEdit && id) {
      await updateMutation.mutateAsync({ id, data: dataToSave });
    } else {
      await createMutation.mutateAsync(dataToSave);
    }

    navigate("/admin/blog");
  };

  const updateField = (field: keyof BlogPostData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTagsChange = (value: string) => {
    setTagsInput(value);
    const tags = value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    updateField("tags", tags);
  };

  const handleKeywordsChange = (value: string) => {
    setKeywordsInput(value);
    const keywords = value
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
    updateField("seo_keywords", keywords);
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
        }}
      >
        <div
          style={{
            color: "hsl(var(--admin-muted))",
            fontSize: "16px",
          }}
        >
          Carregando...
        </div>
      </div>
    );
  }

  const tabs = [
    {
      value: "conteudo",
      label: "Conteúdo",
      content: (
        <div style={styles.section}>
          {/* Informações Básicas */}
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>
              <FileText size={20} style={{ display: "inline", marginRight: "8px" }} />
              Informações Básicas
            </h3>

            <div style={styles.fieldGroup}>
              <div style={styles.label}>
                <FileText size={18} />
                <span>Título *</span>
              </div>
              <Input
                value={formData.titulo}
                onChange={(e) => updateField("titulo", e.target.value)}
                placeholder="Digite o título do post"
                required
                style={{ fontSize: "15px", padding: "12px" }}
              />
            </div>

            <div style={styles.fieldGroup}>
              <SlugField
                value={formData.slug}
                onChange={(v) => updateField("slug", v)}
                basedOn={formData.titulo}
                table="st_blog_posts"
                currentId={id}
                required
              />
            </div>

            <div style={styles.fieldGroup}>
              <div style={styles.label}>
                <Tag size={18} />
                <span>Categoria</span>
              </div>
              <Select value={formData.categoria} onValueChange={(v) => updateField("categoria", v)}>
                <SelectTrigger style={{ fontSize: "15px", padding: "12px" }}>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dicas & Decoração">Dicas & Decoração</SelectItem>
                  <SelectItem value="Mercado">Mercado</SelectItem>
                  <SelectItem value="Investimento">Investimento</SelectItem>
                  <SelectItem value="Arquitetura">Arquitetura</SelectItem>
                  <SelectItem value="Lançamentos">Lançamentos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div style={styles.fieldGroup}>
              <div style={styles.label}>
                <FileText size={18} />
                <span>Resumo</span>
              </div>
              <Textarea
                value={formData.resumo}
                onChange={(e) => updateField("resumo", e.target.value)}
                placeholder="Breve resumo do post para visualização em cards"
                maxLength={200}
                rows={4}
                style={{ fontSize: "14px" }}
              />
              <div style={styles.charCounter}>{formData.resumo.length}/200 caracteres</div>
            </div>

            <div style={styles.fieldGroup}>
              <div style={styles.label}>
                <User size={18} />
                <span>Autor</span>
              </div>
              <Input
                value={formData.autor_nome}
                onChange={(e) => updateField("autor_nome", e.target.value)}
                placeholder="Nome do autor do post"
                style={{ fontSize: "15px", padding: "12px" }}
              />
            </div>
          </div>

          {/* Editor de Conteúdo */}
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>
              <FileText size={20} style={{ display: "inline", marginRight: "8px" }} />
              Conteúdo do Post *
            </h3>

            <TiptapEditor
              value={formData.conteudo}
              onChange={(v) => updateField("conteudo", v)}
              placeholder="Escreva o conteúdo completo do post aqui..."
              minHeight={500}
              required
            />
          </div>
        </div>
      ),
    },
    {
      value: "midia",
      label: "Mídia",
      content: (
        <div style={styles.section}>
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>
              <Image size={20} style={{ display: "inline", marginRight: "8px" }} />
              Imagens do Post
            </h3>

            <div style={{ marginBottom: "32px" }}>
              <ImageUploader
                label="Imagem de Destaque *"
                description="Esta imagem aparece no topo do post. Tamanho recomendado: 1920x1080px (16:9)"
                value={formData.imagem_destaque}
                onChange={(v) => updateField("imagem_destaque", v)}
                aspectRatio="16:9"
                required
              />
              {formData.imagem_destaque && (
                <div style={{ marginTop: "16px" }}>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      marginBottom: "10px",
                      color: "hsl(var(--admin-text))",
                    }}
                  >
                    Preview da Imagem de Destaque
                  </p>
                  <img src={formData.imagem_destaque} alt="Preview Destaque" style={styles.imagePreview} />
                </div>
              )}
            </div>

            <div>
              <ImageUploader
                label="Imagem do Card"
                description="Esta imagem aparece nas listagens e cards. Tamanho recomendado: 1200x800px (3:2)"
                value={formData.imagem_card}
                onChange={(v) => updateField("imagem_card", v)}
                aspectRatio="3:2"
              />
              {formData.imagem_card && (
                <div style={{ marginTop: "16px" }}>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      marginBottom: "10px",
                      color: "hsl(var(--admin-text))",
                    }}
                  >
                    Preview da Imagem do Card
                  </p>
                  <img src={formData.imagem_card} alt="Preview Card" style={styles.imagePreview} />
                </div>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      value: "configuracoes",
      label: "Configurações",
      content: (
        <div style={styles.section}>
          {/* Tags */}
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>
              <Tag size={20} style={{ display: "inline", marginRight: "8px" }} />
              Tags e Categorização
            </h3>

            <div style={styles.fieldGroup}>
              <div style={styles.label}>
                <Tag size={18} />
                <span>Tags</span>
              </div>
              <Input
                value={tagsInput}
                onChange={(e) => handleTagsChange(e.target.value)}
                placeholder="Separe as tags por vírgula (ex: imóveis, decoração, investimento)"
                style={{ fontSize: "15px", padding: "12px" }}
              />
              {formData.tags.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                    marginTop: "14px",
                  }}
                >
                  {formData.tags.map((tag) => (
                    <span key={tag} style={styles.tagBadge}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Configurações de Exibição */}
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>
              <Settings size={20} style={{ display: "inline", marginRight: "8px" }} />
              Configurações de Exibição
            </h3>

            <div style={styles.switchCard}>
              <div style={styles.switchInfo}>
                <div style={styles.switchTitle}>
                  <TrendingUp size={18} />
                  Destacar na Home
                </div>
                <div style={styles.switchDescription}>
                  Posts em destaque aparecem na seção especial da página inicial
                </div>
              </div>
              <Switch checked={formData.is_destaque} onCheckedChange={(v) => updateField("is_destaque", v)} />
            </div>

            <div style={styles.fieldGroup}>
              <div style={styles.label}>
                <Eye size={18} />
                <span>Visualizações</span>
              </div>
              <Input
                type="number"
                value={formData.visualizacoes}
                onChange={(e) => updateField("visualizacoes", parseInt(e.target.value) || 0)}
                disabled={!isEdit}
                style={{ fontSize: "15px", padding: "12px" }}
              />
              <div style={styles.helperText}>
                <TrendingUp size={14} />
                Contador atualizado automaticamente quando o post é visualizado
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      value: "seo",
      label: "SEO",
      content: (
        <div style={styles.section}>
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>
              <Search size={20} style={{ display: "inline", marginRight: "8px" }} />
              Otimização para Mecanismos de Busca
            </h3>

            <div style={styles.fieldGroup}>
              <div style={styles.label}>
                <FileText size={18} />
                <span>Título SEO</span>
              </div>
              <Input
                value={formData.seo_title}
                onChange={(e) => updateField("seo_title", e.target.value)}
                placeholder="Título otimizado para aparecer nos resultados do Google"
                maxLength={60}
                style={{ fontSize: "15px", padding: "12px" }}
              />
              <div style={styles.charCounter}>{formData.seo_title.length}/60 caracteres</div>
            </div>

            <div style={styles.fieldGroup}>
              <div style={styles.label}>
                <FileText size={18} />
                <span>Descrição SEO</span>
              </div>
              <Textarea
                value={formData.seo_description}
                onChange={(e) => updateField("seo_description", e.target.value)}
                placeholder="Descrição que aparece nos resultados de busca do Google"
                maxLength={160}
                rows={4}
                style={{ fontSize: "14px" }}
              />
              <div style={styles.charCounter}>{formData.seo_description.length}/160 caracteres</div>
            </div>

            <div style={styles.fieldGroup}>
              <div style={styles.label}>
                <Tag size={18} />
                <span>Palavras-chave SEO</span>
              </div>
              <Input
                value={keywordsInput}
                onChange={(e) => handleKeywordsChange(e.target.value)}
                placeholder="Separe as palavras-chave por vírgula"
                style={{ fontSize: "15px", padding: "12px" }}
              />
              {formData.seo_keywords.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                    marginTop: "14px",
                  }}
                >
                  {formData.seo_keywords.map((keyword) => (
                    <span key={keyword} style={styles.tagBadge}>
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Preview do Google */}
          <div style={styles.previewBox}>
            <div style={styles.previewTitle}>
              <Search size={18} />
              Preview nos Resultados do Google
            </div>
            <div style={{ padding: "16px", background: "#fff", borderRadius: "8px" }}>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "500",
                  color: "#1a0dab",
                  marginBottom: "4px",
                  cursor: "pointer",
                }}
              >
                {formData.seo_title || formData.titulo || "Título do Post"}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#006621",
                  marginBottom: "4px",
                }}
              >
                casteval.com.br › blog › {formData.slug || "slug-do-post"}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: "#545454",
                  lineHeight: "1.5",
                }}
              >
                {formData.seo_description ||
                  formData.resumo ||
                  "Descrição do post aparecerá aqui nos resultados de busca..."}
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div style={{ paddingBottom: "120px" }}>
      <div
        style={{
          marginBottom: "32px",
          paddingBottom: "24px",
          borderBottom: "2px solid hsl(var(--admin-line))",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "700",
            color: "hsl(var(--admin-text))",
            marginBottom: "8px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <FileText size={32} />
          {isEdit ? "Editar Post" : "Novo Post"}
        </h1>
        <p
          style={{
            fontSize: "15px",
            color: "hsl(var(--admin-muted))",
          }}
        >
          {isEdit ? `Editando: ${formData.titulo || "Post sem título"}` : "Crie um novo post para o blog da Casteval"}
        </p>
      </div>

      <FormBase
        tabs={tabs}
        onSaveDraft={() => handleSubmit("rascunho")}
        onPublish={() => handleSubmit("publicado")}
        onPreview={isEdit && formData.slug ? () => window.open(`/blog/${formData.slug}`, "_blank") : undefined}
        isLoading={createMutation.isPending || updateMutation.isPending}
        showPreview={isEdit && !!formData.slug}
      />
    </div>
  );
}

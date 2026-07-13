import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useBlogPost, useCreateBlogPost, useUpdateBlogPost } from "@/hooks/useBlogPosts";
import { FormBase } from "@/components/admin/FormBase";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { TiptapEditor } from "@/components/admin/TiptapEditor";
import { SlugField } from "@/components/admin/SlugField";
import { toast } from "sonner";
import {
  FileText,
  Image,
  Settings,
  Search,
  Eye,
  Tag,
  User,
  TrendingUp,
  Cloud,
  CloudOff,
  RotateCcw,
} from "lucide-react";

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

const DRAFT_PREFIX = "casteval:blog-form-draft:";

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
};

const isValidUUID = (value?: string): boolean =>
  !!value && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

const hasMeaningfulContent = (html: string) => {
  const text = (html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .trim();
  return text.length > 0;
};

type DraftPayload = {
  formData: BlogPostData;
  tagsInput: string;
  keywordsInput: string;
  savedAt: string;
};

function readDraft(key: string): DraftPayload | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as DraftPayload;
  } catch {
    return null;
  }
}

function writeDraft(key: string, payload: DraftPayload) {
  try {
    localStorage.setItem(key, JSON.stringify(payload));
  } catch {
    // quota / private mode — ignore
  }
}

function clearDraft(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

function formatDraftTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export default function BlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = isValidUUID(id);
  const draftKey = `${DRAFT_PREFIX}${isEdit ? id : "new"}`;

  const [formData, setFormData] = useState<BlogPostData>(initialData);
  const [tagsInput, setTagsInput] = useState("");
  const [keywordsInput, setKeywordsInput] = useState("");
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const skipNextDraftSave = useRef(false);
  const loadedPostId = useRef<string | null>(null);
  const newPostHydrated = useRef(false);

  const { data: post, isLoading } = useBlogPost(isEdit ? id : undefined);
  const createMutation = useCreateBlogPost();
  const updateMutation = useUpdateBlogPost();

  useEffect(() => {
    const styleId = "tiptap-toolbar-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .tiptap-toolbar {
          padding: 12px !important;
          gap: 8px !important;
          border-bottom: 2px solid hsl(var(--admin-line)) !important;
          background: hsl(var(--admin-surface-2)) !important;
        }
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
        .tiptap-toolbar button svg {
          width: 20px !important;
          height: 20px !important;
        }
        .tiptap-toolbar button:hover {
          background: hsl(var(--admin-accent)) !important;
          transform: scale(1.05) !important;
        }
        .tiptap-toolbar button.is-active {
          background: hsl(var(--admin-accent)) !important;
          color: hsl(var(--admin-accent-foreground)) !important;
        }
        .tiptap-toolbar .separator {
          width: 2px !important;
          height: 32px !important;
          background: hsl(var(--admin-line)) !important;
          margin: 0 8px !important;
        }
        .tiptap-toolbar select,
        .tiptap-toolbar input {
          min-height: 40px !important;
          padding: 8px 12px !important;
          font-size: 14px !important;
          border-radius: 8px !important;
        }
        .ProseMirror {
          padding: 20px !important;
          font-size: 15px !important;
          line-height: 1.7 !important;
        }
        .ProseMirror:focus {
          outline: none !important;
          border: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      document.getElementById(styleId)?.remove();
    };
  }, []);

  // Hydrate: edit from API, or new from local draft
  useEffect(() => {
    if (isEdit) {
      if (!post) return;
      if (loadedPostId.current === post.id) return;
      loadedPostId.current = post.id;

      const draft = readDraft(draftKey);
      const serverData: BlogPostData = {
        ...post,
        tags: Array.isArray(post.tags) ? post.tags : [],
        seo_keywords: Array.isArray(post.seo_keywords) ? post.seo_keywords : [],
      };

      if (draft?.formData && draft.savedAt) {
        skipNextDraftSave.current = true;
        setFormData(draft.formData);
        setTagsInput(draft.tagsInput ?? "");
        setKeywordsInput(draft.keywordsInput ?? "");
        setDraftSavedAt(draft.savedAt);
        setIsDirty(true);
        toast.message("Rascunho local restaurado", {
          description: "Você tinha alterações não publicadas neste post.",
          action: {
            label: "Usar versão do servidor",
            onClick: () => {
              skipNextDraftSave.current = true;
              setFormData(serverData);
              setTagsInput(serverData.tags.join(", "));
              setKeywordsInput(serverData.seo_keywords.join(", "));
              clearDraft(draftKey);
              setDraftSavedAt(null);
              setIsDirty(false);
            },
          },
        });
      } else {
        skipNextDraftSave.current = true;
        setFormData(serverData);
        setTagsInput(serverData.tags.join(", "));
        setKeywordsInput(serverData.seo_keywords.join(", "));
        setIsDirty(false);
      }
      setHydrated(true);
      return;
    }

    // New post — hydrate once
    if (newPostHydrated.current) return;
    newPostHydrated.current = true;

    const draft = readDraft(draftKey);
    if (draft?.formData) {
      skipNextDraftSave.current = true;
      setFormData({
        ...draft.formData,
        autor_nome:
          draft.formData.autor_nome ||
          user?.user_metadata?.full_name ||
          user?.email ||
          "",
      });
      setTagsInput(draft.tagsInput ?? "");
      setKeywordsInput(draft.keywordsInput ?? "");
      setDraftSavedAt(draft.savedAt);
      setIsDirty(true);
      toast.success("Rascunho local restaurado");
    } else {
      skipNextDraftSave.current = true;
      setFormData((prev) => ({
        ...prev,
        autor_nome: user?.user_metadata?.full_name || user?.email || prev.autor_nome || "",
      }));
    }
    setHydrated(true);
  }, [post, user, isEdit, draftKey]);

  // Fill author when auth resolves after first paint (new posts only)
  useEffect(() => {
    if (isEdit || !user) return;
    const name = user.user_metadata?.full_name || user.email || "";
    if (!name) return;
    setFormData((prev) => (prev.autor_nome ? prev : { ...prev, autor_nome: name }));
  }, [user, isEdit]);

  // Autosave draft to localStorage
  useEffect(() => {
    if (!hydrated) return;
    if (skipNextDraftSave.current) {
      skipNextDraftSave.current = false;
      return;
    }

    const hasContent =
      formData.titulo.trim() ||
      formData.slug.trim() ||
      formData.resumo.trim() ||
      hasMeaningfulContent(formData.conteudo) ||
      formData.imagem_destaque ||
      formData.seo_title.trim();

    if (!hasContent) {
      clearDraft(draftKey);
      setDraftSavedAt(null);
      setIsDirty(false);
      return;
    }

    const timer = window.setTimeout(() => {
      const savedAt = new Date().toISOString();
      writeDraft(draftKey, { formData, tagsInput, keywordsInput, savedAt });
      setDraftSavedAt(savedAt);
      setIsDirty(true);
    }, 600);

    return () => window.clearTimeout(timer);
  }, [formData, tagsInput, keywordsInput, hydrated, draftKey]);

  // Warn on browser leave with unsaved draft
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

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
      if (!hasMeaningfulContent(formData.conteudo)) {
        toast.error("Conteúdo é obrigatório para publicar");
        return;
      }
      if (!formData.imagem_destaque) {
        toast.error("Imagem de destaque é obrigatória para publicar");
        return;
      }
    }

    const { id: _id, created_at: _createdAt, updated_at: _updatedAt, ...rest } = formData as any;

    const dataToSave = {
      ...rest,
      is_published: status === "publicado",
      data_publicacao:
        status === "publicado" && !formData.data_publicacao ? new Date().toISOString() : formData.data_publicacao,
      imagem_destaque: extractImageUrl(formData.imagem_destaque as any),
      imagem_card: extractImageUrl(formData.imagem_card as any),
    };

    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, data: dataToSave });
      } else {
        await createMutation.mutateAsync({
          ...dataToSave,
          autor_id: user?.id ?? null,
        });
      }
      clearDraft(draftKey);
      setIsDirty(false);
      setDraftSavedAt(null);
      navigate("/admin/blog");
    } catch (error) {
      console.error("Erro ao salvar post:", error);
    }
  };

  const updateField = useCallback((field: keyof BlogPostData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

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

  const discardLocalDraft = () => {
    clearDraft(draftKey);
    setDraftSavedAt(null);
    if (isEdit && post) {
      skipNextDraftSave.current = true;
      const serverData: BlogPostData = {
        ...post,
        tags: Array.isArray(post.tags) ? post.tags : [],
        seo_keywords: Array.isArray(post.seo_keywords) ? post.seo_keywords : [],
      };
      setFormData(serverData);
      setTagsInput(serverData.tags.join(", "));
      setKeywordsInput(serverData.seo_keywords.join(", "));
      setIsDirty(false);
      toast.success("Rascunho local descartado");
      return;
    }
    skipNextDraftSave.current = true;
    const autor =
      user?.user_metadata?.full_name || user?.email || "";
    setFormData({ ...initialData, autor_nome: autor, data_publicacao: new Date().toISOString() });
    setTagsInput("");
    setKeywordsInput("");
    setIsDirty(false);
    toast.success("Formulário limpo");
  };

  const tabComplete = useMemo(
    () => ({
      conteudo: Boolean(formData.titulo.trim() && formData.slug.trim() && hasMeaningfulContent(formData.conteudo)),
      midia: Boolean(formData.imagem_destaque),
      configuracoes: Boolean(formData.categoria || formData.tags.length > 0),
      seo: Boolean(formData.seo_title.trim() || formData.seo_description.trim()),
    }),
    [formData],
  );

  if (isLoading && isEdit) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
        }}
      >
        <div style={{ color: "hsl(var(--admin-muted))", fontSize: "16px" }}>Carregando...</div>
      </div>
    );
  }

  const tabs = [
    {
      value: "conteudo",
      label: "Conteúdo",
      complete: tabComplete.conteudo,
      icon: <FileText className="h-4 w-4" />,
      content: (
        <div style={styles.section}>
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
      complete: tabComplete.midia,
      icon: <Image className="h-4 w-4" />,
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
      complete: tabComplete.configuracoes,
      icon: <Settings className="h-4 w-4" />,
      content: (
        <div style={styles.section}>
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
      complete: tabComplete.seo,
      icon: <Search className="h-4 w-4" />,
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

  const statusSlot = (
    <div className="flex items-center gap-3">
      {draftSavedAt ? (
        <span className="inline-flex items-center gap-1.5">
          <Cloud className="h-3.5 w-3.5" style={{ color: "hsl(var(--admin-success))" }} />
          Salvo às {formatDraftTime(draftSavedAt)}
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5">
          <CloudOff className="h-3.5 w-3.5" />
          Autosave ativo
        </span>
      )}
      {isDirty && (
        <button
          type="button"
          onClick={discardLocalDraft}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold transition-opacity hover:opacity-80"
          style={{
            color: "hsl(var(--admin-muted))",
            border: "1px solid hsl(var(--admin-line))",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          <RotateCcw className="h-3 w-3" />
          Descartar
        </button>
      )}
    </div>
  );

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
        <p style={{ fontSize: "15px", color: "hsl(var(--admin-muted))" }}>
          {isEdit
            ? `Editando: ${formData.titulo || "Post sem título"}`
            : "Crie um novo post para o blog da Casteval. Seu progresso é salvo automaticamente neste navegador."}
        </p>
      </div>

      <FormBase
        tabs={tabs}
        onSaveDraft={() => handleSubmit("rascunho")}
        onPublish={() => handleSubmit("publicado")}
        onPreview={isEdit && formData.slug ? () => window.open(`/blog/${formData.slug}`, "_blank") : undefined}
        isLoading={createMutation.isPending || updateMutation.isPending}
        showPreview={isEdit && !!formData.slug}
        statusSlot={statusSlot}
      />
    </div>
  );
}

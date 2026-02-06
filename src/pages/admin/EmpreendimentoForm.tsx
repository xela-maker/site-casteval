import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ArrowLeft, Save, Eye, Building2, Star } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { DraggableGallery } from "@/components/admin/DraggableGallery";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { TaxonomySelector } from "@/components/admin/TaxonomySelector";
import { SlugField } from "@/components/admin/SlugField";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EmpreendimentoData {
  id?: string;
  status: string;
  ordem: number;
  destaque: boolean;
  nome: string;
  slug: string;
  slogan_subtitulo: string;
  descricao: string;
  descricao_curta: string;
  endereco_rua: string;
  endereco_bairro: string;
  endereco_cidade: string;
  endereco_uf: string;
  endereco_cep: string;
  mapa_google_embed: string;
  preco_inicial: number;
  metragem_inicial: number;
  metragem_final: number;
  quartos_min: number;
  quartos_max: number;
  suites_min: number;
  previsao_entrega: string;
  hero_image: string;
  hero_video_url: string;
  card_image: string;
  logo_image: string;
  amenidades: string[];
  galeria: string[];
  implantacao_imagem: string;
  mostrar_implantacao: boolean;
  galeria_videos: string[];
  seo_title: string;
  seo_description: string;
  seo_keywords: string[];
}

const initialData: EmpreendimentoData = {
  status: "rascunho",
  ordem: 0,
  destaque: false,
  nome: "",
  slug: "",
  slogan_subtitulo: "",
  descricao: "",
  descricao_curta: "",
  endereco_rua: "",
  endereco_bairro: "",
  endereco_cidade: "",
  endereco_uf: "",
  endereco_cep: "",
  mapa_google_embed: "",
  preco_inicial: 0,
  metragem_inicial: 0,
  metragem_final: 0,
  quartos_min: 0,
  quartos_max: 0,
  suites_min: 0,
  previsao_entrega: "",
  hero_image: "",
  hero_video_url: "",
  card_image: "",
  logo_image: "",
  amenidades: [],
  galeria: [],
  implantacao_imagem: "",
  mostrar_implantacao: true,
  galeria_videos: [],
  seo_title: "",
  seo_description: "",
  seo_keywords: [],
};

export default function EmpreendimentoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState<EmpreendimentoData>(initialData);

  // Tema alinhado ao dashboard
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

  // Carregar dados se for edição
  const { data: empreendimento, isLoading } = useQuery({
    queryKey: ["empreendimento", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase.from("st_empreendimentos").select("*").eq("id", id).single();

      if (error) throw error;
      return data;
    },
    enabled: isEdit,
  });

  useEffect(() => {
    if (empreendimento) {
      setFormData({
        ...empreendimento,
        amenidades: Array.isArray(empreendimento.amenidades) ? empreendimento.amenidades : [],
        galeria: Array.isArray(empreendimento.galeria) ? empreendimento.galeria : [],
        galeria_videos: Array.isArray(empreendimento.galeria_videos) ? empreendimento.galeria_videos : [],
        seo_keywords: Array.isArray(empreendimento.seo_keywords) ? empreendimento.seo_keywords : [],
        mostrar_implantacao: empreendimento.mostrar_implantacao ?? true,
      } as EmpreendimentoData);
    }
  }, [empreendimento]);

  // Helper para extrair URL de string ou objeto
  const extractImageUrl = (imageData: string | { url: string; alt?: string } | null | undefined): string => {
    if (!imageData) return '';
    if (typeof imageData === 'string') return imageData;
    if (typeof imageData === 'object' && 'url' in imageData) return imageData.url || '';
    return '';
  };

  const saveMutation = useMutation({
    mutationFn: async (data: EmpreendimentoData) => {
      // Normalizar campos de imagem para apenas URLs
      const normalizedData = {
        ...data,
        hero_image: extractImageUrl(data.hero_image as any),
        card_image: extractImageUrl(data.card_image as any),
        logo_image: extractImageUrl(data.logo_image as any),
        implantacao_imagem: extractImageUrl(data.implantacao_imagem as any),
      };

      if (isEdit) {
        const { error } = await supabase.from("st_empreendimentos").update(normalizedData).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("st_empreendimentos").insert(normalizedData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(isEdit ? "Empreendimento atualizado com sucesso" : "Empreendimento criado com sucesso");
      navigate("/admin/empreendimentos");
    },
    onError: (error) => {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao salvar empreendimento");
    },
  });

  const handleSubmit = (status: string) => {
    if (!formData.nome) {
      toast.error("Nome é obrigatório");
      return;
    }
    if (!formData.slug) {
      toast.error("Slug é obrigatório");
      return;
    }
    if (!formData.hero_image) {
      toast.error("Imagem hero é obrigatória");
      return;
    }

    saveMutation.mutate({ ...formData, status });
  };

  const updateField = (field: keyof EmpreendimentoData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: bg,
        }}
      >
        <div style={{ color: textMuted }}>Carregando...</div>
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
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              style={{
                borderRadius: 999,
                border: `1px solid ${border}`,
                backgroundColor: surface,
              }}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 4,
                }}
              >
                <div
                  style={{
                    width: 4,
                    height: 40,
                    background: `linear-gradient(180deg, ${brand}, ${brand600})`,
                    borderRadius: 4,
                  }}
                />
                <h1
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    margin: 0,
                    color: text,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Building2 size={24} />
                  {isEdit ? "Editar Empreendimento" : "Novo Empreendimento"}
                </h1>
              </div>
              <p
                style={{
                  margin: 0,
                  marginLeft: 16,
                  fontSize: 14,
                  color: textMuted,
                }}
              >
                {isEdit ? formData.nome || "Empreendimento existente" : "Crie um novo empreendimento para a Casteval"}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Button variant="outline" onClick={() => handleSubmit("rascunho")} disabled={saveMutation.isPending}>
              <Save className="h-4 w-4 mr-2" />
              Salvar rascunho
            </Button>
            <Button
              onClick={() => handleSubmit("publicado")}
              disabled={saveMutation.isPending}
              style={{
                background: `linear-gradient(135deg, ${brand}, ${brand600})`,
                color: "#0a0e13",
                border: "none",
              }}
            >
              Publicar
            </Button>
            {isEdit && formData.slug && (
              <Button variant="outline" onClick={() => window.open(`/empreendimentos/${formData.slug}`, "_blank")}>
                <Eye className="h-4 w-4 mr-2" />
                Ver no site
              </Button>
            )}
          </div>
        </div>

        {/* CARD PRINCIPAL COM TABS */}
        <div
          style={{
            background: surface,
            borderRadius: 18,
            border: `1px solid ${border}`,
            boxShadow: isDark ? "0 8px 24px rgba(0,0,0,0.45)" : "0 4px 16px rgba(15,23,42,0.08)",
            padding: 24,
          }}
        >
          <Tabs defaultValue="geral" style={{ width: "100%" }}>
            <TabsList
              className="w-full"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
                gap: 8,
                backgroundColor: surface2,
                borderRadius: 999,
                padding: 4,
                marginBottom: 24,
              }}
            >
              <TabsTrigger value="geral" style={{ fontSize: 13, fontWeight: 500 }}>
                Geral
              </TabsTrigger>
              <TabsTrigger value="localizacao" style={{ fontSize: 13, fontWeight: 500 }}>
                Localização
              </TabsTrigger>
              <TabsTrigger value="valores" style={{ fontSize: 13, fontWeight: 500 }}>
                Valores
              </TabsTrigger>
              <TabsTrigger value="midia" style={{ fontSize: 13, fontWeight: 500 }}>
                Mídia
              </TabsTrigger>
              <TabsTrigger value="lazer" style={{ fontSize: 13, fontWeight: 500 }}>
                Lazer
              </TabsTrigger>
              <TabsTrigger value="galeria" style={{ fontSize: 13, fontWeight: 500 }}>
                Galeria
              </TabsTrigger>
              <TabsTrigger value="implantacao" style={{ fontSize: 13, fontWeight: 500 }}>
                Implantação
              </TabsTrigger>
              <TabsTrigger value="seo" style={{ fontSize: 13, fontWeight: 500 }}>
                SEO
              </TabsTrigger>
            </TabsList>

            {/* GERAL */}
            <TabsContent value="geral">
              <div style={{ display: "grid", gap: 16 }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.5fr 1fr",
                    gap: 16,
                  }}
                >
                  <div>
                    <Label>Status</Label>
                    <Select value={formData.status} onValueChange={(v) => updateField("status", v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rascunho">Rascunho</SelectItem>
                        <SelectItem value="publicado">Publicado</SelectItem>
                        <SelectItem value="arquivado">Arquivado</SelectItem>
                        <SelectItem value="em-breve">Em breve</SelectItem>
                        <SelectItem value="em-construcao">Em construção</SelectItem>
                        <SelectItem value="pronto">Pronto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Ordem</Label>
                    <Input
                      type="number"
                      value={formData.ordem}
                      onChange={(e) => updateField("ordem", parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 16,
                    background: surface2,
                    borderRadius: 12,
                    border: `1px solid ${border}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: `${brand}20`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Star size={20} color={brand} fill={formData.destaque ? brand : "none"} />
                    </div>
                    <div>
                      <Label style={{ marginBottom: 4, display: "block", fontSize: 14, fontWeight: 600 }}>
                        Destaque na Home
                      </Label>
                      <p style={{ fontSize: 12, color: textMuted, margin: 0 }}>
                        Marque para exibir este empreendimento na seção de destaques da home
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.destaque}
                    onCheckedChange={(checked) => updateField("destaque", checked)}
                  />
                </div>

                <div>
                  <Label>Nome *</Label>
                  <Input
                    value={formData.nome}
                    onChange={(e) => updateField("nome", e.target.value)}
                    placeholder="Nome do empreendimento"
                    required
                  />
                </div>

                <SlugField
                  value={formData.slug}
                  onChange={(v) => updateField("slug", v)}
                  basedOn={formData.nome}
                  table="st_empreendimentos"
                  currentId={id}
                  required
                />

                <div>
                  <Label>Slogan / Subtítulo</Label>
                  <Input
                    value={formData.slogan_subtitulo}
                    onChange={(e) => updateField("slogan_subtitulo", e.target.value)}
                    placeholder="Ex: Residências exclusivas em Santa Felicidade"
                  />
                </div>

                <RichTextEditor
                  label="Descrição"
                  value={formData.descricao}
                  onChange={(v) => updateField("descricao", v)}
                  placeholder="Descrição completa do empreendimento"
                  minHeight={200}
                />

                <div>
                  <Label>Descrição Curta</Label>
                  <Input
                    value={formData.descricao_curta}
                    onChange={(e) => updateField("descricao_curta", e.target.value)}
                    placeholder="Breve descrição para cards (máx. 200 caracteres)"
                    maxLength={200}
                  />
                </div>
              </div>
            </TabsContent>

            {/* LOCALIZAÇÃO */}
            <TabsContent value="localizacao">
              <div style={{ display: "grid", gap: 16 }}>
                <div>
                  <Label>Endereço - Rua *</Label>
                  <Input
                    value={formData.endereco_rua}
                    onChange={(e) => updateField("endereco_rua", e.target.value)}
                    placeholder="Rua, avenida, etc."
                    required
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                  }}
                >
                  <div>
                    <Label>Bairro *</Label>
                    <Input
                      value={formData.endereco_bairro}
                      onChange={(e) => updateField("endereco_bairro", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Cidade *</Label>
                    <Input
                      value={formData.endereco_cidade}
                      onChange={(e) => updateField("endereco_cidade", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                  }}
                >
                  <div>
                    <Label>UF *</Label>
                    <Input
                      value={formData.endereco_uf}
                      onChange={(e) => updateField("endereco_uf", e.target.value.toUpperCase())}
                      placeholder="PR"
                      maxLength={2}
                      required
                    />
                  </div>
                  <div>
                    <Label>CEP</Label>
                    <Input
                      value={formData.endereco_cep}
                      onChange={(e) => updateField("endereco_cep", e.target.value)}
                      placeholder="00000-000"
                    />
                  </div>
                </div>

                <div>
                  <Label>Mapa Google Embed</Label>
                  <Input
                    value={formData.mapa_google_embed}
                    onChange={(e) => updateField("mapa_google_embed", e.target.value)}
                    placeholder="Cole a URL do iframe do Google Maps"
                  />
                  <p
                    style={{
                      fontSize: 12,
                      marginTop: 4,
                      color: textMuted,
                    }}
                  >
                    Cole a URL completa do embed do Google Maps.
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* VALORES */}
            <TabsContent value="valores">
              <div style={{ display: "grid", gap: 16 }}>
                <div>
                  <Label>Valor a partir de (R$) *</Label>
                  <Input
                    type="number"
                    value={formData.preco_inicial}
                    onChange={(e) => updateField("preco_inicial", parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                  }}
                >
                  <div>
                    <Label>Metragem inicial (m²)</Label>
                    <Input
                      type="number"
                      value={formData.metragem_inicial}
                      onChange={(e) => updateField("metragem_inicial", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Metragem final (m²)</Label>
                    <Input
                      type="number"
                      value={formData.metragem_final}
                      onChange={(e) => updateField("metragem_final", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gap: 16,
                  }}
                >
                  <div>
                    <Label>Quartos mínimos</Label>
                    <Input
                      type="number"
                      value={formData.quartos_min}
                      onChange={(e) => updateField("quartos_min", parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Quartos máximos</Label>
                    <Input
                      type="number"
                      value={formData.quartos_max}
                      onChange={(e) => updateField("quartos_max", parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Suítes mínimas</Label>
                    <Input
                      type="number"
                      value={formData.suites_min}
                      onChange={(e) => updateField("suites_min", parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div>
                  <Label>Previsão de entrega</Label>
                  <Input
                    value={formData.previsao_entrega}
                    onChange={(e) => updateField("previsao_entrega", e.target.value)}
                    placeholder="Ex: Pronto para morar, março 2026"
                  />
                </div>
              </div>
            </TabsContent>

            {/* MÍDIA */}
            <TabsContent value="midia">
              <div style={{ display: "grid", gap: 24 }}>
                <ImageUploader
                  label="Hero foto *"
                  description="Recomendado: 1920x1080px, proporção 16:9"
                  value={formData.hero_image}
                  onChange={(v) => updateField("hero_image", v)}
                  aspectRatio="16:9"
                  required
                />

                <div>
                  <Label>Hero vídeo URL</Label>
                  <Input
                    value={formData.hero_video_url}
                    onChange={(e) => updateField("hero_video_url", e.target.value)}
                    placeholder="URL do YouTube, Vimeo ou MP4"
                  />
                  <p
                    style={{
                      fontSize: 12,
                      marginTop: 4,
                      color: textMuted,
                    }}
                  >
                    Se preencher, o vídeo aparece no herói com botão de play.
                  </p>
                </div>

                <ImageUploader
                  label="Logo do empreendimento"
                  description="De preferência em PNG com fundo transparente"
                  value={formData.logo_image}
                  onChange={(v) => updateField("logo_image", v)}
                />

                <ImageUploader
                  label="Imagem de card"
                  description="Imagem usada em listagens e cards"
                  value={formData.card_image}
                  onChange={(v) => updateField("card_image", v)}
                />
              </div>
            </TabsContent>

            {/* LAZER */}
            <TabsContent value="lazer">
              <div style={{ display: "grid", gap: 16 }}>
                <TaxonomySelector
                  type="itens_lazer"
                  label="Itens de lazer"
                  description="Selecione os itens de lazer disponíveis"
                  value={formData.amenidades}
                  onChange={(v) => updateField("amenidades", v)}
                />
              </div>
            </TabsContent>

            {/* GALERIA */}
            <TabsContent value="galeria">
              <div style={{ display: "grid", gap: 24 }}>
                <DraggableGallery
                  label="Galeria de fotos"
                  description="Arraste para reordenar. A primeira imagem será a principal."
                  value={formData.galeria}
                  onChange={(v) => updateField("galeria", v)}
                  maxFiles={50}
                  bucket="empreendimentos"
                />
              </div>
            </TabsContent>

            {/* IMPLANTAÇÃO */}
            <TabsContent value="implantacao">
              <div style={{ display: "grid", gap: 16 }}>
                {/* Toggle para mostrar/ocultar seção */}
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  backgroundColor: isDark ? "#1a1a1a" : "#f5f5f5",
                  borderRadius: 8,
                }}>
                  <div>
                    <Label style={{ marginBottom: 4 }}>Exibir seção de implantação</Label>
                    <p style={{ fontSize: 12, color: textMuted, marginTop: 4 }}>
                      Ative para mostrar a seção de implantação na página pública do empreendimento
                    </p>
                  </div>
                  <Switch
                    checked={formData.mostrar_implantacao ?? true}
                    onCheckedChange={(checked) => updateField("mostrar_implantacao", checked)}
                  />
                </div>

                <ImageUploader
                  label="Planta de implantação"
                  description="Planta geral do condomínio / implantação"
                  value={formData.implantacao_imagem}
                  onChange={(v) => updateField("implantacao_imagem", v)}
                />
              </div>
            </TabsContent>

            {/* SEO */}
            <TabsContent value="seo">
              <div style={{ display: "grid", gap: 16 }}>
                <div>
                  <Label>SEO Title</Label>
                  <Input
                    value={formData.seo_title}
                    onChange={(e) => updateField("seo_title", e.target.value)}
                    placeholder="Título otimizado para SEO (máx. 60 caracteres)"
                    maxLength={60}
                  />
                </div>

                <div>
                  <Label>SEO Description</Label>
                  <Input
                    value={formData.seo_description}
                    onChange={(e) => updateField("seo_description", e.target.value)}
                    placeholder="Descrição para mecanismos de busca (máx. 160 caracteres)"
                    maxLength={160}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Rodapé com hint de status */}
        <p
          style={{
            marginTop: 16,
            fontSize: 12,
            color: textMuted,
            textAlign: "right",
          }}
        >
          Campos marcados com * são obrigatórios para publicação.
        </p>
      </div>
    </div>
  );
}

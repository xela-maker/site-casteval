import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { useBanner, useCreateBanner, useUpdateBanner } from "@/hooks/useBannersHome";
import { ArrowLeft } from "lucide-react";

const bannerSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  subtitulo: z.string().optional(),
  logo_image: z.string().optional(),
  background_image: z.string().min(1, "Imagem de fundo é obrigatória"),
  link_destino: z.string().min(1, "Link de destino é obrigatório"),
  texto_botao: z.string().min(1, "Texto do botão é obrigatório"),
  logo_alt: z.string().optional(),
  ordem: z.number().min(0),
  is_active: z.boolean(),
});

type BannerFormData = z.infer<typeof bannerSchema>;

export default function BannerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const { data: banner, isLoading } = useBanner(id);
  const createMutation = useCreateBanner();
  const updateMutation = useUpdateBanner();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      titulo: "",
      subtitulo: "",
      logo_image: "",
      background_image: "",
      link_destino: "",
      texto_botao: "Saiba Mais",
      logo_alt: "",
      ordem: 0,
      is_active: true,
    },
  });

  const watchedValues = watch();

  // Estilos para os botões do RichTextEditor
  useEffect(() => {
    const styleId = "richtext-toolbar-styles-banner";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        /* Toolbar do RichTextEditor */
        .tiptap-toolbar,
        [class*="toolbar"] {
          padding: 12px !important;
          gap: 8px !important;
          border-bottom: 2px solid hsl(var(--admin-line)) !important;
          background: hsl(var(--admin-surface-2)) !important;
        }
        
        /* Botões da toolbar */
        .tiptap-toolbar button,
        [class*="toolbar"] button {
          min-width: 44px !important;
          min-height: 44px !important;
          padding: 10px !important;
          border-radius: 8px !important;
          transition: all 0.2s !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        
        /* Ícones dentro dos botões */
        .tiptap-toolbar button svg,
        [class*="toolbar"] button svg {
          width: 22px !important;
          height: 22px !important;
        }
        
        /* Hover nos botões */
        .tiptap-toolbar button:hover,
        [class*="toolbar"] button:hover {
          background: hsl(var(--admin-accent)) !important;
          transform: scale(1.05) !important;
        }
        
        /* Botão ativo */
        .tiptap-toolbar button.is-active,
        [class*="toolbar"] button.is-active {
          background: hsl(var(--admin-accent)) !important;
          color: hsl(var(--admin-accent-foreground)) !important;
        }
        
        /* Separadores */
        .tiptap-toolbar .separator,
        [class*="toolbar"] .separator {
          width: 2px !important;
          height: 36px !important;
          background: hsl(var(--admin-line)) !important;
          margin: 0 8px !important;
        }
        
        /* Selects e inputs da toolbar */
        .tiptap-toolbar select,
        .tiptap-toolbar input,
        [class*="toolbar"] select,
        [class*="toolbar"] input {
          min-height: 44px !important;
          padding: 10px 12px !important;
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
    if (banner && isEdit) {
      setValue("titulo", banner.titulo);
      setValue("subtitulo", banner.subtitulo || "");
      setValue("logo_image", banner.logo_image || "");
      setValue("background_image", banner.background_image);
      setValue("link_destino", banner.link_destino);
      setValue("texto_botao", banner.texto_botao);
      setValue("logo_alt", banner.logo_alt || "");
      setValue("ordem", banner.ordem);
      setValue("is_active", banner.is_active);
    }
  }, [banner, isEdit, setValue]);

  // Helper para extrair URL de string ou objeto
  const extractImageUrl = (imageData: string | { url: string; alt?: string } | null | undefined): string => {
    if (!imageData) return "";
    if (typeof imageData === "string") return imageData;
    if (typeof imageData === "object" && "url" in imageData) return imageData.url || "";
    return "";
  };

  const onSubmit = async (data: BannerFormData) => {
    // Normalizar campos de imagem para apenas URLs
    const normalizedData = {
      ...data,
      logo_image: extractImageUrl(data.logo_image as any),
      background_image: extractImageUrl(data.background_image as any),
    };

    if (isEdit && id) {
      await updateMutation.mutateAsync({ id, data: normalizedData });
    } else {
      await createMutation.mutateAsync(normalizedData);
    }
    navigate("/admin/banners");
  };

  if (isLoading) {
    return <div style={{ color: "hsl(var(--admin-muted))" }}>Carregando...</div>;
  }

  return (
    <div
      style={{
        paddingBottom: "80px",
        maxWidth: "1600px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: "32px",
          paddingBottom: "24px",
          borderBottom: "2px solid hsl(var(--admin-line))",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "12px",
          }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/banners")}
            style={{
              color: "hsl(var(--admin-muted))",
              padding: "8px 16px",
              fontSize: "14px",
            }}
          >
            <ArrowLeft style={{ width: "18px", height: "18px", marginRight: "8px" }} />
            Voltar
          </Button>
        </div>
        <h1
          style={{
            color: "hsl(var(--admin-text))",
            fontSize: "32px",
            fontWeight: 700,
            margin: 0,
          }}
        >
          {isEdit ? "Editar Banner" : "Novo Banner"}
        </h1>
        <p
          style={{
            color: "hsl(var(--admin-muted))",
            fontSize: "15px",
            marginTop: "8px",
          }}
        >
          {isEdit ? "Atualize as informações do banner da home" : "Crie um novo banner para a página inicial"}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "32px",
        }}
        className="banner-form-grid"
      >
        {/* Formulário */}
        <div>
          <div
            style={{
              background: "hsl(var(--admin-surface))",
              border: "1px solid hsl(var(--admin-line))",
              borderRadius: "16px",
              padding: "32px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "hsl(var(--admin-text))",
                marginBottom: "24px",
                paddingBottom: "16px",
                borderBottom: "1px solid hsl(var(--admin-line))",
              }}
            >
              Informações do Banner
            </h2>

            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              {/* Título */}
              <div>
                <RichTextEditor
                  label="Título"
                  value={watch("titulo")}
                  onChange={(value) => setValue("titulo", value)}
                  placeholder="Digite o título do banner..."
                  minHeight={100}
                  required
                  description="Use formatação Markdown para quebras de linha e estilização"
                />
              </div>

              {/* Subtítulo */}
              <div>
                <RichTextEditor
                  label="Subtítulo"
                  value={watch("subtitulo") || ""}
                  onChange={(value) => setValue("subtitulo", value)}
                  placeholder="Digite o subtítulo do banner..."
                  minHeight={120}
                  description="Use formatação Markdown para quebras de linha e estilização"
                />
              </div>

              {/* Imagens */}
              <div
                style={{
                  padding: "20px",
                  background: "hsl(var(--admin-surface-2))",
                  borderRadius: "12px",
                  border: "1px solid hsl(var(--admin-line))",
                }}
              >
                <h3
                  style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "hsl(var(--admin-text))",
                    marginBottom: "20px",
                  }}
                >
                  Imagens
                </h3>

                <div style={{ marginBottom: "20px" }}>
                  <Label
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Logo do Empreendimento
                  </Label>
                  <ImageUploader
                    value={watchedValues.logo_image || ""}
                    onChange={(url) => {
                      const finalUrl = typeof url === "string" ? url : "";
                      setValue("logo_image", finalUrl);
                    }}
                    bucket="empreendimentos"
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <Label
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Logo Alt Text
                  </Label>
                  <Input
                    {...register("logo_alt")}
                    placeholder="Ex: Casa Volpi"
                    style={{
                      padding: "10px 12px",
                      fontSize: "14px",
                    }}
                  />
                </div>

                <div>
                  <Label
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Imagem de Fundo *
                  </Label>
                  <ImageUploader
                    value={watchedValues.background_image}
                    onChange={(url) => {
                      const finalUrl = typeof url === "string" ? url : "";
                      setValue("background_image", finalUrl);
                    }}
                    bucket="empreendimentos"
                  />
                  {errors.background_image && (
                    <p
                      style={{
                        color: "hsl(var(--admin-error))",
                        fontSize: "13px",
                        marginTop: "6px",
                      }}
                    >
                      {errors.background_image.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Configurações */}
              <div
                style={{
                  padding: "20px",
                  background: "hsl(var(--admin-surface-2))",
                  borderRadius: "12px",
                  border: "1px solid hsl(var(--admin-line))",
                }}
              >
                <h3
                  style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "hsl(var(--admin-text))",
                    marginBottom: "20px",
                  }}
                >
                  Configurações
                </h3>

                <div style={{ marginBottom: "20px" }}>
                  <Label
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Link de Destino *
                  </Label>
                  <Input
                    {...register("link_destino")}
                    placeholder="/empreendimentos/casa-volpi"
                    style={{
                      padding: "10px 12px",
                      fontSize: "14px",
                    }}
                  />
                  {errors.link_destino && (
                    <p
                      style={{
                        color: "hsl(var(--admin-error))",
                        fontSize: "13px",
                        marginTop: "6px",
                      }}
                    >
                      {errors.link_destino.message}
                    </p>
                  )}
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <Label
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Texto do Botão *
                  </Label>
                  <Input
                    {...register("texto_botao")}
                    style={{
                      padding: "10px 12px",
                      fontSize: "14px",
                    }}
                  />
                  {errors.texto_botao && (
                    <p
                      style={{
                        color: "hsl(var(--admin-error))",
                        fontSize: "13px",
                        marginTop: "6px",
                      }}
                    >
                      {errors.texto_botao.message}
                    </p>
                  )}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                  }}
                >
                  <div>
                    <Label
                      style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        marginBottom: "8px",
                        display: "block",
                      }}
                    >
                      Ordem
                    </Label>
                    <Input
                      type="number"
                      {...register("ordem", { valueAsNumber: true })}
                      style={{
                        padding: "10px 12px",
                        fontSize: "14px",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 12px",
                        background: "hsl(var(--admin-surface))",
                        borderRadius: "8px",
                        border: "1px solid hsl(var(--admin-line))",
                      }}
                    >
                      <Switch
                        checked={watchedValues.is_active}
                        onCheckedChange={(checked) => setValue("is_active", checked)}
                      />
                      <Label
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          margin: 0,
                        }}
                      >
                        Banner Ativo
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  paddingTop: "8px",
                }}
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/banners")}
                  style={{
                    borderColor: "hsl(var(--admin-line))",
                    flex: "1",
                    padding: "12px 24px",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="admin-btn-primary"
                  style={{
                    flex: "1",
                    padding: "12px 24px",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  {isEdit ? "Atualizar" : "Criar"} Banner
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Preview */}
        <div
          style={{
            position: "sticky",
            top: "24px",
            height: "fit-content",
          }}
        >
          <div
            style={{
              background: "hsl(var(--admin-surface))",
              border: "1px solid hsl(var(--admin-line))",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#10b981",
                }}
              />
              <h3
                style={{
                  color: "hsl(var(--admin-text))",
                  fontWeight: 600,
                  fontSize: "16px",
                  margin: 0,
                }}
              >
                Preview em Tempo Real
              </h3>
            </div>

            <div
              style={{
                position: "relative",
                minHeight: "500px",
                borderRadius: "12px",
                overflow: "hidden",
                background: "#0a0a0a",
                border: "1px solid hsl(var(--admin-line))",
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              }}
            >
              {watchedValues.background_image && (
                <>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage: `url(${watchedValues.background_image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      opacity: 0.9,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.2) 100%)",
                    }}
                  />
                </>
              )}
              <div
                style={{
                  position: "relative",
                  zIndex: 10,
                  padding: "40px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  minHeight: "500px",
                }}
              >
                {watchedValues.logo_image && (
                  <img
                    src={watchedValues.logo_image}
                    alt={watchedValues.logo_alt || watchedValues.titulo}
                    style={{
                      height: "56px",
                      width: "auto",
                      marginBottom: "24px",
                      objectFit: "contain",
                    }}
                  />
                )}
                <h2
                  style={{
                    color: "white",
                    fontSize: "36px",
                    fontWeight: "600",
                    marginBottom: "12px",
                    lineHeight: "1.3",
                    textShadow: "0 2px 12px rgba(0,0,0,0.5)",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: watchedValues.titulo?.replace(/\n/g, "<br>") || "Título do banner",
                  }}
                />
                {watchedValues.subtitulo && (
                  <p
                    style={{
                      color: "white",
                      fontSize: "18px",
                      marginBottom: "28px",
                      opacity: 0.9,
                      lineHeight: "1.5",
                      textShadow: "0 1px 8px rgba(0,0,0,0.5)",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: watchedValues.subtitulo.replace(/\n/g, "<br>"),
                    }}
                  />
                )}
                <div>
                  <Button
                    size="lg"
                    style={{
                      background: "#F5B321",
                      color: "#000",
                      padding: "14px 32px",
                      fontSize: "15px",
                      fontWeight: 600,
                      borderRadius: "9999px",
                      border: "none",
                      boxShadow: "0 4px 16px rgba(245, 179, 33, 0.3)",
                    }}
                  >
                    {watchedValues.texto_botao || "Saiba Mais"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Info do Preview */}
            <div
              style={{
                marginTop: "16px",
                padding: "12px 16px",
                background: "hsl(var(--admin-surface-2))",
                borderRadius: "8px",
                fontSize: "13px",
                color: "hsl(var(--admin-muted))",
              }}
            >
              💡 O preview mostra como o banner aparecerá na página inicial
            </div>
          </div>
        </div>
      </div>

      {/* CSS Responsivo */}
      <style>{`
        @media (max-width: 1024px) {
          .banner-form-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

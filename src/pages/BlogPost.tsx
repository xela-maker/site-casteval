import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { LazyImage } from "@/components/LazyImage";
import { useBlogBySlug } from "@/hooks/useBlogBySlug";
import { Calendar, User } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useBlogBySlug(slug);

  // Helper para extrair URL de campos de imagem que podem estar como JSON string
  const getImageUrl = (imageField: string | null | undefined): string => {
    if (!imageField) return "";
    try {
      const parsed = JSON.parse(imageField);
      return parsed.url || "";
    } catch {
      // Se não for JSON, retorna o valor direto (já é uma URL)
      return imageField;
    }
  };

  // ESTILOS GERAIS
  const pageBg = "#050608";
  const surface = "#F6F6F6";
  const textDark = "#111111";
  const textMuted = "#666666";
  const primary = "#F5B321";

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: pageBg }}>
        <Header />
        <main
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "72px 24px",
          }}
        >
          <Skeleton
            style={{
              height: 60,
              width: "75%",
              marginBottom: 24,
              borderRadius: 8,
            }}
          />
          <Skeleton
            style={{
              height: 320,
              width: "100%",
              marginBottom: 40,
              borderRadius: 16,
            }}
          />
          <div style={{ display: "grid", gap: 16 }}>
            <Skeleton style={{ height: 18, width: "100%", borderRadius: 8 }} />
            <Skeleton style={{ height: 18, width: "100%", borderRadius: 8 }} />
            <Skeleton style={{ height: 18, width: "75%", borderRadius: 8 }} />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: pageBg }}>
        <Header />
        <main
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "96px 24px",
            color: "#FFFFFF",
          }}
        >
          <h1
            style={{
              fontSize: 32,
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            Post não encontrado
          </h1>
          <Link
            to="/blog"
            style={{
              display: "inline-block",
              marginTop: 12,
              color: primary,
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Voltar para o blog
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const featuredImage = getImageUrl(post.imagem_destaque) || getImageUrl(post.imagem_card) || "";
  
  // Debug: verificar URL da imagem
  if (featuredImage) {
    console.log("Featured Image URL:", featuredImage);
  } else {
    console.log("Nenhuma imagem de destaque encontrada");
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: pageBg }}>
      <SEOHead
        title={`${post.seo_title || post.titulo} - Blog Casteval`}
        description={post.seo_description || post.resumo || ""}
        keywords={post.seo_keywords?.join(", ") || post.categoria || ""}
      />

      {/* estilos específicos da página */}
      <style>{`
        @media (max-width: 768px) {
          .post-wrapper {
            padding: 32px 16px !important;
          }
          .post-breadcrumb {
            padding: 16px !important;
          }
          .post-title {
            font-size: 24px !important;
          }
          .post-meta {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 8px !important;
          }
          .post-hero-image {
            height: 260px !important;
          }
          .post-cta-title {
            font-size: 24px !important;
            line-height: 32px !important;
          }
        }

        .post-content {
          color: #222222;
          font-size: 16px;
          line-height: 1.7;
        }
        .post-content p {
          margin-bottom: 16px;
        }
        .post-content h1 {
          font-size: 28px;
          margin: 40px 0 16px;
          font-weight: 700;
          color: #111111;
        }
        .post-content h2 {
          font-size: 24px;
          margin: 32px 0 12px;
          font-weight: 700;
          color: #111111;
        }
        .post-content h3 {
          font-size: 20px;
          margin: 24px 0 10px;
          font-weight: 600;
          color: #111111;
        }
        .post-content h4 {
          font-size: 18px;
          margin: 20px 0 8px;
          font-weight: 600;
          color: #111111;
        }
        .post-content ul,
        .post-content ol {
          margin: 8px 0 16px 24px;
        }
        .post-content ul {
          list-style-type: disc;
        }
        .post-content ol {
          list-style-type: decimal;
        }
        .post-content li {
          margin-bottom: 6px;
        }
        .post-content a {
          color: #F5B321;
          text-decoration: underline;
        }
        .post-content strong {
          font-weight: 700;
        }
        .post-content u {
          text-decoration: underline;
        }
        .post-content s {
          text-decoration: line-through;
        }
        .post-content code {
          background: #f5f5f5;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
        }
        .post-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 16px 0;
          display: block;
        }
        .post-content blockquote {
          border-left: 4px solid #F5B321;
          padding-left: 16px;
          margin: 16px 0;
          font-style: italic;
          color: #555;
        }
        .post-content hr {
          border: 0;
          border-top: 2px solid #e0e0e0;
          margin: 24px 0;
        }
        .post-content [style*="text-align: center"] {
          text-align: center;
        }
        .post-content [style*="text-align: right"] {
          text-align: right;
        }
        .post-content [style*="text-align: justify"] {
          text-align: justify;
        }
      `}</style>

      <Header />

      <main>
        {/* POST */}
        <section
          style={{
            padding: "48px 0 64px",
            background: "linear-gradient(to bottom, #050608 0%, #111111 40%, #F6F6F6 40%, #F6F6F6 100%)",
          }}
        >
          <div
            className="post-wrapper"
            style={{
              maxWidth: "900px",
              margin: "0 auto",
              padding: "40px 24px 0",
              backgroundColor: "transparent",
            }}
          >
            {/* Categoria */}
            {post.categoria && (
              <Badge
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px 14px",
                  borderRadius: 999,
                  backgroundColor: primary,
                  color: "#000000",
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 16,
                }}
              >
                {post.categoria}
              </Badge>
            )}

            {/* Título */}
            <h1
              className="post-title"
              style={{
                fontSize: 32,
                lineHeight: 1.25,
                fontWeight: 700,
                color: "#FFFFFF",
                marginBottom: 12,
              }}
            >
              {post.titulo}
            </h1>

            {/* Resumo, se existir */}
            {post.resumo && (
              <p
                style={{
                  fontSize: 16,
                  color: "#EAEAEA",
                  marginBottom: 20,
                  maxWidth: "90%",
                }}
              >
                {post.resumo}
              </p>
            )}

            {/* Meta */}
            <div
              className="post-meta"
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 16,
                fontSize: 13,
                color: "#DDDDDD",
                marginBottom: 28,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Calendar style={{ width: 16, height: 16 }} />
                <span>
                  {post.data_publicacao
                    ? format(new Date(post.data_publicacao), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                    : "Data não informada"}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <User style={{ width: 16, height: 16 }} />
                <span>{post.autor_nome || "Equipe Casteval"}</span>
              </div>
            </div>

            {/* Imagem de destaque */}
            {featuredImage && (
              <div
                className="post-hero-image"
                style={{
                  position: "relative",
                  height: 380,
                  borderRadius: 18,
                  overflow: "hidden",
                  boxShadow: "0 18px 40px rgba(0,0,0,0.55)",
                  marginBottom: 40,
                  backgroundColor: "#1a1a1a",
                }}
              >
                <img 
                  src={featuredImage} 
                  alt={post.titulo} 
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block"
                  }}
                  loading="lazy"
                  onError={(e) => {
                    console.error("Erro ao carregar imagem:", featuredImage);
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.15))",
                    pointerEvents: "none",
                  }}
                />
              </div>
            )}

            {/* Conteúdo */}
            <div
              className="post-content"
              dangerouslySetInnerHTML={{ __html: post.conteudo || "" }}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 18,
                padding: 32,
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              }}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

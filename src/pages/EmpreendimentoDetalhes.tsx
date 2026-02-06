import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFAB } from "@/components/WhatsAppFAB";
import { SEOHead } from "@/components/SEOHead";
import { LazyImage } from "@/components/LazyImage";
import { EmpreendimentoDetailsSkeleton } from "@/components/EmpreendimentoDetailsSkeleton";
import { WhatsAppIntegration } from "@/components/WhatsAppIntegration";
import { useEmpreendimento } from "@/hooks/useEmpreendimentos";
import { useItensLazerWithIcons } from "@/hooks/useItensLazerWithIcons";
import { createEmpreendimentoSchema } from "@/lib/structuredData";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import casaVolpiHero from "@/assets/casa-volpi-hero.jpg";
import familiaCta from "@/assets/familia-cta.jpg";
import {
  Play,
  MapPin,
  Bed,
  Maximize,
  Box,
  CircleDollarSign,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Camera,
} from "lucide-react";
import * as icons from "lucide-react";
import { Dialog, DialogContent, LightboxDialogContent } from "@/components/ui/dialog";

// Componente de Carrossel da Galeria
function GalleryCarousel({ images, empreendimentoNome, onImageClick }: any) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 640) {
        setItemsPerView(1);
      } else if (window.innerWidth <= 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, images.length - itemsPerView);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  const handlePrev = () => {
    if (canGoPrev) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Container do carrossel */}
      <div
        style={{
          overflow: "hidden",
          position: "relative",
          padding: "10px 0", // Espaço para sombra
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 16,
            transform: `translateX(-${currentIndex * (100 / itemsPerView + 16 / itemsPerView)}%)`,
            transition: "transform 0.4s ease-in-out",
          }}
        >
          {images.map((imagem: any, index: number) => (
            <div
              key={index}
              onClick={() => onImageClick(index)}
              style={{
                minWidth: `calc(${100 / itemsPerView}% - ${(16 * (itemsPerView - 1)) / itemsPerView}px)`,
                cursor: "pointer",
                borderRadius: 8,
                overflow: "hidden",
                boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
                transition: "transform 0.2s, box-shadow 0.2s",
                position: "relative",
                height: 280,
                backgroundColor: "#f0f0f0",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.18)";
              }}
            >
              <LazyImage
                src={typeof imagem === "string" ? imagem : imagem.url}
                alt={`${empreendimentoNome} - Galeria ${index + 1}`}
                className="w-full h-full object-cover"
                threshold={0.2}
              />
              {/* Overlay com ícone */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(0,0,0,0)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background-color 0.2s, opacity 0.2s",
                  opacity: 0,
                }}
                className="gallery-overlay"
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    backgroundColor: "#F5B321",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Camera color="#000" size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seta Esquerda */}
      {canGoPrev && (
        <button
          onClick={handlePrev}
          style={{
            position: "absolute",
            left: -20,
            top: "50%",
            transform: "translateY(-50%)",
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "none",
            backgroundColor: "#F5B321",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s, box-shadow 0.2s",
            zIndex: 10,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(-50%) scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
          }}
        >
          <ChevronLeft color="#000" size={28} />
        </button>
      )}

      {/* Seta Direita */}
      {canGoNext && (
        <button
          onClick={handleNext}
          style={{
            position: "absolute",
            right: -20,
            top: "50%",
            transform: "translateY(-50%)",
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "none",
            backgroundColor: "#F5B321",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s, box-shadow 0.2s",
            zIndex: 10,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(-50%) scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
          }}
        >
          <ChevronRight color="#000" size={28} />
        </button>
      )}

      {/* Indicadores de posição */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 8,
          marginTop: 20,
        }}
      >
        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            style={{
              width: currentIndex === idx ? 24 : 8,
              height: 8,
              borderRadius: 4,
              border: "none",
              backgroundColor: currentIndex === idx ? "#F5B321" : "#D0D0D0",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
            aria-label={`Ir para slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// Novo Componente de Carrossel para Residências
function ResidenciasCarousel({ casas, empreendimento }: any) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 640) {
        setItemsPerView(1);
      } else if (window.innerWidth <= 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3); // 3 items em telas grandes para melhor visualização dos cards
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, casas.length - itemsPerView);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  const handlePrev = () => {
    if (canGoPrev) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const gap = 20; // Espaçamento entre os cards

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          overflow: "hidden",
          position: "relative",
          margin: "0 -10px", // Compensar o padding lateral dos cards para hover
          padding: "24px 10px", // Padding generoso para evitar cortes de sombra e escala
        }}
      >
        <div
          style={{
            display: "flex",
            gap: gap,
            transform: `translateX(-${currentIndex * (100 / itemsPerView + gap / itemsPerView)}%)`,
            transition: "transform 0.4s ease-in-out",
          }}
        >
          {casas.map((casa: any) => (
            <div
              key={casa.id}
              style={{
                minWidth: `calc(${100 / itemsPerView}% - ${(gap * (itemsPerView - 1)) / itemsPerView}px)`,
                borderRadius: 8,
                overflow: "hidden",
                backgroundColor: "#FFFFFF",
                boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s, box-shadow 0.2s",
                height: "auto", // Altura automática para o conteúdo
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.01)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.15)";
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: 200, // Altura fixa para imagem
                }}
              >
                <LazyImage
                  src={casa.foto_capa || empreendimento.card_image}
                  alt={casa.nome}
                  className="w-full h-full object-cover block"
                />
              </div>
              <div
                style={{
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                }}
              >
                <p
                  style={{
                    fontSize: 12,
                    color: "#777",
                    marginBottom: 4,
                  }}
                >
                  {casa.subtitulo || empreendimento.nome}
                </p>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    marginBottom: 8,
                    lineHeight: 1.3,
                  }}
                >
                  {casa.nome}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "#666",
                    marginBottom: 12,
                    lineHeight: 1.4,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {casa.descricao_curta}
                </p>

                <div style={{ marginTop: "auto" }}>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#777",
                      marginBottom: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Maximize size={14} />
                    {casa.metragem ? `${casa.metragem}m²` : "-"}
                    <span style={{ margin: "0 4px" }}>•</span>
                    <Bed size={14} />
                    {casa.quartos ? `${casa.quartos} quartos` : "-"}
                  </p>

                  {casa.preco && (
                    <p
                      style={{
                        fontWeight: 700,
                        color: "#F5B321",
                        fontSize: 16,
                        marginBottom: 16,
                      }}
                    >
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(casa.preco)}
                    </p>
                  )}

                  <Link
                    to={`/empreendimentos/${empreendimento.slug}/${casa.slug}`}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "12px 0",
                      textAlign: "center",
                      backgroundColor: "#F5B321",
                      color: "#000",
                      fontWeight: 600,
                      fontSize: 14,
                      textDecoration: "none",
                      borderRadius: 4,
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#E0A31C";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#F5B321";
                    }}
                  >
                    Ver Detalhes
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seta Esquerda */}
      {canGoPrev && (
        <button
          onClick={handlePrev}
          style={{
            position: "absolute",
            left: -20,
            top: "50%",
            transform: "translateY(-50%)",
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "none",
            backgroundColor: "#F5B321",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s, box-shadow 0.2s",
            zIndex: 10,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(-50%) scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
          }}
        >
          <ChevronLeft color="#000" size={28} />
        </button>
      )}

      {/* Seta Direita */}
      {canGoNext && (
        <button
          onClick={handleNext}
          style={{
            position: "absolute",
            right: -20,
            top: "50%",
            transform: "translateY(-50%)",
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "none",
            backgroundColor: "#F5B321",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s, box-shadow 0.2s",
            zIndex: 10,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(-50%) scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
          }}
        >
          <ChevronRight color="#000" size={28} />
        </button>
      )}

      {/* Indicadores de posição (Bullets) */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 8,
          marginTop: 24,
        }}
      >
        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            style={{
              width: currentIndex === idx ? 24 : 8,
              height: 8,
              borderRadius: 4,
              border: "none",
              backgroundColor: currentIndex === idx ? "#F5B321" : "#D0D0D0",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
            aria-label={`Ir para grupo ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function EmpreendimentoDetalhes() {
  const { slug } = useParams<{
    slug: string;
  }>();
  const { data: result, isLoading } = useEmpreendimento(slug || "");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [implantacaoLightboxOpen, setImplantacaoLightboxOpen] = useState(false);

  // carrossel da faixa de infos (mobile/tablet)
  const [currentInfoIndex, setCurrentInfoIndex] = useState(0);
  const amenidadeIds = result?.amenidades || [];
  const { data: itensLazerWithIcons = [] } = useItensLazerWithIcons(amenidadeIds);

  // auto-slide somente em telas menores - SEMPRE chamar hooks antes dos early returns
  useEffect(() => {
    if (!result) return;
    if (typeof window === "undefined") return;
    if (window.innerWidth > 1024) return;
    const interval = setInterval(() => {
      setCurrentInfoIndex((prev) => (prev + 1) % 4); // 4 items na faixa
    }, 4500);
    return () => clearInterval(interval);
  }, [result]);

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return match ? match[1] : null;
  };
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };
  const nextLightboxImage = () => {
    if (empreendimento?.galeria) {
      setLightboxIndex((prev) => (prev + 1) % empreendimento.galeria.length);
    }
  };
  const prevLightboxImage = () => {
    if (empreendimento?.galeria) {
      setLightboxIndex((prev) => (prev - 1 + empreendimento.galeria.length) % empreendimento.galeria.length);
    }
  };

  const swipeRef = useSwipeGesture({
    onSwipeLeft: nextLightboxImage,
    onSwipeRight: prevLightboxImage,
  });

  const renderIcon = (iconName: string | null | undefined) => {
    if (!iconName) {
      return (
        <Box
          style={{
            width: 24,
            height: 24,
            color: "#C0C0C0",
          }}
        />
      );
    }

    // Verifica se é SVG (começa com < seja <svg ou <?xml)
    if (iconName.trim().startsWith("<")) {
      // Adiciona fill se não existir para garantir visibilidade
      let svgContent = iconName;
      if (!svgContent.includes("fill=")) {
        svgContent = svgContent.replace(/<svg/, '<svg fill="#F5B321"');
      }
      return (
        <div
          style={{
            width: 24,
            height: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          dangerouslySetInnerHTML={{
            __html: svgContent,
          }}
        />
      );
    }

    // Tenta usar como nome de ícone do Lucide
    const IconComponent = (icons as any)[iconName];
    if (IconComponent) {
      return (
        <IconComponent
          style={{
            width: 24,
            height: 24,
            color: "#F5B321",
          }}
        />
      );
    }

    return (
      <Box
        style={{
          width: 24,
          height: 24,
          color: "#C0C0C0",
        }}
      />
    );
  };
  if (isLoading) {
    return <EmpreendimentoDetailsSkeleton />;
  }
  const empreendimento = result;
  if (!empreendimento) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            Empreendimento não encontrado
          </h1>
          <Link
            to="/empreendimentos"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              backgroundColor: "#F5B321",
              borderRadius: 4,
              color: "#000",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Voltar aos Empreendimentos
          </Link>
        </div>
      </div>
    );
  }
  const structuredData = createEmpreendimentoSchema(empreendimento);

  // infos para a faixa de características
  const quartosTexto = empreendimento.quartos_max || empreendimento.quartos_min;
  const suitesTexto = empreendimento.suites_min;
  const metragemTexto =
    empreendimento.metragem_inicial && empreendimento.metragem_final
      ? empreendimento.metragem_inicial === empreendimento.metragem_final
        ? `${empreendimento.metragem_inicial}m²`
        : `${empreendimento.metragem_inicial}m² a ${empreendimento.metragem_final}m²`
      : empreendimento.metragem_inicial;
  const precoBase = empreendimento.preco_inicial;
  const precoTexto = precoBase
    ? `A partir de ${new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(precoBase)}`
    : "";

  // itens da faixa (para mobile carrossel)
  const infoItems = [
    {
      id: "endereco",
      icon: MapPin,
      title: empreendimento.endereco_rua || empreendimento.localizacao,
      subtitle:
        empreendimento.endereco_bairro && empreendimento.endereco_cidade
          ? `${empreendimento.endereco_bairro}, ${empreendimento.endereco_cidade}`
          : empreendimento.endereco_bairro || empreendimento.endereco_cidade || "",
    },
    {
      id: "quartos",
      icon: Bed,
      title: quartosTexto ? `${quartosTexto} quarto${Number(quartosTexto) > 1 ? "s" : ""}` : "-",
      subtitle: suitesTexto ? `${suitesTexto} suíte${Number(suitesTexto) > 1 ? "s" : ""}` : "",
    },
    {
      id: "metragem",
      icon: Maximize,
      title: metragemTexto || "-",
      subtitle: "",
    },
    {
      id: "preco",
      icon: CircleDollarSign,
      title: precoTexto || "Consulte condições",
      subtitle: "",
    },
  ];

  // imagem hero e "vídeo"
  const heroBackground = empreendimento.hero_image?.startsWith("/src/")
    ? casaVolpiHero
    : empreendimento.hero_image || empreendimento.card_image || "";
  const videoThumb = empreendimento.hero_image?.startsWith("/src/")
    ? casaVolpiHero
    : empreendimento.hero_image || empreendimento.card_image || heroBackground;
  const implantacaoImagem =
    (empreendimento as any).implantacao_imagem ||
    (empreendimento as any).implantacao_image ||
    (empreendimento as any).implantacao;
  const galeria = empreendimento.galeria && Array.isArray(empreendimento.galeria) ? empreendimento.galeria : [];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#050608",
      }}
    >
      <SEOHead
        title={empreendimento.seo_title || `${empreendimento.nome} - Empreendimento Casteval`}
        description={empreendimento.seo_description || empreendimento.descricao_curta}
        keywords={(empreendimento.seo_keywords || []).join(", ")}
        ogImage={empreendimento.hero_image || empreendimento.card_image}
        structuredData={structuredData}
        preloadImages={[heroBackground]}
      />

      <style>{`
        @media (max-width: 768px) {
          .hero-logo { max-height: 45px !important; }
          .hero-video-wrapper { max-width: 100% !important; }
          .hero-play-btn { width: 60px !important; height: 60px !important; }
          .hero-video-text { font-size: 16px !important; bottom: 16px !important; left: 20px !important; }
          .hero-section { min-height: 420px !important; }
          .leisure-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
          .implantacao-container { height: 350px !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .hero-logo { max-height: 55px !important; }
          .hero-video-wrapper { max-width: 700px !important; }
        }

        /* desktop x mobile para a faixa de infos */
        .info-carousel-mobile {
          display: none;
        }
        .info-grid-desktop {
          display: grid;
        }
        @media (max-width: 1024px) {
          .info-grid-desktop {
            display: none !important;
          }
          .info-carousel-mobile {
            display: block !important;
          }
        }

        .contact-form {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 12px;
          align-items: center;
        }

        @media (max-width: 640px) {
          .contact-form-actions {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>

      <Header />

      <main>
        {/* HERO + VÍDEO CENTRAL */}
        <section
          className="hero-section"
          style={{
            position: "relative",
            minHeight: "720px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            backgroundColor: "#000",
            paddingTop: "120px",
          }}
        >
          {/* fundo imagem com opacidade 80% */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.8,
            }}
          >
            <LazyImage
              src={heroBackground}
              alt={`${empreendimento.nome} - Hero Background`}
              className="w-full h-full"
              threshold={0}
            />
          </div>
          {/* overlay preto */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.9) 100%)",
            }}
          />

          {/* conteúdo central: logo do empreendimento + vídeo */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              width: "100%",
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "40px 24px 40px",
              textAlign: "center",
            }}
          >
            {/* logo do empreendimento */}
            {empreendimento.logo_image &&
              (() => {
                let logoUrl = empreendimento.logo_image;
                try {
                  const parsed = typeof logoUrl === "string" && logoUrl.startsWith("{") ? JSON.parse(logoUrl) : logoUrl;
                  logoUrl = typeof parsed === "object" && parsed.url ? parsed.url : logoUrl;
                } catch (e) {
                  // usa como está
                }
                return (
                  <div
                    style={{
                      marginBottom: 24,
                    }}
                  >
                    <img
                      src={logoUrl}
                      alt={empreendimento.nome}
                      className="hero-logo"
                      style={{
                        maxHeight: 140,
                        maxWidth: 520,
                        margin: "0 auto",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                );
              })()}

            {/* vídeo thumbnail centralizado */}
            <div
              className="hero-video-wrapper"
              style={{
                position: "relative",
                maxWidth: "960px",
                margin: "0 auto",
                cursor: empreendimento.hero_video_url ? "pointer" : "default",
              }}
              onClick={() => {
                if (empreendimento.hero_video_url) {
                  setVideoModalOpen(true);
                }
              }}
            >
              <img
                src={videoThumb}
                alt={empreendimento.nome}
                style={{
                  width: "100%",
                  display: "block",
                  borderRadius: 8,
                  boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
                }}
              />

              {/* botão play centralizado */}
              {empreendimento.hero_video_url && (
                <div
                  className="hero-play-btn"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    backgroundColor: "#F5B321",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translate(-50%, -50%) scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translate(-50%, -50%) scale(1)";
                  }}
                >
                  <Play
                    style={{
                      width: 32,
                      height: 32,
                      color: "#000",
                      marginLeft: 4,
                    }}
                  />
                </div>
              )}
            </div>

            {/* seta pra baixo */}
            <div
              style={{
                marginTop: 28,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <ChevronDown
                style={{
                  width: 32,
                  height: 32,
                  color: "#FFF",
                }}
              />
            </div>
          </div>
        </section>

        {/* FAIXA COM 4 INFOS */}
        <section
          className="info-section"
          style={{
            backgroundColor: "hsl(var(--surface-50))",
            padding: "26px 0",
          }}
        >
          {/* DESKTOP: 4 colunas */}
          <div
            className="info-grid info-grid-desktop"
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "0 24px",
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 40,
            }}
          >
            {/* Endereço */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <MapPin
                style={{
                  width: 28,
                  height: 28,
                  color: "#F5B321",
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  fontSize: 14,
                  color: "#222",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                  }}
                >
                  {empreendimento.endereco_rua || empreendimento.localizacao}
                </div>
                {empreendimento.endereco_bairro || empreendimento.endereco_cidade ? (
                  <div
                    style={{
                      color: "#777",
                      marginTop: 2,
                    }}
                  >
                    {empreendimento.endereco_bairro && empreendimento.endereco_cidade
                      ? `${empreendimento.endereco_bairro}, ${empreendimento.endereco_cidade}`
                      : empreendimento.endereco_bairro || empreendimento.endereco_cidade}
                  </div>
                ) : null}
              </div>
            </div>

            {/* Quartos / suítes */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <Bed
                style={{
                  width: 28,
                  height: 28,
                  color: "#F5B321",
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  fontSize: 14,
                  color: "#222",
                  textAlign: "left",
                }}
              >
                {quartosTexto && (
                  <div
                    style={{
                      fontWeight: 600,
                    }}
                  >
                    {quartosTexto} quarto{Number(quartosTexto) > 1 ? "s" : ""}
                  </div>
                )}
                {suitesTexto && (
                  <div
                    style={{
                      color: "#777",
                      marginTop: 2,
                    }}
                  >
                    {suitesTexto} suíte
                    {Number(suitesTexto) > 1 ? "s" : ""}
                  </div>
                )}
              </div>
            </div>

            {/* Metragem */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <Maximize
                style={{
                  width: 28,
                  height: 28,
                  color: "#F5B321",
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  fontSize: 14,
                  color: "#222",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                  }}
                >
                  {metragemTexto ? `${metragemTexto}` : "-"}
                </div>
              </div>
            </div>

            {/* Preço a partir de */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <CircleDollarSign
                style={{
                  width: 28,
                  height: 28,
                  color: "#F5B321",
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  fontSize: 14,
                  color: "#222",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                  }}
                >
                  {precoTexto || "Consulte condições com nossos corretores"}
                </div>
              </div>
            </div>
          </div>

          {/* MOBILE/TABLET: carrossel */}
          <div
            className="info-carousel-mobile"
            style={{
              maxWidth: 420,
              margin: "0 auto",
              padding: "0 24px",
            }}
          >
            <div
              style={{
                overflow: "hidden",
                borderRadius: 8,
                backgroundColor: "#FFFFFF",
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: `${infoItems.length * 100}%`,
                  transform: `translateX(-${currentInfoIndex * (100 / infoItems.length)}%)`,
                  transition: "transform 0.4s ease",
                }}
              >
                {infoItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      style={{
                        width: `${100 / infoItems.length}%`,
                        padding: "18px 20px",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <Icon
                        style={{
                          width: 24,
                          height: 24,
                          color: "#F5B321",
                          flexShrink: 0,
                        }}
                      />
                      <div
                        style={{
                          textAlign: "left",
                          fontSize: 14,
                          color: "#222",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 600,
                          }}
                        >
                          {item.title}
                        </div>
                        {item.subtitle && (
                          <div
                            style={{
                              marginTop: 2,
                              color: "#777",
                              fontSize: 13,
                            }}
                          >
                            {item.subtitle}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* bullets */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 8,
                marginTop: 12,
              }}
            >
              {infoItems.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentInfoIndex(idx)}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    backgroundColor: idx === currentInfoIndex ? "#F5B321" : "#D0D0D0",
                  }}
                  aria-label={`Ir para informação ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ITENS DE LAZER */}
        {itensLazerWithIcons && itensLazerWithIcons.length > 0 && (
          <section
            style={{
              padding: "60px 0 40px",
              backgroundColor: "#FFFFFF",
            }}
          >
            <div
              style={{
                maxWidth: "1200px",
                margin: "0 auto",
                padding: "0 24px",
              }}
            >
              <h2
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#222",
                  textAlign: "left",
                  marginBottom: 24,
                }}
              >
                Itens de Lazer
              </h2>

              <div
                className="leisure-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 18,
                }}
              >
                {itensLazerWithIcons.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 0",
                      borderBottom: "1px solid #F0F0F0",
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        backgroundColor: "#FFF6DD",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {renderIcon(item.icone)}
                    </div>
                    <span
                      style={{
                        fontSize: 14,
                        color: "#333",
                      }}
                    >
                      {item.nome}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* GALERIA CARROSSEL */}
        <section
          style={{
            padding: "50px 0 80px",
            backgroundColor: "#FFFFFF",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "0 24px",
            }}
          >
            <h2
              style={{
                fontSize: 26,
                fontWeight: 700,
                marginBottom: 24,
                color: "#222",
              }}
            >
              Galeria
            </h2>

            {galeria.length > 0 ? (
              <GalleryCarousel images={galeria} empreendimentoNome={empreendimento.nome} onImageClick={openLightbox} />
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 16,
                }}
              >
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    style={{
                      height: 280,
                      backgroundColor: "#f5f5f5",
                      borderRadius: 8,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 12,
                    }}
                  >
                    <Camera size={48} color="#ccc" />
                    <p
                      style={{
                        color: "#999",
                        fontSize: 14,
                      }}
                    >
                      Imagem {i}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* FORMULÁRIO (TEM INTERESSE?) */}
        <section
          style={{
            padding: "60px 0",
            backgroundColor: "#000000",
            color: "#FFFFFF",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "0 24px",
            }}
          >
            <h2
              style={{
                fontSize: 28,
                fontWeight: 700,
                marginBottom: 8,
                color: "#F5B321",
              }}
            >
              Tem interesse?
            </h2>
            <p
              style={{
                fontSize: 16,
                marginBottom: 8,
                color: "#FFF",
              }}
            >
              Fale com nossos corretores
            </p>
            <p
              style={{
                fontSize: 14,
                marginBottom: 24,
                color: "#DDD",
              }}
            >
              Preencha suas informações para receber uma consultoria especializada.
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="contact-form">
              <input
                type="text"
                placeholder="Nome"
                style={{
                  padding: "10px 12px",
                  borderRadius: 0,
                  border: "none",
                  borderBottom: "1px solid #F5B321",
                  backgroundColor: "transparent",
                  color: "#FFF",
                  fontSize: 14,
                  outline: "none",
                }}
              />
              <input
                type="email"
                placeholder="Email"
                style={{
                  padding: "10px 12px",
                  borderRadius: 0,
                  border: "none",
                  borderBottom: "1px solid #F5B321",
                  backgroundColor: "transparent",
                  color: "#FFF",
                  fontSize: 14,
                  outline: "none",
                }}
              />
              <input
                type="text"
                placeholder="Mensagem"
                style={{
                  padding: "10px 12px",
                  borderRadius: 0,
                  border: "none",
                  borderBottom: "1px solid #F5B321",
                  backgroundColor: "transparent",
                  color: "#FFF",
                  fontSize: 14,
                  outline: "none",
                }}
              />

              {/* checkbox + botão numa linha só igual ao site */}
              <div
                className="contact-form-actions"
                style={{
                  gridColumn: "1 / -1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 16,
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 12,
                    color: "#CCCCCC",
                  }}
                >
                  <input type="checkbox" />
                  <span>Li e concordo com a política de privacidade.</span>
                </label>

                <button
                  type="button"
                  onClick={() => WhatsAppIntegration.openForProperty(empreendimento.nome)}
                  style={{
                    padding: "10px 32px",
                    backgroundColor: "#F5B321",
                    color: "#000",
                    fontWeight: 600,
                    border: "none",
                    borderRadius: 0,
                    cursor: "pointer",
                    textTransform: "uppercase",
                    fontSize: 14,
                  }}
                >
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* IMPLANTAÇÃO - só renderiza se mostrar_implantacao === true */}
        {empreendimento.mostrar_implantacao && implantacaoImagem && (
          <section
            style={{
              padding: "60px 0 40px",
              backgroundColor: "#FFFFFF",
            }}
          >
            <div
              style={{
                maxWidth: "1000px",
                margin: "0 auto",
                padding: "0 24px",
              }}
            >
              <h2
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#222",
                  marginBottom: 24,
                  textAlign: "left",
                }}
              >
                Implantação
              </h2>
              {implantacaoImagem ? (
                <div
                  className="implantacao-container"
                  onClick={() => setImplantacaoLightboxOpen(true)}
                  style={{
                    width: "100%",
                    height: 500,
                    borderRadius: 8,
                    overflow: "hidden",
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    position: "relative",
                    backgroundColor: "#f0f0f0",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.01)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.18)";
                  }}
                >
                  <LazyImage
                    src={implantacaoImagem}
                    alt={`${empreendimento.nome} - Implantação`}
                    className="w-full h-full object-contain"
                    threshold={0.2}
                  />
                  {/* Overlay com ícone de zoom */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: "rgba(0,0,0,0)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background-color 0.2s, opacity 0.2s",
                      opacity: 0,
                      pointerEvents: "none",
                    }}
                    className="implantacao-overlay"
                  >
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        backgroundColor: "#F5B321",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Camera color="#000" size={28} />
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="implantacao-placeholder"
                  style={{
                    width: "100%",
                    height: 500,
                    backgroundColor: "#f5f5f5",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 8,
                    gap: 16,
                  }}
                >
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ccc"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                  <p
                    style={{
                      color: "#666",
                      fontSize: 16,
                      textAlign: "center",
                      maxWidth: 400,
                    }}
                  >
                    Implantação será adicionada em breve
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* RESIDÊNCIAS */}
        {result?.casas && result.casas.length > 0 && (
          <section
            style={{
              padding: "60px 0",
              backgroundColor: "#F3F3F3",
            }}
          >
            <div
              style={{
                maxWidth: "1200px",
                margin: "0 auto",
                padding: "0 24px",
              }}
            >
              <h2
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  marginBottom: 24,
                }}
              >
                Residências
              </h2>

              <ResidenciasCarousel casas={result.casas} empreendimento={empreendimento} />
            </div>
          </section>
        )}

        {/* LOCALIZAÇÃO / MAPA */}
        <section
          style={{
            padding: "60px 0",
            backgroundColor: "#FFFFFF",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "0 24px",
            }}
          >
            <h2
              style={{
                fontSize: 26,
                fontWeight: 700,
                marginBottom: 24,
              }}
            >
              Localização
            </h2>
            {empreendimento.mapa_google_embed ? (
              <div
                style={{
                  width: "100%",
                  height: 360,
                  borderRadius: 8,
                  overflow: "hidden",
                }}
                dangerouslySetInnerHTML={{
                  __html: empreendimento.mapa_google_embed,
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: 360,
                  borderRadius: 8,
                  backgroundColor: "#E0E0E0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#555",
                  fontSize: 16,
                }}
              >
                Mapa - {empreendimento.localizacao}
              </div>
            )}
          </div>
        </section>

        {/* BANNER FINAL – ENCONTRE O EMPREENDIMENTO IDEAL */}
        <section
          style={{
            width: "100%",
            padding: "80px 0",
            backgroundImage: `url(${familiaCta})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.55)",
            }}
          />
          <div
            style={{
              position: "relative",
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "0 24px",
              color: "#FFFFFF",
            }}
          >
            <h2
              style={{
                fontSize: 32,
                fontWeight: 700,
                maxWidth: 520,
                lineHeight: "42px",
                marginBottom: 20,
              }}
              className="text-2xl font-bold"
            >
              Encontre o empreendimento ideal para você e sua família.
            </h2>
            <button
              style={{
                backgroundColor: "#F5B321",
                border: "none",
                padding: "14px 28px",
                borderRadius: 30,
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer",
                color: "#000",
              }}
              onClick={() => WhatsAppIntegration.openForProperty("Contato")}
            >
              Fale com nossos corretores
            </button>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppFAB />

      {/* MODAL DO VÍDEO */}
      <Dialog open={videoModalOpen} onOpenChange={setVideoModalOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black border-none">
          <div
            style={{
              position: "relative",
              paddingBottom: "56.25%",
              height: 0,
            }}
          >
            {empreendimento.hero_video_url && (
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeVideoId(empreendimento.hero_video_url)}?autoplay=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* LIGHTBOX DA GALERIA */}
      {galeria.length > 0 && (
        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <LightboxDialogContent className="max-w-[100vw] max-h-[100vh] p-0 bg-black/95 border-none">
            <button
              onClick={() => setLightboxOpen(false)}
              style={{
                position: "absolute",
                top: window.innerWidth < 640 ? 10 : 20,
                right: window.innerWidth < 640 ? 10 : 20,
                zIndex: 50,
                background: "rgba(255,255,255,0.1)",
                border: "none",
                borderRadius: "50%",
                width: window.innerWidth < 640 ? 48 : 40,
                height: window.innerWidth < 640 ? 48 : 40,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X color="#fff" size={window.innerWidth < 640 ? 28 : 24} />
            </button>
            <button
              onClick={prevLightboxImage}
              style={{
                position: "absolute",
                left: window.innerWidth < 640 ? 10 : 20,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 50,
                background: "rgba(255,255,255,0.1)",
                border: "none",
                borderRadius: "50%",
                width: window.innerWidth < 640 ? 56 : 48,
                height: window.innerWidth < 640 ? 56 : 48,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ChevronLeft color="#fff" size={window.innerWidth < 640 ? 36 : 32} />
            </button>
            <button
              onClick={nextLightboxImage}
              style={{
                position: "absolute",
                right: window.innerWidth < 640 ? 10 : 20,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 50,
                background: "rgba(255,255,255,0.1)",
                border: "none",
                borderRadius: "50%",
                width: window.innerWidth < 640 ? 56 : 48,
                height: window.innerWidth < 640 ? 56 : 48,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ChevronRight color="#fff" size={window.innerWidth < 640 ? 36 : 32} />
            </button>
            <div
              ref={swipeRef}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                width: "100%",
                padding: "20px",
              }}
            >
              <img
                src={typeof galeria[lightboxIndex] === "string" ? galeria[lightboxIndex] : galeria[lightboxIndex]?.url}
                alt={`Imagem ${lightboxIndex + 1}`}
                style={{
                  maxWidth: "90vw",
                  maxHeight: "90vh",
                  objectFit: "contain",
                }}
              />
            </div>
          </LightboxDialogContent>
        </Dialog>
      )}

      {/* LIGHTBOX DA IMPLANTAÇÃO */}
      {implantacaoImagem && (
        <Dialog open={implantacaoLightboxOpen} onOpenChange={setImplantacaoLightboxOpen}>
          <LightboxDialogContent className="max-w-[100vw] max-h-[100vh] p-0 bg-black/95 border-none">
            <button
              onClick={() => setImplantacaoLightboxOpen(false)}
              style={{
                position: "absolute",
                top: window.innerWidth < 640 ? 10 : 20,
                right: window.innerWidth < 640 ? 10 : 20,
                zIndex: 50,
                background: "rgba(255,255,255,0.1)",
                border: "none",
                borderRadius: "50%",
                width: window.innerWidth < 640 ? 48 : 40,
                height: window.innerWidth < 640 ? 48 : 40,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X color="#fff" size={window.innerWidth < 640 ? 28 : 24} />
            </button>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                width: "100%",
                padding: "20px",
              }}
            >
              <img
                src={implantacaoImagem}
                alt={`${empreendimento.nome} - Implantação`}
                style={{
                  maxWidth: "90vw",
                  maxHeight: "90vh",
                  objectFit: "contain",
                }}
              />
            </div>
          </LightboxDialogContent>
        </Dialog>
      )}
    </div>
  );
}

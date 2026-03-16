import { useState } from "react";
import {
  Home,
  BedDouble,
  Bath,
  Car,
  Bed,
  Building2,
  MapPin,
  MessageCircle,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  Camera,
  Square,
  LandPlot,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { getImageUrl, getImageAlt } from '@/lib/imageUtils';
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import { useWhatsAppIntegration } from "@/hooks/useWhatsAppIntegration";
import { trackWhatsAppClick } from "@/utils/analytics";

interface CasaDetalhesBaseProps {
  casa: any;
  empreendimento: any;
  comodidadesComIcones: any[];
  similares?: any[];
  showSimilares?: boolean;
  contextType?: "select" | "business" | "general";
}

const renderIcon = (iconName: string, style: any = {}) => {
  const IconComponent = (LucideIcons as any)[iconName];
  if (IconComponent) {
    return <IconComponent style={{ width: "20px", height: "20px", ...style }} />;
  }
  return <Home style={{ width: "20px", height: "20px", ...style }} />;
};

const formatPrice = (price?: number) => {
  if (!price) return "Sob consulta";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  }).format(price);
};

export function CasaDetalhesBase({
  casa,
  empreendimento,
  comodidadesComIcones = [],
  similares = [],
  showSimilares = true,
  contextType = "general",
}: CasaDetalhesBaseProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);

  const { phoneNumber, openForProperty, openForVisit } = useWhatsAppIntegration();

  const images = Array.isArray(casa.galeria) ? casa.galeria : [];

  // Detectar tamanho da tela
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const isTablet = typeof window !== "undefined" && window.innerWidth >= 768 && window.innerWidth < 1024;
  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const swipeRef = useSwipeGesture({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrevious,
  });

  const location = [
    empreendimento.endereco_rua,
    empreendimento.endereco_bairro,
    empreendimento.endereco_cidade,
    empreendimento.endereco_uf,
  ]
    .filter(Boolean)
    .join(", ");

  // Estilos com tema dourado e responsivos
  const heroStyle = {
    position: "relative" as const,
    height: isMobile ? "50vh" : "60vh",
    minHeight: isMobile ? "400px" : "500px",
    maxHeight: isMobile ? "600px" : "700px",
    overflow: "hidden",
    background: "linear-gradient(135deg, #C9A961 0%, #D4AF37 100%)",
  };

  const overlayStyle = {
    position: "absolute" as const,
    inset: 0,
    background: `
      linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 15%, transparent 30%),
      linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 60%)
    `,
    zIndex: 1,
  };

  const containerStyle = {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: isMobile ? "0 15px" : isTablet ? "0 25px" : "0 20px",
    paddingBottom: "100px", // Margem inferior aumentada
  };

  const cardStyle = {
    background: "#ffffff",
    borderRadius: "20px",
    padding: isMobile ? "20px" : "30px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
    border: "1px solid rgba(212, 175, 55, 0.1)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  const featureCardStyle = {
    background: "#ffffff",
    borderRadius: "16px",
    padding: isMobile ? "16px" : "24px",
    textAlign: "center" as const,
    border: "1px solid rgba(212, 175, 55, 0.08)",
    transition: "all 0.3s ease",
    cursor: "pointer",
  };

  const buttonPrimaryStyle = {
    width: "100%",
    padding: isMobile ? "16px 24px" : "18px 32px",
    background: "linear-gradient(135deg, #C9A961 0%, #D4AF37 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    fontSize: isMobile ? "15px" : "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  };

  const buttonOutlineStyle = {
    width: "100%",
    padding: isMobile ? "16px 24px" : "18px 32px",
    background: "transparent",
    color: "#C9A961",
    border: "2px solid #C9A961",
    borderRadius: "12px",
    fontSize: isMobile ? "15px" : "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  };

  const priceCardStyle = {
    background: "linear-gradient(135deg, #FFF9EB 0%, #FFEFD5 100%)",
    borderRadius: "20px",
    padding: isMobile ? "25px" : "35px",
    border: "2px solid rgba(212, 175, 55, 0.15)",
    boxShadow: "0 10px 30px rgba(201, 169, 97, 0.1)",
  };

  const sectionTitleStyle = {
    fontSize: isMobile ? "20px" : isTablet ? "24px" : "32px",
    fontWeight: "700",
    marginBottom: isMobile ? "20px" : "30px",
    color: "#1a1a1a",
  };

  return (
    <>
      {/* Hero Section */}
      <section style={heroStyle}>
        <div style={{ position: "absolute", inset: 0 }}>
          <img
            src={casa.hero_image || casa.foto_capa}
            alt={casa.nome}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <div style={overlayStyle} />
        </div>

        <div
          style={{
            ...containerStyle,
            position: "relative",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            paddingBottom: isMobile ? "30px" : "50px",
            zIndex: 2,
          }}
        >
          <div style={{ maxWidth: isMobile ? "100%" : "800px" }}>
            {casa.destaque && (
              <span
                style={{
                  display: "inline-block",
                  background: "linear-gradient(135deg, #D4AF37, #F4E4C1)",
                  color: "#1a1a1a",
                  padding: isMobile ? "8px 20px" : "10px 24px",
                  borderRadius: "30px",
                  fontSize: isMobile ? "12px" : "14px",
                  fontWeight: "600",
                  marginBottom: "20px",
                  boxShadow: "0 4px 15px rgba(212, 175, 55, 0.3)",
                }}
              >
                ⭐ Destaque
              </span>
            )}

            <h1
              style={{
                fontSize: isMobile ? "1rem" : isTablet ? "1.25rem" : "clamp(1.5rem, 2.75vw, 1.85rem)",
                fontWeight: "700",
                color: "#ffffff",
                marginBottom: isMobile ? "12px" : "16px",
                textShadow: "0 2px 20px rgba(0,0,0,0.3)",
              }}
            >
              {casa.nome}
            </h1>

            <p
              style={{
                fontSize: isMobile ? "13px" : isTablet ? "16px" : "18px",
                color: "rgba(255,255,255,0.95)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: isMobile ? "20px" : "30px",
                flexWrap: "wrap",
              }}
            >
              <MapPin style={{ width: "20px", height: "20px" }} />
              {location}
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: isMobile ? "15px" : "30px",
                color: "rgba(255,255,255,0.95)",
              }}
            >
              {[
                { icon: Home, value: casa.metragem, label: "m²" },
                { icon: BedDouble, value: casa.quartos, label: casa.quartos === 1 ? "quarto" : "quartos" },
                { icon: Bath, value: casa.banheiros, label: casa.banheiros === 1 ? "banheiro" : "banheiros" },
                { icon: Car, value: casa.vagas, label: casa.vagas === 1 ? "vaga" : "vagas" },
              ].filter(item => item.value && item.value > 0).map(({ icon: Icon, value, label }, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: isMobile ? "13px" : isTablet ? "14px" : "16px",
                  }}
                >
                  <Icon style={{ width: isMobile ? "18px" : "20px", height: isMobile ? "18px" : "20px" }} />
                  <span style={{ fontWeight: "500" }}>{value}{label.includes("m²") ? "m²" : ` ${label}`}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div style={containerStyle}>
        <div
          style={{
            display: isDesktop ? "grid" : "block",
            gridTemplateColumns: isDesktop ? "1fr 400px" : "1fr",
            gap: "40px",
            marginTop: isMobile ? "40px" : "60px",
          }}
        >
          {/* Main Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "30px" : "50px" }}>
            {/* Description */}
            {casa.descricao_detalhada && (
              <section>
                <h2 style={sectionTitleStyle}>Sobre o Imóvel</h2>
                <div style={cardStyle}>
                  <p
                    style={{
                      fontSize: isMobile ? "14px" : "16px",
                      lineHeight: "1.8",
                      color: "#444",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {casa.descricao_detalhada}
                  </p>
                </div>
              </section>
            )}

            {/* Features */}
            <section>
              <h2 style={sectionTitleStyle}>Características</h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile
                    ? "repeat(2, 1fr)"
                    : isTablet
                      ? "repeat(3, 1fr)"
                      : "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: isMobile ? "12px" : "20px",
                }}
              >
                {[
                  { icon: Home, value: casa.metragem, label: "Área Total", unit: "m²" },
                  { icon: Square, value: casa.area_privativa, label: "Área Privativa", unit: "m²" },
                  { icon: LandPlot, value: casa.area_terreno, label: "Área do Terreno", unit: "m²" },
                  { icon: BedDouble, value: casa.quartos, label: "Quartos" },
                  { icon: Bath, value: casa.banheiros, label: "Banheiros" },
                  { icon: Car, value: casa.vagas, label: "Vagas" },
                  { icon: Bed, value: casa.suites, label: "Suítes" },
                  { icon: Building2, value: casa.pavimentos, label: "Pavimentos" },
                ].filter(item => item.value && item.value > 0).map(({ icon: Icon, value, label, unit = "" }, index) => (
                  <div
                    key={index}
                    style={{
                      ...featureCardStyle,
                      transform: hoveredCard === `feature-${index}` ? "translateY(-5px)" : "translateY(0)",
                      boxShadow:
                        hoveredCard === `feature-${index}`
                          ? "0 15px 30px rgba(201, 169, 97, 0.15)"
                          : "0 5px 15px rgba(0,0,0,0.08)",
                    }}
                    onMouseEnter={() => setHoveredCard(`feature-${index}`)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div
                      style={{
                        width: isMobile ? "45px" : "60px",
                        height: isMobile ? "45px" : "60px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(201, 169, 97, 0.15))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 12px",
                      }}
                    >
                      <Icon
                        style={{
                          width: isMobile ? "20px" : "28px",
                          height: isMobile ? "20px" : "28px",
                          color: "#C9A961",
                        }}
                      />
                    </div>
                    <p
                      style={{
                        fontSize: isMobile ? "24px" : "32px",
                        fontWeight: "700",
                        color: "#1a1a1a",
                        marginBottom: "4px",
                      }}
                    >
                      {value}
                      {unit}
                    </p>
                    <p
                      style={{
                        fontSize: isMobile ? "12px" : "14px",
                        color: "#666",
                        fontWeight: "500",
                      }}
                    >
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Amenities */}
            {comodidadesComIcones.length > 0 && (
              <section>
                <h2 style={sectionTitleStyle}>Comodidades</h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile
                      ? "1fr"
                      : isTablet
                        ? "repeat(2, 1fr)"
                        : "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "15px",
                  }}
                >
                  {comodidadesComIcones.map((comodidade: any, index: number) => (
                    <div
                      key={index}
                      style={{
                        background: "#ffffff",
                        borderRadius: "12px",
                        padding: isMobile ? "14px 16px" : "16px 20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        border: "1px solid rgba(212, 175, 55, 0.08)",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        transform: hoveredCard === `amenity-${index}` ? "translateX(5px)" : "translateX(0)",
                        boxShadow:
                          hoveredCard === `amenity-${index}`
                            ? "0 5px 20px rgba(201, 169, 97, 0.12)"
                            : "0 2px 8px rgba(0,0,0,0.05)",
                      }}
                      onMouseEnter={() => setHoveredCard(`amenity-${index}`)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div
                        style={{
                          width: isMobile ? "40px" : "45px",
                          height: isMobile ? "40px" : "45px",
                          borderRadius: "10px",
                          background: "linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(201, 169, 97, 0.15))",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {renderIcon(comodidade.icone, {
                          color: "#C9A961",
                          width: isMobile ? "18px" : "22px",
                          height: isMobile ? "18px" : "22px",
                        })}
                      </div>
                      <span
                        style={{
                          fontSize: isMobile ? "14px" : "15px",
                          fontWeight: "600",
                          color: "#2a2a2a",
                        }}
                      >
                        {comodidade.nome}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Gallery */}
            {images.length > 0 && (
              <section>
                <h2 style={sectionTitleStyle}>Galeria de Fotos</h2>

                <div style={{ marginBottom: "20px" }}>
                  <div
                    style={{
                      position: "relative",
                      aspectRatio: "16/9",
                      borderRadius: isMobile ? "12px" : "20px",
                      overflow: "hidden",
                      cursor: "pointer",
                      boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
                    }}
                    onClick={() => openLightbox(0)}
                    onMouseEnter={() => setHoveredImage(0)}
                    onMouseLeave={() => setHoveredImage(null)}
                  >
                    <img
                      src={getImageUrl(images[0])}
                      alt={getImageAlt(images[0], casa.nome)}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transform: hoveredImage === 0 ? "scale(1.05)" : "scale(1)",
                        transition: "transform 0.5s ease",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: isMobile ? "12px" : "20px",
                        right: isMobile ? "12px" : "20px",
                        background: "rgba(0,0,0,0.7)",
                        backdropFilter: "blur(10px)",
                        color: "#ffffff",
                        padding: isMobile ? "8px 12px" : "10px 16px",
                        borderRadius: "30px",
                        fontSize: isMobile ? "12px" : "14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Camera style={{ width: "16px", height: "16px" }} />
                      <span>{images.length} fotos</span>
                    </div>
                  </div>
                </div>

                {images.length > 1 && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile
                        ? "repeat(3, 1fr)"
                        : isTablet
                          ? "repeat(4, 1fr)"
                          : "repeat(auto-fill, minmax(150px, 1fr))",
                      gap: isMobile ? "10px" : "15px",
                    }}
                  >
                    {images.slice(1, 6).map((image: any, index: number) => (
                      <div
                        key={index + 1}
                        style={{
                          position: "relative",
                          aspectRatio: "16/9",
                          borderRadius: isMobile ? "8px" : "12px",
                          overflow: "hidden",
                          cursor: "pointer",
                          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                        }}
                        onClick={() => openLightbox(index + 1)}
                        onMouseEnter={() => setHoveredImage(index + 1)}
                        onMouseLeave={() => setHoveredImage(null)}
                      >
                        <img
                          src={getImageUrl(image)}
                          alt={getImageAlt(image, `${casa.nome} - Foto ${index + 2}`)}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transform: hoveredImage === index + 1 ? "scale(1.1)" : "scale(1)",
                            transition: "transform 0.3s ease",
                          }}
                        />
                        {index === 4 && images.length > 6 && (
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              background: "rgba(0,0,0,0.7)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#ffffff",
                              fontSize: isMobile ? "16px" : "20px",
                              fontWeight: "600",
                            }}
                          >
                            +{images.length - 6}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Location */}
            <section>
              <h2 style={sectionTitleStyle}>Localização</h2>
              <div style={cardStyle}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "15px",
                    marginBottom: "25px",
                  }}
                >
                  <MapPin
                    style={{
                      width: "24px",
                      height: "24px",
                      color: "#C9A961",
                      flexShrink: 0,
                      marginTop: "2px",
                    }}
                  />
                  <div>
                    <p
                      style={{
                        fontSize: isMobile ? "16px" : "18px",
                        fontWeight: "600",
                        color: "#1a1a1a",
                        marginBottom: "5px",
                      }}
                    >
                      {empreendimento.nome}
                    </p>
                    <p
                      style={{
                        fontSize: isMobile ? "14px" : "15px",
                        color: "#666",
                      }}
                    >
                      {location}
                    </p>
                  </div>
                </div>

                {(casa.mapa_google_embed || empreendimento.mapa_google_embed) && (
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      paddingBottom: "56.25%", // 16:9 aspect ratio
                      borderRadius: "12px",
                      overflow: "hidden",
                      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: (casa.mapa_google_embed || empreendimento.mapa_google_embed)
                          ?.replace(/width="[^"]*"/g, 'width="100%"')
                          .replace(/height="[^"]*"/g, 'height="100%"')
                      }}
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Mobile CTA - Aparece apenas no mobile/tablet */}
            {!isDesktop && (
              <section style={{ marginTop: "30px" }}>
                <div style={priceCardStyle}>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#8B7355",
                      marginBottom: "8px",
                      fontWeight: "500",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Valor do Imóvel
                  </p>
                  <p
                    style={{
                      fontSize: "2rem",
                      fontWeight: "800",
                      color: "#C9A961",
                      marginBottom: "5px",
                    }}
                  >
                    {formatPrice(casa.preco)}
                  </p>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#A0826D",
                      fontStyle: "italic",
                    }}
                  >
                    * Consulte condições especiais
                  </p>
                </div>

                <div style={{ ...cardStyle, marginTop: "20px" }}>
                  <h3
                    style={{
                      fontSize: "15px",
                      fontWeight: "600",
                      marginBottom: "20px",
                      color: "#666",
                    }}
                  >
                    Interessado?
                  </h3>
                  <button
                    style={buttonPrimaryStyle}
                    onClick={() => {
                      trackWhatsAppClick("casa_detalhes_mobile_interesse");
                      openForProperty(casa.nome);
                    }}
                  >
                    <MessageCircle style={{ width: "18px", height: "18px" }} />
                    Tenho Interesse
                  </button>

                  <button
                    style={{ ...buttonOutlineStyle, marginTop: "12px" }}
                    onClick={() => {
                      trackWhatsAppClick("casa_detalhes_mobile_visita");
                      openForVisit(casa.nome);
                    }}
                  >
                    <Calendar style={{ width: "18px", height: "18px" }} />
                    Agendar Visita
                  </button>

                  <div
                    style={{
                      marginTop: "20px",
                      paddingTop: "20px",
                      borderTop: "1px solid rgba(212, 175, 55, 0.1)",
                      fontSize: "12px",
                      color: "#999",
                      textAlign: "center",
                    }}
                  >
                    Código:{" "}
                    <span
                      style={{
                        fontWeight: "600",
                        color: "#C9A961",
                        fontFamily: "monospace",
                      }}
                    >
                      {casa.slug}
                    </span>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar - Desktop Only */}
          {isDesktop && (
            <aside
              style={{
                position: "sticky",
                top: "30px",
                height: "fit-content",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                {/* Price Card */}
                <div style={priceCardStyle}>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#8B7355",
                      marginBottom: "8px",
                      fontWeight: "500",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Valor do Imóvel
                  </p>
                  <p
                    style={{
                      fontSize: "clamp(2rem, 3vw, 2.8rem)",
                      fontWeight: "800",
                      color: "#C9A961",
                      marginBottom: "5px",
                    }}
                  >
                    {formatPrice(casa.preco)}
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#A0826D",
                      fontStyle: "italic",
                    }}
                  >
                    * Consulte condições especiais
                  </p>
                </div>

                {/* CTA Card */}
                <div style={cardStyle}>
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      marginBottom: "20px",
                      color: "#666",
                    }}
                  >
                    Interessado?
                  </h3>
                  <button
                    style={buttonPrimaryStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 10px 25px rgba(201, 169, 97, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                    onClick={() => {
                      trackWhatsAppClick("casa_detalhes_desktop_interesse");
                      openForProperty(casa.nome);
                    }}
                  >
                    <MessageCircle style={{ width: "20px", height: "20px" }} />
                    Tenho Interesse
                  </button>

                  <button
                    style={{ ...buttonOutlineStyle, marginTop: "15px" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#C9A961";
                      e.currentTarget.style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#C9A961";
                    }}
                    onClick={() => {
                      trackWhatsAppClick("casa_detalhes_desktop_visita");
                      openForVisit(casa.nome);
                    }}
                  >
                    <Calendar style={{ width: "20px", height: "20px" }} />
                    Agendar Visita
                  </button>

                  <div
                    style={{
                      marginTop: "20px",
                      paddingTop: "20px",
                      borderTop: "1px solid rgba(212, 175, 55, 0.1)",
                      fontSize: "13px",
                      color: "#999",
                    }}
                  >
                    Código:{" "}
                    <span
                      style={{
                        fontWeight: "600",
                        color: "#C9A961",
                        fontFamily: "monospace",
                      }}
                    >
                      {casa.slug}
                    </span>
                  </div>
                </div>

                {/* Quick Info */}
                <div style={cardStyle}>
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      marginBottom: "20px",
                      color: "#1a1a1a",
                    }}
                  >
                    Informações Rápidas
                  </h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingBottom: "15px",
                        borderBottom: "1px solid rgba(212, 175, 55, 0.08)",
                      }}
                    >
                      <span style={{ fontSize: "14px", color: "#666" }}>Tipo</span>
                      <span style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a" }}>{casa.tipo}</span>
                    </div>

                    {casa.status && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingBottom: "15px",
                          borderBottom: "1px solid rgba(212, 175, 55, 0.08)",
                        }}
                      >
                        <span style={{ fontSize: "14px", color: "#666" }}>Status</span>
                        <span
                          style={{
                            padding: "4px 12px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "600",
                            background: "linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(201, 169, 97, 0.15))",
                            color: "#C9A961",
                          }}
                        >
                          {casa.status}
                        </span>
                      </div>
                    )}

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: "14px", color: "#666" }}>Empreendimento</span>
                      <span style={{ fontSize: "14px", fontWeight: "500", color: "#1a1a1a" }}>
                        {empreendimento.nome}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Development Link */}
                <a
                  href={`/empreendimentos/${empreendimento.slug}`}
                  style={{
                    display: "block",
                    padding: "14px",
                    textAlign: "center",
                    color: "#C9A961",
                    background: "#ffffff",
                    border: "2px solid #C9A961",
                    borderRadius: "12px",
                    textDecoration: "none",
                    fontWeight: "600",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#C9A961";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#ffffff";
                    e.currentTarget.style.color = "#C9A961";
                  }}
                >
                  Ver Empreendimento Completo
                </a>
              </div>
            </aside>
          )}
        </div>

        {/* Similar Properties */}
        {showSimilares && similares && similares.length > 0 && (
          <section
            style={{
              marginTop: isMobile ? "50px" : "80px",
              marginBottom: "50px",
            }}
          >
            <h2 style={sectionTitleStyle}>Imóveis Similares</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : isTablet
                    ? "repeat(2, 1fr)"
                    : "repeat(auto-fit, minmax(300px, 1fr))",
                gap: isMobile ? "20px" : "30px",
              }}
            >
              {similares.slice(0, 3).map((similar: any, index: number) => (
                <a
                  key={similar.id}
                  href={`/select/${similar.slug}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                    style={{
                      background: "#ffffff",
                      borderRadius: "16px",
                      overflow: "hidden",
                      boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
                      border: "1px solid rgba(212, 175, 55, 0.08)",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      transform: hoveredCard === `similar-${index}` ? "translateY(-10px)" : "translateY(0)",
                    }}
                    onMouseEnter={() => setHoveredCard(`similar-${index}`)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div
                      style={{
                        aspectRatio: "16/9",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={similar.foto_capa}
                        alt={similar.nome}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transform: hoveredCard === `similar-${index}` ? "scale(1.1)" : "scale(1)",
                          transition: "transform 0.5s ease",
                        }}
                      />
                    </div>
                    <div style={{ padding: isMobile ? "16px" : "20px" }}>
                      <h3
                        style={{
                          fontSize: isMobile ? "16px" : "18px",
                          fontWeight: "600",
                          marginBottom: "10px",
                          color: "#1a1a1a",
                        }}
                      >
                        {similar.nome}
                      </h3>
                      <p
                        style={{
                          fontSize: isMobile ? "20px" : "24px",
                          fontWeight: "700",
                          color: "#C9A961",
                          marginBottom: "15px",
                        }}
                      >
                        {formatPrice(similar.preco)}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          gap: isMobile ? "15px" : "20px",
                          fontSize: isMobile ? "13px" : "14px",
                          color: "#666",
                          flexWrap: "wrap",
                        }}
                      >
                        <span>{similar.metragem}m²</span>
                        <span>{similar.quartos} quartos</span>
                        <span>{similar.vagas} vagas</span>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.95)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "fadeIn 0.3s ease",
          }}
        >
          <button
            onClick={closeLightbox}
            style={{
              position: "absolute",
              top: isMobile ? "20px" : "30px",
              right: isMobile ? "20px" : "30px",
              background: "transparent",
              border: "none",
              color: "#ffffff",
              cursor: "pointer",
              zIndex: 10000,
              padding: "10px",
            }}
            aria-label="Fechar galeria"
          >
            <X style={{ width: isMobile ? "28px" : "32px", height: isMobile ? "28px" : "32px" }} />
          </button>

          <button
            onClick={goToPrevious}
            style={{
              position: "absolute",
              left: isMobile ? "20px" : "30px",
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "#ffffff",
              cursor: "pointer",
              padding: isMobile ? "12px" : "15px",
              borderRadius: "50%",
              backdropFilter: "blur(10px)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              if (!isMobile) {
                e.currentTarget.style.background = "rgba(201, 169, 97, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isMobile) {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              }
            }}
            aria-label="Foto anterior"
          >
            <ChevronLeft style={{ width: isMobile ? "24px" : "30px", height: isMobile ? "24px" : "30px" }} />
          </button>

          <button
            onClick={goToNext}
            style={{
              position: "absolute",
              right: isMobile ? "20px" : "30px",
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "#ffffff",
              cursor: "pointer",
              padding: isMobile ? "12px" : "15px",
              borderRadius: "50%",
              backdropFilter: "blur(10px)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              if (!isMobile) {
                e.currentTarget.style.background = "rgba(201, 169, 97, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isMobile) {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              }
            }}
            aria-label="Próxima foto"
          >
            <ChevronRight style={{ width: isMobile ? "24px" : "30px", height: isMobile ? "24px" : "30px" }} />
          </button>

          <div
            ref={swipeRef}
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: isMobile ? "20px" : "40px",
            }}
          >
            <img
              src={getImageUrl(images[currentImageIndex])}
              alt={getImageAlt(images[currentImageIndex], `${casa.nome} - Foto ${currentImageIndex + 1}`)}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />
          </div>

          <div
            style={{
              position: "absolute",
              bottom: isMobile ? "20px" : "30px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "10px",
              overflowX: "auto",
              maxWidth: "90vw",
              padding: "10px",
            }}
          >
            {images.map((image: any, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                style={{
                  width: isMobile ? "60px" : "80px",
                  height: isMobile ? "45px" : "60px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: index === currentImageIndex ? "3px solid #C9A961" : "3px solid transparent",
                  flexShrink: 0,
                  cursor: "pointer",
                  opacity: index === currentImageIndex ? 1 : 0.6,
                  transition: "all 0.3s ease",
                  transform: index === currentImageIndex ? "scale(1.1)" : "scale(1)",
                }}
              >
                <img
                  src={getImageUrl(image)}
                  alt={getImageAlt(image, `Thumbnail ${index + 1}`)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </button>
            ))}
          </div>

          <div
            style={{
              position: "absolute",
              top: isMobile ? "20px" : "30px",
              left: isMobile ? "20px" : "30px",
              color: "#ffffff",
              fontSize: isMobile ? "16px" : "18px",
              fontWeight: "500",
              background: "rgba(0,0,0,0.5)",
              padding: isMobile ? "8px 16px" : "10px 20px",
              borderRadius: "30px",
              backdropFilter: "blur(10px)",
            }}
          >
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}

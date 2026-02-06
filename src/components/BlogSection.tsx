import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

// Helper para extrair URL de campos de imagem que podem estar como JSON string
const getImageUrl = (imageField: string | null | undefined): string => {
  if (!imageField) return "";

  try {
    const parsed = JSON.parse(imageField);
    return parsed.url || "";
  } catch {
    return imageField;
  }
};

interface BlogPost {
  id: string;
  titulo: string;
  resumo: string;
  data_publicacao: string;
  autor_nome: string | null;
  categoria: string | null;
  imagem_card: string | null;
  slug: string;
}

const BlogCard = ({ post }: { post: BlogPost }) => {
  const imageUrl = getImageUrl(post.imagem_card);

  return (
    <Link to={`/blog/${post.slug}`} style={{ display: "block", height: "100%" }}>
      <article
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          overflow: "hidden",
          height: "100%",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
          transition: "all 500ms ease",
          display: "flex",
          flexDirection: "column",
          border: "1px solid #e5e7eb",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1)";
          e.currentTarget.style.borderColor = "rgba(218, 180, 105, 0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
          e.currentTarget.style.borderColor = "#e5e7eb";
        }}
      >
        {/* Image Container */}
        <div style={{ position: "relative", overflow: "hidden", backgroundColor: "#f3f4f6" }}>
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={post.titulo}
            style={{
              width: "100%",
              height: "224px",
              objectFit: "cover",
              transition: "transform 500ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
            onError={(e) => {
              console.error("Erro ao carregar imagem:", imageUrl);
              e.currentTarget.src = "/placeholder.svg";
            }}
          />

          {/* Categoria Badge */}
          {post.categoria && (
            <span
              style={{
                position: "absolute",
                top: "12px",
                left: "12px",
                backgroundColor: "#dab469",
                color: "black",
                fontSize: "12px",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                borderRadius: "9999px",
                padding: "6px 12px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            >
              {post.categoria}
            </span>
          )}

          {/* Overlay Hover */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(0, 0, 0, 0.2), transparent)",
              opacity: 0,
              transition: "opacity 300ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "0";
            }}
          />
        </div>

        {/* Content */}
        <div
          style={{
            padding: "20px 24px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              color: "#111827",
              marginBottom: "8px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: "1.25",
              transition: "color 300ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#dab469";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#111827";
            }}
          >
            {post.titulo}
          </h3>

          <p
            style={{
              fontSize: "14px",
              color: "#4b5563",
              marginBottom: "16px",
              flex: 1,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: "1.625",
            }}
          >
            {post.resumo}
          </p>

          {/* Meta Info */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              paddingTop: "16px",
              borderTop: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "12px",
                color: "#6b7280",
                gap: "8px",
              }}
            >
              <span style={{ fontWeight: "500" }}>
                {post.data_publicacao
                  ? format(new Date(post.data_publicacao), "dd 'de' MMM 'de' yyyy", { locale: ptBR })
                  : ""}
              </span>
              {post.autor_nome && (
                <span
                  style={{
                    color: "#374151",
                    fontWeight: "500",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {post.autor_nome}
                </span>
              )}
            </div>

            {/* Read More Link */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: "#dab469",
                fontWeight: "600",
                fontSize: "12px",
                transition: "all 300ms ease",
                marginTop: "8px",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "rgba(218, 180, 105, 0.8)";
                e.currentTarget.style.gap = "12px";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#dab469";
                e.currentTarget.style.gap = "8px";
              }}
            >
              LEIA MAIS
              <ChevronRight
                size={16}
                style={{
                  transition: "transform 300ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateX(2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

const PlaceholderCard = () => (
  <div
    style={{
      backgroundColor: "#f3f4f6",
      borderRadius: "8px",
      height: "384px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "2px dashed #d1d5db",
      transition: "border-color 300ms ease",
      cursor: "pointer",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = "rgba(218, 180, 105, 0.3)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = "#d1d5db";
    }}
  >
    <p style={{ color: "#9ca3af", fontWeight: "500" }}>Em breve</p>
  </div>
);

interface BlogSectionProps {
  posts: BlogPost[];
  isLoading?: boolean;
}

export const BlogSection = ({ posts, isLoading }: BlogSectionProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calcula o flex basis baseado na largura da tela
  const getFlexBasis = () => {
    if (windowWidth >= 1024) {
      return "25%"; // 4 colunas no desktop
    } else if (windowWidth >= 768) {
      return "50%"; // 2 colunas no tablet
    } else {
      return "100%"; // 1 coluna no mobile
    }
  };

  const flexBasis = getFlexBasis();

  return (
    <section
      style={{
        paddingTop: "48px",
        paddingBottom: "48px",
        backgroundColor: "#f9fafb",
      }}
    >
      <div
        style={{
          maxWidth: "80rem",
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: "16px",
          paddingRight: "16px",
        }}
      >
        {/* Section Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "48px",
          }}
        >
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#111827",
              marginBottom: "16px",
              letterSpacing: "-0.02em",
            }}
          >
            Insights e Novidades
          </h2>
          <p
            style={{
              fontSize: "18px",
              color: "#4b5563",
              maxWidth: "42rem",
              marginLeft: "auto",
              marginRight: "auto",
              lineHeight: "1.625",
            }}
          >
            Fique por dentro das últimas tendências do mercado imobiliário
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "256px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  height: "32px",
                  width: "32px",
                  border: "4px solid #d1d5db",
                  borderTop: "4px solid #dab469",
                  borderRadius: "9999px",
                  animation: "spin 1s linear infinite",
                }}
              />
              <p style={{ color: "#6b7280", fontSize: "14px" }}>Carregando posts...</p>
            </div>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : posts.length === 0 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "256px",
            }}
          >
            <p style={{ color: "#6b7280", fontSize: "14px" }}>Nenhum post disponível no momento.</p>
          </div>
        ) : (
          <>
            {/* Blog Carousel */}
            <div style={{ position: "relative", marginBottom: "48px" }}>
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                  slidesToScroll: 1,
                }}
                plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
                setApi={setApi}
                style={{ width: "100%" }}
              >
                <CarouselContent style={{ marginLeft: "-12px" }}>
                  {posts.slice(0, 4).map((post) => (
                    <CarouselItem
                      key={post.id}
                      style={{
                        paddingLeft: "12px",
                        paddingRight: "12px",
                        flex: `0 0 calc(${flexBasis} - 24px)`,
                        minWidth: 0,
                      }}
                    >
                      <div style={{ height: "100%", width: "100%" }}>
                        <BlogCard post={post} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Navigation Arrows - Desktop Only */}
                {windowWidth >= 1024 && (
                  <>
                    <CarouselPrevious
                      style={{
                        position: "absolute",
                        left: "-64px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        display: "none",
                      }}
                      className="hidden lg:flex"
                    />
                    <CarouselNext
                      style={{
                        position: "absolute",
                        right: "-64px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        display: "none",
                      }}
                      className="hidden lg:flex"
                    />
                  </>
                )}
              </Carousel>
            </div>

            {/* Carousel Indicator Dots - Mobile/Tablet */}
            {count > 1 && windowWidth < 1024 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "8px",
                  marginBottom: "48px",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                }}
              >
                {Array.from({ length: count }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => api?.scrollTo(index)}
                    aria-label={`Ir para slide ${index + 1}`}
                    style={{
                      height: "8px",
                      borderRadius: "9999px",
                      transition: "all 300ms ease",
                      border: "none",
                      cursor: "pointer",
                      width: index === current ? "32px" : "8px",
                      backgroundColor: index === current ? "#dab469" : "#d1d5db",
                    }}
                    onMouseEnter={(e) => {
                      if (index !== current) {
                        e.currentTarget.style.backgroundColor = "#e5e7eb";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (index !== current) {
                        e.currentTarget.style.backgroundColor = "#d1d5db";
                      }
                    }}
                  />
                ))}
              </div>
            )}

            {/* CTA Button */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                paddingLeft: "16px",
                paddingRight: "16px",
              }}
            >
              <Link to="/blog" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    border: "2px solid #dab469",
                    color: "#dab469",
                    backgroundColor: "transparent",
                    fontWeight: "bold",
                    fontSize: "14px",
                    paddingLeft: "24px",
                    paddingRight: "24px",
                    paddingTop: "10px",
                    paddingBottom: "10px",
                    transition: "all 300ms ease",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    cursor: "pointer",
                    borderRadius: "6px",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#dab469";
                    e.currentTarget.style.color = "black";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#dab469";
                  }}
                >
                  Ver Todos os Posts
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

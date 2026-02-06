import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useBannersHome } from "@/hooks/useBannersHome";
import { getImageUrl } from "@/lib/imageUtils";

// Conversão simples de Markdown para HTML
const markdownToHtml = (markdown: string): string => {
  if (!markdown) return '';
  
  return markdown
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^\d+\.\s+(.*$)/gim, '<li>$1</li>')
    .replace(/^-\s+(.*$)/gim, '<li>$1</li>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="underline">$1</a>')
    .replace(/\n/g, '<br>')
    .replace(/<\/li><br><li>/g, '</li><li>')
    .replace(/(<li>.*<\/li>)/s, '<ul class="list-disc ml-6">$1</ul>');
};

export const HeroSection = () => {
  const { data: banners, isLoading } = useBannersHome();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const handleDotClick = (index: number) => {
    api?.scrollTo(index);
  };

  if (isLoading || !banners || banners.length === 0) {
    return (
      <section
        style={{
          position: "relative",
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              color: "hsl(var(--muted-foreground))",
              fontSize: "16px",
            }}
          >
            {isLoading ? "Carregando..." : "Nenhum banner disponível"}
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        className="hero-section"
        style={{
          position: "relative",
          minHeight: "75vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          overflow: "hidden",
        }}
      >
        <Carousel
          opts={{
            loop: true,
            align: "start",
          }}
          plugins={[
            Autoplay({
              delay: 5000,
              stopOnInteraction: true,
            }),
          ]}
          setApi={setApi}
          onSelect={() => {
            if (api) {
              setCurrent(api.selectedScrollSnap());
            }
          }}
          style={{ width: "100%", height: "100%" }}
        >
          <CarouselContent>
            {banners.map((banner) => (
              <CarouselItem key={banner.id}>
                <div
                  className="hero-slide"
                  style={{
                    position: "relative",
                    minHeight: "75vh",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "flex-start",
                    paddingBottom: "60px",
                  }}
                >
                  {/* Background Image */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage: `url(${getImageUrl(banner.background_image)})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    {/* Gradient Overlay */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.3) 100%)",
                      }}
                    />
                  </div>

                  {/* Content Container */}
                  <div
                    className="hero-content"
                    style={{
                      position: "relative",
                      zIndex: 10,
                      width: "100%",
                      maxWidth: "1400px",
                      margin: "0 auto",
                      padding: "0 24px",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "620px",
                      }}
                    >
                      {/* Logo do Empreendimento */}
                      {banner.logo_image && getImageUrl(banner.logo_image) && (
                        <div
                          className="hero-logo"
                          style={{
                            marginBottom: "24px",
                            marginLeft: "-2px",
                          }}
                        >
                          <img
                            src={getImageUrl(banner.logo_image)}
                            alt={banner.logo_alt || banner.titulo}
                            style={{
                              height: "auto",
                              width: "auto",
                              maxWidth: "100%",
                              maxHeight: "72px",
                              objectFit: "contain",
                              display: "block",
                            }}
                          />
                        </div>
                      )}

                      {/* Main Heading */}
                      <h1
                        className="hero-title"
                        style={{
                          color: "#ffffff",
                          fontSize: "36px",
                          fontWeight: "600",
                          lineHeight: "1.3",
                          marginBottom: "20px",
                          textShadow: "0 2px 20px rgba(0,0,0,0.5)",
                          letterSpacing: "-0.02em",
                        }}
                        dangerouslySetInnerHTML={{ __html: markdownToHtml(banner.titulo) }}
                      />
                      {banner.subtitulo && (
                        <span
                          style={{
                            display: "block",
                            marginTop: "14px",
                            fontWeight: "400",
                            fontSize: "20px",
                            opacity: 0.85,
                            letterSpacing: "0.01em",
                            lineHeight: "1.5",
                            color: "#ffffff",
                          }}
                          dangerouslySetInnerHTML={{ __html: markdownToHtml(banner.subtitulo) }}
                        />
                      )}

                      {/* CTA Button */}
                      <div
                        style={{
                          marginTop: "32px",
                        }}
                      >
                        <Link to={banner.link_destino}>
                          <Button
                            size="pill"
                            style={{
                              background: "hsl(var(--brand-gold))",
                              color: "#000",
                              fontWeight: "700",
                              fontSize: "15px",
                              letterSpacing: "0.05em",
                              padding: "16px 40px",
                              height: "56px",
                              borderRadius: "9999px",
                              border: "none",
                              cursor: "pointer",
                              boxShadow: "0 4px 16px rgba(245, 158, 11, 0.3)",
                              transition: "all 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "translateY(-2px)";
                              e.currentTarget.style.boxShadow = "0 6px 24px rgba(245, 158, 11, 0.4)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow = "0 4px 16px rgba(245, 158, 11, 0.3)";
                            }}
                          >
                            {banner.texto_botao}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navegação - Setas (ocultas no mobile) */}
          <CarouselPrevious
            className="nav-arrow nav-prev"
            style={{
              position: "absolute",
              left: "32px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          />
          <CarouselNext
            className="nav-arrow nav-next"
            style={{
              position: "absolute",
              right: "32px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          />
        </Carousel>

        {/* Indicadores de Slide (Dots) */}
        <div
          className="hero-dots"
          style={{
            position: "absolute",
            bottom: "32px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "12px",
            zIndex: 20,
          }}
        >
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              style={{
                width: current === index ? "32px" : "8px",
                height: "8px",
                borderRadius: "4px",
                border: "none",
                background: current === index ? "#F5B321" : "rgba(255,255,255,0.5)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                padding: 0,
              }}
              onMouseEnter={(e) => {
                if (current !== index) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.8)";
                }
              }}
              onMouseLeave={(e) => {
                if (current !== index) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.5)";
                }
              }}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* CSS Responsivo */}
      <style>{`
        /* Tablet - 1024px */
        @media (max-width: 1024px) {
          .hero-section {
            min-height: 65vh !important;
          }
          
          .hero-slide {
            min-height: 65vh !important;
            padding-bottom: 50px !important;
          }
          
          .hero-content {
            padding: 0 32px !important;
          }
          
          .hero-logo {
            margin-bottom: 20px !important;
            margin-left: 0 !important;
          }
          
          .hero-logo img {
            max-height: 64px !important;
          }
          
          .hero-title {
            font-size: 32px !important;
            font-weight: 600 !important;
            margin-bottom: 16px !important;
            letter-spacing: -0.02em !important;
          }
          
          .hero-title span {
            margin-top: 12px !important;
            font-size: 0.5em !important;
            font-weight: 400 !important;
            opacity: 0.85 !important;
            letter-spacing: 0.01em !important;
          }
          
          .nav-arrow {
            display: none !important;
          }
        }

        /* Mobile - 768px */
        @media (max-width: 768px) {
          .hero-section {
            min-height: 60vh !important;
          }
          
          .hero-slide {
            min-height: 60vh !important;
            padding-bottom: 40px !important;
          }
          
          .hero-content {
            padding: 0 24px !important;
          }
          
          .hero-logo {
            margin-bottom: 18px !important;
            margin-left: 0 !important;
          }
          
          .hero-logo img {
            max-height: 56px !important;
          }
          
          .hero-title {
            font-size: 28px !important;
            font-weight: 600 !important;
            margin-bottom: 14px !important;
            text-align: left !important;
            letter-spacing: -0.02em !important;
          }
          
          .hero-title span {
            margin-top: 10px !important;
            font-size: 0.5em !important;
            font-weight: 400 !important;
            opacity: 0.85 !important;
            letter-spacing: 0.01em !important;
          }
          
          .hero-content button {
            padding: 14px 32px !important;
            height: 52px !important;
            font-size: 14px !important;
          }
          
          .hero-content > div > div:last-child {
            text-align: left !important;
          }
          
          .hero-dots {
            bottom: 24px !important;
            gap: 10px !important;
          }
        }

        /* Small Mobile - 480px */
        @media (max-width: 480px) {
          .hero-section {
            min-height: 55vh !important;
          }
          
          .hero-slide {
            min-height: 55vh !important;
            padding-bottom: 36px !important;
          }
          
          .hero-content {
            padding: 0 20px !important;
          }
          
          .hero-logo img {
            max-height: 48px !important;
          }
          
          .hero-logo {
            margin-left: 0 !important;
          }
          
          .hero-title {
            font-size: 24px !important;
            font-weight: 600 !important;
            line-height: 1.35 !important;
            letter-spacing: -0.02em !important;
          }
          
          .hero-title span {
            margin-top: 10px !important;
            font-size: 0.5em !important;
            font-weight: 400 !important;
            opacity: 0.85 !important;
            letter-spacing: 0.01em !important;
          }
          
          .hero-content button {
            padding: 12px 28px !important;
            height: 48px !important;
            font-size: 13px !important;
          }
          
          .hero-content > div > div:last-child {
            text-align: left !important;
          }
          
          .hero-dots {
            bottom: 20px !important;
            gap: 8px !important;
          }
          
          .hero-dots button {
            width: 6px !important;
            height: 6px !important;
          }
          
          .hero-dots button[style*="width: 32px"] {
            width: 24px !important;
          }
        }

        /* Extra Small - 375px */
        @media (max-width: 375px) {
          .hero-title {
            font-size: 22px !important;
            font-weight: 600 !important;
            letter-spacing: -0.02em !important;
          }
          
          .hero-title span {
            font-size: 0.5em !important;
            font-weight: 400 !important;
            opacity: 0.85 !important;
            margin-top: 8px !important;
          }
          
          .hero-logo img {
            max-height: 44px !important;
          }
          
          .hero-logo {
            margin-left: 0 !important;
          }
          
          .hero-content button {
            padding: 12px 24px !important;
            height: 46px !important;
            font-size: 12px !important;
          }
          
          .hero-content > div > div:last-child {
            text-align: left !important;
          }
        }

        /* Hover effects para setas */
        @media (min-width: 1025px) {
          .nav-arrow:hover {
            background: rgba(0,0,0,0.5) !important;
            transform: translateY(-50%) scale(1.1) !important;
          }
        }
      `}</style>
    </>
  );
};

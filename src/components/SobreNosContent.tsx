import { Button } from "@/components/ui/button";
import contatoHero from "@/assets/contato-hero.png";
import fotoCasteval01 from "@/assets/foto-casteval-01.webp";
import fotoCasteval02 from "@/assets/foto-casteval-02.webp";
import fotoLivro03 from "@/assets/foto-livro-03.webp";
import commercialImage from "@/assets/commercial-building-new.webp";
import castevalBusinessLogo from "@/assets/casteval-business-logo.png";
import { Link } from "react-router-dom";

const heroImage = contatoHero;
const heroTitle = "Sobre a Casteval";

export const SobreNosContent = () => {
  return (
    <>
      {/* HERO */}
      <section
        className="about-hero"
        style={{
          position: "relative",
          background: "#000",
          minHeight: "65vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          paddingTop: "140px",
          paddingBottom: "80px",
          paddingLeft: "24px",
          paddingRight: "24px",
          textAlign: "center",
        }}
      >
        <img
          src={heroImage}
          alt={heroTitle}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.75,
            pointerEvents: "none",
          }}
        />

        {/* Overlay gradiente */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.4))",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "1000px",
            margin: "0 auto",
            width: "100%",
          }}
        >
          <p
            style={{
              color: "#C5A139",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              margin: "0 0 12px 0",
              fontSize: "13px",
            }}
          >
            Sobre Nós
          </p>
          <h1
            className="hero-title"
            style={{
              color: "#fff",
              margin: "0 0 16px 0",
              fontWeight: 800,
              fontSize: "48px",
              lineHeight: 1.15,
              textShadow: "0 2px 20px rgba(0,0,0,0.3)",
            }}
          >
            Tradição em Construir Sonhos
          </h1>
          <p
            className="hero-subtitle"
            style={{
              color: "rgba(255,255,255,0.95)",
              margin: "0 auto",
              maxWidth: "780px",
              lineHeight: 1.7,
              fontSize: "18px",
              textShadow: "0 1px 10px rgba(0,0,0,0.4)",
            }}
          >
            Com mais de 60 anos no mercado imobiliário de Curitiba, a Casteval carrega no DNA a excelência em construir
            lares que inspiram e acolhem famílias para novas soluções imobiliárias.
          </p>
        </div>

        {/* indicador de scroll */}
        <div
          className="scroll-indicator"
          style={{
            position: "absolute",
            left: "50%",
            bottom: "24px",
            transform: "translateX(-50%)",
            color: "rgba(255,255,255,0.7)",
            animation: "bounce 2s infinite",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* COMPROMISSO */}
      <section
        className="section-compromisso"
        style={{
          background: "#FFFFFF",
          padding: "80px 24px",
        }}
      >
        <div
          className="content-grid"
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: "56px",
            alignItems: "center",
          }}
        >
          {/* Texto */}
          <div>
            <h2
              className="section-title"
              style={{
                fontSize: "38px",
                lineHeight: 1.2,
                fontWeight: 800,
                color: "#111",
                margin: "0 0 20px 0",
              }}
            >
              Compromisso que atravessa gerações
            </h2>
            <p
              style={{
                color: "#4A4A4A",
                lineHeight: 1.7,
                margin: "0 0 24px 0",
                fontSize: "16px",
              }}
            >
              Fundada por Osvaldo Bernucci em 1963, a Casteval nasceu com uma visão clara: criar lares onde famílias
              possam florescer. Mais que construir imóveis, construímos sonhos e realizações.
            </p>

            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                color: "#4A4A4A",
                fontSize: "16px",
              }}
            >
              <li
                style={{
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span
                  style={{
                    color: "#C5A139",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  •
                </span>
                <span>Mais de 60 anos de tradição no mercado</span>
              </li>
              <li
                style={{
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span
                  style={{
                    color: "#C5A139",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  •
                </span>
                <span>Milhares de famílias realizadas</span>
              </li>
              <li
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span
                  style={{
                    color: "#C5A139",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  •
                </span>
                <span>Compromisso com a excelência</span>
              </li>
            </ul>
          </div>

          {/* Imagem */}
          <div className="image-container">
            <img
              src={fotoCasteval01}
              alt="Osvaldo Bernucci, fundador da Casteval"
              style={{
                width: "100%",
                height: "400px",
                objectFit: "cover",
                borderRadius: "16px",
                boxShadow: "0 12px 40px rgba(0,0,0,0.1)",
              }}
            />
          </div>
        </div>
      </section>

      {/* REFERÊNCIA */}
      <section
        className="section-referencia"
        style={{
          background: "#F9F9F9",
          padding: "80px 24px",
        }}
      >
        <div
          className="content-grid content-grid-reverse"
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1.15fr",
            gap: "56px",
            alignItems: "center",
          }}
        >
          {/* Imagem */}
          <div className="image-container">
            <img
              src={fotoCasteval02}
              alt="Pórtico de Santa Felicidade - Curitiba"
              style={{
                width: "100%",
                height: "400px",
                objectFit: "cover",
                borderRadius: "16px",
                boxShadow: "0 12px 40px rgba(0,0,0,0.1)",
              }}
            />
          </div>

          {/* Texto */}
          <div>
            <h2
              className="section-title"
              style={{
                fontSize: "38px",
                lineHeight: 1.2,
                fontWeight: 800,
                color: "#111",
                margin: "0 0 20px 0",
              }}
            >
              Referência que surgiu em{" "}
              <span
                style={{
                  color: "#C5A139",
                }}
              >
                Santa Felicidade
              </span>
            </h2>
            <p
              style={{
                color: "#4A4A4A",
                lineHeight: 1.7,
                margin: "0 0 16px 0",
                fontSize: "16px",
              }}
            >
              Foi em Santa Felicidade que tudo começou. Um bairro que respira tradição, tranquilidade e qualidade de
              vida — valores que sempre nortearam nossos empreendimentos.
            </p>
            <p
              style={{
                color: "#4A4A4A",
                lineHeight: 1.7,
                margin: "0 0 16px 0",
                fontSize: "16px",
              }}
            >
              Desde os primeiros projetos, buscamos criar não apenas residências, mas verdadeiros refúgios urbanos onde
              as pessoas possam viver com conforto, segurança e bem-estar.
            </p>
            <p
              style={{
                color: "#4A4A4A",
                lineHeight: 1.7,
                margin: 0,
                fontSize: "16px",
              }}
            >
              Hoje, expandimos nossos horizontes para toda Curitiba e região metropolitana, sempre mantendo a essência
              que nos tornou referência: cuidado com cada detalhe e compromisso com a satisfação de nossos clientes.
            </p>
          </div>
        </div>
      </section>

      {/* HISTÓRIA / LIVRO */}
      <section
        className="section-livro"
        style={{
          background: "#111314",
          padding: "80px 24px",
        }}
      >
        <div
          className="content-grid"
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1.1fr",
            gap: "56px",
            alignItems: "center",
          }}
        >
          {/* Imagem */}
          <div className="image-container">
            <img
              src={fotoLivro03}
              alt="História da Casteval - 60 anos de tradição"
              style={{
                width: "100%",
                height: "400px",
                objectFit: "cover",
                borderRadius: "16px",
                boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
              }}
            />
          </div>

          {/* Texto */}
          <div>
            <p
              style={{
                color: "#C5A139",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                margin: "0 0 12px 0",
                fontSize: "13px",
              }}
            >
              Livro Casteval
            </p>
            <h2
              className="section-title"
              style={{
                fontSize: "38px",
                lineHeight: 1.2,
                fontWeight: 800,
                color: "#fff",
                margin: "0 0 20px 0",
              }}
            >
              Uma história construída com sucesso
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.9)",
                lineHeight: 1.7,
                margin: "0 0 16px 0",
                fontSize: "16px",
              }}
            >
              Nossa forte raiz, imagem e desempenho mostram como a Casteval ajudou a desenhar bairros e modas em
              Curitiba.
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.8)",
                lineHeight: 1.7,
                margin: "0 0 28px 0",
                fontSize: "16px",
              }}
            >
              Baixe gratuitamente ou leia online e compartilhe com clientes e parceiros.
            </p>
            <Button
              size="default"
              style={{
                background: "#C5A139",
                color: "#000",
                fontWeight: 700,
                padding: "14px 32px",
                borderRadius: "9999px",
                fontSize: "14px",
                letterSpacing: "0.05em",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(197, 161, 57, 0.3)",
              }}
            >
              BAIXE O LIVRO GRATUITAMENTE
            </Button>
          </div>
        </div>
      </section>

      {/* BUSINESS */}
      <section
        className="section-business"
        style={{
          background: "#0A0A0A",
          color: "#fff",
          padding: "80px 24px",
        }}
      >
        <div
          className="content-grid"
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1.05fr 1fr",
            gap: "56px",
            alignItems: "center",
          }}
        >
          {/* Texto + logo */}
          <div>
            <div
              style={{
                marginBottom: "24px",
              }}
            >
              <img
                src={castevalBusinessLogo}
                alt="Casteval Business"
                className="business-logo"
                style={{
                  height: "68px",
                  width: "auto",
                }}
              />
            </div>

            <h2
              className="section-title"
              style={{
                fontSize: "36px",
                lineHeight: 1.25,
                fontWeight: 800,
                margin: "0 0 16px 0",
              }}
            >
              Um novo conceito em{" "}
              <span
                style={{
                  color: "#C5A139",
                }}
              >
                locação de imóveis comerciais
              </span>
            </h2>

            <p
              style={{
                color: "rgba(255,255,255,0.9)",
                lineHeight: 1.7,
                margin: "0 0 28px 0",
                maxWidth: "580px",
                fontSize: "16px",
              }}
            >
              Espaços corporativos prontos para receber seu negócio, com localização estratégica, estrutura moderna e
              agilidade na locação.
            </p>

            <Link to="/business">
              <Button
                variant="default"
                style={{
                  background: "#fff",
                  color: "#0A0A0A",
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  padding: "14px 32px",
                  borderRadius: "9999px",
                  fontSize: "14px",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(255,255,255,0.2)",
                }}
              >
                VER IMÓVEIS
              </Button>
            </Link>
          </div>

          {/* Imagem */}
          <div
            className="image-container"
            style={{
              position: "relative",
            }}
          >
            <img
              src={commercialImage}
              alt="Empreendimentos comerciais Casteval Business"
              style={{
                width: "100%",
                height: "440px",
                objectFit: "cover",
                borderRadius: "16px",
                boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "16px",
                background: "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0))",
              }}
            />
          </div>
        </div>
      </section>

      {/* CSS Responsivo e Animações */}
      <style>{`
        /* Animação do scroll indicator */
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }

        /* Tablet */
        @media (max-width: 1024px) {
          .about-hero {
            min-height: 55vh !important;
            padding-top: 120px !important;
            padding-bottom: 60px !important;
          }
          
          .hero-title {
            font-size: 40px !important;
          }
          
          .hero-subtitle {
            font-size: 16px !important;
          }
          
          .section-compromisso,
          .section-referencia,
          .section-livro,
          .section-business {
            padding: 60px 24px !important;
          }
          
          .content-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          
          .content-grid-reverse {
            direction: ltr !important;
          }
          
          .section-title {
            font-size: 32px !important;
          }
          
          .image-container img {
            height: 340px !important;
          }
          
          .business-logo {
            height: 56px !important;
          }
        }

        /* Mobile */
        @media (max-width: 640px) {
          .about-hero {
            min-height: 50vh !important;
            padding-top: 100px !important;
            padding-bottom: 50px !important;
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
          
          .hero-title {
            font-size: 32px !important;
            margin-bottom: 12px !important;
          }
          
          .hero-subtitle {
            font-size: 15px !important;
            line-height: 1.6 !important;
          }
          
          .scroll-indicator {
            bottom: 16px !important;
          }
          
          .section-compromisso,
          .section-referencia,
          .section-livro,
          .section-business {
            padding: 50px 20px !important;
          }
          
          .content-grid {
            gap: 32px !important;
          }
          
          .section-title {
            font-size: 28px !important;
            margin-bottom: 16px !important;
          }
          
          .image-container img {
            height: 280px !important;
            border-radius: 12px !important;
          }
          
          .business-logo {
            height: 48px !important;
            margin-bottom: 20px !important;
          }
          
          p {
            font-size: 15px !important;
          }
          
          ul li {
            font-size: 15px !important;
            margin-bottom: 10px !important;
          }
        }

        /* Extra small mobile */
        @media (max-width: 375px) {
          .hero-title {
            font-size: 28px !important;
          }
          
          .section-title {
            font-size: 24px !important;
          }
          
          .image-container img {
            height: 240px !important;
          }
        }
      `}</style>
    </>
  );
};

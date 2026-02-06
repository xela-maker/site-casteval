import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFAB } from "@/components/WhatsAppFAB";
import { SEOHead } from "@/components/SEOHead";
import { useEmpreendimentosFilters } from "@/hooks/useEmpreendimentosFilters";
import { createOrganizationSchema } from "@/lib/structuredData";
import { Link } from "react-router-dom";

import contatoHero from "@/assets/contato-hero.png";
import familiaCta from "@/assets/familia-cta.jpg";

const styles = {
  container: {
    overflowX: "hidden" as const,
    background: "#ffffff",
  },
  heroSection: {
    width: "100%",
    height: "520px",
    backgroundImage: `url(${contatoHero})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundColor: "#000000",
    position: "relative" as const,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  heroOverlay: {
    position: "absolute" as const,
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  heroContent: {
    position: "relative" as const,
    color: "white",
    textAlign: "center" as const,
    maxWidth: "900px",
    padding: "0 20px",
  },
  heroTitle: {
    fontSize: "clamp(32px, 6vw, 52px)",
    fontWeight: "700",
    marginBottom: "20px",
    lineHeight: "1.2",
    letterSpacing: "-0.5px",
  },
  heroSubtitle: {
    fontSize: "clamp(14px, 2.8vw, 18px)",
    lineHeight: "1.6",
    maxWidth: "700px",
    margin: "0 auto",
    opacity: 0.98,
  },
  listingSection: {
    background: "linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)",
    padding: "40px 0 80px 0",
  },
  listingWrapper: {
    maxWidth: "1600px",
    margin: "0 auto",
    padding: "0 24px",
  },
  listingTitle: {
    color: "#1a1a1a",
    fontSize: "20px",
    marginBottom: "40px",
    fontWeight: "600",
    letterSpacing: "-0.3px",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "24px",
  },
  cardContainer: {
    height: "100%",
    display: "flex",
  },
  card: {
    background: "#ffffff",
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column" as const,
    textDecoration: "none",
    color: "inherit",
    height: "100%",
    flex: "1",
    border: "1px solid #e8e8e8",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  cardImage: {
    width: "100%",
    height: "220px",
    background: "#1a1a1a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  cardImageImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    objectPosition: "center",
  },
  cardNoImage: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: "#f59e0b",
    gap: "8px",
  },
  cardContent: {
    padding: "20px",
    display: "flex",
    flexDirection: "column" as const,
    flex: "1",
  },
  cardLocation: {
    color: "#6b7280",
    fontSize: "13px",
    marginBottom: "8px",
    fontWeight: "500",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "16px",
    flex: "1",
    color: "#1a1a1a",
    lineHeight: "1.3",
  },
  cardButton: {
    width: "100%",
    borderRadius: "8px",
    textAlign: "center" as const,
    border: "none",
    cursor: "pointer",
  },
  ctaSection: {
    width: "100%",
    padding: "100px 0",
    backgroundImage: `url(${familiaCta})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative" as const,
  },
  ctaOverlay: {
    position: "absolute" as const,
    inset: 0,
    background: "rgba(0,0,0,0.55)",
  },
  ctaContent: {
    position: "relative" as const,
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
    color: "white",
  },
  ctaTitle: {
    fontSize: "clamp(26px, 5vw, 44px)",
    lineHeight: "clamp(32px, 6vw, 56px)",
    fontWeight: "700",
    maxWidth: "650px",
    marginBottom: "28px",
    letterSpacing: "-0.5px",
  },
  ctaButton: {
    border: "none",
    cursor: "pointer",
  },
};

const animationStyle = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .emp-card {
    animation: fadeIn 0.5s ease-out;
  }
  
  .emp-card:hover .card-link {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  }
  
  .emp-card:hover .card-button {
    transform: scale(1.02);
  }
  
  .grid-responsive {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }
  
  @media (max-width: 1280px) {
    .grid-responsive {
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
  }
  
  @media (max-width: 1024px) {
    .grid-responsive {
      grid-template-columns: repeat(2, 1fr);
      gap: 18px;
    }
  }
  
  @media (max-width: 640px) {
    .grid-responsive {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }
`;

const Empreendimentos = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 100; // Aumentado para mostrar todos

  const { filteredEmpreendimentos, isLoading } = useEmpreendimentosFilters(currentPage, pageSize);

  const organizationSchema = createOrganizationSchema();

  return (
    <>
      <SEOHead
        title="Nossos Empreendimentos | Casteval"
        description="Conheça os empreendimentos da Casteval, planejados para unir qualidade, conforto e valorização, com mais de 60 anos de tradição no mercado imobiliário de Curitiba."
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />

      <style>{animationStyle}</style>

      <Header />

      <main style={styles.container}>
        {/* -------------------- HERO -------------------- */}
        <section style={styles.heroSection}>
          <div style={styles.heroOverlay} />

          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>
              Nossos <span style={{ color: "#F5B321" }}>Empreendimentos</span>
            </h1>

            <p style={styles.heroSubtitle}>
              Cada projeto da Casteval é planejado para unir qualidade, conforto e valorização, sempre com a tradição de
              mais de 60 anos no mercado imobiliário de Curitiba.
            </p>
          </div>
        </section>

        {/* -------------------- LISTAGEM -------------------- */}
        <section style={styles.listingSection}>
          <div style={styles.listingWrapper}>
            <p style={styles.listingTitle}>
              Conheça os <span style={{ fontWeight: 700 }}>nossos empreendimentos</span>
            </p>

            {/* -------------------- GRID DE EMPREENDIMENTOS -------------------- */}
            {isLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "400px",
                  color: "#6b7280",
                  fontSize: "18px",
                }}
              >
                Carregando empreendimentos...
              </div>
            ) : filteredEmpreendimentos.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "400px",
                  color: "#6b7280",
                  fontSize: "18px",
                }}
              >
                Nenhum empreendimento encontrado.
              </div>
            ) : (
              <div className="grid-responsive">
                {filteredEmpreendimentos.map((emp) => (
                  <div key={emp.id} className="emp-card" style={styles.cardContainer}>
                    <Link to={`/empreendimentos/${emp.slug}`} className="card-link" style={styles.card}>
                      {/* IMAGEM */}
                      <div style={styles.cardImage}>
                        {emp.card_image ? (
                          <img src={emp.card_image} alt={emp.nome} style={styles.cardImageImg} />
                        ) : (
                          <div style={styles.cardNoImage}>
                            <svg width="44" height="44" stroke="currentColor" fill="none" strokeWidth="2">
                              <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            <span style={{ fontSize: 13, fontWeight: 600 }}>Sem imagem</span>
                          </div>
                        )}
                      </div>

                      {/* INFORMAÇÕES */}
                      <div style={styles.cardContent}>
                        <p style={styles.cardLocation}>{emp.endereco_bairro} – Curitiba</p>

                        <h3 style={styles.cardTitle}>{emp.nome}</h3>

                        <button
                          className="card-button bg-gradient-gold text-primary-foreground font-semibold py-3 shadow-[0_4px_12px_hsl(var(--primary)/0.25)] hover:shadow-[0_6px_20px_hsl(var(--primary)/0.35)] transition-smooth"
                          style={styles.cardButton}
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.href = `/empreendimentos/${emp.slug}`;
                          }}
                        >
                          Conheça
                        </button>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* -------------------- CTA FAMÍLIA -------------------- */}
        <section style={styles.ctaSection}>
          <div style={styles.ctaOverlay} />

          <div style={styles.ctaContent}>
            <h2 style={styles.ctaTitle}>Encontre o empreendimento ideal para você e sua família.</h2>

            <button 
              className="bg-gradient-gold text-primary-foreground font-bold py-4 px-9 rounded-pill text-[clamp(14px,3.2vw,16px)] shadow-[0_8px_20px_hsl(var(--primary)/0.35)] hover:shadow-[0_10px_30px_hsl(var(--primary)/0.45)] transition-smooth"
              style={styles.ctaButton} 
              onClick={() => (window.location.href = "/contato")}
            >
              Fale com nossos corretores
            </button>
          </div>
        </section>
      </main>

      <WhatsAppFAB />
      <Footer />
    </>
  );
};

export default Empreendimentos;

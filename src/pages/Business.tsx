import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BusinessContent } from "@/components/BusinessContent";
import { WhatsAppFAB } from "@/components/WhatsAppFAB";
import { Button } from "@/components/ui/button";
import { SelectPropertyCard } from "@/components/SelectPropertyCard";
import { BusinessFilters } from "@/components/BusinessFilters";
import { useBusinessCasas, UseBusinessCasasOptions } from "@/hooks/useBusinessCasas";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Filter, Heart, Building2, MapPin, Ruler, Bed, Bath, CarFront, ChevronRight } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { CSSProperties } from "react";

const styles: Record<string, CSSProperties> = {
  container: {
    minHeight: "100vh",
    background: "#ffffff",
  } as CSSProperties,
  heroSection: {
    height: "280px",
    background: "linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.2) 100%)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    overflow: "hidden",
    position: "relative",
  } as CSSProperties,
  heroContent: {
    textAlign: "center",
    zIndex: 10,
  } as CSSProperties,
  heroTitle: {
    fontSize: "32px",
    fontWeight: "800",
    margin: "0 0 8px 0",
    letterSpacing: "-0.5px",
  } as CSSProperties,
  heroSubtitle: {
    fontSize: "15px",
    fontWeight: "400",
    margin: 0,
    opacity: 0.95,
  } as CSSProperties,
  mainSection: {
    padding: "40px 20px",
    background: "#ffffff",
  } as CSSProperties,
  contentWrapper: {
    maxWidth: "1400px",
    margin: "0 auto",
    display: "flex",
    gap: "32px",
  } as CSSProperties,
  sidebar: {
    width: "260px",
    flexShrink: 0,
    position: "sticky",
    top: "80px",
    height: "fit-content",
  } as CSSProperties,
  sidebarTitle: {
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "16px",
    color: "#1a1a1a",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  } as CSSProperties,
  filterBox: {
    background: "white",
    borderRadius: "10px",
    padding: "16px",
    boxShadow: "0 1px 8px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb",
  } as CSSProperties,
  mainContent: {
    flex: 1,
    minWidth: 0,
  } as CSSProperties,
  headerSection: {
    paddingTop: "50px",
    marginBottom: "28px",
    paddingBottom: "20px",
    borderBottom: "1px solid #f0f0f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    flexWrap: "wrap",
  } as CSSProperties,
  headerTitle: {
    fontSize: "26px",
    fontWeight: "800",
    color: "#1a1a1a",
    margin: 0,
    letterSpacing: "-0.5px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flex: 1,
  } as CSSProperties,
  resultsCount: {
    fontSize: "26px",
    fontWeight: "800",
    color: "hsl(var(--brand-gold))",
  } as CSSProperties,
  filterButtonMobile: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    background: "hsl(var(--brand-gold))",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    color: "#fff",
    transition: "all 0.2s ease",
  } as CSSProperties,
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  } as CSSProperties,
  loadingContainer: {
    textAlign: "center",
    padding: "60px 20px",
  } as CSSProperties,
  loadingText: {
    fontSize: "16px",
    color: "#6b7280",
    margin: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  } as CSSProperties,
  noPropertiesCard: {
    background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
    borderRadius: "12px",
    padding: "50px 40px",
    textAlign: "center",
    border: "2px dashed #e5e7eb",
  } as CSSProperties,
  noPropertiesTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: "10px",
  } as CSSProperties,
  noPropertiesText: {
    fontSize: "15px",
    color: "#6b7280",
    marginBottom: "20px",
  } as CSSProperties,
  paginationContainer: {
    marginTop: "40px",
    paddingTop: "30px",
    borderTop: "1px solid #e5e7eb",
  } as CSSProperties,
  spinner: {
    display: "inline-block",
    width: "16px",
    height: "16px",
    border: "3px solid #e5e7eb",
    borderRadius: "50%",
    borderTopColor: "#f59e0b",
    animation: "spin 0.6s linear infinite",
  } as CSSProperties,
  institutionalSection: {
    padding: "60px 20px",
    background: "linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%)",
    borderTop: "1px solid #e5e7eb",
  } as CSSProperties,
  institutionalContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "60px",
    alignItems: "center",
  } as CSSProperties,
  institutionalText: {
    flex: 1,
  } as CSSProperties,
  institutionalTitle: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: "8px",
    letterSpacing: "-0.5px",
  } as CSSProperties,
  institutionalHighlight: {
    color: "#f59e0b",
  } as CSSProperties,
  institutionalSubtitle: {
    fontSize: "16px",
    color: "#6b7280",
    marginBottom: "20px",
    lineHeight: "1.6",
  } as CSSProperties,
  institutionalDescription: {
    fontSize: "15px",
    color: "#6b7280",
    lineHeight: "1.8",
    marginBottom: "20px",
  } as CSSProperties,
  ctaButton: {
    padding: "12px 28px",
    background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "inline-block",
  } as CSSProperties,
  institutionalImage: {
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
  } as CSSProperties,
};

const animationStyle = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .property-card {
    animation: fadeIn 0.3s ease-out;
  }
`;

export default function Business() {
  const [filters, setFilters] = useState<UseBusinessCasasOptions>({
    page: 1,
    pageSize: 12,
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data, isLoading } = useBusinessCasas(filters);
  const casas = data?.casas || [];
  const totalPages = data?.totalPages || 1;
  const currentPage = data?.page || 1;

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFiltersApply = () => {
    setIsFilterOpen(false);
    setFilters({ ...filters, page: 1 });
  };

  const handleFiltersClear = () => {
    setFilters({ page: 1, pageSize: 12 });
  };

  return (
    <div style={styles.container}>
      <style>{animationStyle}</style>
      <Header />

      {/* Hero Section */}
      <BusinessContent />

      <main>
        {/* Listagem de Propriedades Business */}
        <section style={styles.mainSection}>
          <div style={styles.contentWrapper}>
            {/* Filtros Desktop */}
            <aside
              style={
                {
                  ...styles.sidebar,
                  display: typeof window !== "undefined" && window.innerWidth >= 1024 ? "block" : "none",
                } as CSSProperties
              }
            >
              <div style={styles.filterBox}>
                <BusinessFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  onApply={handleFiltersApply}
                  onClear={handleFiltersClear}
                />
              </div>
            </aside>

            {/* Conteúdo Principal */}
            <div style={styles.mainContent}>
              {/* Header com Filtro Mobile */}
              <div
                style={
                  {
                    marginBottom: "28px",
                    paddingBottom: "20px",
                    borderBottom: "1px solid #f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                    flexWrap: "wrap",
                  } as CSSProperties
                }
              >
                <div style={{ flex: 1 }}>
                  <h1 style={styles.headerTitle}>
                    <span style={styles.resultsCount}>{data?.count || 0}</span>
                    <span style={{ fontSize: "16px", color: "#6b7280", fontWeight: "400" }}>
                      {data?.count === 1 ? "imóvel encontrado" : "imóveis encontrados"}
                    </span>
                  </h1>
                </div>

                {/* Botão Filtro Mobile */}
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger
                    asChild
                    style={{
                      display: typeof window !== "undefined" && window.innerWidth < 1024 ? "block" : "none",
                    }}
                  >
                    <button style={styles.filterButtonMobile}>
                      <Filter size={16} strokeWidth={2.5} />
                      Filtros
                    </button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    style={
                      {
                        width: typeof window !== "undefined" && window.innerWidth < 640 ? "280px" : "360px",
                        overflowY: "auto",
                        background: "#ffffff",
                      } as CSSProperties
                    }
                  >
                    <div style={{ padding: "20px 0" }}>
                      <BusinessFilters
                        filters={filters}
                        onFiltersChange={setFilters}
                        onApply={handleFiltersApply}
                        onClear={handleFiltersClear}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Grid de Propriedades */}
              {isLoading ? (
                <div style={styles.loadingContainer}>
                  <p style={styles.loadingText}>
                    <span style={styles.spinner}></span>
                    Carregando imóveis incríveis...
                  </p>
                </div>
              ) : casas.length === 0 ? (
                <div
                  style={
                    {
                      background: "hsl(var(--muted))",
                      borderRadius: "16px",
                      padding: "48px 32px",
                      textAlign: "center",
                      border: "1px solid hsl(var(--border))",
                    } as CSSProperties
                  }
                >
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>🏢</div>
                  <h3 style={styles.noPropertiesTitle}>Nenhum imóvel encontrado</h3>
                  <p style={styles.noPropertiesText}>Tente ajustar os filtros para ver mais opções</p>
                  <button
                    onClick={handleFiltersClear}
                    style={styles.ctaButton}
                    onMouseEnter={(e) => {
                      const target = e.currentTarget as HTMLButtonElement;
                      target.style.transform = "translateY(-2px)";
                      target.style.boxShadow = "0 8px 16px rgba(245, 158, 11, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      const target = e.currentTarget as HTMLButtonElement;
                      target.style.transform = "translateY(0)";
                      target.style.boxShadow = "none";
                    }}
                  >
                    Limpar Filtros
                  </button>
                </div>
              ) : (
                <>
                  <div style={styles.grid}>
                    {casas.map((casa) => (
                      <div key={casa.id} className="property-card">
                        <SelectPropertyCard casa={casa} contextType="business" />
                      </div>
                    ))}
                  </div>

                  {/* Paginação */}
                  {totalPages > 1 && (
                    <div style={styles.paginationContainer}>
                      <div
                        style={
                          {
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "6px",
                            flexWrap: "wrap",
                          } as CSSProperties
                        }
                      >
                        {/* Botão Anterior */}
                        <button
                          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          style={
                            {
                              padding: "8px 12px",
                              background: currentPage === 1 ? "#f3f4f6" : "white",
                              border: "1px solid #d1d5db",
                              borderRadius: "6px",
                              cursor: currentPage === 1 ? "not-allowed" : "pointer",
                              opacity: currentPage === 1 ? 0.5 : 1,
                              fontSize: "13px",
                              fontWeight: "500",
                              color: "#374151",
                              transition: "all 0.2s ease",
                            } as CSSProperties
                          }
                          onMouseEnter={(e) => {
                            if (currentPage > 1) {
                              const target = e.currentTarget as HTMLButtonElement;
                              target.style.background = "#f3f4f6";
                              target.style.borderColor = "#9ca3af";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (currentPage > 1) {
                              const target = e.currentTarget as HTMLButtonElement;
                              target.style.background = "white";
                              target.style.borderColor = "#d1d5db";
                            }
                          }}
                        >
                          ← Anterior
                        </button>

                        {/* Números de Página */}
                        <div
                          style={
                            {
                              display: "flex",
                              gap: "2px",
                              alignItems: "center",
                            } as CSSProperties
                          }
                        >
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              style={
                                {
                                  padding: "6px 10px",
                                  background:
                                    page === currentPage
                                      ? "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)"
                                      : "white",
                                  color: page === currentPage ? "white" : "#374151",
                                  border: page === currentPage ? "1px solid #f59e0b" : "1px solid #d1d5db",
                                  borderRadius: "5px",
                                  cursor: "pointer",
                                  fontSize: "13px",
                                  fontWeight: page === currentPage ? "600" : "500",
                                  minWidth: "36px",
                                  transition: "all 0.2s ease",
                                } as CSSProperties
                              }
                              onMouseEnter={(e) => {
                                if (page !== currentPage) {
                                  const target = e.currentTarget as HTMLButtonElement;
                                  target.style.background = "#f3f4f6";
                                  target.style.borderColor = "#9ca3af";
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (page !== currentPage) {
                                  const target = e.currentTarget as HTMLButtonElement;
                                  target.style.background = "white";
                                  target.style.borderColor = "#d1d5db";
                                }
                              }}
                            >
                              {page}
                            </button>
                          ))}
                        </div>

                        {/* Botão Próximo */}
                        <button
                          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          style={
                            {
                              padding: "8px 12px",
                              background: currentPage === totalPages ? "#f3f4f6" : "white",
                              border: "1px solid #d1d5db",
                              borderRadius: "6px",
                              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                              opacity: currentPage === totalPages ? 0.5 : 1,
                              fontSize: "13px",
                              fontWeight: "500",
                              color: "#374151",
                              transition: "all 0.2s ease",
                            } as CSSProperties
                          }
                          onMouseEnter={(e) => {
                            if (currentPage < totalPages) {
                              const target = e.currentTarget as HTMLButtonElement;
                              target.style.background = "#f3f4f6";
                              target.style.borderColor = "#9ca3af";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (currentPage < totalPages) {
                              const target = e.currentTarget as HTMLButtonElement;
                              target.style.background = "white";
                              target.style.borderColor = "#d1d5db";
                            }
                          }}
                        >
                          Próximo →
                        </button>
                      </div>

                      {/* Informação de Página */}
                      <p
                        style={
                          {
                            textAlign: "center",
                            fontSize: "13px",
                            color: "#6b7280",
                            margin: "16px 0 0 0",
                          } as CSSProperties
                        }
                      >
                        Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>

        {/* Seção Institucional */}
        <section style={styles.institutionalSection}>
          <div style={styles.institutionalContent}>
            <div style={styles.institutionalText}>
              <p
                style={
                  {
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "#f59e0b",
                    marginBottom: "8px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  } as CSSProperties
                }
              >
                Sobre Nós
              </p>
              <h2 style={styles.institutionalTitle}>
                Imóveis selecionados com
                <br />
                <span style={styles.institutionalHighlight}>cuidado de uma empresa familiar</span>
              </h2>
              <p style={styles.institutionalSubtitle}>Somos comprometidos em encontrar o imóvel perfeito para você</p>
              <p style={styles.institutionalDescription}>
                Com mais de uma década de experiência no mercado imobiliário, oferecemos soluções personalizadas para
                investimentos e residências. Nosso time de especialistas dedica-se a entender suas necessidades e
                encontrar as melhores oportunidades com as mais altas expectativas de qualidade.
              </p>
              <p style={styles.institutionalDescription}>
                Trabalhamos com integridade, transparência e uma abordagem consultiva para garantir que você tome as
                melhores decisões. Cada propriedade é cuidadosamente selecionada e apresentada com informações
                detalhadas para sua análise.
              </p>
              <button
                style={styles.ctaButton}
                onMouseEnter={(e) => {
                  const target = e.currentTarget as HTMLButtonElement;
                  target.style.transform = "translateY(-2px)";
                  target.style.boxShadow = "0 8px 16px rgba(245, 158, 11, 0.3)";
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget as HTMLButtonElement;
                  target.style.transform = "translateY(0)";
                  target.style.boxShadow = "none";
                }}
              >
                Conheça mais sobre nós
              </button>
            </div>

            {/* Imagem */}
            <div style={styles.institutionalImage}>
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&q=80"
                alt="Equipe Casteval"
                style={
                  {
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  } as CSSProperties
                }
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppFAB />
    </div>
  );
}

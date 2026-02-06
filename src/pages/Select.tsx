import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFAB } from "@/components/WhatsAppFAB";
import { SelectPropertyCard } from "@/components/SelectPropertyCard";
import { SelectFilters } from "@/components/SelectFilters";
import { useSelectCasas, UseSelectCasasOptions } from "@/hooks/useSelectCasas";
import { usePageSettings } from "@/hooks/usePageSettings";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const styles = {
  container: {
    minHeight: "100vh",
    background: "#ffffff",
  },
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
    position: "relative" as const,
  },
  mainSection: {
    padding: "40px 20px",
    background: "#ffffff",
  },
  contentWrapper: {
    maxWidth: "1400px",
    margin: "0 auto",
    display: "flex",
    gap: "32px",
  },
  sidebar: {
    width: "260px",
    flexShrink: 0,
    position: "sticky" as const,
    top: "80px",
    height: "fit-content",
  },
  sidebarTitle: {
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "16px",
    color: "#1a1a1a",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  filterBox: {
    background: "white",
    borderRadius: "10px",
    padding: "16px",
    boxShadow: "0 1px 8px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb",
  },
  mainContent: {
    flex: 1,
    minWidth: 0,
  },
  headerSection: {
    paddingTop: "50px",
    marginBottom: "28px",
    paddingBottom: "20px",
    borderBottom: "1px solid #f0f0f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    flexWrap: "wrap" as const,
  },
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
  },
  resultsCount: {
    fontSize: "26px",
    fontWeight: "800",
    background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
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
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  },
  loadingContainer: {
    textAlign: "center" as const,
    padding: "60px 20px",
  },
  loadingText: {
    fontSize: "16px",
    color: "#6b7280",
    margin: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  noPropertiesCard: {
    background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
    borderRadius: "12px",
    padding: "50px 40px",
    textAlign: "center" as const,
    border: "2px dashed #e5e7eb",
  },
  noPropertiesTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: "10px",
  },
  noPropertiesText: {
    fontSize: "15px",
    color: "#6b7280",
    marginBottom: "20px",
  },
  paginationContainer: {
    marginTop: "40px",
    paddingTop: "30px",
    borderTop: "1px solid #e5e7eb",
  },
  spinner: {
    display: "inline-block",
    width: "16px",
    height: "16px",
    border: "3px solid #e5e7eb",
    borderRadius: "50%",
    borderTopColor: "#f59e0b",
    animation: "spin 0.6s linear infinite",
  },
  institutionalSection: {
    padding: "60px 20px",
    background: "linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%)",
    borderTop: "1px solid #e5e7eb",
  },
  institutionalContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "60px",
    alignItems: "center",
  },
  institutionalText: {
    flex: 1,
  },
  institutionalTitle: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: "8px",
    letterSpacing: "-0.5px",
  },
  institutionalHighlight: {
    color: "#f59e0b",
  },
  institutionalSubtitle: {
    fontSize: "16px",
    color: "#6b7280",
    marginBottom: "20px",
    lineHeight: "1.6",
  },
  institutionalDescription: {
    fontSize: "15px",
    color: "#6b7280",
    lineHeight: "1.8",
    marginBottom: "20px",
  },
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
  },
  institutionalImage: {
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
  },
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

export default function Select() {
  const [filters, setFilters] = useState<UseSelectCasasOptions>({
    page: 1,
    pageSize: 12,
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: pageSettings, isLoading: isLoadingSettings } = usePageSettings('select');
  const { data, isLoading } = useSelectCasas(filters);
  const casas = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const currentPage = data?.page || 1;
  const totalCount = data?.count || 0;

  const heroImage = pageSettings?.hero_image;
  const heroTitle = pageSettings?.hero_title || 'Select - Empreendimentos Exclusivos';
  const heroSubtitle = pageSettings?.hero_subtitle || 'Conheça nossa seleção especial de empreendimentos';

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
      <section className="relative h-[280px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        {isLoadingSettings ? (
          <Skeleton className="absolute inset-0" />
        ) : heroImage ? (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/80 via-brand-charcoal/40 to-brand-charcoal/20"></div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-charcoal via-brand-charcoal/90 to-brand-charcoal/80" />
        )}

        {/* Content */}
        <div className="relative z-10 container mx-auto max-w-container mobile:px-16 desktop:px-24 text-center pt-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-[48px] font-bold text-white mb-6 leading-tight">
              {heroTitle}
            </h1>
            <p className="text-[18px] text-white/90 mb-8 max-w-[600px] mx-auto">
              {heroSubtitle}
            </p>
            
            {/* Scroll Indicator */}
            <div className="animate-bounce inline-block">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <main>
        {/* Listagem de Empreendimentos */}
        <section style={styles.mainSection}>
          <div style={styles.contentWrapper}>
            {/* Filtros Desktop */}
            <aside
              style={{
                ...styles.sidebar,
                display: window.innerWidth >= 1024 ? "block" : "none",
              }}
            >
              <div style={styles.filterBox}>
                <SelectFilters
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
              <div style={styles.headerSection}>
                <div style={{ flex: 1 }}>
                  <h1 style={styles.headerTitle}>
                    <span style={styles.resultsCount}>{totalCount}</span>
                    <span style={{ fontSize: "16px", color: "#6b7280", fontWeight: "400" }}>
                      {totalCount === 1 ? "empreendimento selecionado" : "empreendimentos selecionados"}
                    </span>
                  </h1>
                </div>

                {/* Botão Filtro Mobile */}
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild style={{ display: window.innerWidth < 1024 ? "block" : "none" }}>
                    <button style={styles.filterButtonMobile}>
                      <Filter size={16} />
                      Filtros
                    </button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    style={{
                      width: window.innerWidth < 640 ? "280px" : "360px",
                      overflowY: "auto",
                      background: "#ffffff",
                    }}
                  >
                    <div style={{ padding: "20px 0" }}>
                      <SelectFilters
                        filters={filters}
                        onFiltersChange={setFilters}
                        onApply={handleFiltersApply}
                        onClear={handleFiltersClear}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Grid de Empreendimentos */}
              {isLoading ? (
                <div style={styles.loadingContainer}>
                  <p style={styles.loadingText}>
                    <span style={styles.spinner}></span>
                    Carregando empreendimentos...
                  </p>
                </div>
              ) : casas.length === 0 ? (
                <div style={styles.noPropertiesCard}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>🏢</div>
                  <h3 style={styles.noPropertiesTitle}>Nenhum empreendimento encontrado</h3>
                  <p style={styles.noPropertiesText}>Tente ajustar os filtros para ver mais opções</p>
                  <button
                    onClick={handleFiltersClear}
                    style={styles.ctaButton}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 8px 16px rgba(245, 158, 11, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
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
                        <SelectPropertyCard casa={casa} contextType="select" />
                      </div>
                    ))}
                  </div>

                  {/* Paginação */}
                  {totalPages > 1 && (
                    <div style={styles.paginationContainer}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "6px",
                          flexWrap: "wrap",
                        }}
                      >
                        {/* Botão Anterior */}
                        <button
                          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          style={{
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
                          }}
                          onMouseEnter={(e) => {
                            if (currentPage > 1) {
                              e.currentTarget.style.background = "#f3f4f6";
                              e.currentTarget.style.borderColor = "#9ca3af";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (currentPage > 1) {
                              e.currentTarget.style.background = "white";
                              e.currentTarget.style.borderColor = "#d1d5db";
                            }
                          }}
                        >
                          ← Anterior
                        </button>

                        {/* Números de Página */}
                        <div
                          style={{
                            display: "flex",
                            gap: "2px",
                            alignItems: "center",
                          }}
                        >
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              style={{
                                padding: "6px 10px",
                                background:
                                  page === currentPage ? "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)" : "white",
                                color: page === currentPage ? "white" : "#374151",
                                border: page === currentPage ? "1px solid #f59e0b" : "1px solid #d1d5db",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontSize: "13px",
                                fontWeight: page === currentPage ? "600" : "500",
                                minWidth: "36px",
                                transition: "all 0.2s ease",
                              }}
                              onMouseEnter={(e) => {
                                if (page !== currentPage) {
                                  e.currentTarget.style.background = "#f3f4f6";
                                  e.currentTarget.style.borderColor = "#9ca3af";
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (page !== currentPage) {
                                  e.currentTarget.style.background = "white";
                                  e.currentTarget.style.borderColor = "#d1d5db";
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
                          style={{
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
                          }}
                          onMouseEnter={(e) => {
                            if (currentPage < totalPages) {
                              e.currentTarget.style.background = "#f3f4f6";
                              e.currentTarget.style.borderColor = "#9ca3af";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (currentPage < totalPages) {
                              e.currentTarget.style.background = "white";
                              e.currentTarget.style.borderColor = "#d1d5db";
                            }
                          }}
                        >
                          Próximo →
                        </button>
                      </div>

                      {/* Informação de Página */}
                      <p
                        style={{
                          textAlign: "center",
                          fontSize: "13px",
                          color: "#6b7280",
                          margin: "16px 0 0 0",
                        }}
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
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#f59e0b",
                  marginBottom: "8px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                Sobre Nós
              </p>
              <h2 style={styles.institutionalTitle}>
                Empreendimentos selecionados com
                <br />
                <span style={styles.institutionalHighlight}>cuidado de uma empresa familiar</span>
              </h2>
              <p style={styles.institutionalSubtitle}>Especialistas em oportunidades imobiliárias de qualidade</p>
              <p style={styles.institutionalDescription}>
                Com mais de uma década de experiência no mercado imobiliário, oferecemos os melhores empreendimentos
                para investimentos seguros e rentáveis. Nosso time de especialistas dedica-se a selecionar apenas
                projetos de excelência com as mais altas expectativas de qualidade e localização.
              </p>
              <p style={styles.institutionalDescription}>
                Trabalhamos com integridade, transparência e uma abordagem consultiva para garantir que você tome as
                melhores decisões de investimento. Cada empreendimento é cuidadosamente avaliado e apresentado com
                informações detalhadas sobre rentabilidade, localização e perspectivas de valorização.
              </p>
              <button
                style={styles.ctaButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 16px rgba(245, 158, 11, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
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
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { X } from "lucide-react";
import { useState } from "react";
import contatoHero from "@/assets/contato-hero.png";
import familyImage from "@/assets/family-investment.jpg";
import { EmpreendimentoCard } from "@/components/EmpreendimentoCard";
import type { EmpreendimentoFilters } from "@/hooks/useEmpreendimentosFilters";
import type { Empreendimento } from "@/hooks/useEmpreendimentos";

interface EmpreendimentosContentProps {
  filters: EmpreendimentoFilters;
  filteredEmpreendimentos: Empreendimento[];
  updateFilter: (key: keyof EmpreendimentoFilters, value: any) => void;
  clearFilters: () => void;
  isLoading: boolean;
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
  };
  onPageChange: (page: number) => void;
}

export const EmpreendimentosContent = ({ 
  filters, 
  filteredEmpreendimentos,
  updateFilter,
  clearFilters,
  isLoading,
  pagination,
  onPageChange
}: EmpreendimentosContentProps) => {
  const [isSticky, setIsSticky] = useState(false);

  const handleScroll = () => {
    const hero = document.querySelector('section'); // First section (hero)
    if (hero) {
      const heroBottom = hero.offsetTop + hero.offsetHeight;
      setIsSticky(window.scrollY > heroBottom - 100);
    }
  };

  useState(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const regioes = [
    "Água Verde", "Batel", "Bigorrilho", "Centro", "Ecoville", 
    "Mercês", "Santa Felicidade", "São Francisco", "Tingui"
  ];

  const hasActiveFilters = filters.status || filters.regiao || filters.quartos || 
    filters.search || filters.metragem[0] > 100 || filters.metragem[1] < 1000;

  return (
    <>
      {/* Hero Section */}
      <section style={{
        position: "relative",
        background: "#000",
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        padding: "96px 20px 72px 20px",
        textAlign: "center"
      }}>
        <img 
          src={contatoHero} 
          alt="Empreendimentos Casteval" 
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.8,
            pointerEvents: "none"
          }} 
        />
        <div style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1200,
          margin: "0 auto"
        }}>
          <p style={{
            color: "#C5A139",
            fontWeight: 700,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            margin: "0 0 10px 0",
            fontSize: 12
          }}>
            NOSSOS EMPREENDIMENTOS
          </p>
          <h1 style={{
            color: "#fff",
            margin: "0 0 10px 0",
            fontWeight: 800,
            fontSize: 40,
            lineHeight: 1.15
          }}>
            Conheça todos os empreendimentos Casteval
          </h1>
          <p style={{
            color: "rgba(255,255,255,.9)",
            margin: "0 auto",
            maxWidth: 760,
            lineHeight: 1.6,
            fontSize: 18
          }} className="text-slate-50 mx-[43px] my-0 px-0">
            Lançamentos, em obras e entregues. Encontre o projeto ideal para você.
          </p>
        </div>

        {/* indicador de scroll */}
        <div style={{
          position: "absolute",
          left: "50%",
          bottom: 18,
          transform: "translateX(-50%)",
          color: "rgba(255,255,255,.6)"
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Filters Section */}
      <div className={`bg-surface-50 border-b border-line-100 transition-smooth overflow-x-hidden ${
        isSticky ? 'sticky top-0 z-40 shadow-card-rest' : ''
      }`}>
        <div className="container mx-auto max-w-container px-24 py-6 overflow-x-hidden">
          {/* Desktop Layout */}
          <div className="desktop:flex desktop:items-center desktop:gap-6 desktop:flex-wrap hidden">
            {/* Status Filter */}
            <div className="min-w-[180px]">
              <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
                <SelectTrigger className="bg-surface-0 border-line-100">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lancamento">Lançamento</SelectItem>
                  <SelectItem value="em-obras">Em obras</SelectItem>
                  <SelectItem value="entregue">Entregue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Região Filter */}
            <div className="min-w-[180px]">
              <Select value={filters.regiao} onValueChange={(value) => updateFilter('regiao', value)}>
                <SelectTrigger className="bg-surface-0 border-line-100">
                  <SelectValue placeholder="Região" />
                </SelectTrigger>
                <SelectContent>
                  {regioes.map((regiao) => (
                    <SelectItem key={regiao} value={regiao.toLowerCase().replace(/\s+/g, '-')}>
                      {regiao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quartos Filter */}
            <div className="min-w-[160px]">
              <Select value={filters.quartos} onValueChange={(value) => updateFilter('quartos', value)}>
                <SelectTrigger className="bg-surface-0 border-line-100">
                  <SelectValue placeholder="Quartos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Quarto</SelectItem>
                  <SelectItem value="2">2 Quartos</SelectItem>
                  <SelectItem value="3">3 Quartos</SelectItem>
                  <SelectItem value="4">4+ Quartos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Metragem Slider */}
            <div className="min-w-[200px]">
              <div className="space-y-2">
                <label className="text-caption text-ink-500 font-medium">
                  Metragem: {filters.metragem[0]}m² - {filters.metragem[1]}m²
                </label>
                <Slider
                  value={filters.metragem}
                  onValueChange={(value) => updateFilter('metragem', value)}
                  min={100}
                  max={1000}
                  step={50}
                  className="w-full"
                />
              </div>
            </div>

            {/* Search Input */}
            <div className="min-w-[250px] flex-grow">
              <Input
                placeholder="Digite o nome do empreendimento"
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="bg-surface-0 border-line-100"
              />
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Limpar
              </Button>
            )}
          </div>

          {/* Mobile Layout */}
          <div className="desktop:hidden space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
                <SelectTrigger className="bg-surface-0 border-line-100">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lancamento">Lançamento</SelectItem>
                  <SelectItem value="em-obras">Em obras</SelectItem>
                  <SelectItem value="entregue">Entregue</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.regiao} onValueChange={(value) => updateFilter('regiao', value)}>
                <SelectTrigger className="bg-surface-0 border-line-100">
                  <SelectValue placeholder="Região" />
                </SelectTrigger>
                <SelectContent>
                  {regioes.map((regiao) => (
                    <SelectItem key={regiao} value={regiao.toLowerCase().replace(/\s+/g, '-')}>
                      {regiao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Select value={filters.quartos} onValueChange={(value) => updateFilter('quartos', value)}>
                <SelectTrigger className="bg-surface-0 border-line-100">
                  <SelectValue placeholder="Quartos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Quarto</SelectItem>
                  <SelectItem value="2">2 Quartos</SelectItem>
                  <SelectItem value="3">3 Quartos</SelectItem>
                  <SelectItem value="4">4+ Quartos</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Limpar
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-caption text-ink-500 font-medium">
                Metragem: {filters.metragem[0]}m² - {filters.metragem[1]}m²
              </label>
              <Slider
                value={filters.metragem}
                onValueChange={(value) => updateFilter('metragem', value)}
                min={100}
                max={1000}
                step={50}
                className="w-full"
              />
            </div>

            <Input
              placeholder="Digite o nome do empreendimento"
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="bg-surface-0 border-line-100"
            />
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-line-100">
            <p className="text-body-s text-ink-500">
              {isLoading ? 'Carregando...' : `Mostrando resultados para seus filtros`}
            </p>
          </div>
        </div>
      </div>

      {/* Grid Section */}
      <section id="empreendimentos-grid" className="py-24 bg-surface-0 overflow-x-hidden">
        <div className="container mx-auto max-w-container px-24 overflow-x-hidden">
          {isLoading ? (
            <div className="grid desktop:grid-cols-3 tablet:grid-cols-2 mobile:grid-cols-1 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-surface-50 rounded-card aspect-property mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-surface-50 rounded w-3/4"></div>
                    <div className="h-6 bg-surface-50 rounded"></div>
                    <div className="h-4 bg-surface-50 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredEmpreendimentos.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-h3 font-bold text-ink-900 mb-4">
                Nenhum empreendimento encontrado
              </h3>
              <p className="text-body-l text-ink-500">
                Tente ajustar os filtros para ver mais resultados.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-h2 font-bold text-ink-900 mb-4">
                  {filteredEmpreendimentos.length} {filteredEmpreendimentos.length === 1 ? 'Empreendimento' : 'Empreendimentos'}
                </h2>
                <p className="text-body-l text-ink-500">
                  Conheça nossos projetos exclusivos em Curitiba
                </p>
              </div>

              <div className="grid desktop:grid-cols-3 tablet:grid-cols-2 mobile:grid-cols-1 gap-6">
                {filteredEmpreendimentos.map((empreendimento) => (
                  <EmpreendimentoCard 
                    key={empreendimento.id} 
                    empreendimento={empreendimento} 
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-16 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="border-line-200 text-ink-700 hover:bg-surface-50"
                  >
                    Anterior
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => {
                      // Show first page, last page, current page, and pages around current
                      const showPage = 
                        pageNum === 1 ||
                        pageNum === pagination.totalPages ||
                        Math.abs(pageNum - pagination.page) <= 1;

                      if (!showPage) {
                        // Show ellipsis
                        if (pageNum === pagination.page - 2 || pageNum === pagination.page + 2) {
                          return (
                            <span key={pageNum} className="px-2 text-ink-400">
                              ...
                            </span>
                          );
                        }
                        return null;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={pageNum === pagination.page ? "default" : "outline"}
                          size="sm"
                          onClick={() => onPageChange(pageNum)}
                          className={
                            pageNum === pagination.page
                              ? "bg-brand-gold text-black hover:bg-brand-gold-700"
                              : "border-line-200 text-ink-700 hover:bg-surface-50"
                          }
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="border-line-200 text-ink-700 hover:bg-surface-50"
                  >
                    Próxima
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative py-24 overflow-x-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${familyImage})` }}
        >
          <div className="absolute inset-0 bg-brand-charcoal/70"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto max-w-container px-24 text-center overflow-x-hidden">
          <h2 className="text-h2 font-bold text-white mb-6">
            Pronto para conhecer seu novo lar?
          </h2>
          <p className="text-body-l text-white/85 mb-8 max-w-[600px] mx-auto">
            Entre em contato com nossos especialistas e descubra o empreendimento perfeito para você e sua família.
          </p>
          <Button 
            size="default"
            className="bg-brand-gold hover:bg-brand-gold-700 text-black font-semibold text-body-s tracking-button shadow-card-rest hover:shadow-card-hover px-8 py-3 rounded-pill"
          >
            FALE COM UM CORRETOR
          </Button>
        </div>
      </section>
    </>
  );
};

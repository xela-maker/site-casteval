import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Plus, MapPin, Calculator } from "lucide-react";
import { useSelectWishlist } from "@/hooks/useSelectWishlist";
import { useSelectComparator } from "@/hooks/useSelectComparator";
import { useSelectCasas } from "@/hooks/useSelectCasas";
import { useState } from "react";

export const SelectShowcase = () => {
  const { toggleWishlist, isInWishlist } = useSelectWishlist();
  const { toggleComparison, isInComparison, comparison, openComparator } = useSelectComparator();
  const [showLocationMap, setShowLocationMap] = useState<string | null>(null);
  const [showCalculator, setShowCalculator] = useState<string | null>(null);
  
  // Buscar casas Select do banco
  const { data: selectData } = useSelectCasas({ pageSize: 6 });
  const casas = selectData?.data || [];
  
  // Mapear dados do banco para o formato esperado pelo componente
  const selectProjects = casas.map(casa => ({
    id: casa.id,
    name: casa.nome,
    status: casa.status || 'Disponível',
    description: casa.descricao_curta || '',
    specs: {
      area: casa.metragem ? `${casa.metragem}m²` : '',
      suites: casa.suites ? `${casa.suites} suíte${casa.suites > 1 ? 's' : ''}` : '',
      parking: casa.vagas ? `${casa.vagas} vaga${casa.vagas > 1 ? 's' : ''}` : ''
    },
    image: casa.hero_image || casa.foto_capa || '',
    reverse: false,
    empreendimento: casa.empreendimento
  }));

  const openWhatsApp = (projectName: string) => {
    const message = `Tenho interesse no imóvel ${projectName} da linha Casteval Select`;
    window.open(`https://wa.me/5541999999999?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (selectProjects.length === 0) {
    return (
      <section id="select-showcase" className="py-72 mobile:py-40">
        <div className="container mx-auto max-w-container px-24 mobile:px-16">
          <div className="text-center py-20">
            <p className="text-body-l text-ink-700">
              Nenhum imóvel Select disponível no momento.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="select-showcase" className="py-72 mobile:py-40">
      {/* Comparator Floating Button */}
      {comparison.length > 0 && (
        <div className="fixed bottom-24 left-24 z-40">
          <Button
            onClick={openComparator}
            className={`bg-brand-gold hover:bg-brand-gold-700 text-black font-semibold rounded-pill px-16 py-8 shadow-card-rest ${
              comparison.length >= 2 ? 'animate-pulse' : ''
            }`}
            disabled={comparison.length < 2}
          >
            <Plus className="w-16 h-16 mr-8" />
            Comparar ({comparison.length})
          </Button>
        </div>
      )}

      {selectProjects.map((project, index) => {
        const reverse = index % 2 !== 0;
        const location = [
          project.empreendimento.endereco_bairro,
          project.empreendimento.endereco_cidade,
          project.empreendimento.endereco_uf
        ].filter(Boolean).join(', ');
        
        return (
        <div key={project.id} className={`${index > 0 ? 'mt-96 mobile:mt-64' : ''}`}>
          <div className="container mx-auto max-w-container px-24 mobile:px-16">
            <div className={`grid grid-cols-1 desktop:grid-cols-2 gap-48 desktop:gap-64 items-center ${
              project.reverse ? 'desktop:grid-flow-col-dense' : ''
            }`}>
              
              {/* Image */}
              <div className={`${project.reverse ? 'desktop:col-start-2' : ''} mobile:order-1`}>
                <div className="relative rounded-card overflow-hidden shadow-card-rest group">
                  <img 
                    src={project.image}
                    alt={`Fachada do ${project.name}`}
                    className="w-full h-[400px] desktop:h-[500px] object-cover transition-smooth group-hover:scale-105"
                  />
                  <div className="absolute top-20 left-20">
                    <span className="inline-block bg-brand-gold text-black text-caption font-semibold px-12 py-4 rounded-pill uppercase tracking-overline">
                      {project.status}
                    </span>
                  </div>
                  
                  {/* Floating Action Buttons */}
                  <div className="absolute top-20 right-20 flex flex-col gap-8">
                    {/* Wishlist Button */}
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => toggleWishlist(project)}
                      className={`w-40 h-40 rounded-full bg-white/90 border-white/20 backdrop-blur-sm transition-all ${
                        isInWishlist(project.id) 
                          ? 'text-red-500 hover:text-red-600' 
                          : 'text-ink-600 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-20 h-20 ${isInWishlist(project.id) ? 'fill-current' : ''}`} />
                    </Button>
                    
                    {/* Comparator Button */}
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => toggleComparison(project)}
                      disabled={!isInComparison(project.id) && comparison.length >= 3}
                      className={`w-40 h-40 rounded-full bg-white/90 border-white/20 backdrop-blur-sm transition-all ${
                        isInComparison(project.id) 
                          ? 'text-brand-gold bg-brand-gold/10' 
                          : 'text-ink-600 hover:text-brand-gold'
                      }`}
                    >
                      <Plus className={`w-20 h-20 ${isInComparison(project.id) ? 'rotate-45' : ''} transition-transform`} />
                    </Button>
                  </div>

                  {/* Hover overlay with location and calculator */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex gap-12">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowLocationMap(showLocationMap === project.id ? null : project.id)}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-pill backdrop-blur-sm"
                      >
                        <MapPin className="w-16 h-16 mr-8" />
                        Veja o entorno
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowCalculator(showCalculator === project.id ? null : project.id)}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-pill backdrop-blur-sm"
                      >
                        <Calculator className="w-16 h-16 mr-8" />
                        Simular
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Location Map Widget */}
                {showLocationMap === project.id && (
                  <div className="mt-16 p-16 bg-surface-50 rounded-card shadow-card-rest">
                    <h4 className="text-body-s font-semibold text-ink-900 mb-12">Entorno premium</h4>
                    <div className="grid grid-cols-2 gap-8 text-caption text-ink-600">
                      <span>• Shopping Curitiba (500m)</span>
                      <span>• Parque Barigui (800m)</span>
                      <span>• Colégio Positivo (300m)</span>
                      <span>• Hospital Marcelino (1km)</span>
                    </div>
                  </div>
                )}

                {/* Investment Calculator Widget */}
                {showCalculator === project.id && (
                  <div className="mt-16 p-16 bg-surface-50 rounded-card shadow-card-rest">
                    <h4 className="text-body-s font-semibold text-ink-900 mb-12">Simulação de investimento</h4>
                    <div className="space-y-8 text-caption text-ink-600">
                      <div className="flex justify-between">
                        <span>Entrada (30%):</span>
                        <span className="font-semibold">R$ 450.000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Financiamento:</span>
                        <span className="font-semibold">R$ 1.050.000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Parcela estimada:</span>
                        <span className="font-semibold text-brand-gold">R$ 7.200/mês</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className={`${project.reverse ? 'desktop:col-start-1' : ''} mobile:order-2`}>
                <p className="text-caption font-medium text-ink-500 tracking-overline uppercase mb-12">
                  Residencial
                </p>
                <h2 className="text-h2 font-bold text-ink-900 mb-24">
                  {project.name}
                </h2>
                <p className="text-body-l text-ink-700 mb-32">
                  {project.description}
                </p>
                
                {/* Specs */}
                <div className="space-y-12 mb-32">
                  {project.specs.area && (
                    <div className="flex items-center text-body-s text-ink-700">
                      <span className="w-4 h-4 bg-brand-gold rounded-full mr-12 flex-shrink-0"></span>
                      {project.specs.area} privativos
                    </div>
                  )}
                  {project.specs.suites && (
                    <div className="flex items-center text-body-s text-ink-700">
                      <span className="w-4 h-4 bg-brand-gold rounded-full mr-12 flex-shrink-0"></span>
                      {project.specs.suites}
                    </div>
                  )}
                  {project.specs.parking && (
                    <div className="flex items-center text-body-s text-ink-700">
                      <span className="w-4 h-4 bg-brand-gold rounded-full mr-12 flex-shrink-0"></span>
                      {project.specs.parking}
                    </div>
                  )}
                </div>

                <div className="flex gap-12 mobile:flex-col">
                  <Button 
                    variant="outline"
                    className="group border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-black font-semibold text-body-s tracking-button px-24 py-12 rounded-pill transition-smooth"
                  >
                    Conheça este empreendimento
                    <ArrowRight className="ml-8 h-16 w-16 transition-smooth group-hover:translate-x-4" />
                  </Button>
                  <Button 
                    onClick={() => openWhatsApp(project.name)}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold text-body-s tracking-button px-24 py-12 rounded-pill transition-smooth"
                  >
                    Falar sobre este imóvel
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </div>
        );
      })}
    </section>
  );
};
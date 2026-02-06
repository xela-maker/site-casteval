import { Button } from "@/components/ui/button";
import commercialBuilding from "@/assets/commercial-building.jpg";

export const BusinessCallout = () => {
  return (
    <section className="mobile:py-40 desktop:py-56 bg-surface-0">
      <div className="container mx-auto max-w-container mobile:px-16 desktop:px-24">
        <div className="grid mobile:grid-cols-1 desktop:grid-cols-2 mobile:gap-32 desktop:gap-48 items-center">
          {/* Left Image */}
          <div className="mobile:order-2 desktop:order-1">
            <img 
              src={commercialBuilding} 
              alt="Pessoas trabalhando em escritório moderno"
              className="w-full h-[400px] object-cover rounded-lg shadow-card-rest"
            />
          </div>

          {/* Right Content */}
          <div className="mobile:order-1 desktop:order-2">
            <h2 className="text-h2 font-bold text-ink-800 mb-6 leading-tight">
              Mais do que imóveis, oferecemos{" "}
              <span className="text-primary-600">soluções completas</span>{" "}
              para empresas
            </h2>
            <p className="text-body-l text-ink-600 mb-8 leading-relaxed">
              Na Casteval Business, entendemos que cada empresa tem necessidades únicas. 
              Por isso, oferecemos consultoria especializada, flexibilidade nos contratos 
              e suporte completo para que você foque no que realmente importa: fazer seu negócio crescer.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-brand-gold rounded-full"></div>
                <span className="text-body-s text-ink-600">Consultoria especializada em espaços corporativos</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-brand-gold rounded-full"></div>
                <span className="text-body-s text-ink-600">Contratos flexíveis adaptados ao seu negócio</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-brand-gold rounded-full"></div>
                <span className="text-body-s text-ink-600">Gestão de facilidades e suporte técnico</span>
              </div>
            </div>
            <Button 
              size="default"
              className="bg-brand-gold hover:bg-brand-gold-700 text-black font-semibold text-body-s tracking-button shadow-card-rest hover:shadow-card-hover px-8 py-3 rounded-pill"
            >
              AGENDE UMA VISITA
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
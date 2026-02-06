import { Button } from "@/components/ui/button";
import commercialBuilding from "@/assets/commercial-building.jpg";

export const BusinessCTABanner = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${commercialBuilding})` }}
      >
        <div className="absolute inset-0 bg-brand-charcoal/75"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto max-w-container px-24 text-center">
        <h2 className="text-h2 font-bold text-white mb-6">
          Encontre o espaço ideal para a sua empresa
        </h2>
        <p className="text-body-l text-white/85 mb-8 max-w-[600px] mx-auto">
          Entre em contato com nossos especialistas e descubra como podemos ajudar 
          seu negócio a crescer no local perfeito.
        </p>
        <Button 
          size="default"
          className="bg-brand-gold hover:bg-brand-gold-700 text-black font-semibold text-body-s tracking-button shadow-card-rest hover:shadow-card-hover px-8 py-3 rounded-pill"
        >
          FALE COM UM CORRETOR
        </Button>
      </div>
    </section>
  );
};
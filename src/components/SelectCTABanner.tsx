import { Button } from "@/components/ui/button";
import { useWhatsAppIntegration } from "@/hooks/useWhatsAppIntegration";

export const SelectCTABanner = () => {
  const { open } = useWhatsAppIntegration();

  const openSelectConsultor = () => {
    open('Tenho interesse na linha Casteval Select');
  };

  const scheduleExclusiveVisit = () => {
    open('Gostaria de agendar uma visita exclusiva Select');
  };

  return (
    <section className="relative py-72 mobile:py-48 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto max-w-container px-24 mobile:px-16 text-center">
        <h2 className="text-h2 font-bold text-white mb-24">
          Pronto para viver o exclusivo?
        </h2>
        <p className="text-body-l text-white/85 mb-32 max-w-[600px] mx-auto">
          Fale com nossos especialistas e descubra como ter acesso aos empreendimentos mais exclusivos da Casteval.
        </p>
        
        {/* Dual Premium CTAs */}
        <div className="flex flex-col mobile:flex-row gap-16 justify-center items-center">
          <Button 
            onClick={openSelectConsultor}
            size="default"
            className="bg-brand-gold hover:bg-brand-gold-700 text-black font-semibold text-body-s tracking-button shadow-card-rest hover:shadow-card-hover px-32 py-12 rounded-pill transition-smooth"
          >
            Fale com um corretor Select
          </Button>
          <Button 
            onClick={scheduleExclusiveVisit}
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-black font-semibold text-body-s tracking-button px-32 py-12 rounded-pill transition-smooth"
          >
            Agende uma visita exclusiva
          </Button>
        </div>
      </div>
    </section>
  );
};
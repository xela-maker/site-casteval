import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FamilySection } from "@/components/FamilySection";
import { usePageSettings } from "@/hooks/usePageSettings";

export const SelectContent = () => {
  const navigate = useNavigate();
  const { data: pageSettings } = usePageSettings('select');

  const heroImage = pageSettings?.hero_image || 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2070';
  const heroTitle = pageSettings?.hero_title || 'Casteval Select';
  const heroSubtitle = pageSettings?.hero_subtitle || 'Empreendimentos exclusivos, pensados para oferecer sofisticação, conforto e valorização em cada detalhe.';

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] desktop:min-h-[75vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
        </div>

        {/* Content - Centralized */}
        <div className="relative z-10 container mx-auto max-w-container px-24 mobile:px-16 text-center">
          <div className="max-w-[720px] mx-auto">
            <h1 className="text-display font-bold text-white mb-24 leading-tight">
              {heroTitle}
            </h1>
            <p className="text-body-l text-white/90 mb-48 max-w-[600px] mx-auto">
              {heroSubtitle}
            </p>

            {/* Scroll Cue */}
            <div className="animate-bounce">
              <ChevronDown className="w-24 h-24 text-white/60 mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section id="select-showcase" className="py-72 mobile:py-56 bg-white">
        <div className="container mx-auto max-w-container px-24 mobile:px-16 text-center">
          <h2 className="text-h2 font-bold text-ink-900 mb-32">
            Conheça os nossos empreendimentos
          </h2>
          
          <Button 
            onClick={() => navigate('/empreendimentos?tipo=select')}
            className="bg-brand-gold hover:bg-brand-gold-700 text-black font-semibold text-body-s tracking-button shadow-card-rest hover:shadow-card-hover px-32 py-12 rounded-pill transition-smooth"
          >
            DISPONÍVEIS
          </Button>
        </div>
      </section>

      {/* Family Section */}
      <FamilySection />
    </>
  );
};

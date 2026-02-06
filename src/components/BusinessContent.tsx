import { useNavigate } from "react-router-dom";
import { FamilySection } from "@/components/FamilySection";
import { usePageSettings } from "@/hooks/usePageSettings";
import { getImageUrl } from "@/lib/imageUtils";
import { Skeleton } from "@/components/ui/skeleton";
export const BusinessContent = () => {
  const navigate = useNavigate();
  const {
    data: pageSettings,
    isLoading
  } = usePageSettings('business');
  const heroImage = getImageUrl(pageSettings?.hero_image);
  const heroTitle = pageSettings?.hero_title || 'Casteval Business';
  const heroSubtitle = pageSettings?.hero_subtitle || 'Imóveis comerciais de alto padrão, estrategicamente localizados para alavancar seu negócio.';
  return <>
      {/* Hero Section */}
      <section className="relative h-[280px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        {isLoading ? <Skeleton className="absolute inset-0" /> : heroImage ? <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: `url(${heroImage})`
      }}>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/80 via-brand-charcoal/40 to-brand-charcoal/20"></div>
          </div> : <div className="absolute inset-0 bg-gradient-to-br from-brand-charcoal via-brand-charcoal/90 to-brand-charcoal/80" />}

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

      {/* Family Section */}
      
    </>;
};
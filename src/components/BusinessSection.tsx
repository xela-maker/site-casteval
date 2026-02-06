import { Button } from "@/components/ui/button";
import commercialImage from "@/assets/commercial-building-new.webp";
import castevalBusinessLogo from "@/assets/casteval-business-logo.png";
import { Link } from "react-router-dom";

export const BusinessSection = () => {
  return (
    <section className="mobile:py-20 tablet:py-32 desktop:py-48 bg-brand-charcoal text-white">
      <div className="container mx-auto max-w-container mobile:px-16 desktop:px-24">
        <div className="grid mobile:grid-cols-1 desktop:grid-cols-2 mobile:gap-32 desktop:gap-48 items-center">
          {/* Left Content */}
          <div>
            {/* Logo */}
            <div className="mb-24">
              <img src={castevalBusinessLogo} alt="Casteval Business" className="h-40 w-auto object-contain" />
            </div>

            {/* Heading */}
            <h2 className="text-h2 font-bold mb-24 leading-tight py-0 my-0 px-0">
              Um novo conceito em <span className="text-brand-gold">locação de imóveis comerciais</span>
            </h2>

            {/* Description */}
            <p className="text-body-l text-white/85 mb-32 leading-relaxed max-w-[48ch]">
              Espaços corporativos prontos para receber seu negócio, com localização estratégica, estrutura moderna e
              agilidade na locação.
            </p>

            {/* CTA Button */}
            <Link to="/business">
              <Button
                variant="default"
                size="pill"
                className="text-caption tracking-button py-12 px-20 text-slate-950 text-xs font-bold"
              >
                VER IMÓVEIS
              </Button>
            </Link>
          </div>

          {/* Right Content - Image */}
          <div className="relative">
            <img
              src={commercialImage}
              alt="Empreendimentos comerciais Casteval Business"
              className="w-full desktop:h-[500px] tablet:h-[400px] mobile:h-[300px] object-cover rounded-card shadow-card-rest"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-card"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

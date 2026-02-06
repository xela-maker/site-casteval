import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import familyImage from "@/assets/family-investment-new.webp";
export const FamilySection = () => {
  return <section className="mobile:py-20 tablet:py-32 desktop:py-48 bg-surface-50">
      <div className="container mx-auto max-w-container mobile:px-16 desktop:px-24">
        <div className="grid mobile:grid-cols-1 desktop:grid-cols-2 mobile:gap-32 desktop:gap-48 items-center">
          {/* Left Content */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center border-2 border-brand-gold text-brand-gold bg-transparent py-2 rounded-lg mb-24 text-caption font-medium tracking-overline px-20">
              INSTITUCIONAL
            </div>

            {/* Heading */}
            <h2 className="text-h2 font-bold text-ink-900 mb-24 leading-snug">
              Imóveis selecionados com{" "}
              <span className="text-brand-gold">o cuidado de uma empresa familiar</span>
            </h2>

            {/* Description */}
            <p className="text-body-l text-ink-700 mb-24 leading-relaxed max-w-[52ch]">
              De projetos exclusivos a imóveis prontos para morar, nosso compromisso é entregar resultados que superam expectativas e valorizam as comunidades onde atuamos.
            </p>

            <p className="text-body-l text-ink-600 mb-32 leading-relaxed max-w-[52ch]">
              Com foco em inovação, sustentabilidade e satisfação dos clientes, trabalhamos para transformar seu novo lar ou investimento em uma conquista segura e duradoura.
            </p>

            {/* CTA Button */}
            <Link to="/sobre-nos">
              <Button variant="default" size="pill" className="text-caption tracking-button px-20 py-[15px] font-extrabold">
                CONHEÇA NOSSA HISTÓRIA
              </Button>
            </Link>
          </div>

          {/* Right Content - Image */}
          <div className="relative">
            <img src={familyImage} alt="Família realizando o sonho da casa própria" className="w-full desktop:h-[600px] tablet:h-[400px] mobile:h-[300px] object-cover rounded-card shadow-card-rest" />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-card"></div>
          </div>
        </div>
      </div>
    </section>;
};
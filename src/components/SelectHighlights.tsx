import { MapPin, Building, Star, Crown } from "lucide-react";

const highlights = [
  {
    icon: MapPin,
    title: "Localização nobre",
    description: "Situados nos bairros mais valorizados de Curitiba, com fácil acesso a tudo que a cidade oferece de melhor."
  },
  {
    icon: Building,
    title: "Arquitetura autoral",
    description: "Projetos assinados por renomados arquitetos, com design único e funcionalidade pensada em cada detalhe."
  },
  {
    icon: Star,
    title: "Acabamentos premium",
    description: "Materiais selecionados e acabamentos de primeira linha, garantindo qualidade e sofisticação em todos os ambientes."
  },
  {
    icon: Crown,
    title: "Exclusividade no atendimento",
    description: "Suporte personalizado e dedicado durante todo o processo, desde a escolha até a entrega das chaves."
  }
];

export const SelectHighlights = () => {
  return (
    <section className="py-72 mobile:py-40 bg-brand-charcoal">
      <div className="container mx-auto max-w-container px-24 mobile:px-16">
        <div className="text-center mb-64 mobile:mb-48">
          <h2 className="text-h2 font-bold text-white mb-24">
            O que define a linha Select
          </h2>
          <p className="text-body-l text-white/85 max-w-[600px] mx-auto">
            Cada aspecto dos nossos empreendimentos Select é pensado para proporcionar uma experiência única e exclusiva.
          </p>
        </div>

        <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4 gap-48 mobile:gap-40">
          {highlights.map((highlight, index) => {
            const Icon = highlight.icon;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-64 h-64 bg-brand-gold rounded-full mb-24">
                  <Icon className="w-32 h-32 text-black" />
                </div>
                <h3 className="text-h3 font-semibold text-white mb-16">
                  {highlight.title}
                </h3>
                <p className="text-body-s text-white/80">
                  {highlight.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
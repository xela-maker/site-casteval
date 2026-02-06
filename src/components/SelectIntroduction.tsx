import { MapPin, Building, Star, Crown } from "lucide-react";

const premiumFeatures = [
  {
    icon: MapPin,
    title: "Localização nobre",
    description: "Situados nos bairros mais valorizados de Curitiba"
  },
  {
    icon: Building,
    title: "Arquitetura autoral",
    description: "Projetos assinados por renomados arquitetos"
  },
  {
    icon: Star,
    title: "Acabamentos premium",
    description: "Materiais selecionados e acabamentos de primeira linha"
  },
  {
    icon: Crown,
    title: "Atendimento personalizado",
    description: "Suporte dedicado durante todo o processo"
  }
];

export const SelectIntroduction = () => {
  return (
    <section className="py-72 mobile:py-40 bg-surface-0">
      <div className="container mx-auto max-w-container px-24 mobile:px-16">
        {/* Manifesto Section */}
        <div className="text-center mb-64 mobile:mb-48">
          <h2 className="text-h2 font-bold text-ink-900 mb-24">
            Mais do que imóveis. Um estilo de vida.
          </h2>
          <p className="text-body-l text-ink-700 max-w-[800px] mx-auto mb-32">
            A linha Casteval Select representa o que há de mais exclusivo em nosso portfólio. 
            Cada empreendimento é uma obra de arte arquitetônica, cuidadosamente curada para 
            proporcionar experiências únicas de moradia.
          </p>
          <p className="text-body-l text-ink-700 max-w-[800px] mx-auto">
            Aqui, a arquitetura autoral encontra localizações privilegiadas, design exclusivo 
            se une a acabamentos premium, criando não apenas residências, mas verdadeiros 
            marcos de sofisticação urbana.
          </p>
        </div>

        {/* Minimalist Icons Line */}
        <div className="grid grid-cols-2 desktop:grid-cols-4 gap-32 mobile:gap-24">
          {premiumFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-48 h-48 bg-brand-gold/10 rounded-full mb-16 group-hover:bg-brand-gold/20 transition-colors duration-300">
                  <Icon className="w-24 h-24 text-brand-gold" />
                </div>
                <h3 className="text-body-s font-semibold text-ink-900 mb-8">
                  {feature.title}
                </h3>
                <p className="text-caption text-ink-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
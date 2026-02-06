import { Button } from "@/components/ui/button";
import { ArrowRight, Book, Home, Sparkles } from "lucide-react";

const contentCards = [
  {
    id: 1,
    icon: Home,
    title: "Guia de lifestyle em Santa Felicidade",
    description: "Descubra os melhores restaurantes, parques e pontos de interesse no bairro mais charmoso de Curitiba.",
    readTime: "5 min",
    category: "Lifestyle"
  },
  {
    id: 2,
    icon: Sparkles,
    title: "Tendências em design de interiores de luxo",
    description: "As últimas tendências em decoração para criar ambientes sofisticados e acolhedores.",
    readTime: "8 min",
    category: "Design"
  },
  {
    id: 3,
    icon: Book,
    title: "Arquitetura autoral: como escolher o diferencial certo",
    description: "Entenda os elementos que fazem da arquitetura autoral um investimento único e valorizado.",
    readTime: "6 min",
    category: "Arquitetura"
  }
];

export const SelectSurpriseContent = () => {
  return (
    <section className="py-72 mobile:py-40 bg-surface-50">
      <div className="container mx-auto max-w-container px-24 mobile:px-16">
        <div className="text-center mb-48 mobile:mb-32">
          <h2 className="text-h2 font-bold text-ink-900 mb-16">
            Explore além do imóvel
          </h2>
          <p className="text-body-l text-ink-700 max-w-[600px] mx-auto">
            Conteúdos exclusivos para quem busca não apenas um lar, mas um estilo de vida sofisticado.
          </p>
        </div>

        <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-32 mobile:gap-24">
          {contentCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="group bg-white rounded-card shadow-card-rest hover:shadow-card-hover transition-all duration-300 overflow-hidden cursor-pointer"
              >
                <div className="p-24 mobile:p-20">
                  <div className="flex items-center justify-between mb-16">
                    <div className="inline-flex items-center justify-center w-40 h-40 bg-brand-gold/10 rounded-full">
                      <Icon className="w-20 h-20 text-brand-gold" />
                    </div>
                    <span className="text-caption text-ink-500 font-medium">
                      {card.readTime}
                    </span>
                  </div>
                  
                  <div className="mb-12">
                    <span className="inline-block text-caption font-semibold text-brand-gold uppercase tracking-overline">
                      {card.category}
                    </span>
                  </div>
                  
                  <h3 className="text-h4 font-semibold text-ink-900 mb-12 group-hover:text-brand-gold transition-colors">
                    {card.title}
                  </h3>
                  
                  <p className="text-body-s text-ink-600 mb-20 line-clamp-3">
                    {card.description}
                  </p>
                  
                  <Button
                    variant="ghost"
                    className="group/btn p-0 h-auto text-brand-gold hover:text-brand-gold-700 font-semibold text-body-s"
                  >
                    Ler mais
                    <ArrowRight className="ml-8 h-16 w-16 transition-transform group-hover/btn:translate-x-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA to Blog */}
        <div className="text-center mt-48 mobile:mt-32">
          <Button
            variant="outline"
            className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-black font-semibold text-body-s tracking-button px-32 py-12 rounded-pill transition-smooth"
          >
            Ver todos os artigos
          </Button>
        </div>
      </div>
    </section>
  );
};
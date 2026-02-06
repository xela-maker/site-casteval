import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const lifestyleImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?q=80&w=2070",
    caption: "Mais do que viver, é sentir",
    description: "Rooftop com vista panorâmica da cidade"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070",
    caption: "Momentos únicos em família",
    description: "Jantar sofisticado com vista privilegiada"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070",
    caption: "Onde cada detalhe importa",
    description: "Ambientes projetados para o seu bem-estar"
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070",
    caption: "Viva a exclusividade",
    description: "Espaços que traduzem sofisticação"
  }
];

export const SelectLifestyle = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % lifestyleImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + lifestyleImages.length) % lifestyleImages.length);
  };

  return (
    <section className="py-72 mobile:py-40 bg-brand-charcoal overflow-hidden">
      <div className="container mx-auto max-w-container px-24 mobile:px-16">
        <div className="text-center mb-48 mobile:mb-32">
          <h2 className="text-h2 font-bold text-white mb-16">
            Viva a experiência Select
          </h2>
          <p className="text-body-l text-white/85 max-w-[600px] mx-auto">
            Descubra como é viver com exclusividade, onde cada momento se torna especial.
          </p>
        </div>

        {/* Lifestyle Carousel */}
        <div className="relative">
          <div className="relative h-[400px] desktop:h-[500px] rounded-card overflow-hidden">
            {lifestyleImages.map((image, index) => (
              <div
                key={image.id}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={image.src}
                  alt={image.description}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-32 mobile:p-24">
                  <p className="text-h3 font-bold text-white mb-8">
                    {image.caption}
                  </p>
                  <p className="text-body-s text-white/80">
                    {image.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className="absolute left-16 top-1/2 -translate-y-1/2 bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-full w-48 h-48"
          >
            <ChevronLeft className="w-20 h-20" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className="absolute right-16 top-1/2 -translate-y-1/2 bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-full w-48 h-48"
          >
            <ChevronRight className="w-20 h-20" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-8 mt-24">
            {lifestyleImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-8 h-8 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-brand-gold' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
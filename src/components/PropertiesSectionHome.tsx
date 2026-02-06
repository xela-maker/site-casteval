import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LazyImage } from "./LazyImage";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useEmpreendimentos } from "@/hooks/useEmpreendimentos";
import { getImageUrl } from "@/lib/imageUtils";

export const PropertiesSectionHome = () => {
  const { data: response, isLoading } = useEmpreendimentos({ destaque: true, pageSize: 4 });
  
  // Map featured properties (destaque=true)
  const properties = response?.data?.map(emp => ({
    slug: emp.slug,
    image: getImageUrl(emp.card_image) || getImageUrl(emp.hero_image) || '/placeholder.jpg',
    title: emp.nome,
    location: `${emp.endereco_bairro || ''}, ${emp.endereco_cidade || ''}`.trim().replace(/^,\s*/, ''),
    description: emp.descricao_curta || emp.descricao?.substring(0, 100) || ''
  })) || [];

  if (isLoading) {
    return (
      <section id="properties-section" className="mobile:py-20 tablet:py-32 desktop:py-48 bg-surface-50">
        <div className="container mx-auto max-w-container mobile:px-16 desktop:px-24">
          <h2 className="text-h2 font-bold text-ink-900 mb-48 text-center">Conheça nossos empreendimentos</h2>
          <div className="flex justify-center items-center h-64">
            <p className="text-ink-500">Carregando...</p>
          </div>
        </div>
      </section>
    );
  }
  return <section id="properties-section" className="mobile:py-20 tablet:py-32 desktop:py-48 bg-surface-50">
      <div className="container mx-auto max-w-container mobile:px-16 desktop:px-24">
        {/* Section Header */}
        <h2 className="text-h2 font-bold text-ink-900 mb-48 text-center">Conheça nossos empreendimentos</h2>

        {/* Carousel Container */}
        <div className="relative mb-48">
          <Carousel opts={{
          align: "start",
          loop: true
        }} className="w-full">
            <CarouselContent className="-ml-16 mobile:-ml-8">
              {properties.map(property => <CarouselItem key={property.slug} className="pl-16 mobile:pl-8 basis-full tablet:basis-1/2 desktop:basis-1/4">
                  <div className="bg-white rounded-card shadow-card-rest overflow-hidden hover:shadow-card-hover transition-smooth h-full">
                    {/* Image */}
                    <div className="relative h-[280px] overflow-hidden">
                      <LazyImage src={property.image} alt={property.title} className="w-full h-full object-cover" />
                    </div>

                    {/* Content */}
                    <div className="p-24">
                      {/* Location */}
                      <p className="text-caption text-ink-600 mb-8 font-medium uppercase tracking-wider">
                        {property.location}
                      </p>

                      {/* Description */}
                      <p className="text-body-m text-ink-700 mb-24">{property.description}</p>

                      {/* CTA Button */}
                      <Link to={`/empreendimentos/${property.slug}`}>
                        <Button variant="outline" className="w-full border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-black font-semibold text-body-s tracking-button transition-smooth">
                          SAIBA MAIS
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CarouselItem>)}
            </CarouselContent>

            {/* Navigation Buttons - Hidden on Mobile */}
            <div className="hidden tablet:block">
              <CarouselPrevious className="absolute -left-16 top-[140px] bg-white border-surface-200 hover:bg-surface-50 text-ink-900" />
              <CarouselNext className="absolute -right-16 top-[140px] bg-white border-surface-200 hover:bg-surface-50 text-ink-900" />
            </div>
          </Carousel>
        </div>

        {/* See More Button */}
        <div className="text-center">
          <Link to="/empreendimentos">
            <Button variant="default" size="pill" className="text-caption font-semibold tracking-button px-[30px] py-20">
              VER TODOS
            </Button>
          </Link>
        </div>
      </div>
    </section>;
};
import { PropertyCard } from "./PropertyCard";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useWhatsAppIntegration } from "@/hooks/useWhatsAppIntegration";
import property1 from "@/assets/property-1.jpg";

export const PropertiesSection = () => {
  const { openGeneral } = useWhatsAppIntegration();

  const openWhatsApp = () => {
    openGeneral();
  };

  const properties = [
    {
      image: property1,
      title: "Virgínia Dalabona, 000",
      location: "Jardim Marajoara - São Paulo",
      price: "Sob consulta",
      status: "Lançamento" as const,
      features: {
        bedrooms: 3,
        bathrooms: 2,
        parking: 2,
        area: "200m² Privativos"
      },
      description: "Uma casa diferente da que você se viu em volta. Facilidades."
    },
    {
      image: property1,
      title: "Virgínia Dalabona, 000",
      location: "Jardim Marajoara - São Paulo", 
      price: "Sob consulta",
      status: "Lançamento" as const,
      features: {
        bedrooms: 3,
        bathrooms: 2,
        parking: 2,
        area: "200m² Privativos"
      },
      description: "Uma casa diferente da que você se viu em volta. Facilidades."
    },
    {
      image: property1,
      title: "Virgínia Dalabona, 000",
      location: "Jardim Marajoara - São Paulo",
      price: "Sob consulta", 
      status: "Lançamento" as const,
      features: {
        bedrooms: 3,
        bathrooms: 2,
        parking: 2,
        area: "200m² Privativos"
      },
      description: "Uma casa diferente da que você se viu em volta. Facilidades."
    },
    {
      image: property1,
      title: "Virgínia Dalabona, 000",
      location: "Jardim Marajoara - São Paulo",
      price: "Sob consulta",
      status: "Lançamento" as const,
      features: {
        bedrooms: 3,
        bathrooms: 2,
        parking: 2,
        area: "200m² Privativos"
      },
      description: "Uma casa diferente da que você se viu em volta. Facilidades."
    }
  ];

  return (
    <section id="properties-section" className="mobile:py-40 tablet:py-56 desktop:py-72 bg-background">
      <div className="container mx-auto max-w-container mobile:px-16 desktop:px-24">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-24">
          <h2 className="text-h2 font-bold text-ink-900">
            Conheça nossos empreendimentos
          </h2>
          <div className="hidden tablet:flex items-center">
            <Button 
              onClick={openWhatsApp}
              variant="outline" 
              className="border-success text-success hover:bg-success hover:text-white transition-smooth"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid mobile:grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4 mobile:gap-16 tablet:gap-24 desktop:gap-24 mb-24">
          {properties.map((property, index) => (
            <PropertyCard key={index} {...property} />
          ))}
        </div>

        {/* See More Button */}
        <div className="text-center">
          <Link to="/empreendimentos">
            <Button 
              variant="default"
              size="pill"
              className="text-caption font-semibold tracking-button"
            >
              VER TODOS OS EMPREENDIMENTOS
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
import { PropertyCard } from "@/components/PropertyCard";
import commercialImage from "@/assets/commercial-building.jpg";

const businessProperties = [
  {
    id: 1,
    image: commercialImage,
    title: "Centro Empresarial Ecoville",
    location: "Ecoville - Curitiba",
    price: "Sob consulta",
    status: "BUSINESS",
  features: {
    area: "120m² a 800m²",
    rooms: 10,
    parking: 5,
    floor: "8º ao 15º andar"
  },
    description: "Salas comerciais modernas em um dos bairros mais valorizados de Curitiba."
  },
  {
    id: 2,
    image: commercialImage,
    title: "Corporate Center Batel",
    location: "Batel - Curitiba",
    price: "Sob consulta",
    status: "BUSINESS",
  features: {
    area: "80m² a 500m²",
    rooms: 6,
    parking: 3,
    floor: "5º ao 12º andar"
  },
    description: "Espaços corporativos premium no coração do Batel."
  },
  {
    id: 3,
    image: commercialImage,
    title: "Business Tower Santa Felicidade",
    location: "Santa Felicidade - Curitiba",
    price: "Sob consulta",
    status: "BUSINESS",
  features: {
    area: "60m² a 300m²",
    rooms: 4,
    parking: 2,
    floor: "3º ao 10º andar"
  },
    description: "Oportunidade única em localização estratégica e tradicional."
  },
  {
    id: 4,
    image: commercialImage,
    title: "Office Premium Água Verde",
    location: "Água Verde - Curitiba",
    price: "Sob consulta",
    status: "BUSINESS",
  features: {
    area: "100m² a 600m²",
    rooms: 7,
    parking: 4,
    floor: "6º ao 14º andar"
  },
    description: "Ambiente corporativo sofisticado com vista privilegiada da cidade."
  }
];

export const BusinessGrid = () => {
  return (
    <section className="mobile:py-40 desktop:py-56 bg-surface-50">
      <div className="container mx-auto max-w-container mobile:px-16 desktop:px-24">
        <div className="text-center mb-32">
          <h2 className="text-h2 font-bold text-ink-800 mb-6">
            Empreendimentos Business disponíveis
          </h2>
          <p className="text-body-l text-ink-600 max-w-[600px] mx-auto">
            Conheça nossos espaços comerciais estrategicamente localizados nos melhores bairros de Curitiba.
          </p>
        </div>

        <div className="grid mobile:grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-2 mobile:gap-24 desktop:gap-32">
          {businessProperties.map((property) => (
            <PropertyCard
              key={property.id}
              image={property.image}
              title={property.title}
              location={property.location}
              price={property.price}
              status={property.status}
              features={{
                bedrooms: property.features.rooms,
                bathrooms: property.features.floor,
                parking: property.features.parking,
                area: property.features.area
              }}
              description={property.description}
              variant="business"
            />
          ))}
        </div>
      </div>
    </section>
  );
};
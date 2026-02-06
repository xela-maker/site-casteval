import { Empreendimento } from "@/hooks/useEmpreendimentos";
import { Casa } from "@/hooks/useCasa";

export const createEmpreendimentoSchema = (empreendimento: Empreendimento) => ({
  "@context": "https://schema.org",
  "@type": "ApartmentComplex",
  "name": empreendimento.nome,
  "description": empreendimento.descricao || empreendimento.descricao_curta,
  "url": `https://casteval.com/empreendimentos/${empreendimento.slug}`,
  "image": empreendimento.hero_image || empreendimento.card_image,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": empreendimento.endereco_rua || "",
    "addressLocality": empreendimento.endereco_cidade || "Curitiba",
    "addressRegion": empreendimento.endereco_uf || "PR",
    "addressCountry": "BR"
  },
  "geo": empreendimento.endereco_bairro ? {
    "@type": "GeoCoordinates",
    "address": `${empreendimento.endereco_bairro}, ${empreendimento.endereco_cidade} - ${empreendimento.endereco_uf}`
  } : undefined,
  "numberOfRooms": empreendimento.quartos_max,
  "floorSize": {
    "@type": "QuantitativeValue",
    "value": empreendimento.metragem_inicial,
    "unitText": "m²"
  },
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "BRL",
    "lowPrice": empreendimento.preco_inicial,
    "availability": "https://schema.org/InStock"
  }
});

export const createCasaSchema = (
  casa: Casa, 
  empreendimento: { nome: string; slug: string; endereco_cidade?: string; endereco_bairro?: string }
) => ({
  "@context": "https://schema.org",
  "@type": "SingleFamilyResidence",
  "name": `${casa.nome} - ${empreendimento.nome}`,
  "description": casa.descricao_detalhada || casa.descricao_curta,
  "url": `https://casteval.com/empreendimentos/${empreendimento.slug}/${casa.slug}`,
  "image": casa.foto_capa,
  "address": {
    "@type": "PostalAddress",
    "addressLocality": empreendimento.endereco_cidade || "Curitiba",
    "addressRegion": "PR",
    "addressCountry": "BR"
  },
  "numberOfRooms": casa.quartos,
  "numberOfBedrooms": casa.quartos,
  "numberOfBathroomsTotal": casa.banheiros,
  "floorSize": {
    "@type": "QuantitativeValue",
    "value": casa.metragem,
    "unitText": "m²"
  },
  "offers": {
    "@type": "Offer",
    "price": casa.preco,
    "priceCurrency": "BRL",
    "availability": casa.status === 'disponivel' 
      ? "https://schema.org/InStock" 
      : "https://schema.org/OutOfStock"
  }
});

export const createOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "Casteval",
  "description": "Sofisticação e exclusividade em empreendimentos imobiliários de alto padrão",
  "url": "https://casteval.com",
  "logo": "https://casteval.com/casteval-logo.png",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Curitiba",
    "addressRegion": "PR",
    "addressCountry": "BR"
  },
  "sameAs": [
    "https://www.instagram.com/casteval",
    "https://www.linkedin.com/company/casteval"
  ]
});

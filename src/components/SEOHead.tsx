import { useEffect } from 'react';
import { useConfig } from '@/hooks/useConfig';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  structuredData?: object;
  preloadImages?: string[];
}

export const SEOHead = ({
  title,
  description,
  keywords,
  ogImage = "/hero-house.jpg",
  ogType = "website",
  canonical,
  structuredData,
  preloadImages = []
}: SEOHeadProps) => {
  const { data: config } = useConfig();

  const finalTitle =
    title ||
    config?.site_title_default ||
    "Casteval - Sofisticação e Exclusividade em Empreendimentos";

  const finalDescription =
    description ||
    config?.site_description_default ||
    "Descubra empreendimentos exclusivos da Casteval. Arquitetura autoral, localizações nobres e atendimento personalizado. Casteval Select e Business.";

  const finalKeywords =
    keywords ||
    config?.site_keywords_default ||
    "casteval, empreendimentos, imóveis, curitiba, são paulo, casteval select, casteval business, arquitetura, exclusividade, sofisticação";

  const finalAuthor = config?.site_author_default || "Casteval";

  useEffect(() => {
    // Update document title
    document.title = finalTitle;
    
    // Update meta tags
    updateMetaTag('description', finalDescription);
    updateMetaTag('keywords', finalKeywords);
    updateMetaTag('author', finalAuthor);
    
    // Open Graph
    updateMetaTag('og:title', finalTitle, 'property');
    updateMetaTag('og:description', finalDescription, 'property');
    updateMetaTag('og:image', ogImage, 'property');
    updateMetaTag('og:type', ogType, 'property');
    updateMetaTag('og:site_name', 'Casteval', 'property');
    
    // Twitter Card
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', finalTitle);
    updateMetaTag('twitter:description', finalDescription);
    updateMetaTag('twitter:image', ogImage);
    
    // Canonical URL
    if (canonical) {
      updateLinkTag('canonical', canonical);
    }
    
    // Structured Data
    if (structuredData) {
      updateStructuredData(structuredData);
    }

    // Preload critical images
    preloadImages.forEach((imageUrl) => {
      if (imageUrl) {
        updateLinkTag('preload', imageUrl);
      }
    });
    
  }, [finalTitle, finalDescription, finalKeywords, finalAuthor, ogImage, ogType, canonical, structuredData, preloadImages]);

  const updateMetaTag = (name: string, content: string, property?: string) => {
    const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
    let meta = document.querySelector(selector);
    
    if (!meta) {
      meta = document.createElement('meta');
      if (property) {
        meta.setAttribute('property', name);
      } else {
        meta.setAttribute('name', name);
      }
      document.head.appendChild(meta);
    }
    
    meta.setAttribute('content', content);
  };

  const updateLinkTag = (rel: string, href: string) => {
    let link = document.querySelector(`link[rel="${rel}"][href="${href}"]`) as HTMLLinkElement;
    
    if (!link) {
      link = document.createElement('link');
      link.rel = rel;
      if (rel === 'preload') {
        link.as = 'image';
      }
      document.head.appendChild(link);
    }
    
    link.href = href;
  };

  const updateStructuredData = (data: object) => {
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  };

  return null; // This component doesn't render anything
};

// Pre-defined structured data schemas
export const createRealEstateSchema = (properties: any[]) => ({
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "Casteval",
  "description": "Empreendimentos exclusivos com arquitetura autoral e localizações nobres",
  "url": "https://casteval.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Curitiba",
    "addressRegion": "PR",
    "addressCountry": "BR"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Empreendimentos Casteval",
    "itemListElement": properties.map((property, index) => ({
      "@type": "Product",
      "position": index + 1,
      "name": property.title,
      "description": property.description,
      "image": property.image,
      "offers": {
        "@type": "Offer",
        "price": property.price,
        "priceCurrency": "BRL",
        "availability": "https://schema.org/InStock"
      }
    }))
  }
});

export const createOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Casteval",
  "url": "https://casteval.com",
  "logo": "https://casteval.com/casteval-logo.png",
  "description": "Sofisticação e exclusividade em empreendimentos imobiliários",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Curitiba",
    "addressRegion": "PR", 
    "addressCountry": "BR"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+55-41-99999-9999",
    "contactType": "customer service"
  },
  "sameAs": [
    "https://www.instagram.com/casteval",
    "https://www.linkedin.com/company/casteval"
  ]
});
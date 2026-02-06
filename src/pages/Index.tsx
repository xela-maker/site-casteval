import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { PropertiesSectionHome } from "@/components/PropertiesSectionHome";
import { BusinessSection } from "@/components/BusinessSection";
import { FamilySection } from "@/components/FamilySection";
import { BlogSection } from "@/components/BlogSection";
import { Footer } from "@/components/Footer";
import { WhatsAppFAB } from "@/components/WhatsAppFAB";
import { SEOHead, createOrganizationSchema } from "@/components/SEOHead";
import { useBlogPosts } from "@/hooks/useBlogPosts";

const Index = () => {
  const { data: blogData, isLoading } = useBlogPosts({
    is_published: true,
    pageSize: 4,
  });

  return (
    <div className="min-h-screen">
      <SEOHead 
        title="Casteval - Sofisticação e Exclusividade em Empreendimentos | Curitiba e São Paulo"
        description="Descubra empreendimentos exclusivos da Casteval. Arquitetura autoral, localizações nobres e atendimento personalizado. Casteval Select e Business em Curitiba e São Paulo."
        keywords="casteval, empreendimentos curitiba, imóveis são paulo, casteval select, casteval business, arquitetura autoral, exclusividade, sofisticação, apartamentos de luxo"
        structuredData={createOrganizationSchema()}
      />
      <Header />
      <HeroSection />
      <PropertiesSectionHome />
      <BusinessSection />
      <FamilySection />
      <BlogSection posts={blogData?.data || []} isLoading={isLoading} />
      <Footer />
      <WhatsAppFAB />
    </div>
  );
};

export default Index;

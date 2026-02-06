import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFAB } from "@/components/WhatsAppFAB";
import { Button } from "@/components/ui/button";
import { useCasaBySlug } from "@/hooks/useCasaBySlug";
import { useSelectSimilar } from "@/hooks/useSelectSimilar";
import { useComodidadesWithIcons } from "@/hooks/useComodidadesWithIcons";
import { SEOHead } from "@/components/SEOHead";
import { CasaDetalhesBase } from "@/components/CasaDetalhesBase";

export default function CasaDetalhesUnificado() {
  const { slug } = useParams<{ slug: string }>();
  const { data: casa, isLoading } = useCasaBySlug(slug!);
  const { data: similares = [] } = useSelectSimilar(casa?.id, 3);

  const comodidades = Array.isArray(casa?.comodidades) ? casa.comodidades : [];
  const { data: comodidadesComIcones = [] } = useComodidadesWithIcons(comodidades);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!casa) {
    return (
      <div className="min-h-screen flex flex-col">
        <SEOHead title="Imóvel não encontrado - Casteval" />
        <Header />
        <div className="flex-1 container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Imóvel não encontrado</h1>
          <p className="text-muted-foreground mb-8 text-lg">
            O imóvel que você está procurando não existe ou foi removido.
          </p>
          <Button asChild size="lg">
            <Link to="/">Voltar para Início</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  // Detectar contexto baseado nas tags
  const isSelect = casa.tags?.includes("select");
  const isBusiness = casa.tags?.includes("business");

  const location = [
    casa.empreendimento.endereco_rua,
    casa.empreendimento.endereco_bairro,
    casa.empreendimento.endereco_cidade,
    casa.empreendimento.endereco_uf,
  ]
    .filter(Boolean)
    .join(", ");

  const isAvulso = casa.empreendimento.slug === "sem-empreendimento";
  const empreendimentoNome = isAvulso ? "Imóvel Avulso" : casa.empreendimento.nome;

  // SEO baseado no contexto
  const seoTitle = isSelect
    ? `${casa.nome} - Casteval Select`
    : isBusiness
      ? `${casa.nome} - Casteval Business`
      : `${casa.nome} - ${empreendimentoNome} | Casteval`;

  const seoKeywords = isSelect
    ? `${casa.tipo}, ${casa.nome}, casteval select, imóvel premium, ${casa.empreendimento.endereco_cidade}`
    : isBusiness
      ? `${casa.tipo}, ${casa.nome}, casteval business, imóvel comercial, ${casa.empreendimento.endereco_cidade}`
      : `${casa.nome}, ${empreendimentoNome}, casa, venda, ${casa.empreendimento.endereco_cidade}`;

  const contextType = isSelect ? 'select' : isBusiness ? 'business' : 'general';

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title={seoTitle}
        description={casa.descricao_curta || `${casa.nome} em ${location}`}
        keywords={seoKeywords}
      />
      <Header />

      <main className="flex-1">
        <CasaDetalhesBase
          casa={casa}
          empreendimento={casa.empreendimento}
          comodidadesComIcones={comodidadesComIcones}
          similares={isSelect ? similares : []}
          showSimilares={isSelect}
          contextType={contextType}
        />
      </main>

      <Footer />
      <WhatsAppFAB />
    </div>
  );
}

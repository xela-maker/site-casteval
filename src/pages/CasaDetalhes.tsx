import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFAB } from "@/components/WhatsAppFAB";
import { Button } from "@/components/ui/button";
import { useCasa } from "@/hooks/useCasa";
import { useComodidadesWithIcons } from "@/hooks/useComodidadesWithIcons";
import { SEOHead } from "@/components/SEOHead";
import { CasaDetalhesBase } from "@/components/CasaDetalhesBase";

export default function CasaDetalhes() {
  const { empreendimentoSlug, casaSlug } = useParams();
  const { data, isLoading } = useCasa(empreendimentoSlug!, casaSlug!);

  const comodidades = Array.isArray(data?.casa?.comodidades) ? data.casa.comodidades : [];
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

  if (!data || !data.casa || !data.empreendimento) {
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
            <a href="/empreendimentos">Voltar para Empreendimentos</a>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const { casa, empreendimento } = data;
  const location = [
    empreendimento.endereco_rua,
    empreendimento.endereco_bairro,
    empreendimento.endereco_cidade,
    empreendimento.endereco_uf,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title={`${casa.nome} - ${empreendimento.nome} | Casteval`}
        description={casa.descricao_curta || `${casa.nome} em ${location}`}
        keywords={`${casa.nome}, ${empreendimento.nome}, casa, venda, ${empreendimento.endereco_cidade}`}
      />
      <Header />

      <main className="flex-1">
        <CasaDetalhesBase
          casa={casa}
          empreendimento={empreendimento}
          comodidadesComIcones={comodidadesComIcones}
          showSimilares={false}
          contextType="general"
        />
      </main>

      <Footer />
      <WhatsAppFAB />
    </div>
  );
}

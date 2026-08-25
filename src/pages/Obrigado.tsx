import { Link } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { useConfig } from "@/hooks/useConfig";
import { getPhoneDigits } from "@/lib/phoneUtils";
import contatoHero from "@/assets/contato-hero.png";
import familiaCta from "@/assets/familia-cta.jpg";

const toWhatsAppE164 = (raw?: string | null) => {
  const digits = getPhoneDigits(raw || "");
  if (!digits) return "5541999999999";
  return `55${digits}`;
};

const STEPS = [
  {
    n: "01",
    title: "Fique de olho no seu WhatsApp",
    body: "Nossa equipe vai entrar em contato pelo número que você informou no formulário.",
  },
  {
    n: "02",
    title: "Salve o nosso número",
    body: "Assim que receber a mensagem, salve o contato na agenda para não perder nenhuma comunicação importante.",
  },
  {
    n: "03",
    title: "Tire todas as dúvidas",
    body: "Aproveite a conversa para perguntar o que precisar. Estamos aqui para ajudar, sem pressa e sem pressão.",
  },
] as const;

export default function Obrigado() {
  const { data: config } = useConfig();
  const phoneNumber = toWhatsAppE164(config?.whatsapp_numero);
  const defaultMessage =
    config?.whatsapp_mensagem_padrao ||
    "Olá! Acabei de enviar uma mensagem pelo site da Casteval e gostaria de continuar a conversa.";

  const openWhatsApp = () => {
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="min-h-screen bg-surface-0">
      <SEOHead
        title="Mensagem recebida | Casteval"
        description="Sua mensagem chegou. Um consultor da Casteval vai falar com você em breve."
        canonical="https://casteval.com.br/obrigado"
      />
      <Header />

      <main>
        {/* Hero — ritmo do Contato */}
        <section className="relative isolate overflow-hidden bg-black text-white text-center pt-[116px] pb-[80px] px-16 desktop:px-24">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-80 pointer-events-none"
            style={{ backgroundImage: `url(${contatoHero})` }}
            aria-hidden
          />
          <div className="relative z-10 container mx-auto max-w-container">
            <h1 className="text-display font-bold text-white mb-[10px] leading-tight">
              Sua mensagem chegou.
            </h1>
            <p className="text-body-l text-white/95 max-w-[760px] mx-auto mb-32">
              Um consultor da Casteval vai falar com você em breve.
            </p>
            {/* mobile: coluna full-width; desktop: row — mobile: no projeto = max-width 599 */}
            <div className="flex flex-col desktop:flex-row gap-16 justify-center items-stretch desktop:items-center w-full max-w-[360px] desktop:max-w-none mx-auto">
              <Button
                type="button"
                onClick={openWhatsApp}
                className="w-full desktop:w-auto bg-brand-gold hover:bg-brand-gold-700 text-black font-semibold text-body-s tracking-button shadow-card-rest hover:shadow-card-hover px-32 py-12 rounded-pill transition-smooth"
              >
                <FaWhatsapp className="h-16 w-16" aria-hidden />
                Falar no WhatsApp
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full desktop:w-auto border-white text-white hover:bg-white hover:text-black font-semibold text-body-s tracking-button px-32 py-12 rounded-pill transition-smooth"
              >
                <Link to="/">Voltar ao início</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Conteúdo — bloco claro do Contato */}
        <section className="bg-surface-50 py-64 px-16 desktop:px-24">
          <div className="container mx-auto max-w-container">
            <p className="text-body-l text-ink-700 leading-relaxed max-w-[65ch] mb-48">
              Você deu o primeiro passo para encontrar o lar certo para a sua
              família. Com mais de 60 anos construindo Curitiba, a Casteval
              está aqui para tornar esse processo tranquilo, transparente e sem
              surpresas, do primeiro contato até a entrega das chaves.
            </p>

            <h2 className="text-h2 font-bold text-ink-900 mb-32">
              Próximos Passos
            </h2>

            <ol className="border-t border-line-100">
              {STEPS.map((step) => (
                <li
                  key={step.n}
                  className="grid grid-cols-1 desktop:grid-cols-[80px_1fr] gap-12 desktop:gap-24 py-24 border-b border-line-100"
                >
                  <span className="text-h3 font-bold text-brand-gold leading-none">
                    {step.n}
                  </span>
                  <div className="max-w-[52ch]">
                    <h3 className="text-h4 font-bold text-ink-900 mb-8">
                      {step.title}
                    </h3>
                    <p className="text-body-l text-ink-600 leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Depoimento — ritmo FamilySection */}
        <section className="mobile:py-20 tablet:py-32 desktop:py-48 bg-surface-0">
          <div className="container mx-auto max-w-container px-16 desktop:px-24">
            <div className="grid grid-cols-1 desktop:grid-cols-2 gap-32 desktop:gap-48 items-center">
              <div className="relative">
                <img
                  src={familiaCta}
                  alt="Família em um lar Casteval"
                  className="w-full h-[300px] tablet:h-[400px] desktop:h-[600px] object-cover rounded-card shadow-card-rest"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-card" />
              </div>

              <div>
                <h2 className="text-h2 font-bold text-ink-900 mb-24 leading-snug">
                  Você Vai Gostar do Que Vem Por Aí
                </h2>
                <p className="text-body-l text-ink-700 mb-24 leading-relaxed max-w-[52ch]">
                  “Achar um imóvel estava sendo tão desgastante que entrar em
                  contato direto com a Casteval foi uma última tentativa. O
                  processo foi tão rápido que ainda nem absorvi a ideia, mas se
                  eu soubesse que seria tão tranquilo, teria sido minha primeira
                  opção. É muito satisfatório ser bem atendido.”
                </p>
                <p className="text-body-l text-ink-600 leading-relaxed max-w-[52ch]">
                  O atendimento virou parte fundamental da experiência de compra.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA — ritmo SelectCTABanner */}
        <section className="relative py-72 mobile:py-48 overflow-hidden">
          <div className="absolute inset-0 bg-brand-charcoal" aria-hidden />
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 55% at 75% 35%, hsl(45 81% 49% / 0.28), transparent 62%)",
            }}
            aria-hidden
          />
          <div className="relative z-10 container mx-auto max-w-container px-16 desktop:px-24 text-center">
            <h2 className="text-h2 font-bold text-white mb-24">
              Fale Agora pelo WhatsApp
            </h2>
            <p className="text-body-l text-white/85 mb-32 max-w-[600px] mx-auto">
              Prefere falar agora? Nossa equipe está pronta para continuar o
              atendimento pelo WhatsApp.
            </p>
            <Button
              type="button"
              onClick={openWhatsApp}
              className="w-full max-w-[360px] desktop:w-auto bg-[#25D366] hover:bg-[#1ebe57] text-white font-semibold text-body-s tracking-button shadow-card-rest hover:shadow-card-hover px-32 py-12 rounded-pill transition-smooth"
            >
              <FaWhatsapp className="h-16 w-16" aria-hidden />
              Falar no WhatsApp
            </Button>
            <p className="text-body-s text-white/60 mt-32 break-words px-8">
              Alguma dúvida? Fale com nosso suporte:{" "}
              <a
                href="mailto:contato@casteval.com.br"
                className="font-semibold text-brand-gold hover:underline underline-offset-4"
              >
                contato@casteval.com.br
              </a>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

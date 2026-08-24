import { Link } from "react-router-dom";
import { CheckCircle, MessageCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { useConfig } from "@/hooks/useConfig";
import { getPhoneDigits } from "@/lib/phoneUtils";

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
        {/* Hero confirmation */}
        <section className="relative bg-[#F6F7F8] pt-24 pb-16 md:pb-20 px-5">
          <div className="mx-auto max-w-[1200px] grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-pill bg-white px-4 py-2 shadow-sm border border-line-100">
                <CheckCircle className="h-5 w-5 text-success" aria-hidden />
                <span className="text-caption font-semibold tracking-button text-ink-700 uppercase">
                  Mensagem recebida
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.05] text-ink-900 mb-5">
                Sua mensagem chegou.
              </h1>
              <p className="text-body-l text-ink-500 leading-relaxed max-w-[40ch]">
                Um consultor da Casteval vai falar com você em breve.
              </p>
              <div className="mt-8">
                <Button asChild variant="outline" size="pill">
                  <Link to="/">Voltar ao início</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-xl bg-secondary text-white p-8 md:p-10 shadow-lg">
              <p className="text-body-l leading-relaxed text-white/90">
                Você deu o primeiro passo para encontrar o lar certo para a sua
                família. Com mais de 60 anos construindo Curitiba, a Casteval
                está aqui para tornar esse processo tranquilo, transparente e
                sem surpresas - do primeiro contato até a entrega das chaves.
              </p>
            </div>
          </div>
        </section>

        {/* Próximos passos */}
        <section className="bg-surface-0 py-16 md:py-24 px-5">
          <div className="mx-auto max-w-[1200px]">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-ink-900 mb-12 max-w-[20ch]">
              Próximos Passos
            </h2>

            <ol className="grid gap-0 border-t border-line-100">
              {STEPS.map((step, index) => (
                <li
                  key={step.n}
                  className={`grid gap-4 md:grid-cols-[88px_1fr] md:gap-10 py-8 md:py-10 border-b border-line-100 ${
                    index === 1 ? "md:pl-16" : index === 2 ? "md:pl-8" : ""
                  }`}
                >
                  <span className="text-3xl md:text-4xl font-bold text-brand-gold tracking-tighter leading-none">
                    {step.n}
                  </span>
                  <div className="max-w-[54ch]">
                    <h3 className="text-xl md:text-2xl font-bold text-ink-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-body-l text-ink-500 leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Depoimento */}
        <section className="bg-secondary text-white py-16 md:py-24 px-5">
          <div className="mx-auto max-w-[900px] text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-10">
              Você Vai Gostar do Que Vem Por Aí
            </h2>
            <blockquote className="text-lg md:text-xl leading-relaxed text-white/90 font-medium">
              “Achar um imóvel estava sendo tão desgastante que entrar em
              contato direto com a Casteval foi uma última tentativa. O
              processo foi tão rápido que ainda nem absorvi a ideia, mas se eu
              soubesse que seria tão tranquilo, teria sido minha primeira
              opção. É muito satisfatório ser bem atendido.”
            </blockquote>
            <p className="mt-8 text-body-s font-semibold tracking-button uppercase text-brand-gold">
              O atendimento virou parte fundamental da experiência de compra.
            </p>
          </div>
        </section>

        {/* CTA WhatsApp */}
        <section className="bg-[#F6F7F8] py-16 md:py-20 px-5">
          <div className="mx-auto max-w-[720px] text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-ink-900 mb-4">
              Fale Agora pelo WhatsApp
            </h2>
            <p className="text-body-l text-ink-500 mb-8 max-w-[42ch] mx-auto">
              Prefere falar agora? Nossa equipe está pronta para continuar o
              atendimento pelo WhatsApp.
            </p>
            <Button
              type="button"
              size="lg"
              onClick={openWhatsApp}
              className="bg-[#25D366] hover:bg-[#1ebe57] text-white shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
              FALAR NO WHATSAPP
            </Button>
            <p className="mt-10 text-body-s text-ink-500">
              Alguma dúvida? Fale com nosso suporte:{" "}
              <a
                href="mailto:contato@casteval.com.br"
                className="font-semibold text-ink-900 underline-offset-4 hover:underline"
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

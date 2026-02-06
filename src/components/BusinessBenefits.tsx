import { MapPin, Building2, Zap, Headphones } from "lucide-react";

const benefits = [
  {
    icon: MapPin,
    title: "Localização estratégica",
    description: "Pontos privilegiados da cidade com fácil acesso e visibilidade."
  },
  {
    icon: Building2,
    title: "Estrutura moderna",
    description: "Ambientes planejados com tecnologia e infraestrutura completa."
  },
  {
    icon: Zap,
    title: "Flexibilidade de locação",
    description: "Contratos adaptáveis às necessidades do seu negócio."
  },
  {
    icon: Headphones,
    title: "Suporte completo",
    description: "Atendimento especializado e gestão de facilidades."
  }
];

export const BusinessBenefits = () => {
  return (
    <section className="mobile:py-40 desktop:py-56 bg-surface-0">
      <div className="container mx-auto max-w-container mobile:px-16 desktop:px-24">
        <div className="text-center mb-32">
          <h2 className="text-h2 font-bold text-ink-800 mb-6">
            Por que escolher a Casteval Business?
          </h2>
          <p className="text-body-l text-ink-600 max-w-[600px] mx-auto">
            Oferecemos mais que espaços comerciais. Criamos ambientes que potencializam o sucesso do seu negócio.
          </p>
        </div>

        <div className="grid mobile:grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4 mobile:gap-24 desktop:gap-32">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary-50 rounded-full flex items-center justify-center">
                <benefit.icon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-h3 font-semibold text-ink-800 mb-4">
                {benefit.title}
              </h3>
              <p className="text-body-s text-ink-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
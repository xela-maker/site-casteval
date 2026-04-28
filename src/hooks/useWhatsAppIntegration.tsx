import { useConfig } from "./useConfig";
import { requestWhatsAppLeadOpen } from "@/lib/whatsappLeadGate";

export const useWhatsAppIntegration = () => {
  const { data: config } = useConfig();

  const phoneNumber = config?.whatsapp_numero || "5541999999999";

  const messages = {
    general: config?.whatsapp_mensagem_padrao || "Olá! Gostaria de conhecer mais sobre os empreendimentos da Casteval.",
    select: config?.whatsapp_msg_select || "Olá! Tenho interesse nos empreendimentos da linha Casteval Select.",
    business: config?.whatsapp_msg_business || "Olá! Gostaria de conhecer as oportunidades de investimento da Casteval Business.",
    consultation: config?.whatsapp_msg_consulta || "Olá! Gostaria de agendar uma consulta com um especialista da Casteval.",
    property: (propertyName: string) => 
      `Olá! Tenho interesse no empreendimento ${propertyName}. Poderia me enviar mais informações?`,
    visit: (propertyName: string) => 
      `Olá! Gostaria de agendar uma visita ao empreendimento ${propertyName}.`,
    comparison: (properties: string[]) => 
      `Olá! Gostaria de comparar os seguintes empreendimentos: ${properties.join(', ')}. Poderia me ajudar?`,
    investment: (propertyName: string, investment: string) => 
      `Olá! Tenho interesse em investir no ${propertyName}. Valor aproximado: ${investment}. Poderia me enviar mais detalhes?`
  };

  const open = (message: string) => {
    requestWhatsAppLeadOpen({
      phoneNumber,
      message,
    });
  };

  return {
    phoneNumber,
    messages,
    open,
    // Quick access methods
    openGeneral: () => open(messages.general),
    openSelect: () => open(messages.select),
    openBusiness: () => open(messages.business),
    openConsultation: () => open(messages.consultation),
    openForProperty: (propertyName: string) => open(messages.property(propertyName)),
    openForVisit: (propertyName: string) => open(messages.visit(propertyName)),
    openForComparison: (properties: string[]) => open(messages.comparison(properties)),
    openForInvestment: (propertyName: string, investment: string) => 
      open(messages.investment(propertyName, investment))
  };
};

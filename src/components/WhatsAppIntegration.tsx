// WhatsApp Integration Utility
export const WhatsAppIntegration = {
  // Base phone number for all WhatsApp interactions
  phoneNumber: "5541999999999",

  // Generic messages for different contexts
  messages: {
    general: "Olá! Gostaria de conhecer mais sobre os empreendimentos da Casteval.",
    select: "Olá! Tenho interesse nos empreendimentos da linha Casteval Select.",
    business: "Olá! Gostaria de conhecer as oportunidades de investimento da Casteval Business.",
    property: (propertyName: string) => 
      `Olá! Tenho interesse no empreendimento ${propertyName}. Poderia me enviar mais informações?`,
    consultation: "Olá! Gostaria de agendar uma consulta com um especialista da Casteval.",
    visit: (propertyName: string) => 
      `Olá! Gostaria de agendar uma visita ao empreendimento ${propertyName}.`,
    comparison: (properties: string[]) => 
      `Olá! Gostaria de comparar os seguintes empreendimentos: ${properties.join(', ')}. Poderia me ajudar?`,
    investment: (propertyName: string, investment: string) => 
      `Olá! Tenho interesse em investir no ${propertyName}. Valor aproximado: ${investment}. Poderia me enviar mais detalhes?`
  },

  // Open WhatsApp with custom message
  open: (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${WhatsAppIntegration.phoneNumber}?text=${encodedMessage}`;
    window.open(url, '_blank');
  },

  // Quick access methods for common actions
  openGeneral: () => WhatsAppIntegration.open(WhatsAppIntegration.messages.general),
  openSelect: () => WhatsAppIntegration.open(WhatsAppIntegration.messages.select),
  openBusiness: () => WhatsAppIntegration.open(WhatsAppIntegration.messages.business),
  openConsultation: () => WhatsAppIntegration.open(WhatsAppIntegration.messages.consultation),
  
  // Context-specific methods
  openForProperty: (propertyName: string) => 
    WhatsAppIntegration.open(WhatsAppIntegration.messages.property(propertyName)),
  
  openForVisit: (propertyName: string) => 
    WhatsAppIntegration.open(WhatsAppIntegration.messages.visit(propertyName)),
  
  openForComparison: (properties: string[]) => 
    WhatsAppIntegration.open(WhatsAppIntegration.messages.comparison(properties)),
  
  openForInvestment: (propertyName: string, investment: string) => 
    WhatsAppIntegration.open(WhatsAppIntegration.messages.investment(propertyName, investment))
};
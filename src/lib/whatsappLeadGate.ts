export const WHATSAPP_LEAD_OPEN_EVENT = "whatsapp:lead-open";

export interface WhatsAppLeadRequest {
  phoneNumber: string;
  message: string;
}

export const requestWhatsAppLeadOpen = (request: WhatsAppLeadRequest) => {
  window.dispatchEvent(
    new CustomEvent<WhatsAppLeadRequest>(WHATSAPP_LEAD_OPEN_EVENT, {
      detail: request,
    }),
  );
};

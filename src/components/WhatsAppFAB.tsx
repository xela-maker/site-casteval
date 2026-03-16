import { FaWhatsapp } from "react-icons/fa";
import { useWhatsAppIntegration } from "@/hooks/useWhatsAppIntegration";
import { trackWhatsAppClick } from "@/utils/analytics";

export const WhatsAppFAB = () => {
  const whatsapp = useWhatsAppIntegration();

  return (
    <button
      onClick={() => {
        trackWhatsAppClick("fab_general");
        whatsapp.openGeneral();
      }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-success text-white rounded-full shadow-card-rest hover:shadow-card-hover transition-smooth hover:-translate-y-1 focus:outline-none focus:focus-brand"
      aria-label="Falar no WhatsApp"
    >
      <FaWhatsapp className="w-6 h-6 mx-auto" />
    </button>
  );
};
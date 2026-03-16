declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export const trackWhatsAppClick = (source: string) => {
  if (typeof window === "undefined") return;

  const label = source || "unknown";

  if (typeof window.gtag === "function") {
    window.gtag("event", "whatsapp_click", {
      event_category: "engagement",
      event_label: label,
    });
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: "whatsapp_click",
      whatsapp_source: label,
    });
  }
};


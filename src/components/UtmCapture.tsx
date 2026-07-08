import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { captureUtmFromSearch } from "@/lib/utmTracking";

export const UtmCapture = () => {
  const location = useLocation();

  useEffect(() => {
    captureUtmFromSearch(location.search);

    // Garante captura mesmo se o React Router normalizar a URL depois.
    if (typeof window !== "undefined" && window.location.search) {
      captureUtmFromSearch(window.location.search);
    }
  }, [location.search, location.pathname]);

  return null;
};

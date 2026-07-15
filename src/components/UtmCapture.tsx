import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { captureUtmFromLocation, captureUtmFromSearch } from "@/lib/utmTracking";

export const UtmCapture = () => {
  const location = useLocation();

  useEffect(() => {
    captureUtmFromSearch(location.search);
    captureUtmFromLocation();
  }, [location.search, location.pathname, location.hash]);

  // Captura imediata no mount (antes de navegações client-side limparem a query).
  useEffect(() => {
    captureUtmFromLocation();
  }, []);

  return null;
};

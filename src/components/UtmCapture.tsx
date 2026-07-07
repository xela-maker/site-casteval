import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { captureUtmFromSearch } from "@/lib/utmTracking";

export const UtmCapture = () => {
  const location = useLocation();

  useEffect(() => {
    captureUtmFromSearch(location.search);
  }, [location.search]);

  return null;
};

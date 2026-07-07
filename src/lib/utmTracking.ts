export const UTM_STORAGE_KEY = "casteval-utm-params";
export const UTM_PARAM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export type UtmParamKey = (typeof UTM_PARAM_KEYS)[number];
export type UtmParams = Partial<Record<UtmParamKey, string>>;

const isBrowser = () => typeof window !== "undefined";

const readFromSearch = (search: string): UtmParams => {
  const params = new URLSearchParams(search);
  const utm: UtmParams = {};

  for (const key of UTM_PARAM_KEYS) {
    const value = params.get(key)?.trim();
    if (value) {
      utm[key] = value;
    }
  }

  return utm;
};

export const hasUtmParams = (utm: UtmParams) => Object.keys(utm).length > 0;

export const captureUtmFromSearch = (search: string) => {
  if (!isBrowser()) return;

  const incoming = readFromSearch(search);
  if (!hasUtmParams(incoming)) return;

  localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(incoming));
};

export const getStoredUtmParams = (): UtmParams => {
  if (!isBrowser()) return {};

  const raw = localStorage.getItem(UTM_STORAGE_KEY);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as UtmParams;
    const sanitized: UtmParams = {};

    for (const key of UTM_PARAM_KEYS) {
      const value = parsed[key]?.trim();
      if (value) sanitized[key] = value;
    }

    return sanitized;
  } catch {
    return {};
  }
};

export const formatUtmForMessage = (utm: UtmParams) => {
  if (!hasUtmParams(utm)) return "";

  const lines = UTM_PARAM_KEYS
    .filter((key) => utm[key])
    .map((key) => `${key}: ${utm[key]}`);

  return `\n\n--- Rastreamento UTM ---\n${lines.join("\n")}`;
};

export const utmParamsToRecord = (utm: UtmParams) => ({
  utm_source: utm.utm_source || null,
  utm_medium: utm.utm_medium || null,
  utm_campaign: utm.utm_campaign || null,
  utm_term: utm.utm_term || null,
  utm_content: utm.utm_content || null,
});

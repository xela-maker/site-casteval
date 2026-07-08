export const UTM_STORAGE_KEY = "casteval-utm-params";

export const UTM_PARAM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

/** Parâmetros extras de campanha (Google Ads etc.) */
export const EXTRA_TRACKING_KEYS = [
  "gclid",
  "utm_platform",
  "utm_input",
  "gad_source",
  "gad_campaignid",
  "gbraid",
] as const;

export type UtmParamKey = (typeof UTM_PARAM_KEYS)[number];
export type ExtraTrackingKey = (typeof EXTRA_TRACKING_KEYS)[number];
export type UtmParams = Partial<Record<UtmParamKey | ExtraTrackingKey, string>>;

const ALL_TRACKING_KEYS = [...UTM_PARAM_KEYS, ...EXTRA_TRACKING_KEYS] as const;

const isBrowser = () => typeof window !== "undefined";

const safeDecodeURIComponent = (value: string) => {
  try {
    return decodeURIComponent(value.replace(/\+/g, " "));
  } catch {
    return value;
  }
};

const extractFromParams = (params: URLSearchParams): UtmParams => {
  const utm: UtmParams = {};

  for (const key of ALL_TRACKING_KEYS) {
    const value = params.get(key)?.trim();
    if (value) {
      utm[key] = value;
    }
  }

  return utm;
};

const hasStandardUtm = (utm: UtmParams) =>
  UTM_PARAM_KEYS.some((key) => Boolean(utm[key]));

/**
 * Alguns links do Google Ads chegam com as UTMs inteiras codificadas em um único
 * parâmetro, ex.: ?utm_source%3Dgoogle%26utm_medium%3Dcpc...
 * O URLSearchParams padrão não extrai utm_source nesse caso.
 */
const parseNestedEncodedQuery = (search: string): UtmParams => {
  const raw = search.startsWith("?") ? search.slice(1) : search;
  if (!raw) return {};

  const candidates = new Set<string>();

  for (const segment of raw.split("&")) {
    if (!segment) continue;

    candidates.add(segment);
    candidates.add(safeDecodeURIComponent(segment));

    if (segment.includes("%3D") || segment.includes("%26")) {
      candidates.add(safeDecodeURIComponent(segment));
    }
  }

  // Remove sufixos de redirecionamento do Google (ex.: &ved=...)
  const withoutVed = raw.split(/&ved=/i)[0];
  candidates.add(withoutVed);
  candidates.add(safeDecodeURIComponent(withoutVed));

  for (const candidate of candidates) {
    if (!candidate.includes("utm_source=")) continue;

    const query = candidate.startsWith("?") ? candidate : `?${candidate}`;
    const parsed = extractFromParams(new URLSearchParams(query));
    if (hasStandardUtm(parsed)) {
      return parsed;
    }
  }

  return {};
};

export const parseUtmFromSearch = (search: string): UtmParams => {
  if (!search) return {};

  const standard = extractFromParams(new URLSearchParams(search));
  if (hasStandardUtm(standard)) {
    return standard;
  }

  return parseNestedEncodedQuery(search);
};

export const hasUtmParams = (utm: UtmParams) => hasStandardUtm(utm);

export const captureUtmFromSearch = (search: string) => {
  if (!isBrowser()) return;

  const incoming = parseUtmFromSearch(search);
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

    for (const key of ALL_TRACKING_KEYS) {
      const value = parsed[key]?.trim();
      if (value) sanitized[key] = value;
    }

    return sanitized;
  } catch {
    return {};
  }
};

export const formatUtmForMessage = (utm: UtmParams) => {
  if (!hasUtmParams(utm) && !EXTRA_TRACKING_KEYS.some((key) => utm[key])) {
    return "";
  }

  const lines = ALL_TRACKING_KEYS
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

export const extraTrackingToPayload = (utm: UtmParams) => ({
  gclid: utm.gclid || null,
  utm_platform: utm.utm_platform || null,
  utm_input: utm.utm_input || null,
  gad_source: utm.gad_source || null,
  gad_campaignid: utm.gad_campaignid || null,
  gbraid: utm.gbraid || null,
});

export const getLeadTrackingFields = () => {
  const utm = getStoredUtmParams();
  return {
    ...utmParamsToRecord(utm),
    ...extraTrackingToPayload(utm),
  };
};

export const getLeadTrackingFieldsForDb = () => utmParamsToRecord(getStoredUtmParams());

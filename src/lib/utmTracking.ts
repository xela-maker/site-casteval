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

const hasAnyTracking = (utm: UtmParams) =>
  ALL_TRACKING_KEYS.some((key) => Boolean(utm[key]));

const mergeUtm = (...parts: UtmParams[]): UtmParams => {
  const merged: UtmParams = {};
  for (const part of parts) {
    for (const key of ALL_TRACKING_KEYS) {
      const value = part[key]?.trim();
      if (value) merged[key] = value;
    }
  }
  return merged;
};

/**
 * Alguns links do Google Ads chegam com as UTMs inteiras codificadas em um único
 * parâmetro, ex.: ?utm_source%3Dgoogle%26utm_medium%3Dcpc...
 * Também comum: ?gclid=xxx&utm_source%3Dgoogle%26utm_medium%3Dcpc (gclid normal + UTM aninhada).
 */
const parseNestedEncodedQuery = (search: string): UtmParams => {
  const raw = search.startsWith("?") ? search.slice(1) : search;
  if (!raw) return {};

  const candidates = new Set<string>();

  for (const segment of raw.split("&")) {
    if (!segment) continue;

    candidates.add(segment);
    candidates.add(safeDecodeURIComponent(segment));

    // chave=valor onde a chave é a query inteira codificada
    const eq = segment.indexOf("=");
    if (eq > 0) {
      const key = segment.slice(0, eq);
      const val = segment.slice(eq + 1);
      candidates.add(safeDecodeURIComponent(key));
      candidates.add(safeDecodeURIComponent(val));
    }

    if (segment.includes("%3D") || segment.includes("%26")) {
      candidates.add(safeDecodeURIComponent(segment));
    }
  }

  const withoutVed = raw.split(/&ved=/i)[0];
  candidates.add(withoutVed);
  candidates.add(safeDecodeURIComponent(withoutVed));

  let best: UtmParams = {};

  for (const candidate of candidates) {
    const looksLikeTracking =
      /utm_source=/i.test(candidate) ||
      /utm_medium=/i.test(candidate) ||
      /utm_campaign=/i.test(candidate) ||
      /gclid=/i.test(candidate);

    if (!looksLikeTracking) continue;

    const query = candidate.startsWith("?") ? candidate : `?${candidate}`;
    const parsed = extractFromParams(new URLSearchParams(query));
    if (hasAnyTracking(parsed)) {
      best = mergeUtm(best, parsed);
    }
  }

  return best;
};

export const parseUtmFromSearch = (search: string): UtmParams => {
  if (!search) return {};

  // Sempre mescla padrão + aninhado — links do Google Ads misturam os dois.
  const standard = extractFromParams(new URLSearchParams(search));
  const nested = parseNestedEncodedQuery(search);
  return mergeUtm(standard, nested);
};

export const parseUtmFromUrl = (urlOrHref: string): UtmParams => {
  if (!urlOrHref) return {};

  try {
    const url = new URL(urlOrHref, isBrowser() ? window.location.origin : "https://casteval.com.br");
    const fromSearch = parseUtmFromSearch(url.search);
    const fromHash = url.hash.includes("=")
      ? parseUtmFromSearch(url.hash.replace(/^#/, "?").replace(/^\?/, "?"))
      : {};
    return mergeUtm(fromSearch, fromHash);
  } catch {
    const q = urlOrHref.includes("?") ? urlOrHref.slice(urlOrHref.indexOf("?")) : urlOrHref;
    return parseUtmFromSearch(q);
  }
};

export const hasUtmParams = (utm: UtmParams) => hasAnyTracking(utm);

/**
 * Captura tags da URL e persiste no localStorage.
 * - Salva UTMs padrão e extras (gclid, gad_*, etc.)
 * - Faz merge: mantém tags já salvas e atualiza as que vierem na URL nova
 */
export const captureUtmFromSearch = (search: string) => {
  if (!isBrowser()) return;

  const incoming = parseUtmFromSearch(search);
  if (!hasAnyTracking(incoming)) return;

  const existing = getStoredUtmParams();
  const merged = mergeUtm(existing, incoming);

  localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(merged));
};

export const captureUtmFromLocation = () => {
  if (!isBrowser()) return;

  const fromHref = parseUtmFromUrl(window.location.href);
  const fromSearch = parseUtmFromSearch(window.location.search);
  const incoming = mergeUtm(fromSearch, fromHref);

  if (!hasAnyTracking(incoming)) return;

  const existing = getStoredUtmParams();
  localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(mergeUtm(existing, incoming)));
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
  if (!hasAnyTracking(utm)) {
    return "";
  }

  const lines = ALL_TRACKING_KEYS
    .filter((key) => utm[key])
    .map((key) => `${key}: ${utm[key]}`);

  return `\n\n--- Rastreamento UTM ---\n${lines.join("\n")}`;
};

/** Texto curto para o campo oficial `anuncio` da API Vista/Loft. */
export const formatUtmForAnuncio = (utm: UtmParams) => {
  if (!hasAnyTracking(utm)) return "";

  const parts = [
    utm.utm_source && `source=${utm.utm_source}`,
    utm.utm_medium && `medium=${utm.utm_medium}`,
    utm.utm_campaign && `campaign=${utm.utm_campaign}`,
    utm.utm_term && `term=${utm.utm_term}`,
    utm.utm_content && `content=${utm.utm_content}`,
    utm.gclid && `gclid=${utm.gclid}`,
  ].filter(Boolean);

  return parts.join(" | ");
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
  // Re-captura da URL atual caso o localStorage ainda esteja vazio.
  captureUtmFromLocation();

  const utm = getStoredUtmParams();
  return {
    ...utmParamsToRecord(utm),
    ...extraTrackingToPayload(utm),
  };
};

/** Colunas UTM da tabela st_contatos (só as 5 padrão). */
export const getLeadTrackingFieldsForDb = () => {
  captureUtmFromLocation();
  return utmParamsToRecord(getStoredUtmParams());
};

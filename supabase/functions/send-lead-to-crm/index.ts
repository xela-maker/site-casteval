import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LeadPayload {
  contato_id?: string | null;
  nome: string;
  email: string;
  telefone?: string | null;
  mensagem?: string | null;
  interesse?: string | null;
  origem?: string | null;
  url_origem?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  gclid?: string | null;
  utm_platform?: string | null;
  utm_input?: string | null;
  gad_source?: string | null;
  gad_campaignid?: string | null;
  gbraid?: string | null;
}

type TrackingKey =
  | "utm_source"
  | "utm_medium"
  | "utm_campaign"
  | "utm_term"
  | "utm_content"
  | "gclid"
  | "utm_platform"
  | "utm_input"
  | "gad_source"
  | "gad_campaignid"
  | "gbraid";

const TRACKING_KEYS: TrackingKey[] = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "utm_platform",
  "utm_input",
  "gad_source",
  "gad_campaignid",
  "gbraid",
];

const ORIGEM_VEICULO: Record<string, string> = {
  whatsapp_modal: "WhatsApp - Site Casteval",
  empreendimento_interesse_form: "Empreendimento - Site Casteval",
  contato_form: "Contato - Site Casteval",
};

const buildEndpoint = () => {
  const baseUrl = (Deno.env.get("CRM_BASE_URL") || "https://cli43769-rest.vistahost.com.br").replace(/\/$/, "");
  const apiKey = Deno.env.get("CRM_API_KEY");
  if (!apiKey) {
    throw new Error("CRM_API_KEY não configurada");
  }

  const leadPath = Deno.env.get("CRM_LEAD_PATH") || "/lead";
  return { baseUrl, apiKey, endpoint: `${baseUrl}${leadPath}?key=${encodeURIComponent(apiKey)}` };
};

const safeDecode = (value: string) => {
  try {
    return decodeURIComponent(value.replace(/\+/g, " "));
  } catch {
    return value;
  }
};

const extractTrackingFromParams = (params: URLSearchParams): Partial<Record<TrackingKey, string>> => {
  const out: Partial<Record<TrackingKey, string>> = {};
  for (const key of TRACKING_KEYS) {
    const value = params.get(key)?.trim();
    if (value) out[key] = value;
  }
  return out;
};

const parseNestedTracking = (search: string): Partial<Record<TrackingKey, string>> => {
  const raw = search.startsWith("?") ? search.slice(1) : search;
  if (!raw) return {};

  const candidates = new Set<string>();
  for (const segment of raw.split("&")) {
    if (!segment) continue;
    candidates.add(segment);
    candidates.add(safeDecode(segment));
    const eq = segment.indexOf("=");
    if (eq > 0) {
      candidates.add(safeDecode(segment.slice(0, eq)));
      candidates.add(safeDecode(segment.slice(eq + 1)));
    }
  }

  let best: Partial<Record<TrackingKey, string>> = {};
  for (const candidate of candidates) {
    if (!/utm_source=|utm_medium=|utm_campaign=|gclid=/i.test(candidate)) continue;
    const query = candidate.startsWith("?") ? candidate : `?${candidate}`;
    const parsed = extractTrackingFromParams(new URLSearchParams(query));
    best = { ...best, ...parsed };
  }
  return best;
};

const parseTrackingFromUrl = (urlOrHref?: string | null): Partial<Record<TrackingKey, string>> => {
  if (!urlOrHref) return {};
  try {
    const url = new URL(urlOrHref);
    const standard = extractTrackingFromParams(new URLSearchParams(url.search));
    const nested = parseNestedTracking(url.search);
    return { ...standard, ...nested };
  } catch {
    const q = urlOrHref.includes("?") ? urlOrHref.slice(urlOrHref.indexOf("?")) : "";
    return {
      ...extractTrackingFromParams(new URLSearchParams(q)),
      ...parseNestedTracking(q),
    };
  }
};

const getTrackingEntries = (lead: LeadPayload) =>
  TRACKING_KEYS
    .map((key) => [key, lead[key]] as const)
    .filter(([, value]) => Boolean(value && String(value).trim()));

const hasTracking = (lead: LeadPayload) => getTrackingEntries(lead).length > 0;

const formatAnuncio = (lead: LeadPayload) => {
  const parts = [
    lead.utm_source && `source=${lead.utm_source}`,
    lead.utm_medium && `medium=${lead.utm_medium}`,
    lead.utm_campaign && `campaign=${lead.utm_campaign}`,
    lead.utm_term && `term=${lead.utm_term}`,
    lead.utm_content && `content=${lead.utm_content}`,
    lead.gclid && `gclid=${lead.gclid}`,
  ].filter(Boolean);

  return parts.join(" | ");
};

const appendUtmToMessage = (lead: LeadPayload, mensagemParts: string[]) => {
  const trackingEntries = getTrackingEntries(lead);
  if (trackingEntries.length === 0) return;

  mensagemParts.push(
    "--- Rastreamento UTM ---",
    ...trackingEntries.map(([key, value]) => `${key}: ${value}`),
  );
};

/**
 * Remove o código do país (+55) quando o número chega completo. Só remove se
 * sobrar um número nacional válido, para preservar o DDD 55 (Santa Maria/RS).
 */
const normalizePhoneDigits = (phone?: string | null) => {
  let digits = (phone || "").replace(/\D/g, "");

  if (digits.length > 11 && digits.startsWith("55")) {
    digits = digits.slice(2);
  }

  return digits.slice(0, 11);
};

const formatFoneForVista = (phone?: string | null) => {
  const digits = normalizePhoneDigits(phone);
  if (digits.length < 10) return "";

  if (digits.length === 10) {
    return `${digits.slice(0, 2)} ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `${digits.slice(0, 2)} ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};

/**
 * A API Vista /lead só reconhece campos oficiais (nome, fone, email, mensagem,
 * veiculo, anuncio, interesse...). Campos utm_* soltos são IGNORADOS.
 * Por isso as tags vão em `anuncio` + `mensagem`.
 */
const buildLeadFields = (lead: LeadPayload) => {
  const mensagemParts = [lead.mensagem || ""];
  if (lead.url_origem) {
    mensagemParts.push(`URL: ${lead.url_origem}`);
  }
  appendUtmToMessage(lead, mensagemParts);

  const origem = lead.origem || "site-casteval";
  const fone = formatFoneForVista(lead.telefone);
  const anuncio = formatAnuncio(lead);

  const leadFields: Record<string, string> = {
    nome: lead.nome,
    email: lead.email,
    mensagem: mensagemParts.filter(Boolean).join("\n"),
    veiculo: ORIGEM_VEICULO[origem] || "Site Casteval",
    interesse: lead.interesse || "",
  };

  if (fone) {
    leadFields.fone = fone;
  }

  // Campo oficial da Vista para origem/campanha do anúncio
  if (anuncio) {
    leadFields.anuncio = anuncio;
  }

  return leadFields;
};

const sendLeadToVista = async (endpoint: string, leadFields: ReturnType<typeof buildLeadFields>) => {
  const wrappedCadastro = { lead: leadFields };
  const formBody = `cadastro=${encodeURIComponent(JSON.stringify(wrappedCadastro))}`;

  console.log("CRM lead fields:", JSON.stringify(leadFields));

  const formResponse = await fetch(endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formBody,
  });

  const formRawBody = await formResponse.text();
  if (formResponse.ok) {
    return { ok: true as const, status: formResponse.status, rawBody: formRawBody, strategy: "form-lead-wrapper" };
  }

  console.error("CRM form-lead-wrapper falhou:", formResponse.status, formRawBody);

  const jsonResponse = await fetch(endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cadastro: leadFields }),
  });

  const jsonRawBody = await jsonResponse.text();
  if (jsonResponse.ok) {
    return { ok: true as const, status: jsonResponse.status, rawBody: jsonRawBody, strategy: "json-flat-cadastro" };
  }

  console.error("CRM json-flat-cadastro falhou:", jsonResponse.status, jsonRawBody);

  return {
    ok: false as const,
    status: jsonResponse.status,
    rawBody: jsonRawBody || formRawBody,
    strategy: "json-flat-cadastro",
  };
};

const getAdminClient = () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey);
};

const updateContatoCrmStatus = async (
  contatoId: string,
  status: "success" | "error",
  erro?: string,
) => {
  const admin = getAdminClient();
  if (!admin) {
    console.error("Supabase admin client indisponível para atualizar crm_status");
    return;
  }

  const { error } = await admin
    .from("st_contatos")
    .update({
      crm_status: status,
      crm_enviado_em: new Date().toISOString(),
      crm_erro: erro ? erro.slice(0, 1000) : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", contatoId);

  if (error) {
    console.error("Erro ao atualizar crm_status do contato:", error);
  }
};

const resolveContato = async (lead: LeadPayload) => {
  const admin = getAdminClient();
  if (!admin) return null;

  if (lead.contato_id) {
    const { data, error } = await admin
      .from("st_contatos")
      .select("id, utm_source, utm_medium, utm_campaign, utm_term, utm_content, url_origem")
      .eq("id", lead.contato_id)
      .maybeSingle();

    if (error) {
      console.error("Erro ao buscar contato por id:", error);
      return null;
    }
    return data;
  }

  if (!lead.email) return null;

  let query = admin
    .from("st_contatos")
    .select("id, utm_source, utm_medium, utm_campaign, utm_term, utm_content, url_origem")
    .eq("email", lead.email)
    .order("created_at", { ascending: false })
    .limit(1);

  if (lead.nome) {
    query = query.eq("nome", lead.nome);
  }

  if (lead.origem) {
    query = query.eq("origem", lead.origem);
  }

  const { data, error } = await query.maybeSingle();
  if (error) {
    console.error("Erro ao localizar contato para atualizar crm_status:", error);
    return null;
  }

  return data;
};

/** Completa UTMs faltantes a partir do banco e da url_origem. */
const enrichLeadTracking = (
  lead: LeadPayload,
  contato: {
    utm_source?: string | null;
    utm_medium?: string | null;
    utm_campaign?: string | null;
    utm_term?: string | null;
    utm_content?: string | null;
    url_origem?: string | null;
  } | null,
): LeadPayload => {
  const enriched: LeadPayload = { ...lead };

  if (contato) {
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const) {
      if (!enriched[key] && contato[key]) {
        enriched[key] = contato[key];
      }
    }
    if (!enriched.url_origem && contato.url_origem) {
      enriched.url_origem = contato.url_origem;
    }
  }

  if (!hasTracking(enriched)) {
    const fromUrl = parseTrackingFromUrl(enriched.url_origem);
    for (const key of TRACKING_KEYS) {
      if (!enriched[key] && fromUrl[key]) {
        enriched[key] = fromUrl[key];
      }
    }
  }

  return enriched;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método não permitido" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let lead: LeadPayload | null = null;

  try {
    lead = (await req.json()) as LeadPayload;
    if (!lead?.nome || !lead?.email) {
      throw new Error("Payload inválido: nome e email são obrigatórios");
    }

    const contato = await resolveContato(lead);
    const contatoId = contato?.id ?? null;
    lead = enrichLeadTracking(lead, contato);

    const { endpoint } = buildEndpoint();
    const leadFields = buildLeadFields(lead);
    const result = await sendLeadToVista(endpoint, leadFields);

    if (!result.ok) {
      if (contatoId) {
        await updateContatoCrmStatus(contatoId, "error", result.rawBody);
      }

      return new Response(
        JSON.stringify({
          success: false,
          status: result.status,
          error: "Falha ao enviar lead para o CRM",
          details: result.rawBody,
          strategy: result.strategy,
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (contatoId) {
      await updateContatoCrmStatus(contatoId, "success");
    }

    return new Response(
      JSON.stringify({
        success: true,
        strategy: result.strategy,
        crm_response: result.rawBody,
        contato_id: contatoId,
        tracking_sent: hasTracking(lead),
        anuncio: leadFields.anuncio || null,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";

    if (lead) {
      const contato = await resolveContato(lead);
      if (contato?.id) {
        await updateContatoCrmStatus(contato.id, "error", message);
      }
    }

    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

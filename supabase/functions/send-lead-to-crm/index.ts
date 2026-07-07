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
}

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

const appendUtmToMessage = (lead: LeadPayload, mensagemParts: string[]) => {
  const utmEntries = [
    ["utm_source", lead.utm_source],
    ["utm_medium", lead.utm_medium],
    ["utm_campaign", lead.utm_campaign],
    ["utm_term", lead.utm_term],
    ["utm_content", lead.utm_content],
  ].filter(([, value]) => value);

  if (utmEntries.length === 0) return;

  mensagemParts.push(
    "--- Rastreamento UTM ---",
    ...utmEntries.map(([key, value]) => `${key}: ${value}`),
  );
};

const buildLeadFields = (lead: LeadPayload) => {
  const mensagemParts = [lead.mensagem || ""];
  if (lead.url_origem) {
    mensagemParts.push(`URL: ${lead.url_origem}`);
  }
  appendUtmToMessage(lead, mensagemParts);

  const origem = lead.origem || "site-casteval";

  return {
    nome: lead.nome,
    email: lead.email,
    fone: lead.telefone || "",
    mensagem: mensagemParts.filter(Boolean).join("\n"),
    veiculo: ORIGEM_VEICULO[origem] || "Site Casteval",
    interesse: lead.interesse || "",
    utm_source: lead.utm_source || "",
    utm_medium: lead.utm_medium || "",
    utm_campaign: lead.utm_campaign || "",
    utm_term: lead.utm_term || "",
    utm_content: lead.utm_content || "",
  };
};

const sendLeadToVista = async (endpoint: string, leadFields: ReturnType<typeof buildLeadFields>) => {
  const wrappedCadastro = { lead: leadFields };
  const formBody = `cadastro=${encodeURIComponent(JSON.stringify(wrappedCadastro))}`;

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

  try {
    const lead = (await req.json()) as LeadPayload;
    if (!lead?.nome || !lead?.email) {
      throw new Error("Payload inválido: nome e email são obrigatórios");
    }

    const { endpoint } = buildEndpoint();
    const leadFields = buildLeadFields(lead);
    const result = await sendLeadToVista(endpoint, leadFields);

    if (!result.ok) {
      if (lead.contato_id) {
        await updateContatoCrmStatus(lead.contato_id, "error", result.rawBody);
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

    if (lead.contato_id) {
      await updateContatoCrmStatus(lead.contato_id, "success");
    }

    return new Response(
      JSON.stringify({
        success: true,
        strategy: result.strategy,
        crm_response: result.rawBody,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

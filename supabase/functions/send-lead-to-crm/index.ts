const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LeadPayload {
  nome: string;
  email: string;
  telefone?: string | null;
  mensagem?: string | null;
  interesse?: string | null;
  origem?: string | null;
  url_origem?: string | null;
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

  const leadPath = Deno.env.get("CRM_LEAD_PATH") || "/lead/site";
  return `${baseUrl}${leadPath}?key=${encodeURIComponent(apiKey)}`;
};

const buildCrmPayload = (lead: LeadPayload) => {
  const mensagemParts = [lead.mensagem || ""];
  if (lead.url_origem) {
    mensagemParts.push(`URL: ${lead.url_origem}`);
  }

  const origem = lead.origem || "site-casteval";

  return {
    cadastro: {
      lead: {
        nome: lead.nome,
        email: lead.email,
        fone: lead.telefone || "",
        mensagem: mensagemParts.filter(Boolean).join("\n"),
        veiculo: ORIGEM_VEICULO[origem] || "Site Casteval",
        interesse: lead.interesse || "",
      },
    },
  };
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

    const endpoint = buildEndpoint();
    const crmPayload = buildCrmPayload(lead);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(crmPayload),
    });

    const rawBody = await response.text();
    if (!response.ok) {
      console.error("Erro CRM Loft:", response.status, rawBody);
      return new Response(
        JSON.stringify({
          success: false,
          status: response.status,
          error: "Falha ao enviar lead para o CRM",
          details: rawBody,
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        crm_response: rawBody,
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

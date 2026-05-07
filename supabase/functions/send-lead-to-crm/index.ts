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

const buildEndpoint = () => {
  const baseUrl = (Deno.env.get("CRM_BASE_URL") || "https://cli43769-rest.vistahost.com.br").replace(/\/$/, "");
  const apiKey = Deno.env.get("CRM_API_KEY");
  if (!apiKey) {
    throw new Error("CRM_API_KEY não configurada");
  }

  return `${baseUrl}/negocios/cadastrar?key=${encodeURIComponent(apiKey)}`;
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

    const crmPayload = {
      nome: lead.nome,
      email: lead.email,
      telefone: lead.telefone || "",
      mensagem: lead.mensagem || "",
      interesse: lead.interesse || "",
      origem: lead.origem || "site-casteval",
      url_origem: lead.url_origem || "",
    };

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

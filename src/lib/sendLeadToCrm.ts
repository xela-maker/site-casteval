import { supabase } from "@/integrations/supabase/client";
import { getEdgeFunctionErrorMessage } from "@/utils/supabaseEdgeError";

export interface LeadCrmPayload {
  contato_id?: string | null;
  nome: string;
  email: string;
  telefone?: string | null;
  mensagem?: string | null;
  interesse?: string | null;
  origem?: string | null;
  url_origem?: string | null;
}

async function persistCrmStatus(
  contatoId: string,
  status: "success" | "error",
  erro?: string,
) {
  const { error } = await supabase
    .from("st_contatos")
    .update({
      crm_status: status,
      crm_enviado_em: new Date().toISOString(),
      crm_erro: erro ? erro.slice(0, 1000) : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", contatoId);

  if (error) {
    console.error("Falha ao salvar crm_status localmente:", error);
  }
}

export async function sendLeadToCrm(payload: LeadCrmPayload): Promise<boolean> {
  const { data, error } = await supabase.functions.invoke("send-lead-to-crm", {
    body: payload,
  });

  if (error) {
    const message = await getEdgeFunctionErrorMessage(error);
    console.error("Erro ao enviar lead para o CRM:", message, error);
    if (payload.contato_id) {
      await persistCrmStatus(payload.contato_id, "error", message);
    }
    return false;
  }

  if (data && typeof data === "object" && "success" in data && data.success === false) {
    const details = "details" in data ? String(data.details) : "CRM rejeitou o lead";
    console.error("CRM rejeitou o lead:", data);
    if (payload.contato_id) {
      await persistCrmStatus(payload.contato_id, "error", details);
    }
    return false;
  }

  if (payload.contato_id) {
    await persistCrmStatus(payload.contato_id, "success");
  }

  return true;
}

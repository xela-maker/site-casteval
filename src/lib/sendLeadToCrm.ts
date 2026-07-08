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
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
}

export async function sendLeadToCrm(payload: LeadCrmPayload): Promise<boolean> {
  const { data, error } = await supabase.functions.invoke("send-lead-to-crm", {
    body: payload,
  });

  if (error) {
    const message = await getEdgeFunctionErrorMessage(error);
    console.error("Erro ao enviar lead para o CRM:", message, error);
    return false;
  }

  if (data && typeof data === "object" && "success" in data && data.success === false) {
    console.error("CRM rejeitou o lead:", data);
    return false;
  }

  return true;
}

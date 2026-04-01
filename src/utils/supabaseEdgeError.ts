/**
 * Lê o JSON `{ error: "..." }` devolvido pelas Edge Functions em 4xx.
 * Sem isso, o toast mostra só "Edge Function returned a non-2xx status code".
 */
export async function getEdgeFunctionErrorMessage(error: unknown): Promise<string> {
  if (error && typeof error === "object" && "context" in error) {
    const ctx = (error as { context?: Response }).context;
    if (ctx && typeof ctx.clone === "function") {
      try {
        const body = await ctx.clone().json();
        if (body && typeof body === "object" && body.error != null) {
          return String(body.error);
        }
      } catch {
        /* ignore */
      }
    }
  }
  if (error instanceof Error) return error.message;
  return "Erro ao chamar a função no servidor";
}

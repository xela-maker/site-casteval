import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { trackFormSubmit } from "@/utils/analytics";
import {
  WHATSAPP_LEAD_OPEN_EVENT,
  WhatsAppLeadRequest,
} from "@/lib/whatsappLeadGate";
import { sendLeadToCrm } from "@/lib/sendLeadToCrm";
import { getLeadTrackingFields, getLeadTrackingFieldsForDb } from "@/lib/utmTracking";
import { formatPhoneMask, getPhoneDigits } from "@/lib/phoneUtils";
import { Loader2, MessageCircle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeadFormData {
  name: string;
  email: string;
  phone: string;
}

const STORAGE_KEY = "whatsapp-lead-data";

const emptyForm: LeadFormData = {
  name: "",
  email: "",
  phone: "",
};

export const WhatsAppLeadCaptureModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [request, setRequest] = useState<WhatsAppLeadRequest | null>(null);
  const [formData, setFormData] = useState<LeadFormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as Partial<LeadFormData>;
      setFormData({
        name: parsed.name || "",
        email: parsed.email || "",
        phone: parsed.phone || "",
      });
    } catch {
      // Ignore invalid local storage payload.
    }
  }, []);

  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<WhatsAppLeadRequest>;
      setRequest(customEvent.detail);
      setErrors({});
      setIsOpen(true);
    };

    window.addEventListener(WHATSAPP_LEAD_OPEN_EVENT, handler);
    return () => {
      window.removeEventListener(WHATSAPP_LEAD_OPEN_EVENT, handler);
    };
  }, []);

  const phoneDigits = useMemo(
    () => getPhoneDigits(formData.phone),
    [formData.phone],
  );

  const validate = () => {
    const newErrors: Partial<Record<keyof LeadFormData, string>> = {};

    if (formData.name.trim().length < 2) {
      newErrors.name = "Informe um nome valido.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Informe um e-mail valido.";
    }

    if (phoneDigits.length < 10) {
      newErrors.phone = "Informe um telefone valido com DDD.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!request || !validate() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const trimmedName = formData.name.trim();
      const trimmedEmail = formData.email.trim();
      const leadPrefix = `Nome: ${trimmedName}\nE-mail: ${trimmedEmail}\nTelefone: ${phoneDigits}`;
      const message = `${leadPrefix}\n\n${request.message}`;
      const url = `https://wa.me/${request.phoneNumber}?text=${encodeURIComponent(message)}`;

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          phone: phoneDigits,
        }),
      );

      const utmFields = getLeadTrackingFieldsForDb();
      const crmTracking = getLeadTrackingFields();

      const { error } = await supabase.from("st_contatos").insert({
        nome: trimmedName,
        email: trimmedEmail,
        telefone: phoneDigits,
        interesse: "WhatsApp",
        mensagem: request.message,
        status: "novo",
        origem: "whatsapp_modal",
        url_origem: window.location.href,
        crm_status: "pending",
        ...utmFields,
      });

      if (error) {
        console.error("Erro ao salvar lead da modal de WhatsApp:", error);
      } else {
        await sendLeadToCrm({
          nome: trimmedName,
          email: trimmedEmail,
          telefone: phoneDigits,
          mensagem: request.message,
          interesse: "WhatsApp",
          origem: "whatsapp_modal",
          url_origem: window.location.href,
          ...crmTracking,
        });
      }

      trackFormSubmit("whatsapp_lead_modal");
      window.open(url, "_blank");
      setIsOpen(false);
      setRequest(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className={cn(
          "flex max-h-[min(90dvh,680px)] w-[calc(100%-1.5rem)] max-w-md flex-col gap-0 overflow-hidden p-0",
          "border-neutral-200/80 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.35)] sm:rounded-2xl",
        )}
      >
        <div className="h-1 shrink-0 bg-gradient-to-r from-[#F5B321] via-[#FFCC4D] to-[#F5B321]" />

        <DialogHeader className="shrink-0 space-y-2 border-b border-neutral-100 bg-neutral-50/80 px-5 pb-4 pt-5 text-left sm:px-6">
          <div className="flex items-start gap-3 pr-6">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366]/12 text-[#1DA851]">
              <MessageCircle className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0 space-y-1.5">
              <DialogTitle className="text-lg font-semibold leading-snug text-neutral-900">
                Antes de continuar para o WhatsApp
              </DialogTitle>
              <DialogDescription className="text-sm leading-relaxed text-neutral-600">
                Preencha seus dados para que nosso time consiga te atender melhor.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={handleSubmit}
        >
          <div
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-6"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {request?.message ? (
              <div className="mb-4 rounded-xl border border-neutral-200/80 bg-neutral-50 px-3.5 py-3">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
                  Sua mensagem
                </p>
                <p className="line-clamp-4 text-sm leading-relaxed text-neutral-700">
                  {request.message}
                </p>
              </div>
            ) : null}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="whatsapp-lead-name" className="text-neutral-800">
                  Nome
                </Label>
                <Input
                  id="whatsapp-lead-name"
                  value={formData.name}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, name: event.target.value }))
                  }
                  placeholder="Seu nome completo"
                  autoComplete="name"
                  className="h-11 border-neutral-200 bg-white"
                />
                {errors.name ? (
                  <p className="text-xs text-destructive">{errors.name}</p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="whatsapp-lead-email" className="text-neutral-800">
                  E-mail
                </Label>
                <Input
                  id="whatsapp-lead-email"
                  type="email"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, email: event.target.value }))
                  }
                  placeholder="voce@exemplo.com"
                  autoComplete="email"
                  inputMode="email"
                  className="h-11 border-neutral-200 bg-white"
                />
                {errors.email ? (
                  <p className="text-xs text-destructive">{errors.email}</p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="whatsapp-lead-phone" className="text-neutral-800">
                  Telefone
                </Label>
                <Input
                  id="whatsapp-lead-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      phone: formatPhoneMask(event.target.value),
                    }))
                  }
                  placeholder="(00) 00000-0000"
                  autoComplete="tel"
                  inputMode="tel"
                  className="h-11 border-neutral-200 bg-white"
                />
                {errors.phone ? (
                  <p className="text-xs text-destructive">{errors.phone}</p>
                ) : null}
              </div>
            </div>

            <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-neutral-500">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#F5B321]" aria-hidden />
              Seus dados sao usados apenas para contato sobre o imovel de interesse.
            </p>
          </div>

          <DialogFooter
            className={cn(
              "shrink-0 border-t border-neutral-100 bg-white px-5 py-4 sm:px-6",
              "pb-[max(1rem,env(safe-area-inset-bottom))]",
            )}
          >
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-full bg-[#25D366] text-sm font-semibold tracking-wide text-white shadow-[0_8px_24px_-8px_rgba(37,211,102,0.65)] transition hover:bg-[#1fb85a] hover:shadow-[0_12px_28px_-8px_rgba(37,211,102,0.75)]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Ir para o WhatsApp
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

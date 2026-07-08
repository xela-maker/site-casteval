import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

const fieldClassName = cn(
  "h-12 rounded-lg border-line-100 bg-surface-0 text-ink-800 shadow-none",
  "placeholder:text-ink-500/55",
  "transition-smooth",
  "focus-visible:border-brand-gold focus-visible:ring-2 focus-visible:ring-brand-gold/20",
);

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
      newErrors.name = "Informe um nome válido.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Informe um e-mail válido.";
    }

    if (phoneDigits.length < 10) {
      newErrors.phone = "Informe um telefone válido com DDD.";
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
          "!flex max-h-[min(90dvh,700px)] w-[calc(100%-1.5rem)] max-w-[440px] !flex-col gap-0 overflow-hidden p-0",
          "border-line-100 bg-surface-0 shadow-card-hover sm:rounded-card",
          "[&>button]:right-5 [&>button]:top-5 [&>button]:rounded-full [&>button]:p-1.5",
          "[&>button]:text-white/70 [&>button]:hover:bg-white/10 [&>button]:hover:text-white",
          "[&>button]:focus:ring-brand-gold/40",
        )}
      >
        <div className="relative shrink-0 overflow-hidden bg-brand-charcoal px-6 pb-6 pt-7 sm:px-7">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-brand-gold/25 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent"
          />

          <DialogHeader className="relative space-y-3 text-left">
            <p className="text-caption font-semibold uppercase tracking-overline text-brand-gold">
              Atendimento exclusivo
            </p>

            <div className="flex items-start gap-4 pr-8">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand-gold/35 bg-brand-gold/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <MessageCircle className="h-5 w-5 text-brand-gold" aria-hidden />
              </span>

              <div className="min-w-0 space-y-2">
                <DialogTitle className="font-heading text-h5 font-bold leading-snug text-white">
                  Antes de continuar para o WhatsApp
                </DialogTitle>
                <DialogDescription className="text-body-s leading-relaxed text-white/65">
                  Preencha seus dados para que nosso time consiga te atender com agilidade.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <div
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-gradient-to-b from-surface-0 to-surface-50 px-6 py-5 sm:px-7"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {request?.message ? (
              <div className="mb-5 rounded-r-lg border-l-[3px] border-brand-gold bg-white/80 py-3.5 pl-4 pr-3 shadow-card-rest backdrop-blur-sm">
                <p className="mb-1.5 text-caption font-semibold uppercase tracking-overline text-ink-500">
                  Sua mensagem
                </p>
                <p className="line-clamp-4 text-body-s leading-relaxed text-ink-700">
                  {request.message}
                </p>
              </div>
            ) : null}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="whatsapp-lead-name"
                  className="text-caption font-semibold uppercase tracking-overline text-ink-500"
                >
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
                  className={fieldClassName}
                />
                {errors.name ? (
                  <p className="text-caption text-destructive">{errors.name}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="whatsapp-lead-email"
                  className="text-caption font-semibold uppercase tracking-overline text-ink-500"
                >
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
                  className={fieldClassName}
                />
                {errors.email ? (
                  <p className="text-caption text-destructive">{errors.email}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="whatsapp-lead-phone"
                  className="text-caption font-semibold uppercase tracking-overline text-ink-500"
                >
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
                  className={fieldClassName}
                />
                {errors.phone ? (
                  <p className="text-caption text-destructive">{errors.phone}</p>
                ) : null}
              </div>
            </div>

            <p className="mt-5 flex items-start gap-2.5 text-caption leading-relaxed text-ink-500">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" aria-hidden />
              Seus dados são usados apenas para contato sobre o imóvel de interesse.
            </p>
          </div>

          <div
            className={cn(
              "shrink-0 border-t border-line-100 bg-surface-50/90 px-6 py-5 backdrop-blur-sm sm:px-7",
              "pb-[max(1.25rem,env(safe-area-inset-bottom))]",
            )}
          >
            <Button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "h-12 w-full rounded-pill text-body-s font-bold tracking-button text-white",
                "bg-[#1A9F4B] shadow-[0_8px_24px_-8px_rgba(26,159,75,0.55)]",
                "ring-1 ring-brand-gold/25 transition-smooth",
                "hover:bg-[#158f43] hover:shadow-[0_12px_28px_-8px_rgba(26,159,75,0.6)] hover:ring-brand-gold/45",
                "disabled:opacity-70",
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <MessageCircle className="h-4 w-4" />
                  Ir para o WhatsApp
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

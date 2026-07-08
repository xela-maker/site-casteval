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
import { supabase } from "@/integrations/supabase/client";
import { trackFormSubmit } from "@/utils/analytics";
import {
  WHATSAPP_LEAD_OPEN_EVENT,
  WhatsAppLeadRequest,
} from "@/lib/whatsappLeadGate";
import { sendLeadToCrm } from "@/lib/sendLeadToCrm";
import { getLeadTrackingFields, getLeadTrackingFieldsForDb } from "@/lib/utmTracking";
import { formatPhoneMask, getPhoneDigits } from "@/lib/phoneUtils";
import { Loader2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
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
          "!flex max-h-[min(90dvh,640px)] w-[calc(100%-2rem)] max-w-[480px] !flex-col gap-0 overflow-hidden border-0 p-0",
          "rounded-xl bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)]",
          "[&>button]:right-4 [&>button]:top-4 [&>button]:text-ink-500 [&>button]:opacity-70",
          "[&>button]:hover:bg-surface-50 [&>button]:hover:text-ink-900 [&>button]:hover:opacity-100",
        )}
      >
        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <div
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-4 pt-6 sm:px-7 sm:pt-7"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <DialogHeader className="space-y-0 text-left">
              <div className="mb-5 flex items-start gap-3.5 pr-8">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                  style={{ background: "#FFF5CC" }}
                >
                  <FaWhatsapp className="h-5 w-5" style={{ color: "#C5A139" }} aria-hidden />
                </div>

                <div className="min-w-0 pt-0.5">
                  <DialogTitle
                    className="font-heading text-[22px] font-semibold leading-tight text-ink-900"
                    style={{ margin: 0 }}
                  >
                    Falar no WhatsApp
                  </DialogTitle>
                  <DialogDescription
                    className="mt-1.5 text-[14px] leading-relaxed text-ink-500"
                    style={{ margin: 0 }}
                  >
                    Preencha seus dados para iniciar a conversa com nosso time.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {request?.message ? (
              <div
                className="mb-5 rounded-lg px-3.5 py-3"
                style={{ background: "#F8F8F8" }}
              >
                <p className="mb-1 text-[12px] font-semibold text-ink-500">Sua mensagem</p>
                <p className="line-clamp-3 text-[14px] leading-relaxed text-ink-700">
                  {request.message}
                </p>
              </div>
            ) : null}

            <div className="space-y-4">
              <div>
                <Label className="mb-2 block text-body-s font-medium text-ink-700">
                  Nome *
                </Label>
                <Input
                  id="whatsapp-lead-name"
                  value={formData.name}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, name: event.target.value }))
                  }
                  placeholder="Seu nome"
                  autoComplete="name"
                  className={cn("h-11 bg-white", errors.name && "border-destructive")}
                />
                {errors.name ? (
                  <p className="mt-1 text-caption text-destructive">{errors.name}</p>
                ) : null}
              </div>

              <div>
                <Label className="mb-2 block text-body-s font-medium text-ink-700">
                  E-mail *
                </Label>
                <Input
                  id="whatsapp-lead-email"
                  type="email"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, email: event.target.value }))
                  }
                  placeholder="seu@email.com"
                  autoComplete="email"
                  inputMode="email"
                  className={cn("h-11 bg-white", errors.email && "border-destructive")}
                />
                {errors.email ? (
                  <p className="mt-1 text-caption text-destructive">{errors.email}</p>
                ) : null}
              </div>

              <div>
                <Label className="mb-2 block text-body-s font-medium text-ink-700">
                  Telefone *
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
                  placeholder="(41) 99999-9999"
                  autoComplete="tel"
                  inputMode="tel"
                  className={cn("h-11 bg-white", errors.phone && "border-destructive")}
                />
                {errors.phone ? (
                  <p className="mt-1 text-caption text-destructive">{errors.phone}</p>
                ) : null}
              </div>
            </div>

            <p className="mt-4 text-[12px] leading-relaxed text-ink-500">
              Seus dados são usados apenas para contato sobre o imóvel de interesse.
            </p>
          </div>

          <div
            className="shrink-0 px-6 pb-6 pt-2 sm:px-7"
            style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
          >
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-full text-[14px] font-bold text-white transition-opacity disabled:cursor-wait disabled:opacity-70"
              style={{ backgroundColor: "#25D366" }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <FaWhatsapp className="h-[18px] w-[18px]" />
                  FALAR NO WHATSAPP
                </>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

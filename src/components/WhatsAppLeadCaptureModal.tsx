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

const WA = {
  header: "#075E54",
  headerLight: "#128C7E",
  primary: "#25D366",
  primaryHover: "#1DA851",
  chatBg: "#ECE5DD",
  bubble: "#DCF8C6",
  bubbleBorder: "#C8E6B0",
  tint: "#F0FAF3",
} as const;

const inputClass = cn(
  "min-h-[48px] rounded-xl border-[#C5E8D0] bg-white text-[15px] text-[#1F2937]",
  "placeholder:text-[#9CA3AF]",
  "focus-visible:border-[#25D366] focus-visible:ring-2 focus-visible:ring-[#25D366]/25",
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
        phone: parsed.phone ? formatPhoneMask(parsed.phone) : "",
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
          "!flex max-h-[min(90dvh,680px)] w-[calc(100%-2rem)] max-w-[480px] !flex-col gap-0 overflow-hidden border-0 p-0",
          "rounded-2xl shadow-[0_20px_50px_rgba(7,94,84,0.22)]",
          "[&>button]:right-4 [&>button]:top-4 [&>button]:z-10 [&>button]:rounded-full [&>button]:p-2",
          "[&>button]:text-white/80 [&>button]:hover:bg-white/15 [&>button]:hover:text-white",
        )}
        style={{ background: WA.chatBg }}
      >
        {/* Header estilo WhatsApp */}
        <div
          className="relative shrink-0 px-6 pb-5 pt-6"
          style={{ background: `linear-gradient(135deg, ${WA.header} 0%, ${WA.headerLight} 100%)` }}
        >
          <DialogHeader className="space-y-0 text-left">
            <div className="flex items-center gap-4 pr-10">
              <div className="flex min-h-[52px] min-w-[52px] shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
                <FaWhatsapp className="h-7 w-7 text-white" aria-hidden />
              </div>

              <div className="min-w-0">
                <DialogTitle className="font-heading text-[20px] font-bold leading-tight text-white">
                  Casteval
                </DialogTitle>
                <DialogDescription className="mt-1 text-[13px] leading-snug text-white/75">
                  online · resposta rápida
                </DialogDescription>
              </div>
            </div>

            <p className="mt-4 text-[15px] font-medium leading-snug text-white/90">
              Preencha seus dados para iniciar a conversa no WhatsApp.
            </p>
          </DialogHeader>
        </div>

        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <div
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6"
            style={{ WebkitOverflowScrolling: "touch", background: WA.chatBg }}
          >
            {request?.message ? (
              <div className="mb-5 flex justify-end">
                <div
                  className="max-w-[88%] rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm"
                  style={{
                    background: WA.bubble,
                    border: `1px solid ${WA.bubbleBorder}`,
                  }}
                >
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[#3D7A45]">
                    Sua mensagem
                  </p>
                  <p className="text-[14px] leading-relaxed text-[#1F2937]">
                    {request.message}
                  </p>
                </div>
              </div>
            ) : null}

            <div
              className="rounded-2xl border border-[#D4EDDA] bg-white p-5 shadow-sm"
              style={{ background: WA.tint }}
            >
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block text-[13px] font-semibold text-[#075E54]">
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
                    className={cn(inputClass, errors.name && "border-destructive")}
                  />
                  {errors.name ? (
                    <p className="mt-1.5 text-[12px] text-destructive">{errors.name}</p>
                  ) : null}
                </div>

                <div>
                  <Label className="mb-2 block text-[13px] font-semibold text-[#075E54]">
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
                    className={cn(inputClass, errors.email && "border-destructive")}
                  />
                  {errors.email ? (
                    <p className="mt-1.5 text-[12px] text-destructive">{errors.email}</p>
                  ) : null}
                </div>

                <div>
                  <Label className="mb-2 block text-[13px] font-semibold text-[#075E54]">
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
                    className={cn(inputClass, errors.phone && "border-destructive")}
                  />
                  {errors.phone ? (
                    <p className="mt-1.5 text-[12px] text-destructive">{errors.phone}</p>
                  ) : null}
                </div>
              </div>
            </div>

            <p className="mt-4 text-center text-[12px] leading-relaxed text-[#6B7280]">
              Seus dados são usados apenas para contato sobre o imóvel de interesse.
            </p>
          </div>

          {/* Rodapé com botão grande */}
          <div
            className="shrink-0 border-t border-[#D4EDDA] bg-white px-5 py-5 sm:px-6"
            style={{ paddingBottom: "max(20px, env(safe-area-inset-bottom))" }}
          >
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "flex w-full min-h-[56px] items-center justify-center gap-3",
                "rounded-full text-[15px] font-bold uppercase tracking-wide text-white",
                "shadow-[0_8px_24px_rgba(37,211,102,0.45)]",
                "transition-all duration-200",
                "hover:brightness-105 hover:shadow-[0_12px_28px_rgba(37,211,102,0.55)]",
                "active:scale-[0.98]",
                "disabled:cursor-wait disabled:opacity-70 disabled:active:scale-100",
              )}
              style={{ backgroundColor: WA.primary }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <FaWhatsapp className="h-6 w-6 shrink-0" />
                  Falar no WhatsApp
                </>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

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
import { getStoredUtmParams, utmParamsToRecord } from "@/lib/utmTracking";
import { formatPhoneMask, getPhoneDigits } from "@/lib/phoneUtils";

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
    if (!request || !validate()) return;

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

    const utmFields = utmParamsToRecord(getStoredUtmParams());

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
        ...utmFields,
      });
    }

    trackFormSubmit("whatsapp_lead_modal");
    window.open(url, "_blank");
    setIsOpen(false);
    setRequest(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Antes de continuar para o WhatsApp</DialogTitle>
          <DialogDescription>
            Preencha seus dados para que nosso time consiga te atender melhor.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="whatsapp-lead-name">Nome</Label>
            <Input
              id="whatsapp-lead-name"
              value={formData.name}
              onChange={(event) =>
                setFormData((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="Seu nome completo"
            />
            {errors.name ? <p className="text-xs text-destructive">{errors.name}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp-lead-email">E-mail</Label>
            <Input
              id="whatsapp-lead-email"
              type="email"
              value={formData.email}
              onChange={(event) =>
                setFormData((current) => ({ ...current, email: event.target.value }))
              }
              placeholder="voce@exemplo.com"
            />
            {errors.email ? <p className="text-xs text-destructive">{errors.email}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp-lead-phone">Telefone</Label>
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
            />
            {errors.phone ? <p className="text-xs text-destructive">{errors.phone}</p> : null}
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full sm:w-auto">
              Ir para o WhatsApp
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

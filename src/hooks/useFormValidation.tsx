import { useState } from 'react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { sendLeadToCrm } from '@/lib/sendLeadToCrm';
import { getLeadTrackingFields, getLeadTrackingFieldsForDb } from '@/lib/utmTracking';
import { getPhoneDigits, isValidPhone } from '@/lib/phoneUtils';

export const contactFormSchema = z.object({
  firstName: z.string()
    .trim()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(50, "Nome deve ter no máximo 50 caracteres"),
  lastName: z.string()
    .trim()
    .min(2, "Sobrenome deve ter pelo menos 2 caracteres")
    .max(50, "Sobrenome deve ter no máximo 50 caracteres"),
  email: z.string()
    .trim()
    .email("Email inválido")
    .max(255, "Email deve ter no máximo 255 caracteres"),
  phone: z.string()
    .trim()
    .refine((value) => isValidPhone(value), "Informe um telefone válido com DDD"),
  interest: z.string().optional(),
  message: z.string()
    .trim()
    .min(10, "Mensagem deve ter pelo menos 10 caracteres")
    .max(1000, "Mensagem deve ter no máximo 1000 caracteres")
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const useFormValidation = () => {
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name: keyof ContactFormData, value: string) => {
    try {
      // Create single field validation
      const singleFieldData = { [name]: value } as Partial<ContactFormData>;
      const result = contactFormSchema.safeParse(singleFieldData);
      
      if (result.success) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
        return true;
      } else {
        const fieldError = result.error.issues.find(err => err.path[0] === name);
        if (fieldError) {
          setErrors(prev => ({ ...prev, [name]: fieldError.message }));
        }
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  const validateForm = (data: ContactFormData) => {
    try {
      contactFormSchema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMap: Partial<Record<keyof ContactFormData, string>> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            errorMap[err.path[0] as keyof ContactFormData] = err.message;
          }
        });
        setErrors(errorMap);
      }
      return false;
    }
  };

  const submitForm = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      if (!validateForm(data)) {
        return false;
      }

      const fullName = `${data.firstName} ${data.lastName}`.trim();
      const phoneDigits = getPhoneDigits(data.phone);

      const utmFields = getLeadTrackingFieldsForDb();
      const crmTracking = getLeadTrackingFields();

      const { error } = await supabase.from('st_contatos').insert({
        nome: fullName,
        email: data.email,
        telefone: phoneDigits,
        interesse: data.interest || null,
        mensagem: data.message,
        status: 'novo',
        origem: 'contato_form',
        url_origem: window.location.href,
        crm_status: 'pending',
        ...utmFields,
      });

      if (error) {
        console.error('Erro ao salvar contato:', error);
        return false;
      }

      await sendLeadToCrm({
        nome: fullName,
        email: data.email,
        telefone: phoneDigits,
        mensagem: data.message,
        interesse: data.interest || 'Não especificado',
        origem: 'contato_form',
        url_origem: window.location.href,
        ...crmTracking,
      });

      return true;
    } catch (error) {
      console.error('Error submitting form:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    errors,
    isSubmitting,
    validateField,
    validateForm,
    submitForm,
    setErrors
  };
};
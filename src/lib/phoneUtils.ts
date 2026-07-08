export const formatPhoneMask = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

export const getPhoneDigits = (value: string) => value.replace(/\D/g, "");

export const isValidPhone = (value: string) => {
  const digits = getPhoneDigits(value);
  return digits.length >= 10 && digits.length <= 11;
};

/** Formato esperado pela API Vista/Loft: "41 99999-9999" */
export const formatPhoneForVista = (phone?: string | null) => {
  const digits = getPhoneDigits(phone || "");
  if (digits.length < 10) return "";

  if (digits.length === 10) {
    return `${digits.slice(0, 2)} ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `${digits.slice(0, 2)} ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};

/**
 * Utilitários de telefone BR.
 * Máscara e armazenamento usam DDD + número (10 ou 11 dígitos),
 * SEM o código do país 55.
 *
 * Importante: nunca truncar em 11 dígitos ANTES de remover o 55,
 * senão números colados como 5541999... perdem os dígitos finais.
 */

/** DDDs brasileiros válidos (sem o 55 de país). */
const VALID_DDDS = new Set([
  "11", "12", "13", "14", "15", "16", "17", "18", "19",
  "21", "22", "24", "27", "28",
  "31", "32", "33", "34", "35", "37", "38",
  "41", "42", "43", "44", "45", "46",
  "47", "48", "49",
  "51", "53", "54", "55",
  "61", "62", "63", "64", "65", "66", "67", "68", "69",
  "71", "73", "74", "75", "77", "79",
  "81", "82", "83", "84", "85", "86", "87", "88", "89",
  "91", "92", "93", "94", "95", "96", "97", "98", "99",
]);

/** Aceita colagem internacional (+55, 055, etc.) antes de normalizar. */
const MAX_RAW_DIGITS = 15;
/** Número nacional: DDD (2) + local (8 ou 9). */
const MAX_NATIONAL_DIGITS = 11;

/**
 * Remove o código do país (+55) e devolve só DDD + número (máx. 11 dígitos).
 *
 * Casos cobertos:
 * - 5541999887766 (13) → 41999887766
 * - 554199988776 (12) → 4199988776
 * - 55469937876 (11, 55 era país + DDD 46) → 469937876
 * - 55999123456 (11, DDD 55 real de Santa Maria + 9...) → mantém
 */
export const normalizePhoneDigits = (value?: string | null) => {
  let digits = (value || "").replace(/\D/g, "").slice(0, MAX_RAW_DIGITS);

  // Remove zeros à esquerda de colagens tipo 05541...
  while (digits.startsWith("0") && digits.length > MAX_NATIONAL_DIGITS) {
    digits = digits.slice(1);
  }

  // Enquanto sobrar mais de 11 dígitos com prefixo 55, é código do país.
  while (digits.length > MAX_NATIONAL_DIGITS && digits.startsWith("55")) {
    digits = digits.slice(2);
  }

  // 12–13 dígitos sem ter entrado no while (edge): tenta strip único de 55
  if (digits.length > MAX_NATIONAL_DIGITS && digits.startsWith("55")) {
    digits = digits.slice(2);
  }

  // 11 dígitos começando com 55: pode ser país+DDD+número curto OU DDD 55 real.
  if (digits.length === MAX_NATIONAL_DIGITS && digits.startsWith("55")) {
    const maybeDdd = digits.slice(2, 4);
    const thirdDigit = digits[2];

    // DDD 55 real (Santa Maria/RS): celular local começa com 9.
    // Se o 3º dígito NÃO é 9, o "55" inicial era código do país.
    if (thirdDigit !== "9" && VALID_DDDS.has(maybeDdd)) {
      digits = digits.slice(2);
    }
  }

  return digits.slice(0, MAX_NATIONAL_DIGITS);
};

/** Máscara visual: (41) 99999-9999 — nunca inclui 55. */
export const formatPhoneMask = (value: string) => {
  const digits = normalizePhoneDigits(value);

  if (digits.length === 0) return "";
  if (digits.length <= 2) return digits.length === 2 ? `(${digits}` : digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

export const getPhoneDigits = (value: string) => normalizePhoneDigits(value);

export const isValidPhone = (value: string) => {
  const digits = getPhoneDigits(value);
  if (digits.length < 10 || digits.length > MAX_NATIONAL_DIGITS) return false;
  return VALID_DDDS.has(digits.slice(0, 2));
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

export function toWhatsAppId(input: string): string {
  const digits = input.replace(/\D/g, '');
  if (digits.startsWith('0')) return `62${digits.slice(1)}`;
  if (digits.startsWith('8')) return `62${digits}`;
  return digits;
}

export function whatsAppLink(whatsappId: string, message?: string): string {
  const base = `https://wa.me/${whatsappId}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function whatsAppShareLink(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function normalizePhone(input: string): string {
  const trimmed = input.trim();
  const plus = trimmed.startsWith('+') ? '+' : '';
  return `${plus}${trimmed.replace(/\D/g, '')}`;
}

export function isValidPhone(input: string): boolean {
  return /^\+?\d{8,15}$/.test(normalizePhone(input));
}

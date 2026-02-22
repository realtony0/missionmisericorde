export function formatPhoneFromWaUrl(waUrl: string): string {
  const match = waUrl.replace(/^https?:\/\//i, "").match(/wa\.me\/(\d+)/);
  if (!match) return "";
  const digits = match[1];
  if (digits.startsWith("221") && digits.length >= 9) {
    const rest = digits.slice(3);
    return `+221 ${rest.slice(0, 2)} ${rest.slice(2, 5)} ${rest.slice(5, 7)} ${rest.slice(7, 9)}`;
  }
  return digits.length >= 9 ? `+${digits.slice(0, 3)} ${digits.slice(3)}` : `+${digits}`;
}

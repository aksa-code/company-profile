// Helper terpusat untuk menembakkan event Meta Pixel dari mana saja.
// Aman dipanggil walau pixel belum load / diblokir: gagal diam-diam
// tanpa mengganggu UX maupun alur form.

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackMetaEvent(
  event: string,
  params?: Record<string, unknown>
): void {
  try {
    if (typeof window === "undefined") return;
    if (typeof window.fbq !== "function") return;
    if (params) {
      window.fbq("track", event, params);
    } else {
      window.fbq("track", event);
    }
  } catch {
    // Abaikan: tracking tidak boleh merusak pengalaman pengguna.
  }
}

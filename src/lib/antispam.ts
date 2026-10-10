// Anti-spam ringan untuk form publik (tanpa CAPTCHA, tanpa friksi user):
// 1. Honeypot — field tersembunyi yang hanya diisi bot otomatis.
// 2. Throttle — batasi 1 kiriman per form per 30 detik per browser.
// Ini menyaring bot kasar dan flood iseng; bukan pengganti CAPTCHA
// untuk serangan terarah.

const MIN_INTERVAL_MS = 30_000;
const STORAGE_PREFIX = "skyland_submit_";

export const SPAM_THROTTLE_MESSAGE =
  "Terlalu cepat! Tunggu sebentar sebelum mengirim lagi.";

/** true jika field jebakan terisi → pengirim hampir pasti bot. */
export function isHoneypotFilled(form: HTMLFormElement): boolean {
  const trap = form.querySelector<HTMLInputElement>('input[name="website"]');
  return !!trap && trap.value.trim() !== "";
}

/**
 * Klaim slot kirim untuk form tertentu. true = boleh lanjut (timestamp dicatat),
 * false = terlalu cepat, tolak. Fail-open jika storage tidak tersedia.
 */
export function claimSubmitSlot(key: string): boolean {
  try {
    const storageKey = STORAGE_PREFIX + key;
    const last = Number(localStorage.getItem(storageKey) || 0);
    const now = Date.now();
    if (now - last < MIN_INTERVAL_MS) return false;
    localStorage.setItem(storageKey, String(now));
    return true;
  } catch {
    return true;
  }
}

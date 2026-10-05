// src/app/hero/useAutoSlide.ts
// Auto-slide yang hemat resource: pause saat tab tidak aktif, carousel di luar
// viewport, di-hover (desktop), atau sedang di-touch (mobile).
// Satu timeout rekursif per carousel — tidak pernah ada timer ganda.

import { useEffect, useRef } from "react";

interface UseAutoSlideOptions {
  /** Jeda antar slide dalam ms (mis. 4500 / 5500). Tidak diubah oleh hook. */
  intervalMs: number;
  /** false = timer mati total (mis. item <= 1). */
  enabled: boolean;
  /** Dipanggil setiap kali slide harus maju. Simpan di ref agar selalu fresh. */
  onAdvance: () => void;
}

/** Interval pengecekan ulang saat sedang pause (tidak memajukan slide). */
const PAUSED_RECHECK_MS = 500;

export function useAutoSlide({ intervalMs, enabled, onAdvance }: UseAutoSlideOptions) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Selalu pakai callback terbaru tanpa me-restart timer.
  // (ditulis di effect agar tidak akses ref saat render)
  const onAdvanceRef = useRef(onAdvance);
  useEffect(() => {
    onAdvanceRef.current = onAdvance;
  });

  useEffect(() => {
    if (!enabled) return;
    const el = containerRef.current;
    if (!el) return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let disposed = false;
    const flags = { visible: true, hover: false, touch: false };

    const clearPending = () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    const isAllowed = () =>
      !document.hidden && flags.visible && !flags.hover && !flags.touch;

    const schedule = (delay: number) => {
      if (disposed) return;
      clearPending();
      timeoutId = setTimeout(() => {
        timeoutId = null;
        if (disposed) return;
        if (isAllowed()) {
          onAdvanceRef.current();
          schedule(intervalMs);
        } else {
          // Masih pause: cek lagi nanti, slide tidak maju.
          schedule(PAUSED_RECHECK_MS);
        }
      }, delay);
    };

    // Perubahan kondisi: evaluasi ulang segera (tanpa memajukan paksa).
    const poke = () => schedule(PAUSED_RECHECK_MS);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearPending(); // pause seketika saat tab tidak aktif
      } else {
        poke();
      }
    };

    const handleMouseEnter = () => {
      flags.hover = true;
      clearPending();
    };
    const handleMouseLeave = () => {
      flags.hover = false;
      poke();
    };
    const handleTouchStart = () => {
      flags.touch = true;
      clearPending();
    };
    const handleTouchEnd = () => {
      flags.touch = false;
      poke();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const nowVisible = entry ? entry.intersectionRatio >= 0.1 : false;
        if (nowVisible !== flags.visible) {
          flags.visible = nowVisible;
          if (nowVisible) poke();
          else clearPending();
        }
      },
      { threshold: [0, 0.1] }
    );
    observer.observe(el);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);
    el.addEventListener("touchstart", handleTouchStart);
    el.addEventListener("touchend", handleTouchEnd);
    el.addEventListener("touchcancel", handleTouchEnd);

    schedule(intervalMs);

    return () => {
      disposed = true;
      clearPending();
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchend", handleTouchEnd);
      el.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [enabled, intervalMs]);

  return containerRef;
}

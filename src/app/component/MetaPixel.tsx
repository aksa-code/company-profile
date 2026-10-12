"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export default function MetaPixel() {
  const pathname = usePathname();

  // Track PageView setiap pindah route (Next.js SPA tidak reload halaman,
  // jadi PageView bawaan Meta hanya ke-fire sekali saat load pertama).
  // Sengaja hanya pakai usePathname (tanpa useSearchParams) agar aman
  // untuk static prerender — useSearchParams wajib Suspense boundary.
  useEffect(() => {
    if (!PIXEL_ID) return;
    // Jangan cemari data iklan dengan traffic internal admin
    if (pathname?.startsWith("/admin")) return;
    if (typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
  }, [pathname]);

  if (!PIXEL_ID) return null;
  // Jangan load pixel sama sekali di halaman admin
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <link rel="dns-prefetch" href="https://connect.facebook.net" />
      <Script
        src="https://connect.facebook.net/en_US/fbevents.js"
        strategy="afterInteractive"
      />
      <Script id="meta-pixel-init" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
    </>
  );
}

// src/app/component/BankLogo.tsx
'use client';

import { useState } from "react";

interface BankLogoProps {
  name: string;
  logo: string;
  className?: string;
}

// Logo bank KPR murni (tanpa bingkai/teks).
// Jika file logo belum tersedia di public/images/bank_kpr,
// logo disembunyikan agar tidak tampil gambar rusak.
export default function BankLogo({ name, logo, className }: BankLogoProps) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- src dinamis dari public/ + butuh fallback onError; next/image tidak mendukung pola ini
    <img
      src={logo}
      alt={`Logo ${name}`}
      title={name}
      onError={() => setFailed(true)}
      loading="lazy"
      className={
        className ??
        "h-8 sm:h-9 w-auto max-w-[110px] shrink-0 object-contain transition-transform duration-300 hover:scale-105"
      }
    />
  );
}

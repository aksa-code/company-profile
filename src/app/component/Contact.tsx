// src/app/hero/Contact.tsx

"use client";

import Link from "next/link";
import { companyInfo } from "../../lib/companyService"; // Sesuaikan jalur impor dengan struktur folder Anda  

export default function Contact() {
  // Mengambil nomor dari companyInfo (6282145200700) dan memastikan format untuk URL WhatsApp
  const rawPhone = companyInfo.contact.phone;
  const formattedPhone = rawPhone.startsWith("0") ? "62" + rawPhone.slice(1) : rawPhone;
  const whatsappNumber = formattedPhone.replace(/[\s+-]/g, "");

  return (
    <section id="contact" className="py-12 px-4 sm:px-6 lg:px-8 bg-orange-500 text-white relative overflow-hidden">
      
      {/* Elemen Dekoratif dengan Efek Animasi Halus */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-orange-400/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-orange-600/30 rounded-full blur-3xl pointer-events-none"></div>

      {/* Lebar container disamakan menjadi max-w-6xl */}
      <div className="max-w-6xl mx-auto text-center relative z-10">
        
        {/* Konten Utama dengan Animasi Masuk */}
        <div className="max-w-3xl mx-auto space-y-4 animate-fade-in-up duration-700">
          
          {/* Judul Utama */}
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
            Siap Mewujudkan Rumah Impian Anda bersama {companyInfo.fullName}?
          </h2>

          {/* Deskripsi */}
          <p className="text-orange-100 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            {companyInfo.description} Konsultasikan kebutuhan hunian Anda dengan tim kami.
          </p>

          {/* Tombol Aksi */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            
            {/* Navigasi ke WhatsApp / Hubungi Kami */}
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Halo ${companyInfo.name}, saya ingin berkonsultasi mengenai rumah impian.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-orange-600 hover:bg-orange-50 font-bold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-orange-900/10 text-xs sm:text-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>Hubungi Sekarang</span>
            </a>

            {/* Navigasi ke Halaman Proyek (/projects) */}
            <Link
              href="/projects"
              className="bg-orange-600/60 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl border border-orange-400/40 transition-all duration-300 hover:scale-105 text-xs sm:text-sm flex items-center gap-2 backdrop-blur-sm"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Lihat Proyek</span>
            </Link>

          </div>

        </div>

      </div>
    </section>
  );
}
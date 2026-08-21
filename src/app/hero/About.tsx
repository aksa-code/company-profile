// src/components/About.tsx

"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import { companyInfo } from "../../lib/companyService";
import { aboutData } from "../data/about";

export default function About() {
  const data = aboutData.homeSection;

  // Inisialisasi AOS untuk animasi scroll
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  // Array icon yang unik dan relevan untuk setiap nilai perusahaan (Reliable, Modern, Best Quality)
  const valueIcons = [
    // Icon untuk Reliable & Honest (Perisai / Keamanan / Kepercayaan)
    <svg key="reliable" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>,
    // Icon untuk Modern & Competent (Gedung / Arsitektur Modern)
    <svg key="modern" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>,
    // Icon untuk Best Quality, Services & Price (Bintang / Kualitas Terbaik)
    <svg key="best" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ];

  return (
    <section id="about" className="py-10 sm:py-12 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
      {/* Menggunakan items-stretch agar tinggi kolom kiri dan kanan menyesuaikan secara proporsional */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-stretch">
        
        {/* Bagian Kiri: Gambar Perumahan yang mengisi tinggi penuh kolom */}
        <div data-aos="fade-up" className="lg:col-span-5 relative flex flex-col">
          <div className="relative h-full min-h-[320px] sm:min-h-[380px] w-full rounded-2xl overflow-hidden shadow-xl bg-gray-100 group flex-grow">
            <Image
              src={data.image}
              alt="Skyland Property Development"
              fill
              sizes="(max-width: 1024px) 100vw, 450px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          
          <div className="absolute -bottom-4 sm:-bottom-5 right-4 sm:right-[-16px] bg-gradient-to-br from-orange-400 to-orange-600 text-white p-3 sm:p-4 rounded-2xl shadow-[0_10px_25px_-5px_rgba(249,115,22,0.4)] flex flex-col items-center justify-center min-w-[100px] sm:min-w-[120px] z-10 transition-all duration-300 hover:scale-105">
            <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight drop-shadow-sm">
              {data.experienceBadge.years}
            </span>
            <span className="text-[10px] sm:text-[11px] font-medium text-orange-100 text-center mt-0.5 tracking-wide">
              {data.experienceBadge.label}
            </span>
          </div>
        </div>

        {/* Bagian Kanan: Teks & Values */}
        <div data-aos="fade-up" data-aos-delay="200" className="lg:col-span-7 space-y-3 flex flex-col justify-between">
          
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-snug">
              {data.titlePrefix} <span className="text-orange-500">{data.titleHighlight}</span>
            </h2>

            {/* Paragraf */}
            <div className="space-y-2 text-gray-500 text-xs sm:text-sm font-normal leading-relaxed mt-3">
              <p>{data.paragraphs[0]}</p>
              <p>{data.paragraphs[1]}</p>
            </div>

            {/* Tautan Lihat Selengkapnya */}
            <div className="pt-2">
              <Link href={data.linkUrl} className="inline-flex items-center gap-1.5 text-orange-500 hover:text-orange-600 font-semibold text-xs transition-colors group">
                <span>{data.linkText}</span>
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>

          {/* Kotak Values dengan Icon yang Berbeda-beda Tiap Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-3">
            {companyInfo.values.map((value, index) => (
              <div 
                key={index}
                data-aos="fade-up"
                data-aos-delay={300 + (index * 100)}
                className="p-3 sm:p-4 rounded-xl bg-gray-50/80 border border-gray-100/80 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-md"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 mb-3">
                  {valueIcons[index] || valueIcons[0]}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-xs sm:text-sm mb-1">{value.title}</h4>
                  <p className="text-gray-500 text-[10px] sm:text-[11px] font-normal leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
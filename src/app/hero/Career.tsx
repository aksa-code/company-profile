// src/components/Career.tsx

"use client";

import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from 'framer-motion';
import { careerHeroData } from "../../lib/careerService";

export default function Career() {
  // Animasi sisi kiri (Fade-in dari kiri)
  const leftVariant: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  // Animasi sisi kanan (Fade-in dari kanan)
  const rightVariant: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.2 } }
  };

  return (
    <section id="career" className="py-10 sm:py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Sisi Kiri: Informasi Karir & Benefit */}
          <motion.div 
            className="lg:col-span-7 p-5 sm:p-10 flex flex-col justify-between"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={leftVariant}
          >
            <div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-2.5 sm:mb-3">
                {careerHeroData.titleMain} <span className="text-orange-500">{careerHeroData.titleHighlight}</span>
              </h2>

              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
                {careerHeroData.description}
              </p>

              {/* Daftar Keunggulan / Benefit */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-5 sm:mb-6">
                {careerHeroData.benefits.map((benefit, index) => (
                  <div 
                    key={index} 
                    className="p-2.5 sm:p-3 rounded-xl bg-gray-50 border border-gray-100 text-[11px] sm:text-xs text-gray-700 font-medium flex items-center gap-2 transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-sm"
                  >
                    <span className="text-orange-500 flex-shrink-0">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    <span className="line-clamp-2">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href={careerHeroData.viewAllLink}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-md shadow-orange-500/20 text-xs sm:text-sm flex items-center justify-center w-full sm:w-auto"
              >
                <span>{careerHeroData.viewAllText}</span>
              </Link>
            </div>
          </motion.div>

          {/* Sisi Kanan: Ilustrasi / Foto Tim Profesional */}
          <motion.div 
            className="lg:col-span-5 bg-[#0f172a] relative overflow-hidden min-h-[280px] sm:min-h-[350px] flex items-center justify-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={rightVariant}
          >
            <Image
              src="/images/hero/FotoPro.png"
              alt="Tim Profesional Skyland Property"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover opacity-65 transition-transform duration-700 hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent"></div>

            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 text-center z-10">
              <p className="text-xs sm:text-sm text-slate-200 font-medium drop-shadow-md">
                {careerHeroData.footerText}
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
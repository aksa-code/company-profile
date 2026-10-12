// src/app/hero/VideoSection.tsx

"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { companyInfo } from '../../lib/companyData';

export default function VideoSection() {
  // Facade YouTube: jangan load player + JS YouTube saat halaman dibuka.
  // Iframe berat hanya dibuat setelah pengunjung menekan tombol play.
  const [playVideo, setPlayVideo] = useState(false);
  // Menambahkan tipe Variants secara eksplisit untuk menghindari error TypeScript
  const leftVariant: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const rightVariant: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section id="video" className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-[#0f172a] text-white overflow-hidden">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        
        {/* Bagian Kiri: Teks (Fade-in dari Kiri) */}
        <motion.div 
          className="lg:col-span-6 space-y-3 sm:space-y-4 order-2 lg:order-1"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={leftVariant}
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug sm:leading-tight">
            Lihat Sendiri <span className="text-orange-500">Keindahan Hunian Kami</span>
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Saksikan bagaimana {companyInfo.name} ({companyInfo.companyName}) menghadirkan kawasan hunian terbaik di Malang. Dari konsep desain hingga lingkungan yang asri dan aman untuk keluarga Anda.
          </p>

          <div className="space-y-2.5 sm:space-y-3 pt-1">
            {[
              { icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", val: companyInfo.values[1] },
              { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", val: companyInfo.values[0] },
              { icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", val: companyInfo.values[2] }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm text-slate-200 transition-transform duration-300 hover:translate-x-1">
                <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-orange-400">
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </span>
                <span>{item.val.title}: {item.val.description}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bagian Kanan: Video (Fade-in dari Kanan) */}
        <motion.div 
          className="lg:col-span-6 mt-2 lg:mt-0 order-1 lg:order-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={rightVariant}
        >
          <div className="relative aspect-video rounded-xl sm:rounded-2xl overflow-hidden shadow-xl bg-black border border-slate-800 transition-all duration-500 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10 group">
            {playVideo ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${companyInfo.youtubeVideoId}?autoplay=1&rel=0`}
                title={`${companyInfo.name} Company Profile`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <button
                type="button"
                onClick={() => setPlayVideo(true)}
                className="relative block w-full h-full cursor-pointer"
                aria-label={`Putar video ${companyInfo.name} Company Profile`}
              >
                <Image
                  src={`https://i.ytimg.com/vi/${companyInfo.youtubeVideoId}/hqdefault.jpg`}
                  alt={`${companyInfo.name} Company Profile`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/20" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-orange-500 flex items-center justify-center shadow-xl shadow-orange-500/30 transition-transform duration-300 group-hover:scale-110">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </span>
              </button>
            )}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
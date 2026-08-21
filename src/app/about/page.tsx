// src/app/about/page.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import Contact from "../component/Contact";
import { aboutData, businessConcept } from "../data/about";
import { companyInfo } from "../../lib/companyService";

export default function AboutPage() {
  const pageData = aboutData.page;

  // Variabel animasi standar (Fade-in dari bawah)
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  // Variabel animasi Visi & Misi (Kiri & Kanan)
  const leftVariant: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const rightVariant: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12 sm:pb-16 selection:bg-orange-500 selection:text-white">
      
      <Navbar />
      
      {/* Banner Header */}
      <div className="relative text-white pt-12 pb-12 sm:pt-20 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gray-900">
        <div className="absolute inset-0 z-0">
          <Image 
            src={pageData.banner.image} 
            alt="About Background"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/40" />
        </div>

        <motion.div 
          className="relative z-10 max-w-6xl mx-auto space-y-2 sm:space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-2 text-xs text-gray-300 font-medium">
            <Link 
              href="/" 
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="hover:text-orange-400 transition-colors"
            >
              Skyland Property
            </Link>
            <span>›</span>
            <span className="text-orange-400">{pageData.banner.breadcrumb}</span>
          </div>

          <h1 className="text-2xl sm:text-5xl font-extrabold tracking-tight">
            {pageData.banner.titlePrefix} <span className="text-orange-500">{pageData.banner.titleHighlight}</span>
          </h1>
          
          <p className="text-gray-200 text-xs sm:text-sm max-w-xl font-normal leading-relaxed">
            {pageData.banner.description}
          </p>
        </motion.div>
      </div>

      {/* Konten Utama About */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 space-y-12 sm:space-y-20">
        
        {/* Section Visi & Misi */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-100 border border-gray-100/80 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-orange-50/50 rounded-bl-full pointer-events-none" />
          
          {/* Teks Visi Misi (Masuk dari Kiri) */}
          <motion.div 
            className="lg:col-span-7 space-y-3 sm:space-y-4 relative z-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={leftVariant}
          >
            <h2 className="text-xl sm:text-3xl font-extrabold text-gray-900 leading-snug">
              {pageData.visionMissionSection.title}
            </h2>
            <p className="text-gray-600 leading-relaxed text-xs sm:text-sm">
              {pageData.visionMissionSection.description}
            </p>
            <div className="space-y-3 sm:space-y-4 pt-2">
              
              {/* Card Visi */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-orange-200 transition-colors">
                <div className="bg-orange-500 text-white p-1.5 rounded-xl mt-0.5 shrink-0 flex items-center justify-center shadow-md shadow-orange-500/20">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="w-full">
                  <h4 className="font-bold text-gray-900 text-xs sm:text-sm mb-1.5">{pageData.visionMissionSection.vision.title}</h4>
                  <ul className="list-disc pl-4 text-gray-600 text-xs space-y-1.5 leading-relaxed marker:text-orange-500">
                    {pageData.visionMissionSection.vision.points.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Misi */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-orange-200 transition-colors">
                <div className="bg-orange-500 text-white p-1.5 rounded-xl mt-0.5 shrink-0 flex items-center justify-center shadow-md shadow-orange-500/20">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-xs sm:text-sm mb-1">{pageData.visionMissionSection.mission.title}</h4>
                  <p className="text-gray-600 text-xs leading-relaxed">{pageData.visionMissionSection.mission.text}</p>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Gambar Visi Misi (Masuk dari Kanan) */}
          <motion.div 
            className="lg:col-span-5 relative h-[260px] sm:h-[480px] rounded-2xl overflow-hidden shadow-xl bg-gray-200 group"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={rightVariant}
          >
            <Image
              src={pageData.visionMissionSection.image}
              alt="Skyland Office"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </motion.div>
        </div>

        {/* Nilai-Nilai Perusahaan */}
        <motion.div 
          className="space-y-6 sm:space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <div className="text-center max-w-xl mx-auto space-y-1.5 sm:space-y-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 pt-1">
              {pageData.coreValuesHeader.title}
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm">
              {pageData.coreValuesHeader.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {pageData.values.map((item, index) => (
              <div key={index} className="bg-white p-5 sm:p-6 rounded-2xl shadow-lg shadow-gray-100/70 border border-gray-100 flex items-start gap-3.5 sm:flex-col sm:items-start sm:space-y-3 hover:shadow-xl hover:border-orange-200 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 text-orange-500 flex items-center justify-center shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="space-y-1 sm:space-y-1">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Konsep Bisnis */}
        <motion.div 
          className="relative bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white p-6 sm:p-10 rounded-3xl shadow-2xl overflow-hidden border border-gray-800"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-6 sm:space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-1.5 sm:space-y-2">
              <h2 className="text-xl sm:text-2xl font-extrabold pt-1">
                Konsep Bisnis Kami
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm">
                Landasan operasional dan pelayanan dalam membangun kawasan hunian impian Anda.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {businessConcept.map((concept, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4 hover:border-orange-500/50 transition-colors">
                  <div className="space-y-2">
                    <span className="text-orange-400 font-black text-xl tracking-wider block">{concept.title}</span>
                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                      {concept.description}
                    </p>
                  </div>
                  <div className="w-8 h-1 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Pimpinan Perusahaan (Opsional / Jika ada di companyInfo) */}
        {companyInfo.leadership && companyInfo.leadership.length > 0 && (
          <motion.div 
            className="space-y-6 sm:space-y-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <div className="text-center max-w-xl mx-auto space-y-1.5 sm:space-y-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 pt-1">
                Pimpinan Perusahaan
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm">
                Tokoh di balik visi dan pertumbuhan {companyInfo.name}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-4xl mx-auto">
              {companyInfo.leadership.map((leader, index) => (
                <div key={index} className="bg-white p-6 sm:p-7 rounded-2xl shadow-lg shadow-gray-100 border border-gray-100 flex flex-col justify-between space-y-4 relative overflow-hidden group hover:border-orange-200 transition-all">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50/60 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
                  
                  <div className="space-y-3 relative z-10">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-gray-900">{leader.name}</h3>
                        <p className="text-orange-500 text-xs sm:text-sm font-semibold">{leader.role}</p>
                      </div>
                    </div>
                    <blockquote className="text-gray-600 text-xs sm:text-sm italic border-l-2 border-orange-500 pl-3.5 py-1 leading-relaxed">
                      &ldquo;{leader.quote}&rdquo;
                    </blockquote>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </div>

      <div className="mt-12 sm:mt-16">
        <Contact />
      </div>
      <div className="mt-8 sm:mt-12">
        <Footer />
      </div>
      
    </div>
  );
}
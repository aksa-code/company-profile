// src/components/hero/Hero.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabase"; // Sesuaikan jalur import supabase Anda jika berbeda

interface HeroProps {
  projects: any[];
  companyInfo: any;
}

export default function Hero({ projects = [], companyInfo }: HeroProps) {
  const mainProject = projects[0];

  const allGlobalUnits: any[] = projects.flatMap((project) =>
    (project.unitTypes || []).map((unit: any) => ({
      ...unit,
      projectTitle: project.title,
      projectLocation: project.location,
    }))
  );

  const [activeUnitIndex, setActiveUnitIndex] = useState(0);
  const [activeProjectIndex, setActiveProjectIndex] = useState(1);

  const [formDataLeft, setFormDataLeft] = useState({
    name: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    if (allGlobalUnits.length === 0) return;
    const unitInterval = setInterval(() => {
      setActiveUnitIndex((prevIndex) => (prevIndex + 1) % allGlobalUnits.length);
    }, 4500);
    return () => clearInterval(unitInterval);
  }, [allGlobalUnits.length]);

  useEffect(() => {
    if (projects.length <= 1) return;
    const projectInterval = setInterval(() => {
      setActiveProjectIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        return nextIndex >= projects.length ? 1 : nextIndex;
      });
    }, 5500);
    return () => clearInterval(projectInterval);
  }, [projects.length]);

  const currentGlobalUnit = allGlobalUnits[activeUnitIndex] || allGlobalUnits[0];
  const secondaryProject = projects[activeProjectIndex] || projects[1] || mainProject;

  const handleHeroSubmitLeft = async (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappNumber = companyInfo?.contact?.phone || "6282145200700";
    const text = `Halo Admin Skyland, saya ${formDataLeft.name} tertarik dengan penawaran properti. Pesan: "${formDataLeft.message}" (No. HP/WA: ${formDataLeft.phone})`;

    // Simpan data ke tabel 'leads' Supabase untuk Marketing Hotline
    try {
      const { error } = await supabase.from("leads").insert([
        {
          visitor_name: formDataLeft.name,
          whatsapp_number: formDataLeft.phone,
          unit_name: formDataLeft.message, // Menyimpan isi pesan/unit diminati
          source: "Form Hero Cepat",
          status: "baru",
        },
      ]);

      if (error) {
        console.error("Gagal menyimpan lead hero ke Supabase:", error.message);
      }
    } catch (err) {
      console.error("Terjadi kesalahan koneksi database:", err);
    }

    // Buka WhatsApp Marketing Hotline
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank");
    
    // Reset form
    setFormDataLeft({ name: "", phone: "", message: "" });
  };

  const activeProjectsCount = projects.filter((p) => p.statusBadge !== "Sold").length;

  return (
    <section id="hero" className="relative min-h-[calc(100vh-80px)] bg-gray-950 text-white flex flex-col justify-center overflow-hidden py-6 sm:py-8 px-4 sm:px-6 lg:px-8 selection:bg-orange-500 selection:text-white">
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/Skyland Savana.png"
          alt="Skyland Property Background"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/95 via-gray-950/80 to-gray-950/60"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full my-auto flex flex-col justify-center gap-4 sm:gap-5">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Kolom Kiri */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col justify-between h-full py-1"
          >
            <div className="space-y-4 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-[3.6rem] font-extrabold tracking-tight leading-[1.08]">
                <span className="block lg:inline">
                  {companyInfo.hero.titlePrefix}{" "}
                  <span className="text-orange-500">{companyInfo.hero.titleHighlight}</span>
                </span>
                <span className="block lg:hidden text-white">{companyInfo.hero.titleSuffix}</span>
                <span className="hidden lg:block">{companyInfo.hero.titleSuffix}</span>
              </h1>

              <p className="text-gray-300 text-xs sm:text-sm max-w-xl leading-relaxed mx-auto lg:mx-0">
                {companyInfo.hero.description}
              </p>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-4">
              <Link
                href="/projects"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2 text-xs sm:text-sm"
              >
                <span>Explore Projects</span>
                <span>→</span>
              </Link>
              <Link
                href="/contact"
                className="bg-gray-900/80 hover:bg-gray-800 text-white font-semibold px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl border border-gray-800 transition-all backdrop-blur-md text-xs sm:text-sm"
              >
                Contact Us
              </Link>
            </div>

          </motion.div>

          {/* Kolom Kanan */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-12 gap-3.5 relative items-center"
          >
            <div className="hidden sm:flex sm:col-span-6 flex-col justify-between h-[410px]">
              {secondaryProject && (
                <Link
                  href={`/projects/${secondaryProject.id || ""}`}
                  className="relative h-[195px] rounded-2xl overflow-hidden border border-gray-700/60 shadow-xl bg-gray-900/50 backdrop-blur-sm group block"
                >
                  <div className="absolute inset-0">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`project-image-${activeProjectIndex}`}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={secondaryProject.imageCover || secondaryProject.image || "/images/placeholder.png"}
                          alt={secondaryProject.title || "Project"}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10"></div>
                  
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-white/10 z-20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>{secondaryProject.statusBadge || "Available"}</span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end z-20">
                    <div>
                      <h4 className="text-white font-bold text-sm sm:text-base">{secondaryProject.title}</h4>
                      <p className="text-[11px] text-gray-300 truncate max-w-[180px]">{secondaryProject.location}</p>
                    </div>
                    <span className="text-xs bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 group-hover:bg-orange-500 transition-colors shrink-0">
                      Detail →
                    </span>
                  </div>
                </Link>
              )}
              
              <div className="bg-gradient-to-br from-gray-950/90 via-gray-900/90 to-gray-950/90 border border-gray-800/90 p-3.5 sm:p-4 rounded-2xl backdrop-blur-xl shadow-xl h-[195px] flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-gray-800/80 pb-2">
                  <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                    Konsultasi Cepat via WhatsApp
                  </h3>
                </div>

                <form onSubmit={handleHeroSubmitLeft} className="space-y-2 flex-1 flex flex-col justify-center">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Nama Lengkap"
                      value={formDataLeft.name}
                      onChange={(e) => setFormDataLeft({ ...formDataLeft, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-gray-950/80 border border-gray-800/80 focus:outline-none focus:border-orange-500 text-xs sm:text-sm text-white placeholder-gray-500 transition-all shadow-inner"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="No. WhatsApp"
                      value={formDataLeft.phone}
                      onChange={(e) => setFormDataLeft({ ...formDataLeft, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-gray-950/80 border border-gray-800/80 focus:outline-none focus:border-orange-500 text-xs sm:text-sm text-white placeholder-gray-500 transition-all shadow-inner"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Tulis pesan atau unit diminati..."
                      value={formDataLeft.message}
                      onChange={(e) => setFormDataLeft({ ...formDataLeft, message: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-gray-950/80 border border-gray-800/80 focus:outline-none focus:border-orange-500 text-xs sm:text-sm text-white placeholder-gray-500 transition-all shadow-inner"
                    />
                    <button
                      type="submit"
                      className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 sm:px-5 py-2 rounded-xl transition-all shadow-lg shadow-orange-500/20 text-xs sm:text-sm shrink-0 flex items-center justify-center gap-1.5"
                    >
                      <span>Kirim</span>
                      <span>→</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {currentGlobalUnit && (
              <div className="sm:col-span-6 relative h-[280px] sm:h-[410px] rounded-2xl overflow-hidden border border-gray-700/60 shadow-xl bg-gray-900/50 backdrop-blur-sm group">
                <div className="absolute inset-0">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`global-unit-${activeUnitIndex}`}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={currentGlobalUnit.image || "/images/placeholder.png"}
                        alt={currentGlobalUnit.name || "Unit"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>

                <div className="absolute top-4 left-4 z-20">
                  <span className="bg-orange-500 text-white text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-lg shadow-md">
                    {currentGlobalUnit.name}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 z-20">
                  <div className="bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 flex-1 min-w-0">
                    <p className="text-xs text-gray-300 truncate">
                      {currentGlobalUnit.buildingType || currentGlobalUnit.building_type || ""} • {currentGlobalUnit.specs || ""}
                    </p>
                    <p className="text-white font-bold text-xs sm:text-sm truncate">{currentGlobalUnit.projectTitle}</p>
                  </div>
                  
                  {currentGlobalUnit.isSoldOut || currentGlobalUnit.is_sold_out ? (
                    <span className="bg-red-500/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-2.5 rounded-xl shrink-0 shadow-md">
                      Sold Out
                    </span>
                  ) : (
                    <span className="bg-emerald-500/80 backdrop-blur-md text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl shrink-0 shadow-md">
                      Start {currentGlobalUnit.priceStarting || currentGlobalUnit.price_starting || "Hubungi Kami"}
                    </span>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Statistik Footer Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full pt-1"
        >
          <div className="relative bg-gradient-to-r from-gray-900/90 via-gray-900/95 to-gray-900/90 border border-orange-500/30 backdrop-blur-xl rounded-2xl py-3.5 sm:py-4 px-6 shadow-2xl shadow-orange-500/5 grid grid-cols-3 gap-2 sm:gap-4 text-center divide-x divide-gray-800/80 overflow-hidden">
            <div className="absolute -left-20 -top-20 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -right-20 -bottom-20 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {companyInfo.hero.stats.map((stat: any, index: number) => (
              <div key={index} className="flex flex-col items-center justify-center relative z-10">
                <h3 className="text-lg sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-100 to-orange-400 tracking-tight">
                  {index === 0 ? activeProjectsCount : stat.value}
                </h3>
                <p className="text-[11px] sm:text-xs font-medium text-gray-300 mt-0.5 tracking-wide">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
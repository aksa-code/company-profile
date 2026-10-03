// src/components/hero/Hero.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabase";

// --- DEFINISI INTERFACE UNTUK MENGHINDARI ERROR 'any' ---

interface UnitType {
  name: string;
  image?: string;
  buildingType?: string;
  building_type?: string;
  specs?: string;
  priceStarting?: string;
  price_starting?: string;
  isSoldOut?: boolean;
  is_sold_out?: boolean;
  projectTitle?: string;
  projectLocation?: string;
}

interface Project {
  id?: string | number;
  title: string;
  location?: string;
  image?: string;
  imageCover?: string;
  statusBadge?: string;
  unitTypes?: UnitType[];
}

interface StatItem {
  value: string | number;
  label: string;
}

interface CompanyInfo {
  hero?: {
    titlePrefix?: string;
    titleHighlight?: string;
    titleSuffix?: string;
    description?: string;
    stats?: StatItem[];
  };
  contact?: {
    phone?: string;
  };
}

interface HeroProps {
  projects: Project[];
  companyInfo?: CompanyInfo;
}

export default function Hero({ projects = [], companyInfo }: HeroProps) {
  // Kode selanjutnya tetap sama, namun sekarang sudah aman dari error 'any'
  const mainProject = projects[0];

  const allGlobalUnits: UnitType[] = projects.flatMap((project) =>
    (project.unitTypes || []).map((unit) => ({
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

  const [phoneError, setPhoneError] = useState("");
  
  const [notification, setNotification] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({
    show: false,
    type: "success",
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

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const currentGlobalUnit = allGlobalUnits[activeUnitIndex] || allGlobalUnits[0];
  const secondaryProject = projects[activeProjectIndex] || projects[1] || mainProject;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setFormDataLeft({ ...formDataLeft, phone: val });

    if (val.length > 0) {
      if (!val.startsWith("08")) {
        setPhoneError("Nomor WhatsApp harus diawali dengan '08'");
      } else if (val.length < 10 || val.length > 13) {
        setPhoneError("Panjang nomor HP antara 10 - 13 digit");
      } else {
        setPhoneError("");
      }
    } else {
      setPhoneError("");
    }
  };

  const handleHeroSubmitLeft = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formDataLeft.phone.startsWith("08") || formDataLeft.phone.length < 10 || formDataLeft.phone.length > 13) {
      setPhoneError("Format nomor WhatsApp tidak valid (harus 08... dan 10-13 digit)");
      setNotification({
        show: true,
        type: "error",
        message: "Periksa kembali nomor WhatsApp Anda.",
      });
      return;
    }

    const whatsappNumber = companyInfo?.contact?.phone || "6282145200700";
    const text = `Halo Admin Skyland, saya ${formDataLeft.name} tertarik dengan penawaran properti. Pesan: "${formDataLeft.message}" (No. HP/WA: ${formDataLeft.phone})`;

    try {
      const { error } = await supabase.from("leads").insert([
        {
          visitor_name: formDataLeft.name,
          whatsapp_number: formDataLeft.phone,
          unit_name: formDataLeft.message,
          source: "Form Hero Cepat",
          status: "baru",
        },
      ]);

      if (error) {
        setNotification({
          show: true,
          type: "error",
          message: "Gagal menyimpan data ke sistem, namun Anda tetap diarahkan ke WhatsApp.",
        });
      } else {
        setNotification({
          show: true,
          type: "success",
          message: "Berhasil! Mengarahkan Anda ke WhatsApp Admin...",
        });
      }
    } catch {
      setNotification({
        show: true,
        type: "error",
        message: "Kesalahan jaringan database.",
      });
    }

    setTimeout(() => {
      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank");
    }, 800);
    
    setFormDataLeft({ name: "", phone: "", message: "" });
    setPhoneError("");
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
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Kolom Kiri (Headline, Deskripsi, Tombol, dan Statistik dipindah ke sini) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col justify-center text-center lg:text-center space-y-6"
          >
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-extrabold tracking-tight leading-[1.15]">
                <span>
                  {companyInfo?.hero?.titlePrefix}
                  <span className="text-orange-500">{companyInfo?.hero?.titleHighlight}</span>
                  {companyInfo?.hero?.titleSuffix}
                </span>
              </h1>

              <p className="text-gray-300 text-xs sm:text-sm max-w-xl leading-relaxed mx-auto lg:mx-0">
                {companyInfo?.hero?.description}
              </p>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-center gap-3 pt-2">
              <Link
                href="/projects"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2 text-xs sm:text-sm"
              >
                <span>Explore Projects</span>
                <span>→</span>
              </Link>
              <Link
                href="/contact"
                className="bg-[#25D366] hover:bg-[#1DA851] text-white font-semibold px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl transition-all shadow-lg shadow-green-500/20 flex items-center gap-2 text-xs sm:text-sm"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>Contact Us</span>
              </Link>
            </div>

            {/* Statistik Footer Hero yang Dipindah ke Kolom Kiri */}
            <div className="w-full pt-1">
              <div className="relative bg-neutral-900/70 border border-white/10 backdrop-blur-xl rounded-2xl overflow-hidden">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
                <div className="py-4 px-4 grid grid-cols-3 gap-2 text-center divide-x divide-white/10">
                  {companyInfo?.hero?.stats?.map((stat: StatItem, index: number) => (
                    <div key={index} className="flex flex-col items-center justify-center px-1">
                      <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
                        {index === 0 ? activeProjectsCount : stat.value}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Kolom Kanan */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-12 gap-3 relative items-center"
          >
            <div className="hidden sm:flex sm:col-span-6 flex-col justify-between h-[410px]">
              {secondaryProject && (
                <Link
                  href={`/projects/${secondaryProject.id}`}
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
                          src={secondaryProject.imageCover || secondaryProject.image || "/images/placeholder.svg"}
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
              
              <div className="relative bg-gradient-to-br from-gray-950/90 via-gray-900/90 to-gray-950/90 border border-gray-800/90 p-3.5 sm:p-4 rounded-2xl backdrop-blur-xl shadow-xl h-[195px] flex flex-col justify-between overflow-hidden">
                
                <AnimatePresence>
                  {notification.show && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`absolute inset-x-2 top-2 z-30 p-2 rounded-xl text-xs font-medium flex items-center justify-between shadow-lg backdrop-blur-md ${
                        notification.type === "success" 
                          ? "bg-emerald-500/90 text-white border border-emerald-400/30" 
                          : "bg-red-500/90 text-white border border-red-400/30"
                      }`}
                    >
                      <span className="truncate pr-2">{notification.message}</span>
                      <button 
                        onClick={() => setNotification((prev) => ({ ...prev, show: false }))}
                        className="text-white/80 hover:text-white font-bold text-sm px-1"
                      >
                        ×
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-between border-b border-gray-800/80 pb-2">
                  <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#25D366] flex items-center justify-center shrink-0 shadow-md shadow-green-500/30">
                      <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                    </span>
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
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        maxLength={13}
                        placeholder="No. WhatsApp (08...)"
                        value={formDataLeft.phone}
                        onChange={handlePhoneChange}
                        className={`w-full px-3 py-2 rounded-xl bg-gray-950/80 border ${
                          phoneError ? "border-red-500" : "border-gray-800/80"
                        } focus:outline-none focus:border-orange-500 text-xs sm:text-sm text-white placeholder-gray-500 transition-all shadow-inner`}
                      />
                    </div>
                  </div>

                  {phoneError && (
                    <p className="text-[10px] text-red-400 font-medium px-1 truncate">{phoneError}</p>
                  )}

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
                      className="bg-[#25D366] hover:bg-[#1DA851] text-white font-semibold px-4 sm:px-5 py-2 rounded-xl transition-all shadow-lg shadow-green-500/20 text-xs sm:text-sm shrink-0 flex items-center justify-center gap-1.5"
                    >
                      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                      <span>Kirim</span>
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
                        src={currentGlobalUnit.image || "/images/placeholder.svg"}
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

      </div>
    </section>
  );
}
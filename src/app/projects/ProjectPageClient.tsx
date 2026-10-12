// src/app/projects/ProjectsPageClient.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, Variants, AnimatePresence } from "framer-motion";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import Contact from "../component/Contact";
import { Project } from "../../lib/projectService";

// Harga termurah dari seluruh tipe unit.
// priceStarting berupa string bebas ("400 Jutaan"), jadi dibandingkan via angka di dalamnya.
function getStartingPrice(project: Project): string | null {
  const units = project.unitTypes || project.unit_types || [];
  let best: string | null = null;
  let bestNum = Infinity;
  for (const u of units) {
    const raw = u.priceStarting || u.price_starting;
    if (!raw) continue;
    const num = parseInt(raw.replace(/[^0-9]/g, ""), 10);
    if (Number.isNaN(num) || num <= 0 || num >= bestNum) continue;
    bestNum = num;
    best = raw;
  }
  return best;
}

// Warna badge status: merah untuk Sold Out, amber untuk Coming Soon, hijau untuk lainnya.
function getStatusColor(status: string): string {
  if (/sold/i.test(status)) return "bg-red-500/90 text-white";
  if (/coming|soon/i.test(status)) return "bg-amber-500/90 text-white";
  return "bg-emerald-500/90 text-white";
}

export default function ProjectsPageClient({ projectsData }: { projectsData: Project[] }) {
  const [activeTab, setActiveTab] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = ["Semua", ...Array.from(new Set(projectsData.map((item) => item.category)))];

  const filteredProjects = projectsData.filter((p: Project) => {
    const matchesTab = activeTab === "Semua" ||
      p.category?.toLowerCase() === activeTab.toLowerCase() ||
      p.title?.toLowerCase().includes(activeTab.toLowerCase());

    const matchesSearch = searchQuery === "" ||
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const fadeIn: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12 sm:pb-16 overflow-hidden selection:bg-orange-500 selection:text-white">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      {/* Banner Header */}
      <div className="relative text-white pt-12 pb-12 sm:pt-20 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gray-900">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/Banner.webp"
            alt="Projects Background"
            fill
            className="object-cover scale-105 duration-1000"
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
            <Link href="/" onClick={() => window.scrollTo(0, 0)} className="hover:text-orange-400 transition-colors">
              Skyland Property
            </Link>
            <span>›</span>
            <span className="text-orange-400">Proyek</span>
          </div>

          <h1 className="text-2xl sm:text-5xl font-extrabold tracking-tight">
            Proyek <span className="text-orange-500">Unggulan</span> Kami
          </h1>

          <p className="text-gray-200 text-xs sm:text-sm max-w-xl font-normal leading-relaxed">
            Temukan hunian impian Anda dari portofolio proyek Skyland Property Nusantara di Malang, Jawa Timur.
          </p>
        </motion.div>
      </div>

      {/* Konten & Filter */}
      <motion.div
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 space-y-6 sm:space-y-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeIn}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 border-b border-gray-200 pb-4 sm:pb-5">
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-full shadow-sm border border-gray-100 overflow-x-auto max-w-full no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                  activeTab === cat
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20 scale-105"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="text-xs text-gray-500 font-medium shrink-0 bg-white px-3 py-2">
              {filteredProjects.length} proyek ditemukan
            </div>
          </div>
        </div>

        {/* Daftar Kartu Proyek */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project: Project) => {
                const startingPrice = getStartingPrice(project);
                const facilities = project.facilities || [];
                const statusLabel = project.statusBadge || "Available";
                const isSoldOutCard = /sold/i.test(statusLabel);

                return (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="h-full"
                  >
                    <Link
                      href={`/projects/${project.id}`}
                      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/70 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_24px_50px_-24px_rgba(249,115,22,0.35)]"
                    >
                      {/* Foto */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                        <Image
                          src={project.imageCover || "/images/placeholder.svg"}
                          alt={project.title || "Project"}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className={`object-contain sm:object-cover transition-transform duration-700 group-hover:scale-105 ${isSoldOutCard ? "grayscale" : ""}`}
                        />
                        <span className={`absolute right-3 top-3 z-10 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold shadow-md backdrop-blur-md ${getStatusColor(statusLabel)}`}>
                          {statusLabel}
                        </span>
                        {project.subBadge && (
                          <span className="absolute bottom-3 left-3 z-10 bg-black/45 backdrop-blur-md text-white text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md font-medium border border-white/20">
                            {project.subBadge}
                          </span>
                        )}
                      </div>

                      {/* Body */}
                      <div className="flex flex-1 flex-col p-4 sm:p-5">
                        {/* {project.category && (
                          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange-600">
                            {project.category}
                          </p>
                        )} */}
                        <h3 className="mt-1 line-clamp-1 text-base sm:text-lg font-bold tracking-tight text-slate-900 transition-colors group-hover:text-orange-600">
                          {project.title}
                        </h3>
                        <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                          <svg className="w-3.5 h-3.5 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="truncate">{project.location}</span>
                        </p>

                        {facilities.length > 0 && (
                          <div className="mt-3 flex items-center gap-1.5 overflow-hidden">
                            {facilities.slice(0, 3).map((facility, idx) => (
                              <span key={idx} className="min-w-0 truncate bg-orange-50 text-orange-700 text-[11px] font-medium px-2 py-1 rounded-md">
                                {facility}
                              </span>
                            ))}
                            {facilities.length > 3 && (
                              <span className="shrink-0 bg-slate-100 text-slate-500 text-[11px] font-medium px-2 py-1 rounded-md">
                                +{facilities.length - 3} lainnya
                              </span>
                            )}
                          </div>
                        )}

                        {/* Harga + Lihat Detail — sebaris, rata bawah */}
                        <div className="mt-auto pt-3">
                          <div className="flex items-end justify-between gap-3 border-t border-slate-100 pt-3">
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                                Mulai Harga
                              </p>
                              <p className="mt-0.5 truncate text-xl font-extrabold tracking-tight text-orange-600">
                                {startingPrice
                                  ? (/an$/i.test(startingPrice.trim()) ? startingPrice : `${startingPrice}an`)
                                  : "Hubungi Kami"}
                              </p>
                            </div>
                            <span className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-orange-500 px-4 py-2.5 text-[13px] font-semibold text-white transition-all group-hover:gap-2 group-hover:bg-orange-600">
                              Lihat Detail <span aria-hidden="true">→</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full py-12 sm:py-16 text-center space-y-4 max-w-md mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto text-xl">
                  🔍
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-gray-900">Proyek Tidak Ditemukan</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Coba ubah kata kunci pencarian atau pilih kategori lainnya.
                  </p>
                </div>
                <button
                  onClick={() => { setActiveTab("Semua"); setSearchQuery(""); }}
                  className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 shadow-md shadow-orange-500/20"
                >
                  Reset Filter
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="mt-12 sm:mt-16"><Contact /></div>
      <div className="mt-8 sm:mt-12"><Footer /></div>
    </div>
  );
}

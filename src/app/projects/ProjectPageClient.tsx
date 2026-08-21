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
      
      {/* Navbar Sticky standar (menempel di atas) */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      {/* Banner Header */}
      <div className="relative text-white pt-12 pb-12 sm:pt-20 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gray-900">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/Banner.png"
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
        {/* Filter Kategori & Search Bar ala News */}
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

        {/* Daftar Kartu Proyek (Grid ala News) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project: Project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="w-full flex justify-start"
                >
                  <div className="w-full bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 flex flex-col group hover:shadow-xl hover:border-orange-200 transition-all duration-300">
                    <Link href={`/projects/${project.id}`} className="flex flex-col h-full">
                      
                      {/* Image Cover Container */}
                      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-gray-100">
                        <Image
                          src={project.imageCover || "/images/placeholder.png"}
                          alt={project.title || "Project"}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        {/* Status Badge */}
                        <div className="absolute top-3 right-3 z-10 flex gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold shadow-md backdrop-blur-md ${
                            project.statusBadge === "Sold" ? "bg-red-500/90 text-white" : "bg-emerald-500/90 text-white"
                          }`}>
                            {project.statusBadge || "Available"}
                          </span>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-1 leading-snug">
                            {project.title}
                          </h3>
                          <p className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                             {project.location}
                          </p>
                          
                        </div>

                        {/* Card Footer: Unit info & Detail Link */}
                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-700">
                            {project.totalUnits || "Unit Ready"} <span className="text-gray-400 font-normal">Unit</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-orange-500 font-semibold text-xs transition-transform duration-300 group-hover:translate-x-1">
                            <span>Lihat Detail</span>
                            <span>→</span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </motion.div>
              ))
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
// src/app/news/NewsPageClient.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants, AnimatePresence } from "framer-motion";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import Contact from "../component/Contact";
import type { NewsItem } from "../../lib/newsService";

export default function NewsPageClient({ newsData }: { newsData: NewsItem[] }) {
  const [activeCategory, setActiveCategory] = useState("Semua");

  // Memastikan halaman otomatis berada di paling atas tanpa animasi saat dimuat
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const categories = ["Semua", ...Array.from(new Set(newsData.map((item) => item.category)))];

  const filteredNews = activeCategory === "Semua"
    ? newsData
    : newsData.filter((item) => item.category?.toLowerCase() === activeCategory.toLowerCase());

  // Variabel Animasi
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
            src="/images/Banner.webp" 
            alt="News Background"
            fill
            sizes="100vw"
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
            <Link 
              href="/" 
              onClick={() => window.scrollTo(0, 0)}
              className="hover:text-orange-400 transition-colors"
            >
              Skyland Property
            </Link>
            <span>›</span>
            <span className="text-orange-400">Berita & Artikel</span>
          </div>

          <h1 className="text-2xl sm:text-5xl font-extrabold tracking-tight">
            Update & <span className="text-orange-500">Berita</span> Terbaru
          </h1>
          
          <p className="text-gray-200 text-xs sm:text-sm max-w-xl font-normal leading-relaxed">
            Temukan berita terbaru, pengumuman, dan artikel menarik seputar perusahaan dan properti kami.
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
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20 scale-105"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="text-xs text-gray-500 font-medium">
            {filteredNews.length} artikel ditemukan
          </div>
        </div>

        {/* Daftar Kartu Berita */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredNews.length > 0 ? (
              filteredNews.map((news) => (
                <motion.div 
                  key={news.id} 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="w-full flex justify-start"
                >
                  <div className="w-full bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 flex flex-col group hover:shadow-xl hover:border-orange-200 transition-all duration-300">
                    <Link href={`/news/${news.id}`} className="flex flex-col h-full">
                      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-gray-100">
                        <Image
                          src={typeof news.image === 'string' && news.image ? news.image : "/images/placeholder.svg"}
                          alt={news.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-orange-500/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold shadow-md">
                            {news.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <span className="text-[11px] text-gray-400 font-medium">{news.date}</span>
                          <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-2 leading-snug">
                            {news.title}
                          </h3>
                          <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                            {news.excerpt}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-500">
                            Skyland Info
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-orange-500 font-semibold text-xs transition-transform duration-300 group-hover:translate-x-1">
                            <span>Baca Selengkapnya</span>
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
                <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-gray-900">Artikel Tidak Ditemukan</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Belum ada artikel yang tersedia untuk kategori <span className="font-semibold text-gray-700">&quot;{activeCategory}&quot;</span>. Silakan pilih kategori lainnya atau reset filter.
                  </p>
                </div>
                <button
                  onClick={() => setActiveCategory("Semua")}
                  className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 shadow-md shadow-orange-500/20"
                >
                  Reset Kategori
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
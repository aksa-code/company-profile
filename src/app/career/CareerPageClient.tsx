// src/app/career/CareerPageClient.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants, AnimatePresence } from "framer-motion";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import Contact from "../component/Contact";
import { getRelativeDate, CareerItem } from "../../lib/careerService";

export default function CareerPageClient({ careersData }: { careersData: CareerItem[] }) {
  const [activeDepartment, setActiveDepartment] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const departments = ["Semua", ...Array.from(new Set(careersData.map((item) => item.department)))];

  const filteredCareers = careersData.filter((item) => {
    const matchesDept = activeDepartment === "Semua" || item.department === activeDepartment;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch && !item.isClosed;
  });

  const careerPageHeader = {
    breadcrumb: "Karier & Lowongan",
    titlePrefix: "Gabung Bersama",
    titleHighlight: "Tim Hebat",
    titleSuffix: "Kami",
    description: "Temukan kesempatan berkarir dan kembangkan potensi terbaik Anda bersama Skyland Property."
  };

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
            src="/images/Banner.png"
            alt="Career Background"
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
            <span className="text-orange-400">{careerPageHeader.breadcrumb}</span>
          </div>

          <h1 className="text-2xl sm:text-5xl font-extrabold tracking-tight">
            {careerPageHeader.titlePrefix} <span className="text-orange-500">{careerPageHeader.titleHighlight}</span> {careerPageHeader.titleSuffix}
          </h1>
          <p className="text-gray-200 text-xs sm:text-sm max-w-xl font-normal leading-relaxed">
            {careerPageHeader.description}
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
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setActiveDepartment(dept)}
                className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                  activeDepartment === dept
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20 scale-105"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Daftar Lowongan */}
        <div className="grid gap-4 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredCareers.length > 0 ? (
              filteredCareers.map((job) => (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="group bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-md transition-all duration-300 hover:shadow-xl hover:border-orange-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <Link href={`/career/${job.id}`} className="space-y-2 max-w-3xl flex-1 cursor-pointer">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-orange-50 text-orange-600 text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full border border-orange-100">
                        {job.department}
                      </span>
                      <span className="bg-gray-100 text-gray-600 text-[10px] sm:text-xs font-medium px-2.5 py-1 rounded-full">
                        {job.type}
                      </span>
                      {job.salary && (
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-100">
                          💰 {job.salary}
                        </span>
                      )}
                      <span className="text-[11px] text-gray-400 font-medium">
                        Diposting {getRelativeDate(job.postedDate)}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-orange-500 transition-colors">
                      {job.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-500 font-medium flex items-center gap-1">
                      📍 {job.location}
                    </p>

                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>
                  </Link>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                    <Link
                      href={`/career/${job.id}`}
                      className="w-full md:w-auto text-center bg-gray-900 hover:bg-orange-500 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md hover:scale-105 duration-300"
                    >
                      Lihat Detail
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-12 sm:py-16 text-center space-y-4 max-w-md mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-gray-900">Belum Ada Lowongan Tersedia</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Coba cari dengan kata kunci lain atau reset filter departemen Anda.
                  </p>
                </div>
                <button
                  onClick={() => { setActiveDepartment("Semua"); setSearchQuery(""); }}
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
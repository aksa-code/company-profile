// src/app/hero/ProjectCard.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { Project } from "../../lib/projectService";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 shadow-md shadow-gray-100 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:border-orange-200 w-[175px] sm:w-[340px] shrink-0 group cursor-pointer block"
    >

      {/* Gambar Proyek & Badge */}
      <div className="relative h-[120px] sm:h-[210px] w-full bg-gray-100 overflow-hidden">
        <Image
          src={project.imageCover || "/images/placeholder.png"}
          alt={project.title}
          fill
          sizes="(max-width: 640px) 175px, 340px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badge Atas */}
        <div className="absolute top-2 left-2 right-2 sm:top-3 sm:left-3 sm:right-3 flex justify-end items-center z-10">
          <span className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold text-white backdrop-blur-md ${
            project.statusBadge === "Sold Out" ? "bg-emerald-600/90" : "bg-orange-500/90"
          }`}>
            {project.statusBadge}
          </span>
        </div>

        {/* Tag Bawah Gambar */}
        <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 flex justify-between items-end z-10">
          <div>
            {project.subBadge && (
              <span className="bg-white/20 backdrop-blur-md text-white text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-md font-medium inline-block mb-0.5 sm:mb-1">
                {project.subBadge}
              </span>
            )}
            <h3 className="text-white text-xs sm:text-base font-bold drop-shadow-md line-clamp-1 sm:line-clamp-none">
              {project.title}
            </h3>
          </div>
          {project.totalUnits && (
            <span className="bg-black/60 backdrop-blur-md text-white text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-md font-semibold">
              {project.totalUnits}
            </span>
          )}
        </div>
      </div>

      {/* Konten Teks & Fasilitas */}
      <div className="p-2.5 sm:p-4 space-y-2 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-[10px] sm:text-xs text-orange-600 font-medium flex items-center gap-1">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{project.location}</span>
          </p>
          <p className="text-gray-500 text-[10px] sm:text-xs mt-0.5 sm:mt-1 leading-relaxed line-clamp-2">
            {project.description}
          </p>

          {/* List Fitur / Fasilitas Kecil */}
          {project.facilities && project.facilities.length > 0 && (
            <div className="hidden sm:flex flex-wrap gap-1.5 mt-2.5 pt-2.5 border-t border-gray-100">
              {project.facilities.slice(0, 3).map((facility, idx) => (
                <span key={idx} className="bg-orange-50 text-orange-700 text-[10px] font-medium px-2 py-0.5 rounded-md">
                  ✓ {facility}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Informasi KPR & Tombol Lihat Detail */}
        <div className="pt-2 sm:pt-2.5 border-t border-gray-100 flex items-center justify-between mt-1">
          <span className="text-[9px] sm:text-[11px] text-gray-500 font-medium">
            KPR: <strong className="text-gray-800">{project.bankKPR || "-"}</strong>
          </span>
          <span className="inline-flex items-center gap-0.5 sm:gap-1 bg-orange-500 group-hover:bg-orange-600 text-white font-semibold text-[10px] sm:text-xs px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all shadow-sm shadow-orange-500/20">
            <span>Detail</span>
            <span className="hidden sm:inline">→</span>
          </span>
        </div>
      </div>

    </Link>
  );
}
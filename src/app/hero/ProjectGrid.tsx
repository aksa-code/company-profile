// src/app/hero/ProjectGrid.tsx

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getAllProjects, Project } from "../../lib/projectService";
import ProjectCard from "./ProjectCard";

export default function ProjectGrid() {
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await getAllProjects();
        setProjectsData(data);
      } catch (error) {
        console.error("Failed to fetch projects in ProjectGrid:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const isScrollable = projectsData.length > 3;
  // Duplikasi data untuk efek infinite loop otomatis di desktop
  const duplicatedProjects = isScrollable ? [...projectsData, ...projectsData] : projectsData;

  return (
    <section id="projects" className="py-10 sm:py-12 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden selection:bg-orange-500 selection:text-white">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Temukan Rumah <span className="text-orange-500">Impian Anda</span>
            </h2>
          </div>
          <div>
            <Link 
              href="/projects" 
              className="inline-flex items-center gap-1 text-orange-500 hover:text-orange-600 font-semibold text-xs sm:text-sm transition-colors"
            >
              <span>Lihat Semua Proyek</span>
              <span>→</span>
            </Link>
          </div>
        </motion.div>

        {/* Container Carousel */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative w-full overflow-hidden py-2"
        >
          {isScrollable && (
            <>
              <div className="absolute top-0 bottom-0 left-0 w-8 sm:w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
              <div className="absolute top-0 bottom-0 right-0 w-8 sm:w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
            </>
          )}

          {isLoading ? (
            <div className="py-10 text-center text-gray-400 text-sm italic">
              Memuat data proyek...
            </div>
          ) : projectsData.length === 0 ? (
            <div className="py-10 text-center text-gray-400 text-sm italic">
              Belum ada proyek yang tersedia.
            </div>
          ) : (
            /* 
              Menggunakan overflow-x-auto murni dengan touch-pan-x dan -webkit-overflow-scrolling 
              agar gesekan jari di HP langsung merespons dengan sangat mulus (native smooth scrolling).
            */
            <div className="w-full overflow-x-auto scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] touch-pan-x pb-3">
              <div className={`flex gap-2.5 sm:gap-4 w-max ${isScrollable ? "animate-auto-scroll hover:[animation-play-state:paused]" : ""}`}>
                {duplicatedProjects.map((project, index) => (
                  <div 
                    key={`${project.id}-${index}`} 
                    className="w-[190px] sm:w-[350px] shrink-0 select-none transition-transform duration-300 hover:scale-[1.02]"
                  >
                    <ProjectCard project={project} />
                  </div>
                ))}
              </div>
            </div>
          )}

        </motion.div>

      </div>

      {/* CSS Keyframes & Pengaturan Touch Helper */}
      <style jsx global>{`
        /*
          Loop mulus: track berisi 2 salinan konten, jadi geser sejauh
          50% + setengah gap. Gap = 10px (mobile, gap-2.5) dan 16px (sm+, gap-4),
          sehingga offset tiap breakpoint dibedakan agar tidak lompat tiap putaran.
        */
        @keyframes autoScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50% - 5px));
          }
        }

        @keyframes autoScrollSm {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50% - 8px));
          }
        }

        .animate-auto-scroll {
          display: flex;
          animation: autoScroll 35s linear infinite;
        }

        @media (min-width: 640px) {
          .animate-auto-scroll {
            animation-name: autoScrollSm;
          }
        }

        /* Saat disentuh atau di-hover, animasi berhenti agar pengguna bisa leluasa swipe manual */
        .animate-auto-scroll:hover,
        .animate-auto-scroll:active,
        .animate-auto-scroll:focus-within {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
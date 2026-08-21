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
  const duplicatedProjects = isScrollable ? [...projectsData, ...projectsData] : projectsData;

  return (
    <section id="projects" className="py-10 sm:py-12 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden selection:bg-orange-500 selection:text-white">
      {/* Bungkus header dan carousel dalam 1 container max-w-6xl yang sama persis */}
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section dengan Animasi Masuk */}
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

        {/* Container Carousel / Grid dengan Animasi Masuk */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative w-full overflow-hidden py-2"
        >
          
          {/* Efek Gradasi Sisi Kiri & Kanan (Hanya muncul jika scrollable) */}
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
            <div 
              className={`w-max ${
                isScrollable 
                  ? "flex gap-3 sm:gap-5 animate-infinite-scroll hover:[animation-play-state:paused]" 
                  : "grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 w-full"
              }`}
            >
              {duplicatedProjects.map((project, index) => (
                <div 
                  key={`${project.id}-${index}`} 
                  className={`${isScrollable ? "w-[175px] sm:w-[350px]" : "w-full"} transition-all duration-500 transform hover:scale-[1.02] hover:z-20 cursor-pointer`}
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          )}

        </motion.div>

      </div>

      {/* CSS Keyframes untuk Auto-Scroll (Hanya dimuat jika scrollable) */}
      {isScrollable && (
        <style jsx global>{`
          @keyframes infiniteScroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-50% - 6px));
            }
          }

          .animate-infinite-scroll {
            display: flex;
            animation: infiniteScroll 35s linear infinite;
          }

          .animate-infinite-scroll:hover {
            animation-play-state: paused;
          }

          @media (min-width: 640px) {
            @keyframes infiniteScroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(calc(-50% - 10px));
              }
            }
          }
        `}</style>
      )}

    </section>
  );
}
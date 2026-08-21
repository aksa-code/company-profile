// src/app/hero/Footer.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { companyInfo } from "../../lib/companyService";
import { getAllProjects, Project } from "../../lib/projectService";

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();
  const [projectsData, setProjectsData] = useState<Project[]>([]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await getAllProjects();
        setProjectsData(data);
      } catch (error) {
        console.error("Failed to fetch projects in Footer:", error);
      }
    }
    fetchProjects();
  }, []);

  // Mengambil nomor admin dengan aman dari companyInfo.contact
  const rawPhone = companyInfo?.contact?.phone ?? "";
  const displayPhone = rawPhone && typeof rawPhone === "string" && rawPhone.startsWith("62")
    ? "0" + rawPhone.slice(2)
    : rawPhone;

  // Menggunakan nomor kontak dari companyInfo sebagai cadangan jika hrdNumber tidak tersedia
  const rawHrdPhone = companyInfo?.contact?.phone ?? "";
  const cleanHrdDigits = rawHrdPhone ? rawHrdPhone.replace(/[\s+-]/g, "") : "";
  const displayHrdPhone = cleanHrdDigits && cleanHrdDigits.startsWith("62")
    ? "0" + cleanHrdDigits.slice(2)
    : cleanHrdDigits;

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      e.preventDefault();
      router.push("/");
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="bg-white text-gray-500 pt-10 sm:pt-12 pb-6 px-4 sm:px-6 lg:px-8 border-t border-gray-100 overflow-hidden">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 mb-8 sm:mb-10">
        
        {/* Kolom 1 */}
        <div className="sm:col-span-2 lg:col-span-4 pr-0 lg:pr-6">
          <Link href="/" onClick={handleLogoClick} className="inline-block mb-3 sm:mb-4 group">
            <div className="relative w-52 sm:w-60 h-9 sm:h-10 -ml-1 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/images/hero/Logo Skyland.png"
                alt={`${companyInfo.name} Logo`}
                fill
                sizes="240px"
                className="object-contain object-left"
              />
            </div>
          </Link>
          <p className="text-xs sm:text-sm leading-relaxed mb-4 max-w-sm sm:max-w-none">
            {companyInfo.description}
          </p>
        </div>

        {/* Kolom 2: Navigation */}
        <div className="sm:col-span-1 lg:col-span-2">
          <h4 className="text-[#1e293b] font-semibold text-sm mb-3 sm:mb-4">Navigation</h4>
          <ul className="flex flex-col gap-2 text-xs sm:text-sm">
            {[
              { name: "Home", href: "/" },
              { name: "About", href: "/about" },
              { name: "Projects", href: "/projects" },
              { name: "News", href: "/news" },
              { name: "Career", href: "/career" },
            ].map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link 
                    href={item.href} 
                    onClick={(e) => {
                      if (isActive) {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    className="hover:text-orange-500 transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Kolom 3: Projects */}
        <div className="sm:col-span-1 lg:col-span-3">
          <h4 className="text-[#1e293b] font-semibold text-sm mb-3 sm:mb-4">Projects</h4>
          <ul className="flex flex-col gap-2 text-xs sm:text-sm">
            {projectsData.length === 0 ? (
              <li className="text-gray-400 italic">Loading projects...</li>
            ) : (
              projectsData.map((project) => {
                const projectHref = `/projects/${project.id}`;
                const isActive = pathname === projectHref;

                return (
                  <li key={project.id}>
                    <Link 
                      href={projectHref} 
                      onClick={(e) => {
                        if (isActive) {
                          e.preventDefault();
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                      className="hover:text-orange-500 transition-all duration-300 hover:translate-x-1 line-clamp-1 inline-block"
                    >
                      {project.title}
                    </Link>
                  </li>
                );
              })
            )}
          </ul>
        </div>

        {/* Kolom 4: Contact */}
        <div className="sm:col-span-2 lg:col-span-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
          <h4 className="text-[#1e293b] font-semibold text-sm mb-3 sm:mb-4 pt-2 sm:pt-0">Contact</h4>
          <ul className="flex flex-col gap-2.5 text-xs sm:text-sm">
            <li className="flex items-start gap-2.5">
              <span className="text-orange-500 mt-0.5 flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              <span>{companyInfo.address}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="text-orange-500 flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </span>
              <span>{displayPhone} (Admin)</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="text-orange-500 flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <a 
                href={`https://wa.me/${cleanHrdDigits}?text=${encodeURIComponent("Halo HRD Skyland Property, saya ingin bertanya seputar informasi karier.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-500 transition-colors"
              >
                {displayHrdPhone} (HRD)
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="text-orange-500 flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <span>{companyInfo.contact?.email}</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center pt-5 sm:pt-6 border-t border-gray-100 text-xs sm:text-sm gap-3 md:gap-0 text-center md:text-left">
        <p>&copy; {new Date().getFullYear()} {companyInfo.name} — All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
// src/app/component/Navbar.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { companyInfo } from "../../lib/companyData";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "News", href: "/news" },
    { name: "Career", href: "/career" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsOpen(false);
    e.preventDefault();

    // Navigasi SPA (tanpa full reload) — lebih cepat, state terjaga,
    // dan klik-tengah / Ctrl+klik tetap membuka tab baru secara native.
    router.push(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo / Nama Brand */}
        <Link 
          href="/" 
          onClick={(e) => handleNavClick(e, "/")}
          className="flex items-center gap-3 group"
        >
          <div className="relative w-36 h-10 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/images/hero/Logo Skyland.png"
              alt={`${companyInfo.name} Logo`}
              fill
              sizes="144px"
              className="object-contain object-left"
              priority
              loading="eager"
            />
          </div>
        </Link>

        {/* Menu Navigasi Desktop */}
        <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-gray-600">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`transition-all duration-300 relative py-1 hover:-translate-y-0.5 ${
                  isActive 
                    ? "text-orange-600 font-bold" 
                    : "hover:text-orange-500"
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded-full animate-fade-in-up duration-300" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Tombol Aksi Cepat (Desktop) & Hamburger Menu (Mobile) */}
        <div className="flex items-center gap-4">
          <Link
            href="/contact"
            onClick={(e) => handleNavClick(e, "/contact")}
            className={`hidden sm:inline-block text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-300 hover:scale-105 shadow-md ${
              pathname === "/contact"
                ? "bg-orange-600 text-white shadow-orange-600/30 ring-2 ring-orange-400 ring-offset-2"
                : "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20"
            }`}
          >
            Contact Us
          </Link>

          {/* Tombol Hamburger Mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl text-gray-600 hover:text-orange-500 hover:bg-gray-50 transition-all duration-300 focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg className="w-6 h-6 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

      </div>

      {/* Dropdown Menu Mobile dengan Animasi Halus */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl py-5 px-6 animate-fade-in-up duration-300">
          <nav className="flex flex-col space-y-4 text-[17px] font-bold text-gray-600">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`transition-all duration-300 flex items-center justify-between ${
                    isActive 
                      ? "text-orange-600 font-bold pl-2 border-l-4 border-orange-500 bg-orange-50/50 py-1.5 rounded-r-lg shadow-sm" 
                      : "hover:text-orange-500 hover:pl-1 font-bold"
                  }`}
                >
                  <span>{link.name}</span>
                </Link>
              );
            })}
            <div className="pt-2">
              <Link
                href="/contact"
                onClick={(e) => handleNavClick(e, "/contact")}
                className={`block w-full text-center text-sm font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:scale-[1.02] shadow-md ${
                  pathname === "/contact"
                    ? "bg-orange-600 text-white shadow-orange-600/30"
                    : "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20"
                }`}
              >
                Contact Us
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
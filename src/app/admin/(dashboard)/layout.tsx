// src/app/admin/layout.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Helper untuk mendeteksi menu aktif
  const isActive = (path: string) => pathname === path;

  return (
    <div className="h-screen bg-slate-100 flex flex-col md:flex-row overflow-hidden relative selection:bg-orange-500 selection:text-white">

      {/* Mobile Top Header - Diposisikan fixed agar benar-benar STUCK di atas saat discroll */}
      <div className="md:hidden bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 z-40 fixed top-0 left-0 right-0 shadow-lg">
        <div>
          <h1 className="font-black text-base tracking-wider text-orange-400">Skyland Admin</h1>
          <p className="text-[10px] text-slate-400">Panel Pengelola Konten</p>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 active:scale-95 transition shadow-sm"
          aria-label="Toggle Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {sidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Sidebar Admin (Fixed di Mobile sebagai Drawer, Sticky/Full Height di Desktop) */}
      <aside className={`
        fixed md:sticky top-0 inset-y-0 left-0 z-50 w-64 h-full bg-slate-900 text-white flex flex-col justify-between border-r border-slate-800
        transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="p-6 space-y-8 overflow-y-auto">
          {/* Header Brand */}
          <div className="hidden md:block space-y-1">
            <h1 className="font-black text-lg tracking-wider text-orange-400">Skyland Admin</h1>
            <p className="text-xs text-slate-400">Panel Pengelola Konten</p>
          </div>

          {/* Navigasi Menu dengan Indikator Aktif & Ikon */}
          <nav className="space-y-1.5 pt-14 md:pt-0 text-sm font-medium">
            <Link
              href="/admin/dashboard"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive("/admin/dashboard")
                  ? "bg-orange-500 text-white font-semibold shadow-md shadow-orange-500/20"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Dashboard
            </Link>

            <Link
              href="/admin/leads"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive("/admin/leads")
                  ? "bg-orange-500 text-white font-semibold shadow-md shadow-orange-500/20"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Kelola Leads
            </Link>

            <Link
              href="/admin/news"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive("/admin/news")
                  ? "bg-orange-500 text-white font-semibold shadow-md shadow-orange-500/20"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              Kelola Berita
            </Link>

            <Link
              href="/admin/career"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive("/admin/career")
                  ? "bg-orange-500 text-white font-semibold shadow-md shadow-orange-500/20"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Kelola Lowongan
            </Link>

            <Link
              href="/admin/project"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive("/admin/project")
                  ? "bg-orange-500 text-white font-semibold shadow-md shadow-orange-500/20"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Kelola Projek
            </Link>
          </nav>
        </div>

        {/* Footer Sidebar / Kembali ke Website */}
        <div className="p-6 border-t border-slate-800 bg-slate-900">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-orange-400 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Website Utama
          </Link>
        </div>
      </aside>

      {/* Overlay Gelap di Mobile Saat Sidebar Terbuka */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Main Content Area - Diberikan padding-top khusus di mobile agar tidak tertutup header fixed */}
      <main className="flex-1 pt-20 md:pt-8 p-4 sm:p-8 overflow-y-auto w-full h-full">
        {children}
      </main>
    </div>
  );
}
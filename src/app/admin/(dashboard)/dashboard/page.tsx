// src/app/admin/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

export default function AdminDashboard() {
  const router = useRouter();
  const [adminName, setAdminName] = useState("Admin");
  const [loading, setLoading] = useState(true);

  // State untuk statistik dinamis dari database
  const [stats, setStats] = useState({
    projects: 0,
    news: 0,
    careers: 0,
    visitors: 0,
    leads: 0,
    applicants: 0,
  });

  // State untuk data tabel
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [recentApplicants, setRecentApplicants] = useState<any[]>([]);

  useEffect(() => {
    async function checkAuthAndFetchData() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
          router.replace("/admin/login");
          return;
        }

        const user = session.user;
        const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "Admin";
        setAdminName(name);

        // Ambil data secara parallel
        const [projectsRes, newsRes, careersRes, leadsRes, visitorsRes, applicantsRes] = await Promise.all([
          supabase.from("projects").select("*", { count: "exact", head: true }),
          supabase.from("news").select("*", { count: "exact", head: true }),
          supabase.from("career").select("*", { count: "exact", head: true }),
          supabase.from("leads").select("*", { count: "exact", head: true }),
          supabase.from("page_views").select("*", { count: "exact", head: true }),
          supabase.from("career_applications").select("*", { count: "exact", head: true }),
        ]);

        setStats({
          projects: projectsRes.count || 0,
          news: newsRes.count || 0,
          careers: careersRes.count || 0,
          visitors: visitorsRes.count || 0,
          leads: leadsRes.count || 0,
          applicants: applicantsRes.count || 0,
        });

        // Ambil data leads terbaru
        const { data: leadsData, error: leadsError } = await supabase
          .from("leads")
          .select("*")
          .order("created_at", { ascending: false });

        if (!leadsError && leadsData) {
          setRecentLeads(leadsData);
        }

        // Ambil data pelamar karier terbaru
        const { data: applicantsData, error: applicantsError } = await supabase
          .from("career_applications")
          .select("*")
          .order("created_at", { ascending: false });

        if (!applicantsError && applicantsData) {
          setRecentApplicants(applicantsData);
        }

      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    checkAuthAndFetchData();
  }, [router]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(`Gagal keluar: ${error.message}`);
    } else {
      router.replace("/admin/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-600 font-medium gap-3">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin shadow-md" />
        <p className="text-sm tracking-wide animate-pulse text-slate-500">Memuat Dashboard Eksklusif...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
      
      {/* Banner Sambutan Modern */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-3xl p-6 sm:p-10 shadow-2xl text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border border-slate-800/80">
        <div className="absolute -right-12 -bottom-12 w-72 h-72 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
            Panel Kontrol Utama
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Selamat Datang, <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 capitalize">{adminName}</span>! 👋
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
            Pantau performa trafik, data prospek pembeli, serta rekrutmen pelamar secara real-time dari database Skyland Nusantara.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="relative z-10 shrink-0 bg-red-600/90 hover:bg-red-600 text-white px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-lg shadow-red-900/20 hover:scale-105 active:scale-95 flex items-center gap-2 border border-red-500/30"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Keluar Sistem
        </button>
      </div>

      {/* Grid Kartu Statistik Interaktif */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Total Project */}
        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 hover:border-orange-200 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Live</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Proyek Perumahan</p>
          <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">{stats.projects}</h3>
        </div>

        {/* Total Berita */}
        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 hover:border-blue-200 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
            </div>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">Artikel</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Berita & Artikel</p>
          <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">{stats.news}</h3>
        </div>

        {/* Total Career */}
        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 hover:border-purple-200 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">Lowongan</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Lowongan (Career)</p>
          <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">{stats.careers}</h3>
        </div>

        {/* Total Pelamar / Applicants */}
        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 hover:border-indigo-200 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">Kandidat</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pelamar (Applicants)</p>
          <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">{stats.applicants} <span className="text-sm font-semibold text-slate-500">Orang</span></h3>
        </div>

        {/* Total Pengunjung Website */}
        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 hover:border-emerald-200 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Traffic</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pengunjung Website</p>
          <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">{stats.visitors.toLocaleString()}</h3>
        </div>

        {/* Total Leads WhatsApp */}
        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 hover:border-rose-200 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            </div>
            <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">Hot Leads</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Tanya Unit / Leads</p>
          <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">{stats.leads} <span className="text-sm font-semibold text-slate-500">Orang</span></h3>
        </div>

      </div>

      {/* Bagian Tabel: Pelamar Karier Terbaru */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100 border border-slate-100 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">Pelamar Karier Terbaru</h3>
            <p className="text-xs text-slate-500 mt-0.5">Daftar kandidat yang melamar lowongan pekerjaan via WhatsApp.</p>
          </div>
          <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3.5 py-1.5 rounded-xl border border-indigo-100 shadow-sm">
            Total Pelamar: {recentApplicants.length}
          </span>
        </div>

        <div className="max-h-[340px] overflow-y-auto overflow-x-auto pr-1 custom-scrollbar rounded-2xl border border-slate-100">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-md z-10 shadow-xs">
              <tr className="border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Nama Pelamar & Posisi</th>
                <th className="py-3.5 px-4">Nomor WhatsApp</th>
                <th className="py-3.5 px-4">Waktu Melamar</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-medium text-slate-700">
              {recentApplicants.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-slate-400 italic">
                    Belum ada data pelamar karier yang masuk ke sistem.
                  </td>
                </tr>
              ) : (
                recentApplicants.map((applicant) => (
                  <tr key={applicant.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                        {applicant.applicant_name}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 font-normal">
                        Posisi: <span className="font-semibold text-slate-800">{applicant.position_title}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-slate-600 bg-slate-50/50 rounded-lg">
                      {applicant.whatsapp_number}
                    </td>
                    <td className="py-4 px-4 text-slate-500 text-xs">
                      {new Date(applicant.created_at).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold capitalize shadow-2xs ${
                        applicant.status === 'baru' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                        applicant.status === 'dihubungi' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {applicant.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bagian Tabel: Aktivitas Leads Terbaru */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100 border border-slate-100 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">Aktivitas Calon Pembeli Terbaru</h3>
            <p className="text-xs text-slate-500 mt-0.5">Catatan interaksi saat pengunjung mengklik tombol "Tanya Unit".</p>
          </div>
          <span className="text-xs font-bold bg-orange-50 text-orange-700 px-3.5 py-1.5 rounded-xl border border-orange-100 shadow-sm">
            Total Leads: {recentLeads.length}
          </span>
        </div>

        <div className="max-h-[340px] overflow-y-auto overflow-x-auto pr-1 custom-scrollbar rounded-2xl border border-slate-100">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-md z-10 shadow-xs">
              <tr className="border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Pesan / Proyek yang Ditanyakan</th>
                <th className="py-3.5 px-4">Waktu Akses</th>
                <th className="py-3.5 px-4">Status Prospek</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-medium text-slate-700">
              {recentLeads.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-10 text-center text-slate-400 italic">
                    Belum ada data leads yang terekam di database.
                  </td>
                </tr>
              ) : (
                recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      {lead.unit_name}
                    </td>
                    <td className="py-4 px-4 text-slate-500 text-xs">
                      {new Date(lead.created_at).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold capitalize shadow-2xs ${
                        lead.status === 'baru' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                        lead.status === 'dihubungi' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
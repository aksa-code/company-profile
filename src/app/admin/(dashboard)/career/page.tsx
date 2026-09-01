// src/app/admin/career/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCareers, deleteCareer, CareerItem } from "../../../../lib/careerService";
import { supabase } from "../../../../lib/supabase";
import NotificationModal from "../../../component/ui/NotificationModal";

export default function AdminCareerPage() {
  const router = useRouter();
  const [careers, setCareers] = useState<CareerItem[]>([]);
  const [loading, setLoading] = useState(true);

  // State untuk data pelamar karir
  const [applications, setApplications] = useState<any[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);

  // State untuk kontrol NotificationModal
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "success" | "danger" | "warning" | "info";
    title: string;
    message: string;
    showCancel?: boolean;
    confirmText?: string;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  const fetchCareerData = async () => {
    setLoading(true);
    const data = await getCareers();
    setCareers(data);
    setLoading(false);
  };

  const fetchApplicationsData = async () => {
    setLoadingApps(true);
    const { data, error } = await supabase
      .from("career_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setApplications(data);
    }
    setLoadingApps(false);
  };

  useEffect(() => {
    fetchCareerData();
    fetchApplicationsData();
  }, []);

  const handleDelete = (id: string) => {
    setModalConfig({
      isOpen: true,
      type: "warning",
      title: "Konfirmasi Hapus",
      message: "Apakah Anda yakin ingin menghapus lowongan ini dari sistem?",
      showCancel: true,
      confirmText: "Hapus",
      onConfirm: async () => {
        try {
          await deleteCareer(id);
          setModalConfig({
            isOpen: true,
            type: "success",
            title: "Berhasil!",
            message: "Lowongan berhasil dihapus.",
            onConfirm: () => fetchCareerData(),
          });
        } catch (error: any) {
          setModalConfig({
            isOpen: true,
            type: "danger",
            title: "Gagal Menghapus",
            message: "Terjadi kesalahan: " + error.message,
          });
        }
      },
    });
  };

  const handleUpdateAppStatus = async (appId: any, newStatus: string) => {
    // Eksekusi update ke database supabase berdasarkan id
    const { data, error } = await supabase
      .from("career_applications")
      .update({ status: newStatus })
      .eq("id", appId)
      .select();

    if (error) {
      setModalConfig({
        isOpen: true,
        type: "danger",
        title: "Gagal Memperbarui",
        message: "Gagal memperbarui status: " + error.message,
      });
    } else if (!data || data.length === 0) {
      // Kemungkinan RLS (Row Level Security) aktif dan memblokir update, atau ID tidak ditemukan
      setModalConfig({
        isOpen: true,
        type: "danger",
        title: "Gagal Memperbarui",
        message: "Perubahan tidak disimpan. Periksa kebijakan RLS (Row Level Security) tabel career_applications di Supabase Anda.",
      });
    } else {
      fetchApplicationsData();
      setModalConfig({
        isOpen: true,
        type: "success",
        title: "Berhasil",
        message: "Status pelamar berhasil diperbarui.",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-12">
      
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Kelola Lowongan Karier</h1>
          <p className="text-slate-500 text-sm mt-1">Tambah, edit, atau tutup lowongan pekerjaan perusahaan.</p>
        </div>
        <button
          onClick={() => router.push("/admin/career/create")}
          className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-2xl font-semibold text-sm transition shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-98 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Tambah Lowongan
        </button>
      </div>

      {/* Konten Utama / Tabel Lowongan */}
      {loading ? (
        <div className="min-h-[30vh] flex items-center justify-center text-slate-600 font-medium bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            Memuat data lowongan...
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-black text-slate-900">Daftar Lowongan Aktif & Ditutup</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/70">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Posisi</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Departemen</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tipe</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Gaji</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {careers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                        </div>
                        <p className="text-slate-500 text-sm font-medium">Belum ada data lowongan pekerjaan.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  careers.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900 text-sm">{item.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">{item.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700">
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">{item.salary || "-"}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${item.isClosed ? 'bg-red-50 text-red-600 border border-red-200/50' : 'bg-emerald-50 text-emerald-600 border border-emerald-200/50'}`}>
                          {item.isClosed ? 'Ditutup' : 'Aktif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => router.push(`/admin/career/edit/${item.id}`)} 
                            className="px-3 py-1.5 text-orange-600 hover:bg-orange-50 rounded-xl transition font-semibold text-xs border border-orange-200/60 cursor-pointer"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)} 
                            className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-xl transition font-semibold text-xs border border-red-200/60 cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION: Daftar Pelamar Masuk (Career Applications) */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Daftar Pelamar Masuk</h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">Daftar kandidat yang melamar lowongan melalui tombol WhatsApp / Glints.</p>
          </div>
          <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-xl border border-indigo-100">
            {applications.length} Total Pelamar
          </span>
        </div>

        {loadingApps ? (
          <div className="py-12 flex items-center justify-center text-slate-500 text-sm font-medium">
            Memuat data pelamar...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/70">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Kandidat</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Posisi Dilamar</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Sumber / Platform</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Waktu Masuk</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Status Pelamar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">
                      Belum ada data pelamar yang masuk ke database.
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-slate-900">{app.applicant_name || "-"}</div>
                        <div className="text-xs text-slate-500 font-medium">{app.whatsapp_number || "-"}</div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">
                        {app.position_title}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">
                          {app.source || "WhatsApp"}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {app.created_at ? new Date(app.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) : "-"}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <select
                          value={app.status || "baru"}
                          onChange={(e) => handleUpdateAppStatus(app.id, e.target.value)}
                          className={`text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 font-bold cursor-pointer transition ${
                            app.status === 'baru' ? 'bg-orange-50 text-orange-600 border border-orange-200 focus:ring-orange-500' :
                            app.status === 'dihubungi' ? 'bg-blue-50 text-blue-600 border border-blue-200 focus:ring-blue-500' :
                            app.status === 'diterima' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 focus:ring-emerald-500' :
                            'bg-red-50 text-red-600 border border-red-200 focus:ring-red-500'
                          }`}
                        >
                          <option value="baru" className="bg-white text-slate-700">Baru</option>
                          <option value="dihubungi" className="bg-white text-slate-700">Dihubungi</option>
                          <option value="diterima" className="bg-white text-slate-700">Diterima</option>
                          <option value="ditolak" className="bg-white text-slate-700">Ditolak</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Notifikasi / Konfirmasi */}
      <NotificationModal
        isOpen={modalConfig.isOpen}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText || "OK"}
        onConfirm={() => {
          if (modalConfig.onConfirm) modalConfig.onConfirm();
          setModalConfig((prev) => ({ ...prev, isOpen: false, showCancel: false }));
        }}
        onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false, showCancel: false }))}
      />

    </div>
  );
}
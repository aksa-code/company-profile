// src/app/admin/project/[id]/page.tsx
'use client';

import { useState, useEffect, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getProjectById, Project } from '../../../../../lib/projectService';
import { supabase } from '../../../../../lib/supabase';
import Link from 'next/link';
import NotificationModal from '../../../../component/ui/NotificationModal'; // Sesuaikan path import komponen modal Anda

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  // State untuk kontrol NotificationModal
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: 'success' | 'danger' | 'warning' | 'info';
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Fetch Data Proyek menggunakan service getProjectById
  const fetchData = useCallback(async () => {
    setLoading(true);
    const data = await getProjectById(projectId);

    if (!data) {
      setModalConfig({
        isOpen: true,
        type: 'danger',
        title: 'Tidak Ditemukan',
        message: 'Proyek tidak ditemukan di dalam sistem.',
        confirmText: 'Kembali',
        cancelText: '',
        onConfirm: () => {
          setModalConfig(prev => ({ ...prev, isOpen: false }));
          router.push('/admin/project');
        }
      });
      setLoading(false);
      return;
    }

    setProject(data);
    setLoading(false);
  }, [projectId, router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount sekali saat halaman dibuka; perilaku disengaja dan tidak diubah
    void fetchData();
  }, [fetchData]);

  // Fungsi Eksekusi Hapus Unit
  const executeDeleteUnit = async (unitId: string) => {
    try {
      // 1. Ambil data unit terlebih dahulu untuk mendapatkan URL gambar + galeri
      const { data: unitData, error: fetchError } = await supabase
        .from('unit_types')
        .select('image, gallery')
        .eq('id', unitId)
        .single();

      if (fetchError) throw new Error('Gagal mengambil data unit untuk dihapus.');

      // 2. Jika unit punya gambar di Supabase Storage, hapus filenya
      if (unitData && unitData.image) {
        const fileName = unitData.image.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('house-type-images')
            .remove([fileName]);
        }
      }

      // 2b. Hapus file-file galeri di bucket tipe-detail
      const galleryArr = Array.isArray(unitData?.gallery) ? unitData.gallery : [];
      const galleryPaths = galleryArr
        .map((g: unknown) => {
          const url = typeof g === 'string' ? g : (g as { url?: string })?.url;
          if (!url || typeof url !== 'string') return null;
          const marker = '/storage/v1/object/public/tipe-detail/';
          const idx = url.indexOf(marker);
          return idx === -1 ? url.split('/').pop() : url.slice(idx + marker.length).split('?')[0];
        })
        .filter((x): x is string => !!x);
      if (galleryPaths.length > 0) {
        await supabase.storage.from('tipe-detail').remove(galleryPaths);
      }

      // 3. Hapus baris data dari database tabel unit_types
      const { error: deleteError } = await supabase
        .from('unit_types')
        .delete()
        .eq('id', unitId);

      if (deleteError) throw new Error(deleteError.message);

      setModalConfig({
        isOpen: true,
        type: 'success',
        title: 'Berhasil Dihapus',
        message: 'Unit berhasil dihapus dari sistem!',
        confirmText: 'OK',
        cancelText: '',
        onConfirm: () => {
          setModalConfig(prev => ({ ...prev, isOpen: false }));
          fetchData(); // Refresh data setelah hapus
        }
      });
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui';
      setModalConfig({
        isOpen: true,
        type: 'danger',
        title: 'Gagal Menghapus',
        message: 'Gagal menghapus unit: ' + errMessage,
        confirmText: 'Tutup',
        cancelText: '',
        onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false }))
      });
    }
  };

  // Fungsi Pemicu Modal Konfirmasi Hapus Unit
  const handleDeleteUnitClick = (unitId: string) => {
    setModalConfig({
      isOpen: true,
      type: 'warning',
      title: 'Konfirmasi Hapus Unit',
      message: 'Yakin ingin menghapus tipe unit ini beserta file gambarnya?',
      confirmText: 'Ya, Hapus',
      cancelText: 'Batal',
      onConfirm: () => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
        executeDeleteUnit(unitId);
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-600 font-medium">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          Memuat detail proyek...
        </div>
      </div>
    );
  }

  if (!project) {
    // Tetap render modal agar notifikasi "Tidak Ditemukan" bisa tampil
    // (fetchData yang gagal sudah mengisi modalConfig + mematikan loading).
    return (
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        <NotificationModal
          isOpen={modalConfig.isOpen}
          type={modalConfig.type}
          title={modalConfig.title}
          message={modalConfig.message}
          confirmText={modalConfig.confirmText}
          cancelText={modalConfig.cancelText}
          onConfirm={modalConfig.onConfirm}
          onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        />
      </div>
    );
  }

  // Mendapatkan daftar unit dari relasi unitTypes / unit_types yang sudah dipetakan service
  const units = project.unitTypes || project.unit_types || [];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">

      {/* Header Proyek */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{project.title}</h1>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-600 border border-orange-500/20">
              {project.statusBadge || project.status_badge || 'Available'}
            </span>

          </div>
          <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5 pt-1">
            <span>📍</span> {project.location}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/project"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition"
          >
            &larr; Kembali
          </Link>
          <Link
            href={`/admin/project/edit/${project.id}`}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-98"
          >
            Edit Proyek
          </Link>
        </div>
      </div>

      {/* Bagian Daftar Unit Rumah */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Daftar Tipe Unit Rumah</h2>
            <p className="text-sm text-slate-500 mt-0.5">Kelola varian unit yang tersedia di dalam proyek ini.</p>
          </div>
          <Link
            href={`/admin/project/${projectId}/tipe/create`}
            className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-98 text-center"
          >
            <span>+</span> Tambah Tipe Unit
          </Link>
        </div>

        {/* Grid Unit */}
        {units.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center space-y-3 shadow-sm">
            <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mx-auto text-xl">
              🏠
            </div>
            <p className="text-slate-800 font-bold">Belum ada tipe unit yang ditambahkan</p>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">Silakan klik tombol &quot;Tambah Tipe Unit&quot; di atas untuk memasukkan varian unit rumah.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {units.map((unit) => (
              <div key={unit.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm flex flex-col group hover:border-orange-200 transition">
                {unit.image && (
                  <div className="relative w-full h-48 overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element -- pratinjau admin ukuran dinamis; optimasi next/image tidak diperlukan di sini */}
                <img src={unit.image} alt={unit.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-black text-lg text-slate-900 group-hover:text-orange-600 transition">{unit.name}</h3>
                      {unit.isSoldOut && (
                        <span className="px-2.5 py-0.5 bg-red-500/10 text-red-600 border border-red-500/20 text-xs font-bold rounded-full">
                          Habis
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-orange-600">Start: {unit.priceStarting || unit.price_starting}</p>
                    {Array.isArray(unit.gallery) && unit.gallery.length > 0 && (
                      <p className="text-xs font-semibold text-slate-500">
                        📷 {unit.gallery.length} foto galeri (bucket tipe-detail)
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 pt-1">
                      <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                        🛏️ {unit.bedrooms || 0} Bedroom
                      </span>
                      <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                        🛁 {unit.bathrooms || 0} Bathroom
                      </span>
                      <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                        🍳 {unit.kitchen ?? 1} Kitchen
                      </span>
                      <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                        🚗 {unit.carport ?? 1} Carport
                      </span>
                    </div>

                    {unit.specs && (
                      <p className="text-xs text-slate-600 mt-2 bg-orange-50/30 p-3 rounded-2xl border border-orange-100/60 leading-relaxed">
                        {unit.specs}
                      </p>
                    )}
                  </div>

                  {/* Tombol Aksi: Edit & Hapus Unit */}
                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                    <Link
                      href={`/admin/project/${projectId}/tipe/edit/${unit.id}`}
                      className="px-3.5 py-1.5 text-xs font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-xl transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteUnitClick(unit.id)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition"
                    >
                      Hapus
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notification Modal Global */}
      <NotificationModal
        isOpen={modalConfig.isOpen}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        onConfirm={modalConfig.onConfirm}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
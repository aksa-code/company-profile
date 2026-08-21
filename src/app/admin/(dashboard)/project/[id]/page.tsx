// src/app/admin/project/[id]/page.tsx
'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { getProjectById, Project } from '../../../../../lib/projectService';
import { supabase } from '../../../../../lib/supabase';
import Link from 'next/link';

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch Data Proyek menggunakan service getProjectById
  const fetchData = async () => {
    setLoading(true);
    const data = await getProjectById(projectId);

    if (!data) {
      alert('Proyek tidak ditemukan');
      router.push('/admin/project');
      return;
    }

    setProject(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [projectId]);

  // Fungsi Hapus Unit
  const handleDeleteUnit = async (unitId: string) => {
    if (!confirm('Yakin ingin menghapus tipe unit ini?')) return;

    const { error } = await supabase.from('unit_types').delete().eq('id', unitId);
    if (error) {
      alert('Gagal menghapus unit: ' + error.message);
    } else {
      fetchData(); // Refresh data setelah hapus
    }
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

  if (!project) return null;

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
                    
                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 pt-1">
                      <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                        🛏️ {unit.bedrooms || 0} Kamar Tidur
                      </span>
                      <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                        🛁 {unit.bathrooms || 0} Kamar Mandi
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
                      onClick={() => handleDeleteUnit(unit.id)}
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
    </div>
  );
}
// src/app/admin/project/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../../../lib/supabase';

export default function AdminProjectsPage() {
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error.message);
    } else {
      setProjectsList(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus proyek ini?')) return;

    const { error } = await supabase.from('projects').delete().eq('id', id);
    
    if (error) {
      alert('Gagal menghapus proyek: ' + error.message);
    } else {
      fetchProjects();
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Kelola Proyek Properti</h1>
          <p className="text-slate-500 text-sm mt-1">Tambah, edit, atau hapus data proyek properti di dalam sistem.</p>
        </div>
        <Link
          href="/admin/project/create"
          className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl text-sm font-semibold transition shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-98 text-center"
        >
          <span>+</span> Tambah Proyek Baru
        </Link>
      </div>

      {/* Konten Tabel / Loading / Empty State */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center text-slate-600 font-medium">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            Memuat data proyek...
          </div>
        </div>
      ) : projectsList.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mx-auto text-xl">
            📂
          </div>
          <p className="text-slate-800 font-bold">Belum ada proyek yang diunggah</p>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">Silakan klik tombol &quot;Tambah Proyek Baru&quot; di atas untuk mulai memasukkan data properti.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="p-4 sm:p-5">Nama Proyek</th>
                  <th className="p-4 sm:p-5">Kawasan</th>
                  <th className="p-4 sm:p-5">Status</th>
                  <th className="p-4 sm:p-5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {projectsList.map((item) => (
                  <tr key={item.id} className="hover:bg-orange-50/20 transition group">
                    
                    <td className="p-4 sm:p-5 font-bold text-slate-900 group-hover:text-orange-600 transition">
                      {item.title}
                    </td>
                    
                    <td className="p-4 sm:p-5 text-slate-600 font-medium">
                      {item.category || '-'}
                    </td>
                    
                    <td className="p-4 sm:p-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        item.status_badge === 'Completed' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                        item.status_badge === 'On Progress' ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20' :
                        item.status_badge === 'Available' ? 'bg-green-500/10 text-green-600 border border-green-500/20' :
                        'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                      }`}>
                        {item.status_badge || 'Available'}
                      </span>
                    </td>
                    
                    <td className="p-4 sm:p-5 text-center">
                      <div className="inline-flex items-center justify-center gap-1.5 flex-wrap">
                        <Link
                          href={`/admin/project/${item.id}`}
                          className="inline-flex items-center text-slate-700 hover:text-slate-900 font-semibold text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition"
                        >
                          Buka
                        </Link>
                        <Link
                          href={`/admin/project/edit/${item.id}`}
                          className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold text-xs bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-xl transition"
                        >
                          Update
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="inline-flex items-center text-red-600 hover:text-red-700 font-semibold text-xs bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
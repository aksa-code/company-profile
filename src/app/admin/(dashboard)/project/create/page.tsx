// src/app/admin/project/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../../lib/supabase';
import Link from 'next/link';
import NotificationModal from '../../../../component/ui/NotificationModal'; // Sesuaikan path import komponen modal Anda

const LIST_BANK_KPR = ["BCA", "BRI", "BNI", "BSI", "BTN", "Mandiri", "BSN"];

export default function CreateProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [statusBadge, setStatusBadge] = useState('Available');
  const [totalUnits, setTotalUnits] = useState('');
  const [location, setLocation] = useState('');
  const [mapsUrl, setMapsUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [clusterConcept, setClusterConcept] = useState('');
  const [security, setSecurity] = useState('');

  const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
  
  const [facility1, setFacility1] = useState('');
  const [facility2, setFacility2] = useState('');
  const [facility3, setFacility3] = useState('');

  // State untuk efek visual Drag and Drop
  const [isDragging, setIsDragging] = useState(false);

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

  const generateId = (text: string) => text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');

  const toggleBank = (bank: string) => {
    if (selectedBanks.includes(bank)) {
      setSelectedBanks(selectedBanks.filter((b) => b !== bank));
    } else {
      setSelectedBanks([...selectedBanks, bank]);
    }
  };

  // Handler Event Drag and Drop
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('image/')) {
        setImageFile(droppedFile);
      } else {
        setModalConfig({
          isOpen: true,
          type: 'warning',
          title: 'Format Tidak Valid',
          message: 'Harap unggah file berformat gambar!',
          confirmText: 'Tutup',
          cancelText: '',
          onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false }))
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const generatedId = generateId(title);
      let imageUrl = '';

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('projects-images').upload(fileName, imageFile);
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from('projects-images').getPublicUrl(fileName);
        imageUrl = publicUrlData.publicUrl;
      }

      const facilities = [facility1, facility2, facility3].filter(Boolean);
      const bankKprString = selectedBanks.join(',');

      const specsSummary = {
        konsep_cluster: clusterConcept,
        keamanan: security,
      };

      const { error: insertError } = await supabase.from('projects').insert([
        {
          id: generatedId,
          title,
          category,
          description,
          status_badge: statusBadge,
          total_units: totalUnits ? Number(totalUnits) : null,
          location,
          maps_url: mapsUrl,
          image_cover: imageUrl,
          bank_kpr: bankKprString,
          facilities,
          specs_summary: specsSummary,
        },
      ]);

      if (insertError) throw insertError;

      setModalConfig({
        isOpen: true,
        type: 'success',
        title: 'Berhasil!',
        message: 'Proyek berhasil ditambahkan.',
        confirmText: 'OK',
        cancelText: '',
        onConfirm: () => {
          setModalConfig(prev => ({ ...prev, isOpen: false }));
          router.push('/admin/project');
          router.refresh();
        }
      });
    } catch (error: any) {
      setModalConfig({
        isOpen: true,
        type: 'danger',
        title: 'Gagal Menyimpan',
        message: error.message || 'Terjadi kesalahan saat menambahkan proyek.',
        confirmText: 'Tutup',
        cancelText: '',
        onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false }))
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/25 focus:border-orange-500 transition placeholder:text-slate-400";

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Tambah Proyek Baru</h1>
          <p className="text-slate-500 text-sm mt-1">Tambahkan informasi lengkap proyek properti baru ke dalam sistem.</p>
        </div>
        <Link
          href="/admin/project"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali
        </Link>
      </div>

      {/* Form Utama */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-800">
                Nama Proyek <span className="text-orange-500">*</span>
              </label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Contoh: Grand Harmoni Cluster" className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-800">Kawasan / Kategori</label>
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Contoh: Malang Kota" className={inputClass} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-800">
              Deskripsi Proyek <span className="text-orange-500">*</span>
            </label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} required placeholder="Tuliskan deskripsi lengkap mengenai proyek ini..." className={inputClass} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-800">Status Proyek</label>
              <select value={statusBadge} onChange={(e) => setStatusBadge(e.target.value)} className={`${inputClass} cursor-pointer`}>
                <option value="Available">Available</option>
                <option value="Coming Soon">Coming Soon</option>
                <option value="Sold Out">Sold Out</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-800">Total Unit (Angka)</label>
              <input type="number" min="0" value={totalUnits} onChange={(e) => setTotalUnits(e.target.value)} placeholder="Contoh: 45" className={inputClass} />
            </div>
          </div>

          {/* Spec Summary Section */}
          <div className="p-5 bg-slate-50/70 rounded-2xl border border-slate-200/60 space-y-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">Spec Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Konsep Cluster</label>
                <input value={clusterConcept} onChange={(e) => setClusterConcept(e.target.value)} placeholder="Contoh: Modern Minimalist" className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Keamanan</label>
                <input value={security} onChange={(e) => setSecurity(e.target.value)} placeholder="Contoh: One Gate System, CCTV 24 Jam" className={inputClass} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-800">
                Lokasi Lengkap <span className="text-orange-500">*</span>
              </label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required placeholder="Contoh: Jl. Soekarno Hatta No. 12, Malang" className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-800">Google Maps URL</label>
              <input type="url" value={mapsUrl} onChange={(e) => setMapsUrl(e.target.value)} placeholder="https://maps.google.com/..." className={inputClass} />
            </div>
          </div>

          {/* Bagian Drag and Drop Gambar Utama (Cover) */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-800">Gambar Utama (Cover)</label>
            <label
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-2xl cursor-pointer transition ${
                isDragging 
                  ? 'border-orange-500 bg-orange-50/40 scale-[1.01]' 
                  : 'border-slate-200 bg-slate-50/50 hover:bg-orange-50/20 hover:border-orange-300'
              }`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                <p className="text-sm text-slate-600 font-medium">
                  {imageFile ? (
                    <span className="text-orange-600 font-bold">📁 {imageFile.name} (Terpilih)</span>
                  ) : (
                    <>Seret dan lepas gambar ke sini, atau <span className="text-orange-600 font-semibold underline">klik untuk memilih</span></>
                  )}
                </p>
                <p className="text-xs text-slate-400 mt-1">Mendukung format file gambar (PNG, JPG, JPEG)</p>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setImageFile(e.target.files?.[0] || null)} 
                className="hidden" 
              />
            </label>
          </div>

          {/* Fasilitas */}
          <div className="p-5 bg-slate-50/70 rounded-2xl border border-slate-200/60 space-y-3">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">Akses / Fasilitas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input value={facility1} onChange={(e) => setFacility1(e.target.value)} placeholder="Fasilitas 1 (Contoh: Taman Bermain)" className={inputClass} />
              <input value={facility2} onChange={(e) => setFacility2(e.target.value)} placeholder="Fasilitas 2 (Contoh: Kolam Renang)" className={inputClass} />
              <input value={facility3} onChange={(e) => setFacility3(e.target.value)} placeholder="Fasilitas 3 (Contoh: Masjid Komplek)" className={inputClass} />
            </div>
          </div>

          {/* Pilihan Bank KPR */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-800">Pilih Bank KPR (Support)</label>
            <div className="flex flex-wrap gap-2 pt-1">
              {LIST_BANK_KPR.map((bank) => {
                const isSelected = selectedBanks.includes(bank);
                return (
                  <button
                    key={bank}
                    type="button"
                    onClick={() => toggleBank(bank)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition border ${
                      isSelected 
                        ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20' 
                        : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300 hover:bg-orange-50/20'
                    }`}
                  >
                    {isSelected ? `✓ ${bank}` : `+ ${bank}`}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Tombol Aksi Bawah */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
          <Link 
            href="/admin/project" 
            className="w-full sm:w-auto px-6 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition text-center"
          >
            Batal
          </Link>
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full sm:w-auto px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-98 disabled:opacity-50 text-center"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Menyimpan...
              </span>
            ) : (
              'Simpan Proyek'
            )}
          </button>
        </div>
      </form>

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
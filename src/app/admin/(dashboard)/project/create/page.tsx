// src/app/admin/project/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../../lib/supabase';
import { compressForUpload, formatFileSize } from '../../../../../lib/imageUpload';
import Link from 'next/link';
import NotificationModal from '../../../../component/ui/NotificationModal'; // Sesuaikan path import komponen modal Anda

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
  const [compressing, setCompressing] = useState(false);
  
  const [clusterConcept, setClusterConcept] = useState('');

  // Daftar fasilitas kawasan (dinamis: bisa tambah/hapus baris)
  const [facilities, setFacilities] = useState<string[]>(['']);

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

  const updateFacility = (index: number, value: string) => {
    setFacilities((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const addFacility = () => {
    setFacilities((prev) => [...prev, '']);
  };

  const removeFacility = (index: number) => {
    setFacilities((prev) => prev.filter((_, i) => i !== index));
  };

  const failModal = (title: string, message: string) => {
    setModalConfig({
      isOpen: true,
      type: 'warning',
      title,
      message,
      confirmText: 'Tutup',
      cancelText: '',
      onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false }))
    });
  };

  const handleCoverSelect = async (files: FileList | File[] | null) => {
    if (!files || Array.from(files).length === 0) return;
    const file = Array.from(files)[0];
    if (!file.type.startsWith('image/')) {
      failModal('Format Tidak Valid', 'Harap unggah file berformat gambar!');
      return;
    }
    setCompressing(true);
    try {
      setImageFile(await compressForUpload(file));
    } catch (err) {
      failModal('Gambar Terlalu Besar', err instanceof Error ? err.message : 'Gagal mengompres gambar.');
    } finally {
      setCompressing(false);
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
      void handleCoverSelect(e.dataTransfer.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const generatedId = generateId(title);
      let imageUrl = '';

      if (imageFile) {
        // Single pipeline: imageFile sudah dikompres sekali saat dipilih — langsung upload.
        const ext = imageFile.type === 'image/jpeg' ? 'jpg' : (imageFile.name.split('.').pop() || 'jpg');
        const fileName = `${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('projects-images').upload(fileName, imageFile, { contentType: imageFile.type || 'image/jpeg', cacheControl: '31536000' });
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from('projects-images').getPublicUrl(fileName);
        imageUrl = publicUrlData.publicUrl;
      }

      // Kirim sebagai array string bersih (tanpa string kosong) ke kolom facilities
      const cleanFacilities = facilities.map((f) => f.trim()).filter(Boolean);

      const specsSummary = {
        konsep_cluster: clusterConcept,
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
          facilities: cleanFacilities,
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat menambahkan proyek.';
      setModalConfig({
        isOpen: true,
        type: 'danger',
        title: 'Gagal Menyimpan',
        message: errorMessage,
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
                  {compressing ? (
                    <span className="text-orange-600 font-bold">⏳ Mengompres gambar...</span>
                  ) : imageFile ? (
                    <span className="text-orange-600 font-bold">📁 {imageFile.name} ({formatFileSize(imageFile.size)} — otomatis hemat storage)</span>
                  ) : (
                    <>Seret dan lepas gambar ke sini, atau <span className="text-orange-600 font-semibold underline">klik untuk memilih</span></>
                  )}
                </p>
                <p className="text-xs text-slate-400 mt-1">Mendukung JPG/PNG/WebP — otomatis dikompres max 1920px (~&lt;1MB), tetap tajam di web</p>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => { void handleCoverSelect(e.target.files); e.target.value = ''; }} 
                className="hidden" 
              />
            </label>
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
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Konsep Cluster</label>
              <input value={clusterConcept} onChange={(e) => setClusterConcept(e.target.value)} placeholder="Contoh: Modern Minimalist" className={inputClass} />
            </div>
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between gap-3">
                <label className="block text-xs font-bold text-slate-700">Fasilitas Kawasan</label>
                <button
                  type="button"
                  onClick={addFacility}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-orange-600 bg-white border border-orange-200/70 hover:bg-orange-100 transition"
                >
                  <span className="text-sm leading-none">+</span> Tambah Fasilitas
                </button>
              </div>
              {facilities.length === 0 ? (
                <p className="text-xs text-slate-400 font-medium">Belum ada fasilitas. Klik &quot;Tambah Fasilitas&quot; untuk menambahkan.</p>
              ) : (
                <div className="space-y-2.5">
                  {facilities.map((facility, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        value={facility}
                        onChange={(e) => updateFacility(index, e.target.value)}
                        placeholder={`Fasilitas ${index + 1} (Contoh: Taman Bermain)`}
                        className={`${inputClass} flex-1`}
                      />
                      <button
                        type="button"
                        onClick={() => removeFacility(index)}
                        title="Hapus fasilitas"
                        aria-label={`Hapus fasilitas ${index + 1}`}
                        className="shrink-0 inline-flex items-center justify-center w-[46px] h-[46px] rounded-xl border border-red-200/70 bg-white text-red-500 hover:bg-red-100 hover:text-red-600 transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
            disabled={loading || compressing} 
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
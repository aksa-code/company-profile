// src/app/admin/project/edit/[id]/page.tsx
'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../../../lib/supabase';
import { compressForUpload, formatFileSize } from '../../../../../../lib/imageUpload';
import Link from 'next/link';
import NotificationModal from '../../../../../component/ui/NotificationModal'; // Sesuaikan path import komponen modal Anda

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [statusBadge, setStatusBadge] = useState('Available');
  const [totalUnits, setTotalUnits] = useState('');
  const [location, setLocation] = useState('');
  const [mapsUrl, setMapsUrl] = useState('');
  const [existingImage, setExistingImage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [compressing, setCompressing] = useState(false);
  
  const [clusterConcept, setClusterConcept] = useState('');

  // Daftar fasilitas kawasan (dinamis: bisa tambah/hapus baris)
  const [facilities, setFacilities] = useState<string[]>(['']);

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

  useEffect(() => {
    async function fetchProjectDetail() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) {
        setModalConfig({
          isOpen: true,
          type: 'danger',
          title: 'Gagal Memuat',
          message: 'Gagal mengambil data proyek: ' + error.message,
          confirmText: 'Kembali',
          cancelText: '',
          onConfirm: () => {
            setModalConfig(prev => ({ ...prev, isOpen: false }));
            router.push('/admin/project');
          }
        });
      } else if (data) {
        setTitle(data.title || '');
        setCategory(data.category || '');
        setDescription(data.description || '');
        setStatusBadge(data.status_badge || 'Available');
        setTotalUnits(data.total_units !== null && data.total_units !== undefined ? String(data.total_units) : '');
        setLocation(data.location || '');
        setMapsUrl(data.maps_url || '');
        setExistingImage(data.image_cover || '');
        
        if (data.specs_summary) {
          setClusterConcept(data.specs_summary.konsep_cluster || '');
        }

        const facilitiesFromDb = Array.isArray(data.facilities)
          ? data.facilities.filter((f: unknown): f is string => typeof f === 'string' && f.trim() !== '')
          : [];
        setFacilities(facilitiesFromDb.length > 0 ? facilitiesFromDb : ['']);
      }
      setLoading(false);
    }

    fetchProjectDetail();
  }, [projectId, router]);

  const updateFacility = (index: number, value: string) => {
    setFacilities((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const addFacility = () => {
    setFacilities((prev) => [...prev, '']);
  };

  const removeFacility = (index: number) => {
    setFacilities((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
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

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      void handleCoverSelect(e.dataTransfer.files);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrl = existingImage;

      // Jika admin mengupload gambar baru (sudah dikompres ke WebP saat dipilih — langsung upload)
      if (imageFile) {
        const baseName = imageFile.name.replace(/\.webp$/i, '').replace(/\.[^.]+$/, '') || 'cover';
        const fileName = `${baseName}_${Date.now()}.webp`;
        const filePath = `${fileName}`;

        // 1. Upload gambar baru ke bucket projects-images
        const { error: uploadError } = await supabase.storage
          .from('projects-images')
          .upload(filePath, imageFile, { contentType: 'image/webp', cacheControl: '31536000', upsert: false });

        if (uploadError) throw new Error('Gagal upload gambar: ' + uploadError.message);

        // 2. Dapatkan public URL untuk gambar baru
        const { data: publicUrlData } = supabase.storage
          .from('projects-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;

        // 3. Hapus gambar lama dari storage jika sebelumnya ada gambar
        if (existingImage) {
          const oldFileName = existingImage.split('/').pop()?.split('?')[0];
          if (oldFileName) {
            const { error: removeError } = await supabase.storage
              .from('projects-images')
              .remove([oldFileName]);

            if (removeError) {
              console.error('Gagal menghapus gambar lama di storage:', removeError.message);
            }
          }
        }
      }

      // Kirim sebagai array string bersih (tanpa string kosong) ke kolom facilities
      const cleanFacilities = facilities.map((f) => f.trim()).filter(Boolean);

      const specsSummary = {
        konsep_cluster: clusterConcept,
      };

      // 4. Update data ke database Supabase
      const { error: updateError } = await supabase
        .from('projects')
        .update({
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
        })
        .eq('id', projectId);

      if (updateError) throw new Error('Gagal memperbarui proyek: ' + updateError.message);

      setModalConfig({
        isOpen: true,
        type: 'success',
        title: 'Berhasil!',
        message: 'Proyek berhasil diperbarui.',
        confirmText: 'OK',
        cancelText: '',
        onConfirm: () => {
          setModalConfig(prev => ({ ...prev, isOpen: false }));
          router.push('/admin/project');
          router.refresh();
        }
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat memperbarui proyek.';
      setModalConfig({
        isOpen: true,
        type: 'danger',
        title: 'Gagal Memperbarui',
        message: errorMessage,
        confirmText: 'Tutup',
        cancelText: '',
        onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false }))
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-600 font-medium">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          Memuat data proyek...
        </div>
      </div>
    );
  }

  const inputClass = "w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/25 focus:border-orange-500 transition placeholder:text-slate-400";

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Edit Proyek</h1>
          <p className="text-slate-500 text-sm mt-1">Perbarui informasi lengkap proyek properti di dalam sistem.</p>
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
      <form onSubmit={handleUpdate} className="space-y-6">
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

          {/* Bagian Drag and Drop Gambar Utama (Cover) pada Edit */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-800">Gambar Utama (Cover)</label>
            
            {existingImage && !imageFile && (
              <div className="mb-3 flex items-center gap-3 p-3 bg-slate-50/70 border border-slate-200/60 rounded-2xl w-fit">
                {/* eslint-disable-next-line @next/next/no-img-element -- pratinjau admin ukuran dinamis; optimasi next/image tidak diperlukan di sini */}
                <img src={existingImage} alt="Current Preview" className="w-20 h-14 object-cover rounded-xl border border-slate-200 shadow-sm" />
                <span className="text-xs text-slate-500 font-medium">Gambar saat ini (akan tetap digunakan jika tidak diubah)</span>
              </div>
            )}

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
                    <>Seret dan lepas gambar baru ke sini, atau <span className="text-orange-600 font-semibold underline">klik untuk memilih</span></>
                  )}
                </p>
                <p className="text-xs text-slate-400 mt-1">Biarkan kosong jika tidak ingin mengubah gambar. File baru otomatis dikompres ke WebP max 1600px (~300KB).</p>
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
            disabled={submitting || compressing} 
            className="w-full sm:w-auto px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-98 disabled:opacity-50 text-center"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Menyimpan...
              </span>
            ) : (
              'Perbarui Proyek'
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
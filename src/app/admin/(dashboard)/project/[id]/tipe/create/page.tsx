// src/app/admin/project/[id]/tipe/create/page.tsx
'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../../../../lib/supabase';
import {
  GALLERY_BUCKET,
  uploadGalleryFiles,
  rollbackUploadedFiles,
} from '../../../../../../../lib/galleryStorage';
import { compressForUpload, formatFileSize } from '../../../../../../../lib/imageUpload';
import Link from 'next/link';
import NotificationModal from '../../../../../../component/ui/NotificationModal';

const LIST_CATEGORIES = ['Komersil', 'Subsidi'];
const LIST_FLOORS = ['1 Lantai', '2 Lantai', '2 Lantai + Balkon', '2 Lantai + Rooftop'];

export default function CreateHouseTypePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id; 
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  
  const [typeName, setTypeName] = useState('');        
  const [buildingType, setBuildingType] = useState(''); 
  const [category, setCategory] = useState('Komersil');
  const [floorInfo, setFloorInfo] = useState('Lantai 1'); 
  const [isSoldOut, setIsSoldOut] = useState(false);     
  const [specs, setSpecs] = useState('');
  
  const [rawPriceInput, setRawPriceInput] = useState('');
  const [formattedPrice, setFormattedPrice] = useState('');

  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [kitchen, setKitchen] = useState('1'); // State baru untuk dapur, default bernilai 1
  const [carport, setCarport] = useState('1'); // State untuk carport, default bernilai 1
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [compressing, setCompressing] = useState(false);

  // Galeri detail (POV kanan/kiri, denah, interior, ...) -> bucket tipe-detail
  const [galleryItems, setGalleryItems] = useState<{ file: File; label: string; preview: string }[]>([]);
  const [isGalleryDragging, setIsGalleryDragging] = useState(false);

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

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setRawPriceInput(value);

    if (!value) {
      setFormattedPrice('');
      return;
    }

    const num = Number(value);
    // Input berupa rupiah penuh (mis. 600000000) atau nominal juta (mis. 400).
    const jutaValue = num >= 1000000 ? Math.round(num / 1000000) : num;

    setFormattedPrice(`Rp ${jutaValue} Juta`);
  };

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

  const showError = (title: string, message: string) => {
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

  const prepareFiles = async (files: FileList | File[]): Promise<File[]> => {
    const list = Array.from(files);
    if (list.some((f) => !f.type.startsWith('image/'))) {
      showError('Format Tidak Valid', 'Hanya file gambar (JPG/PNG/WebP) yang bisa diupload. File non-gambar dilewati.');
    }
    const imgs = list.filter((f) => f.type.startsWith('image/'));
    setCompressing(true);
    try {
      // Per-file (bukan all-or-nothing): 1 file gagal tidak menggugurkan yang lain.
      const results = await Promise.allSettled(imgs.map((f) => compressForUpload(f)));
      const ok: File[] = [];
      const bad: string[] = [];
      results.forEach((r, i) => {
        if (r.status === 'fulfilled') ok.push(r.value);
        else bad.push(`${imgs[i].name} (${r.reason instanceof Error ? r.reason.message : 'gagal'})`);
      });
      if (bad.length > 0) {
        showError(
          'Sebagian File Gagal Diproses',
          `${bad.length} file dilewati dan TIDAK ditambahkan: ${bad.join('; ')}. File lain yang valid tetap ditambahkan.`
        );
      }
      return ok;
    } finally {
      setCompressing(false);
    }
  };

  const handleCoverSelect = async (files: FileList | File[] | null) => {
    if (!files || Array.from(files).length === 0) return;
    const done = await prepareFiles([Array.from(files)[0]]);
    if (done.length > 0) setImageFile(done[0]);
  };

  const addGalleryFiles = async (files: FileList | File[]) => {
    const done = await prepareFiles(files);
    if (done.length === 0) return;
    setGalleryItems((prev) => [
      ...prev,
      ...done.map((file) => ({ file, label: '', preview: URL.createObjectURL(file) })),
    ]);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Lacak semua object yang ter-upload agar bisa di-rollback jika gesam gagal.
    const uploadedCoverPaths: string[] = [];
    const uploadedGalleryPaths: string[] = [];

    try {
      const generatedUnitId = `${projectId}-${generateId(typeName)}`;
      let imageUrl = '';

      if (imageFile) {
        // Single pipeline: imageFile sudah dikompres ke WebP saat dipilih — langsung upload.
        const fileName = `unit_${Date.now()}.webp`;

        const { error: uploadError } = await supabase.storage
          .from('house-type-images')
          .upload(fileName, imageFile, { contentType: 'image/webp', cacheControl: '31536000', upsert: false });

        if (uploadError) throw new Error('Gagal upload gambar: ' + uploadError.message);
        uploadedCoverPaths.push(fileName);

        const { data: publicUrlData } = supabase.storage
          .from('house-type-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl;
      }

      // Upload galeri detail ke bucket tipe-detail (sudah dikompres saat dipilih).
      // Per-file: yang gagal dilaporkan, yang berhasil di-rollback agar tidak orphan.
      const { uploaded, failed } = await uploadGalleryFiles(
        supabase,
        generatedUnitId,
        galleryItems.map((item) => ({ file: item.file, label: item.label }))
      );
      uploadedGalleryPaths.push(...uploaded.map((u) => u.path));
      if (failed.length > 0) {
        throw new Error(
          `Gagal upload ${failed.length} foto galeri: ${failed.map((f) => `${f.name} (${f.message})`).join('; ')}. ` +
          `Tidak ada yang disimpan — file yang sempat ter-upload sudah dibersihkan otomatis.`
        );
      }
      const gallery = uploaded.map((u) => ({ url: u.url, label: u.label }));

      const { error: insertError } = await supabase.from('unit_types').insert([
        {
          id: generatedUnitId,
          project_id: projectId,
          name: typeName,
          building_type: buildingType,
          category: category,
          floor_info: floorInfo,    
          is_sold_out: isSoldOut,   
          specs: specs,
          price_starting: formattedPrice,
          bedrooms: bedrooms ? parseInt(bedrooms) : null,
          bathrooms: bathrooms ? parseInt(bathrooms) : null,
          kitchen: kitchen !== '' ? parseInt(kitchen) : 1, // Disimpan ke database
          carport: carport !== '' ? parseInt(carport) : 1, // Disimpan ke database
          image: imageUrl,
          gallery,
        },
      ]);

      if (insertError) throw new Error('Gagal menyimpan tipe rumah: ' + insertError.message);

      setModalConfig({
        isOpen: true,
        type: 'success',
        title: 'Berhasil Ditambahkan',
        message: 'Tipe rumah berhasil ditambahkan ke dalam sistem!',
        confirmText: 'OK',
        cancelText: '',
        onConfirm: () => {
          setModalConfig(prev => ({ ...prev, isOpen: false }));
          router.push(`/admin/project/${projectId}`);
          router.refresh();
        }
      });
    } catch (error: unknown) {
      // Rollback: file yang sempat ter-upload dibersihkan agar tidak menjadi orphan.
      const coverRb = await rollbackUploadedFiles(supabase, 'house-type-images', uploadedCoverPaths);
      const galleryRb = await rollbackUploadedFiles(supabase, GALLERY_BUCKET, uploadedGalleryPaths);
      let errMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui';
      const rbErrors = [coverRb.error, galleryRb.error].filter(Boolean);
      if (rbErrors.length > 0) {
        errMessage += ` (PERHATIAN: rollback Storage juga gagal — ${rbErrors.join('; ')}. Cek bucket manual untuk file yatim.)`;
      }
      setModalConfig({
        isOpen: true,
        type: 'danger',
        title: 'Gagal Menyimpan',
        message: errMessage,
        confirmText: 'Tutup',
        cancelText: '',
        onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false }))
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Tambah Tipe Unit Baru</h1>
          <p className="text-slate-500 text-sm mt-1">Tambahkan detail nama model dan tipe unit untuk proyek ini.</p>
        </div>
        <Link
          href={`/admin/project/${projectId}`}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition"
        >
          &larr; Kembali
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Nama Model Unit</label>
              <input
                type="text"
                value={typeName}
                onChange={(e) => setTypeName(e.target.value)}
                required
                placeholder="Contoh: Sky Light"
                className="w-full border border-slate-200 rounded-2xl px-4 py-3.5 text-sm text-slate-800 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition"
              />
              {typeName && (
                <span className="text-xs text-slate-400 mt-1.5 block">
                  ID Otomatis: <code className="text-orange-600 font-semibold">{projectId}-{generateId(typeName)}</code>
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Tipe (Ukuran)</label>
              <input
                type="text"
                value={buildingType}
                onChange={(e) => setBuildingType(e.target.value)}
                required
                placeholder="Contoh: 45/60"
                className="w-full border border-slate-200 rounded-2xl px-4 py-3.5 text-sm text-slate-800 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-1">
              <label className="block text-sm font-bold text-slate-800 mb-2">Harga Unit</label>
              <input
                type="text"
                value={rawPriceInput}
                onChange={handlePriceChange}
                required
                placeholder="Contoh: 600000000"
                className="w-full border border-slate-200 rounded-2xl px-4 py-3.5 text-sm text-slate-800 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition"
              />
              <span className="text-xs text-emerald-600 font-semibold mt-1.5 block">
                Hasil Simpan: <span className="font-bold">{formattedPrice || "(Belum diisi)"}</span>
              </span>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Kamar Tidur</label>
              <input
                type="number"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                placeholder="0"
                className="w-full border border-slate-200 rounded-2xl px-4 py-3.5 text-sm text-slate-800 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Kamar Mandi</label>
              <input
                type="number"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                placeholder="0"
                className="w-full border border-slate-200 rounded-2xl px-4 py-3.5 text-sm text-slate-800 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Dapur (Kitchen)</label>
              <input
                type="number"
                value={kitchen}
                onChange={(e) => setKitchen(e.target.value)}
                placeholder="1"
                className="w-full border border-slate-200 rounded-2xl px-4 py-3.5 text-sm text-slate-800 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Carport</label>
              <input
                type="number"
                value={carport}
                onChange={(e) => setCarport(e.target.value)}
                placeholder="1"
                className="w-full border border-slate-200 rounded-2xl px-4 py-3.5 text-sm text-slate-800 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition"
              />
            </div>
          </div>

          {/* Pilihan Kategori & Status Unit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Kategori Unit</label>
              <div className="flex flex-wrap gap-2">
                {LIST_CATEGORIES.map((cat) => {
                  const isSelected = category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-bold transition border ${
                        isSelected
                          ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {isSelected ? `✓ ${cat}` : cat}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Status Ketersediaan</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsSoldOut(false)}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition border ${
                    !isSoldOut
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {!isSoldOut ? '✓ Available' : 'Available'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsSoldOut(true)}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition border ${
                    isSoldOut
                      ? 'bg-rose-600 text-white border-rose-600 shadow-lg shadow-rose-600/20'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {isSoldOut ? '✓ Sold Out' : 'Sold Out'}
                </button>
              </div>
            </div>
          </div>

          {/* Pilihan Keterangan Lantai */}
          <div className="pt-2">
            <label className="block text-sm font-bold text-slate-800 mb-2">Keterangan Lantai</label>
            <div className="flex flex-wrap gap-2">
              {LIST_FLOORS.map((floor) => {
                const isSelected = floorInfo === floor;
                return (
                  <button
                    key={floor}
                    type="button"
                    onClick={() => setFloorInfo(floor)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition border ${
                      isSelected
                        ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected ? `✓ ${floor}` : floor}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upload Gambar / Denah */}
          <div className="pt-2">
            <label className="block text-sm font-bold text-slate-800 mb-2">Gambar Cover (Tampak Depan)</label>
            <label
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-3xl cursor-pointer transition ${
                isDragging 
                  ? 'border-orange-500 bg-orange-50/50 scale-[1.01]' 
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100/60'
              }`}
            >
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <p className="text-sm text-slate-600 font-medium">
                  {compressing ? (
                    <span className="text-orange-600 font-bold">⏳ Mengompres gambar...</span>
                  ) : imageFile ? (
                    <span className="text-orange-600 font-bold flex items-center gap-2">
                      <span>📁</span> {imageFile.name} ({formatFileSize(imageFile.size)} — otomatis hemat storage)
                    </span>
                  ) : (
                    <>Seret dan lepas gambar ke sini, atau <span className="text-orange-600 font-semibold underline">klik untuk memilih</span></>
                  )}
                </p>
                <p className="text-xs text-slate-400 mt-1">Otomatis dikompres ke WebP max 1600px (~300KB) agar hemat kuota 1GB — tetap tajam di web</p>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => { void handleCoverSelect(e.target.files); e.target.value = ''; }} 
                className="hidden" 
              />
            </label>
          </div>

          {/* Galeri Detail */}
          <div className="pt-2">
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Galeri Detail (POV kanan/kiri, denah, interior) — tersimpan di bucket tipe-detail
            </label>
            <label
              onDragOver={(e) => { e.preventDefault(); setIsGalleryDragging(true); }}
              onDragLeave={(e) => { e.preventDefault(); setIsGalleryDragging(false); }}
              onDrop={(e) => { e.preventDefault(); setIsGalleryDragging(false); if (e.dataTransfer.files?.length) addGalleryFiles(e.dataTransfer.files); }}
              className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-3xl cursor-pointer transition ${
                isGalleryDragging
                  ? 'border-orange-500 bg-orange-50/50 scale-[1.01]'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100/60'
              }`}
            >
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <p className="text-sm text-slate-600 font-medium">
                  {compressing ? '⏳ Mengompres...' : <>Seret banyak gambar ke sini, atau <span className="text-orange-600 font-semibold underline">klik untuk memilih</span></>}
                </p>
                <p className="text-xs text-slate-400 mt-1">Bisa pilih sekaligus — otomatis dikompres ke WebP ~300KB/foto, beri label tiap foto di bawah</p>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => { if (e.target.files?.length) void addGalleryFiles(e.target.files); e.target.value = ''; }}
                className="hidden"
              />
            </label>

            {galleryItems.length > 0 && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {galleryItems.map((item, idx) => (
                  <div key={`${item.preview}-${idx}`} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element -- pratinjau admin lokal via object URL */}
                    <img src={item.preview} alt={item.file.name} className="w-20 h-14 object-cover rounded-xl border border-slate-200 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 truncate">{item.file.name} • {formatFileSize(item.file.size)}</p>
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => setGalleryItems((prev) => prev.map((g, i) => i === idx ? { ...g, label: e.target.value } : g))}
                        placeholder="Label: Tampak Depan / Samping Kanan / Denah Lt.1"
                        className="mt-1.5 w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-orange-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setGalleryItems((prev) => prev.filter((_, i) => i !== idx))}
                      className="px-2.5 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">Spesifikasi Singkat</label>
            <textarea
              value={specs}
              onChange={(e) => setSpecs(e.target.value)}
              rows={4}
              required
              placeholder="Tuliskan spesifikasi detail material atau fasilitas..."
              className="w-full border border-slate-200 rounded-2xl p-4 text-sm text-slate-800 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition leading-relaxed"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={loading || compressing}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl text-sm font-bold disabled:opacity-50 transition shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-98"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              'Simpan Tipe Rumah'
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
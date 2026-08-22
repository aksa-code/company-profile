// src/app/admin/project/[id]/tipe/[unitId]/edit/page.tsx
'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../../../../../lib/supabase';
import Link from 'next/link';
import NotificationModal from '../../../../../../../component/ui/NotificationModal'; // Sesuaikan path import komponen modal Anda

const LIST_CATEGORIES = ['Komersil', 'Subsidi'];
const LIST_FLOORS = ['Lantai 1', 'Lantai 2', 'Lantai 2 + Balkon', 'Lantai 2 + Rooftop'];

export default function EditHouseTypePage({
  params
}: {
  params: Promise<{ id: string; unitId: string }>
}) {
  const resolvedParams = use(params);

  const projectIdParam = resolvedParams.id;
  const unitId = resolvedParams.unitId;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);

  const [projectId, setProjectId] = useState('');
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

  const [existingImage, setExistingImage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
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

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setRawPriceInput(value);

    if (!value) {
      setFormattedPrice('');
      return;
    }

    const num = Number(value);
    let jutaValue = num;

    if (num >= 1000) {
      jutaValue = Math.round(num / 1000000);
    }

    setFormattedPrice(`Rp ${jutaValue} Juta an saja`);
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

  useEffect(() => {
    async function fetchData() {
      const { data: projData } = await supabase.from('projects').select('id, title');
      if (projData) setProjects(projData);

      const { data, error } = await supabase
        .from('unit_types')
        .select('*')
        .eq('id', unitId)
        .single();

      if (error) {
        setModalConfig({
          isOpen: true,
          type: 'danger',
          title: 'Gagal Memuat Data',
          message: 'Gagal mengambil data tipe rumah: ' + error.message,
          confirmText: 'OK',
          cancelText: '',
          onConfirm: () => {
            setModalConfig(prev => ({ ...prev, isOpen: false }));
            router.push(`/admin/project/${projectIdParam}`);
          }
        });
      } else if (data) {
        setProjectId(data.project_id || '');
        setTypeName(data.name || '');
        setBuildingType(data.building_type || '');
        setCategory(data.category || 'Komersil');
        setFloorInfo(data.floor_info || 'Lantai 1');
        setIsSoldOut(data.is_sold_out ?? false);
        setSpecs(data.specs || '');
        setBedrooms(data.bedrooms ? data.bedrooms.toString() : '');
        setBathrooms(data.bathrooms ? data.bathrooms.toString() : '');

        const existingPrice = data.price_starting || '';
        setFormattedPrice(existingPrice);

        const extractedDigits = existingPrice.replace(/[^0-9]/g, '');
        setRawPriceInput(extractedDigits);

        setExistingImage(data.image || '');
      }
      setLoading(false);
    }

    if (unitId) {
      fetchData();
    }
  }, [unitId, projectIdParam, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrl = existingImage;

      if (imageFile) {
        // 1. Upload gambar baru
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `unit_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('house-type-images')
          .upload(filePath, imageFile);

        if (uploadError) throw new Error('Gagal upload gambar: ' + uploadError.message);

        const { data: publicUrlData } = supabase.storage
          .from('house-type-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;

        // 2. Hapus gambar lama jika ada
        if (existingImage) {
          try {
            const oldPath = existingImage.split('/').pop();
            if (oldPath) {
              await supabase.storage
                .from('house-type-images')
                .remove([oldPath]);
            }
          } catch (err) {
            console.error("Gagal menghapus gambar lama di storage:", err);
          }
        }
      }

      // 3. Update database
      const { error: updateError } = await supabase
        .from('unit_types')
        .update({
          project_id: projectId,
          name: typeName,
          building_type: buildingType,
          category: category,
          floor_info: floorInfo,
          is_sold_out: isSoldOut,
          specs,
          price_starting: formattedPrice,
          bedrooms: bedrooms ? parseInt(bedrooms) : null,
          bathrooms: bathrooms ? parseInt(bathrooms) : null,
          image: imageUrl,
        })
        .eq('id', unitId);

      if (updateError) throw new Error('Gagal memperbarui tipe rumah: ' + updateError.message);

      setModalConfig({
        isOpen: true,
        type: 'success',
        title: 'Berhasil Diperbarui',
        message: 'Tipe rumah berhasil diperbarui!',
        confirmText: 'OK',
        cancelText: '',
        onConfirm: () => {
          setModalConfig(prev => ({ ...prev, isOpen: false }));
          router.push(`/admin/project/${projectId}`);
          router.refresh();
        }
      });
    } catch (error: any) {
      setModalConfig({
        isOpen: true,
        type: 'danger',
        title: 'Gagal Memperbarui',
        message: error.message,
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
      <div className="max-w-4xl mx-auto p-12 text-center text-slate-500 font-medium">
        Memuat data tipe rumah...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">

      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Edit Tipe Rumah</h1>
          <p className="text-slate-500 text-sm mt-1">Perbarui detail nama model, spesifikasi, dan status unit.</p>
        </div>
        <Link
          href={`/admin/project/${projectId}`}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition"
        >
          &larr; Kembali
        </Link>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">Pilih Proyek Utama</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              required
              className="w-full border border-slate-200 rounded-2xl px-4 py-3.5 text-sm text-slate-800 outline-none bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Nama Model Unit</label>
              <input
                type="text"
                value={typeName}
                onChange={(e) => setTypeName(e.target.value)}
                required
                className="w-full border border-slate-200 rounded-2xl px-4 py-3.5 text-sm text-slate-800 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition"
              />
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Harga Mulai (Ketik Angka)</label>
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
            <label className="block text-sm font-bold text-slate-800 mb-2">Gambar / Denah Rumah</label>

            {existingImage && !imageFile && (
              <div className="mb-4 flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl w-fit">
                <img src={existingImage} alt="Current Preview" className="w-20 h-14 object-cover rounded-xl border border-slate-200" />
                <span className="text-xs text-slate-500 font-medium">Gambar saat ini (akan tetap digunakan jika tidak diubah)</span>
              </div>
            )}

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
                  {imageFile ? (
                    <span className="text-orange-600 font-bold flex items-center gap-2">
                      <span>📁</span> {imageFile.name} (Gambar Baru Terpilih)
                    </span>
                  ) : (
                    <>Seret dan lepas gambar baru ke sini, atau <span className="text-orange-600 font-semibold underline">klik untuk memilih</span></>
                  )}
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
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
          <Link
            href={`/admin/project/${projectId}`}
            className="px-6 py-3.5 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 transition"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl text-sm font-bold disabled:opacity-50 transition shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-98"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              'Perbarui Tipe Rumah'
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
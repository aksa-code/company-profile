// src/app/admin/news/edit/[id]/page.tsx
'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../../../lib/supabase';
import Link from 'next/link';
import NotificationModal from '../../../../../component/ui/NotificationModal'; // Sesuaikan path import komponen modal Anda

export default function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const newsId = resolvedParams.id;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false); // State untuk Drag & Drop

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Perusahaan');
  const [date, setDate] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [contentString, setContentString] = useState('');
  const [existingImage, setExistingImage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

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
    async function fetchNewsDetail() {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', newsId)
        .single();

      if (error) {
        setModalConfig({
          isOpen: true,
          type: 'danger',
          title: 'Gagal Memuat',
          message: 'Gagal mengambil data berita: ' + error.message,
          confirmText: 'Kembali',
          cancelText: '',
          onConfirm: () => {
            setModalConfig(prev => ({ ...prev, isOpen: false }));
            router.push('/admin/news');
          }
        });
      } else if (data) {
        setTitle(data.title || '');
        setCategory(data.category || 'Perusahaan');
        setDate(data.date || '');
        setExcerpt(data.excerpt || '');
        const formattedContent = Array.isArray(data.content)
          ? data.content.join('\n')
          : data.content || '';
        setContentString(formattedContent);
        setExistingImage(data.image || '');
      }
      setLoading(false);
    }

    fetchNewsDetail();
  }, [newsId, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrl = existingImage;

      // Logika Upload & Replace Gambar
      if (imageFile) {
        // 1. Hapus gambar lama jika ada
        if (existingImage) {
          try {
            const oldFilePath = existingImage.split('/').pop()?.split('?')[0];
            if (oldFilePath) {
              await supabase.storage.from('news-images').remove([oldFilePath]);
            }
          } catch (deleteError) {
            console.error('Gagal menghapus gambar lama:', deleteError);
          }
        }

        // 2. Upload gambar baru
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('news-images')
          .upload(fileName, imageFile);

        if (uploadError) throw new Error('Gagal upload gambar: ' + uploadError.message);

        const { data: publicUrlData } = supabase.storage
          .from('news-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl;
      }

      const contentArray = contentString
        .split('\n')
        .filter((paragraph) => paragraph.trim() !== '');

      const { error: updateError } = await supabase
        .from('news')
        .update({
          title,
          category,
          date,
          image: imageUrl,
          excerpt,
          content: contentArray,
        })
        .eq('id', newsId);

      if (updateError) throw new Error('Gagal memperbarui berita: ' + updateError.message);

      // Tampilkan modal sukses, lalu arahkan kembali saat tombol OK ditekan
      setModalConfig({
        isOpen: true,
        type: 'success',
        title: 'Berhasil!',
        message: 'Berita berhasil diperbarui.',
        confirmText: 'OK',
        cancelText: '',
        onConfirm: () => {
          setModalConfig(prev => ({ ...prev, isOpen: false }));
          router.push('/admin/news');
          router.refresh();
        }
      });
    } catch (error: any) {
      setModalConfig({
        isOpen: true,
        type: 'danger',
        title: 'Gagal Memperbarui',
        message: error.message || 'Terjadi kesalahan saat memperbarui berita.',
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
          Memuat data berita...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Edit Berita</h1>
          <p className="text-slate-500 text-sm mt-1">Perbarui informasi atau isi artikel berita perusahaan.</p>
        </div>
        <Link href="/admin/news" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Kembali
        </Link>
      </div>

      <form onSubmit={handleUpdate} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-800">Judul Berita <span className="text-orange-500">*</span></label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-800">Kategori <span className="text-orange-500">*</span></label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition cursor-pointer">
              <option value="Perusahaan">Perusahaan</option>
              <option value="Event">Event</option>
              <option value="Tips & Info">Tips & Info</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-800">Tanggal Publikasi <span className="text-orange-500">*</span></label>
            <input type="text" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition" />
          </div>
        </div>

        {/* Area Drag & Drop */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-800">Gambar Utama</label>
          {existingImage && !imageFile && (
            <div className="mb-3">
              <img src={existingImage} alt="Preview" className="w-36 h-24 object-cover rounded-xl border border-slate-200 shadow-sm" />
            </div>
          )}
          <div 
            className={`flex items-center justify-center w-full transition-all duration-200 ${isDragging ? 'scale-[1.02]' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                setImageFile(e.dataTransfer.files[0]);
              }
            }}
          >
            <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${isDragging ? 'border-orange-500 bg-orange-50' : 'border-slate-200 bg-slate-50/50 hover:bg-orange-50/30 hover:border-orange-300'}`}>
              <div className="flex flex-col items-center justify-center pt-4 pb-5 px-4 text-center">
                {imageFile ? (
                  <span className="text-orange-600 font-bold text-sm">{imageFile.name}</span>
                ) : (
                  <>
                    <p className="text-sm text-slate-600 font-medium">Klik atau seret gambar ke sini</p>
                    <p className="text-xs text-slate-400 mt-1">PNG, JPG, atau JPEG</p>
                  </>
                )}
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-800">Ringkasan Singkat (Excerpt) <span className="text-orange-500">*</span></label>
          <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} required className="w-full border border-slate-200 rounded-xl p-4 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition" />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-800">Isi Berita Lengkap (Paragraf) <span className="text-orange-500">*</span></label>
          <textarea value={contentString} onChange={(e) => setContentString(e.target.value)} rows={8} required className="w-full border border-slate-200 rounded-xl p-4 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition font-mono" />
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-slate-100">
          <Link href="/admin/news" className="px-6 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition text-center">Batal</Link>
          <button type="submit" disabled={submitting} className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold transition disabled:opacity-50 text-center">
            {submitting ? 'Menyimpan...' : 'Perbarui Berita'}
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
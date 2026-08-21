// src/app/admin/news/edit/[id]/page.tsx
'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../../../lib/supabase';
import Link from 'next/link';

export default function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const newsId = resolvedParams.id;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Perusahaan');
  const [date, setDate] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [contentString, setContentString] = useState('');
  const [existingImage, setExistingImage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Ambil data berita lama berdasarkan ID
  useEffect(() => {
    async function fetchNewsDetail() {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', newsId)
        .single();

      if (error) {
        alert('Gagal mengambil data berita: ' + error.message);
        router.push('/admin/news');
      } else if (data) {
        setTitle(data.title || '');
        setCategory(data.category || 'Perusahaan');
        setDate(data.date || '');
        setExcerpt(data.excerpt || '');
        // Jika content disimpan sebagai array, gabungkan kembali dengan newline (\n)
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

      // Jika user mengupload gambar baru
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('news-images')
          .upload(filePath, imageFile);

        if (uploadError) throw new Error('Gagal upload gambar: ' + uploadError.message);

        const { data: publicUrlData } = supabase.storage
          .from('news-images')
          .getPublicUrl(filePath);

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

      alert('Berita berhasil diperbarui!');
      router.push('/admin/news');
      router.refresh();
    } catch (error: any) {
      alert(error.message);
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
      
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Edit Berita</h1>
          <p className="text-slate-500 text-sm mt-1">Perbarui informasi atau isi artikel berita perusahaan.</p>
        </div>
        <Link
          href="/admin/news"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali
        </Link>
      </div>

      {/* Form Utama */}
      <form onSubmit={handleUpdate} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8 space-y-6">
        
        {/* Judul Berita */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-800">
            Judul Berita <span className="text-orange-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition placeholder:text-slate-400"
          />
        </div>

        {/* Kategori & Tanggal Publikasi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-800">
              Kategori <span className="text-orange-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition cursor-pointer"
            >
              <option value="Perusahaan">Perusahaan</option>
              <option value="Event">Event</option>
              <option value="Tips & Info">Tips & Info</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-800">
              Tanggal Publikasi <span className="text-orange-500">*</span>
            </label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Gambar Utama */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-800">Gambar Utama Saat Ini</label>
          {existingImage && (
            <div className="mb-3">
              <img src={existingImage} alt="Preview" className="w-36 h-24 object-cover rounded-xl border border-slate-200 shadow-sm" />
            </div>
          )}
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-2xl cursor-pointer bg-slate-50/50 hover:bg-orange-50/30 hover:border-orange-300 transition group">
              <div className="flex flex-col items-center justify-center pt-4 pb-5 px-4 text-center">
                <p className="text-sm text-slate-600 font-medium">
                  {imageFile ? <span className="text-orange-600 font-bold">{imageFile.name}</span> : <>Klik untuk unggah gambar baru atau seret file ke sini</>}
                </p>
                <p className="text-xs text-slate-400 mt-1">Biarkan kosong jika tidak ingin mengubah gambar.</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Ringkasan Singkat (Excerpt) */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-800">
            Ringkasan Singkat (Excerpt) <span className="text-orange-500">*</span>
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            required
            className="w-full border border-slate-200 rounded-xl p-4 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition placeholder:text-slate-400"
          />
        </div>

        {/* Isi Berita Lengkap */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-800">
            Isi Berita Lengkap (Paragraf) <span className="text-orange-500">*</span>
          </label>
          <textarea
            value={contentString}
            onChange={(e) => setContentString(e.target.value)}
            rows={8}
            required
            className="w-full border border-slate-200 rounded-xl p-4 text-xs sm:text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition placeholder:text-slate-400 font-mono leading-relaxed"
          />
          <p className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            Setiap baris baru (tekan Enter) akan otomatis dipisahkan menjadi paragraf tersendiri.
          </p>
        </div>

        {/* Tombol Aksi Bawah */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-slate-100">
          <Link
            href="/admin/news"
            className="px-6 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition text-center"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-98 disabled:opacity-50 text-center"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Menyimpan...
              </span>
            ) : (
              'Perbarui Berita'
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
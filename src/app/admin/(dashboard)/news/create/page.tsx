// src/app/admin/news/create/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createNews } from '../../../../../lib/newsService'; // Sesuaikan jalur import service Anda
import Link from 'next/link';

export default function CreateNewsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Perusahaan');
  const [date, setDate] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [contentString, setContentString] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Handle Drag & Drop Events
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = '';

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { createClient } = await import('@supabase/supabase-js');
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
        const supabaseClient = createClient(supabaseUrl, supabaseKey);

        const { error: uploadError } = await supabaseClient.storage
          .from('news-images')
          .upload(filePath, imageFile);

        if (uploadError) throw new Error('Gagal upload gambar: ' + uploadError.message);

        const { data: publicUrlData } = supabaseClient.storage
          .from('news-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      const contentArray = contentString
        .split('\n')
        .filter((paragraph) => paragraph.trim() !== '');

      // Memanggil fungsi createNews yang otomatis membuat slug ID dari title
      await createNews({
        title,
        category,
        date,
        image: imageUrl,
        excerpt,
        content: contentArray,
      });

      alert('Berita berhasil ditambahkan!');
      router.push('/admin/news');
      router.refresh();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Tambah Berita Baru</h1>
          <p className="text-slate-500 text-sm mt-1">Buat dan publikasikan artikel atau pengumuman terbaru untuk pengunjung.</p>
        </div>
        <Link
          href="/admin/news"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Daftar Berita
        </Link>
      </div>

      {/* Form Utama */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8 space-y-6">
        
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
            placeholder="Contoh: Peresmian Fasilitas Baru PT Mitra Sejati Electric Bike..."
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
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition cursor-pointer"
            />
          </div>
        </div>

        {/* Upload Gambar Utama (Drag & Drop Enabled) */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-800">
            Gambar Utama
          </label>
          <div className="flex items-center justify-center w-full">
            <label
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition group ${
                isDragging
                  ? "border-orange-500 bg-orange-50/60 scale-[1.01]"
                  : "border-slate-200 bg-slate-50/50 hover:bg-orange-50/30 hover:border-orange-300"
              }`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                </div>
                <p className="text-sm text-slate-600 font-medium">
                  {imageFile ? (
                    <span className="text-orange-600 font-bold">{imageFile.name}</span>
                  ) : isDragging ? (
                    <span className="text-orange-600 font-bold">Lepaskan file di sini...</span>
                  ) : (
                    <>Seret & letakkan gambar di sini, atau <span className="text-orange-600 underline">pilih file</span></>
                  )}
                </p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG, atau WEBP</p>
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
            Ringkasan Singkat (Headline) <span className="text-orange-500">*</span>
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            required
            className="w-full border border-slate-200 rounded-xl p-4 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition placeholder:text-slate-400"
            placeholder="Tuliskan ringkasan singkat yang akan tampil di kartu pratinjau halaman utama..."
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
            placeholder="Tulis paragraf berita di sini. Tekan Enter untuk membuat paragraf baru..."
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
            disabled={loading}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-98 disabled:opacity-50 text-center"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Menyimpan...
              </span>
            ) : (
              'Simpan Berita'
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
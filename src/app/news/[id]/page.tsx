// src/app/news/[id]/page.tsx
import { fetchNewsById } from "../../../lib/newsService";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../component/Navbar";
import Footer from "../../component/Footer";
import Contact from "../../component/Contact";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NewsDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // Ambil data spesifik berdasarkan ID via service (Supabase; image = public URL Storage)
  let news = null;
  try {
    news = await fetchNewsById(id);
  } catch {
    notFound();
  }

  if (!news) {
    notFound();
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16 selection:bg-orange-500 selection:text-white">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      {/* Banner Header Detail Berita */}
      <div className="relative text-white pt-12 pb-16 sm:pt-20 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gray-900">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/40" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto space-y-2.5 sm:space-y-3">
          <div className="flex items-center gap-2 text-xs text-gray-300 font-medium">
            <Link href="/" className="hover:text-orange-400 transition-colors">Skyland Property</Link>
            <span>›</span>
            <Link href="/news" className="hover:text-orange-400 transition-colors">Berita & Artikel</Link>
            <span>›</span>
            <span className="text-orange-400 truncate max-w-[150px] sm:max-w-none">{news.title}</span>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap pt-1">
            <span className="bg-orange-500 text-white text-[10px] sm:text-[11px] px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full font-semibold shadow-md shadow-orange-500/20">
              {news.category}
            </span>
            <span className="text-gray-300 text-xs">{news.date}</span>
          </div>

          <h1 className="text-2xl sm:text-5xl font-extrabold tracking-tight leading-snug">{news.title}</h1>
        </div>
      </div>

      {/* Konten Utama Artikel */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-10 space-y-6 sm:space-y-8">

        {/* Gambar Utama */}
        <div className="relative h-56 sm:h-[450px] w-full rounded-2xl overflow-hidden shadow-xl bg-white border border-gray-100">
          <Image
            src={typeof news.image === 'string' && news.image ? news.image : "/images/placeholder.svg"}
            alt={news.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>

        {/* Kotak Konten Teks */}
        <div className="bg-white rounded-2xl p-5 sm:p-10 shadow-xl border border-gray-100 space-y-4 sm:space-y-6">
          <p className="text-xs sm:text-base font-medium text-gray-700 italic border-l-4 border-orange-500 pl-3 sm:pl-4 leading-relaxed">
            {news.excerpt}
          </p>

          <div className="text-gray-600 leading-relaxed text-xs sm:text-sm space-y-4">
            {/* Merender isi berita menjadi beberapa paragraf sesuai enter dari form admin */}
            {Array.isArray(news.content) ? (
              news.content.map((paragraph: string, index: number) => (
                <p key={index} className="leading-relaxed">
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="leading-relaxed whitespace-pre-line">{news.content}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 sm:mt-16"><Contact /></div>
      <div className="mt-8 sm:mt-12"><Footer /></div>
    </div>
  );
}

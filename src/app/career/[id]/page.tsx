// src/app/career/[id]/page.tsx
import Link from "next/link";
import Navbar from "../../component/Navbar";
import Footer from "../../component/Footer";
import Contact from "../../component/Contact";
import CareerApplyButton from "../../component/CareerApplyButton"; // <-- Import komponen baru
import { supabase } from "../../../lib/supabase";
import { hrdNumber } from "../../../lib/careerService";
import { notFound } from "next/navigation";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CareerDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const { data: career, error } = await supabase
    .from("career")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !career) {
    notFound();
  }

  const whatsappNumber = hrdNumber.replace(/[\s+-]/g, "");
  const waMessage = encodeURIComponent(`Halo HRD Skyland Property, saya ingin melamar untuk posisi *${career.title}*. Berikut lampiran CV dan portofolio saya.`);

  return (
    <div className="bg-gray-50 min-h-screen pb-16 selection:bg-orange-500 selection:text-white">
      <Navbar />

      {/* Banner Header */}
      <div className="relative text-white pt-12 pb-16 sm:pt-20 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gray-900">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/40" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto space-y-2.5 sm:space-y-3">
          <div className="flex items-center gap-2 text-xs text-gray-300 font-medium">
            <Link href="/" className="hover:text-orange-400 transition-colors">Skyland Property</Link>
            <span>›</span>
            <Link href="/career" className="hover:text-orange-400 transition-colors">Karier</Link>
            <span>›</span>
            <span className="text-orange-400 truncate max-w-[150px] sm:max-w-none">{career.title}</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="bg-orange-500 text-white text-[10px] sm:text-[11px] px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full font-semibold">
              {career.department}
            </span>
            <span className="bg-white/10 text-white text-[10px] sm:text-[11px] px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full backdrop-blur-sm">
              {career.type}
            </span>
            {career.salary && (
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] sm:text-[11px] px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full backdrop-blur-sm">
                💰 {career.salary}
              </span>
            )}
            <span className="text-gray-300 text-xs inline-flex items-center gap-1">
              📍 {career.location}
            </span>
          </div>

          <h1 className="text-2xl sm:text-5xl font-extrabold tracking-tight leading-snug">{career.title}</h1>
        </div>
      </div>

      {/* Konten Detail Lowongan */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-10 space-y-6 sm:space-y-8">
        <div className="bg-white rounded-2xl p-5 sm:p-10 shadow-xl border border-gray-100 space-y-6 sm:space-y-8">

          {career.is_closed && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2">
              <span>Lowongan ini telah ditutup. Anda tidak dapat mengirimkan lamaran baru untuk posisi ini.</span>
            </div>
          )}

          {career.salary && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-emerald-600 font-medium">Estimasi Gaji / Kompensasi</p>
                <p className="text-sm sm:text-base font-bold text-emerald-900">{career.salary}</p>
              </div>
            </div>
          )}

          <div className="space-y-1.5 sm:space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Deskripsi Pekerjaan</h2>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">{career.description}</p>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Tanggung Jawab Utama</h2>
            <ul className="space-y-2">
              {Array.isArray(career.responsibilities) && career.responsibilities.map((resp: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2.5 text-gray-600 text-xs sm:text-sm leading-relaxed">
                  <span className="text-orange-500 font-bold mt-0.5">•</span>
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Kualifikasi</h2>
            <ul className="space-y-2">
              {Array.isArray(career.requirements) && career.requirements.map((req: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2.5 text-gray-600 text-xs sm:text-sm leading-relaxed">
                  <span className="text-orange-500 font-bold mt-0.5">✓</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 sm:pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-[10px] sm:text-[11px] text-gray-400">Tertarik dengan posisi ini?</p>
              <p className="text-xs sm:text-sm font-semibold text-gray-800">
                {career.is_closed ? "Lowongan sudah ditutup." : "Kirimkan CV dan lamar melalui platform pilihan Anda."}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              {career.is_closed ? (
                <button disabled className="bg-gray-200 text-gray-400 font-semibold px-6 py-3 rounded-xl text-xs sm:text-sm text-center w-full sm:w-auto cursor-not-allowed">
                  Lowongan Ditutup
                </button>
              ) : (
                <>
                  {career.glints_url && (
                    <a
                      href={career.glints_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl transition-all shadow-lg text-xs sm:text-sm text-center w-full sm:w-auto flex items-center justify-center gap-2"
                    >
                      <span>Lamar via Glints</span>
                    </a>
                  )}

                  {/* Tombol WhatsApp yang otomatis masuk ke database admin panel */}
                  <CareerApplyButton 
                    careerId={career.id}
                    careerTitle={career.title}
                    whatsappNumber={whatsappNumber}
                    waMessage={waMessage}
                  />
                </>
              )}
            </div>
          </div>

        </div>
      </div>

      <div className="mt-12 sm:mt-16"><Contact /></div>
      <div className="mt-8 sm:mt-12"><Footer /></div>
    </div>
  );
}
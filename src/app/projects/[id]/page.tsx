// src/app/projects/[id]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../component/Navbar";
import Footer from "../../component/Footer";
import Contact from "../../component/Contact";
import { getProjectById, MARKETING_HOTLINE } from "../../../lib/projectService";
import WhatsAppLeadButton from "../../component/WhatsAppLeadButton"; // Sesuaikan path jika perlu

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

const ADMIN_PHONE = MARKETING_HOTLINE;

interface UnitType {
  id: string;
  name: string;
  buildingType?: string | null;
  building_type?: string | null;
  category?: string;
  specs?: string;
  priceStarting?: string | null;
  pricestarting?: string | null;
  price_starting?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  kitchen?: number | null;
  image?: string | null;
  floorInfo?: string | null;
  floor_info?: string | null;
  isSoldOut?: boolean;
  is_sold_out?: boolean;
}

// Helper function untuk membersihkan string harga ke dalam bentuk angka (untuk keperluan sorting dari mahal ke murah)
function parsePriceToNumber(priceStr?: string | null): number {
  if (!priceStr) return 0;
  const numbers = priceStr.replace(/[^0-9]/g, "");
  return numbers ? parseInt(numbers, 10) : 0;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const project = await getProjectById(resolvedParams.id);

  if (!project) {
    notFound();
  }

  const rawBanks = (project as any).banks || project.bankKPR || project.bank_kpr || [];
  const bankList: string[] = Array.isArray(rawBanks)
    ? rawBanks
    : typeof rawBanks === 'string'
      ? rawBanks.split(',').map((b: string) => b.trim()).filter(Boolean)
      : [];

  const mapsUrl = (project as any).mapsUrl || (project as any).maps_url || (project as any).googleMaps || (project as any).locationUrl;

  const sortedUnitTypes = project.unitTypes ? [...project.unitTypes].sort((a, b) => {
    const aSold = a.isSoldOut ?? a.is_sold_out ?? false;
    const bSold = b.isSoldOut ?? b.is_sold_out ?? false;

    if (aSold !== bSold) {
      return aSold ? 1 : -1;
    }

    const aCategory = (a.category || "").toLowerCase();
    const bCategory = (b.category || "").toLowerCase();
    const aIsCommercial = aCategory.includes("komersil") || aCategory.includes("komersial");
    const bIsCommercial = bCategory.includes("komersil") || bCategory.includes("komersial");

    if (aIsCommercial && !bIsCommercial) return -1;
    if (!aIsCommercial && bIsCommercial) return 1;

    const priceA = parsePriceToNumber(a.priceStarting || a.priceStarting || a.price_starting);
    const priceB = parsePriceToNumber(b.priceStarting || b.priceStarting || b.price_starting);

    return priceB - priceA;
  }) : [];

  return (
    <div className="bg-slate-50 min-h-screen pb-20 selection:bg-orange-500 selection:text-white overflow-hidden font-sans">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <Navbar />
      </div>

      {/* Hero Banner Header */}
      <div className="relative text-white pt-16 pb-32 sm:pt-24 sm:pb-40 px-4 sm:px-6 lg:px-8 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40 scale-105 transition-transform duration-1000 hover:scale-110">
          <Image
            src={project.imageCover || "/images/placeholder.png"}
            alt={project.title}
            fill
            className="object-cover object-center filter brightness-90 transition-all duration-700"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto space-y-6 animate-fadeIn">
          <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium tracking-wide">
            <Link href="/" className="hover:text-orange-400 transition-colors">Skyland Property</Link>
            <span className="text-orange-500 font-bold">›</span>
            <Link href="/projects" className="hover:text-orange-400 transition-colors">Proyek</Link>
            <span className="text-orange-500 font-bold">›</span>
            <span className="text-orange-400 font-semibold">{project.title}</span>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="bg-orange-500 text-white text-xs px-3.5 py-1.5 rounded-full font-bold tracking-wide shadow-sm shadow-orange-500/30 transition-transform duration-300 hover:scale-105">
              {project.category}
            </span>
            <span className={`text-xs px-3.5 py-1.5 rounded-full font-bold tracking-wide shadow-sm transition-transform duration-300 hover:scale-105 ${project.statusBadge === "Sold Out" ? "bg-red-500 text-white" :
              project.statusBadge === "Coming Soon" ? "bg-amber-500 text-white" :
                "bg-emerald-600 text-white"
              }`}>
              {project.statusBadge || "Available"}
            </span>
          </div>

          <div className="space-y-3 max-w-3xl">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-white drop-shadow-sm transition-all duration-500">
              {project.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <p className="text-slate-300 text-sm sm:text-base flex items-center gap-2 font-medium">
                <span className="p-1.5 bg-orange-500/25 rounded-lg border border-orange-500/30 text-orange-400 shrink-0">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <span>{project.location}</span>
              </p>

              {mapsUrl && (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all duration-300 shadow-md shadow-orange-500/20 hover:scale-105"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <span>Buka Google Maps</span>
                </a>
              )}
            </div>
          </div>

          <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed font-normal bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-md transition-all duration-300 hover:bg-white/10">
            {project.description}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 relative z-20 space-y-12">
        {/* Info Card Utama */}
        <div className="bg-white rounded-3xl p-3 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100/80 backdrop-blur-xl">
          <div className="grid grid-cols-3 gap-2 sm:gap-6">
            <div className="space-y-1 p-2.5 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-100">
              <p className="text-[9px] sm:text-[11px] text-slate-400 font-bold uppercase tracking-wider">Konsep Cluster</p>
              <p className="text-xs sm:text-lg font-extrabold text-slate-900 leading-snug">
                {project.specsSummary?.konsep_cluster || project.specsSummary?.konsep || project.specsSummary?.cluster || "-"}
              </p>
            </div>
            <div className="space-y-1 p-2.5 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-100">
              <p className="text-[9px] sm:text-[11px] text-slate-400 font-bold uppercase tracking-wider">Keamanan</p>
              <p className="text-xs sm:text-lg font-extrabold text-slate-900 leading-snug">
                {project.specsSummary?.keamanan || project.specsSummary?.security || "-"}
              </p>
            </div>
            <div className="space-y-1 p-2.5 sm:p-5 rounded-2xl bg-orange-50/50 border border-orange-100/60">
              <p className="text-[9px] sm:text-[11px] text-orange-600 font-bold uppercase tracking-wider">Legalitas</p>
              <p className="text-xs sm:text-lg font-extrabold text-slate-900 leading-snug">
                {project.specsSummary?.legalitas || "100% Terjamin"}
              </p>
            </div>
          </div>
        </div>

        {/* Daftar Tipe Unit / Rumah */}
        {sortedUnitTypes.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Pilihan Tipe Unit</h2>
                <p className="text-xs text-slate-500">Pilih hunian impian yang sesuai dengan kebutuhan keluarga Anda</p>
              </div>
              <span className="hidden sm:inline-block shrink-0 text-xs text-slate-700 font-bold bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs text-center leading-tight">
                {sortedUnitTypes.length} Tipe <br />Tersedia
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedUnitTypes.map((unit: UnitType) => {
                const isSold = unit.isSoldOut ?? unit.is_sold_out ?? false;
                const bType = unit.buildingType || unit.building_type || "";
                const priceDisplay = unit.priceStarting || unit.pricestarting || unit.price_starting || "Hubungi Kami";
                const fInfo = unit.floorInfo || unit.floor_info || "";

                return (
                  <div key={unit.id} className={`bg-white rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 border ${isSold ? 'border-red-100' : 'border-slate-100'} flex flex-col justify-between group hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 text-left relative`}>
                    {isSold && (
                      <div className="absolute top-0 right-0 z-30 m-4">
                        <span className="bg-red-600 text-white text-[10px] font-extrabold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg animate-pulse">
                          Sold Out
                        </span>
                      </div>
                    )}

                    <div className={`relative aspect-[4/3] w-full ${isSold ? 'bg-slate-700' : 'bg-slate-900'} overflow-hidden`}>
                      <Image
                        src={unit.image || "/images/placeholder.png"}
                        alt={unit.name}
                        fill
                        className={`object-cover ${isSold ? 'opacity-50' : 'opacity-100'} group-hover:scale-110 transition-transform duration-700 ease-out`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 pointer-events-none" />
                      <span className="absolute top-4 left-4 bg-slate-900/70 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-lg border border-white/10 z-10 shadow-md">
                        {unit.category || "Standard"}
                      </span>
                    </div>

                    <div className={`p-6 space-y-5 flex-1 flex flex-col justify-between ${isSold ? 'opacity-70' : 'opacity-100'}`}>
                      <div className="space-y-3.5">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-lg font-black text-slate-900 group-hover:text-orange-600 transition-colors duration-300">
                            {unit.name}
                          </h3>
                          <div className="flex flex-col items-end gap-1">
                            {bType && (
                              <span className="shrink-0 text-[11px] text-orange-700 font-bold uppercase tracking-wider bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-lg">
                                Tipe {bType}
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{unit.specs}</p>

                        {/* Informasi Lantai & Spesifikasi Ruangan Digabung / Dirapikan */}
                        <div className="space-y-2">
                          {fInfo && (
                            <div className="flex items-center gap-2 py-2 px-3 text-xs bg-slate-100/70 rounded-xl border border-slate-200/60 text-slate-700 font-medium">
                              <span className="p-1 bg-white text-slate-700 rounded-md shadow-xs">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                              </span>
                              <span>Lantai: <strong className="text-slate-900">{fInfo}</strong></span>
                            </div>
                          )}

                          <div className="flex flex-wrap items-center justify-between gap-2 py-2.5 px-3.5 text-xs font-semibold text-slate-700 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-1.5">
                              <span className="p-1 bg-orange-100 text-orange-600 rounded-lg">
                                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                              </span>
                              <span>{unit.bedrooms !== null && unit.bedrooms !== undefined ? `${unit.bedrooms} Bedroom` : '-'}</span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <span className="p-1 bg-orange-100 text-orange-600 rounded-lg">
                                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                </svg>
                              </span>
                              <span>{unit.bathrooms !== null && unit.bathrooms !== undefined ? `${unit.bathrooms} Bathroom` : '-'}</span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <span className="p-1 bg-orange-100 text-orange-600 rounded-lg">
                                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                              </span>
                              <span>{unit.kitchen ?? 1} Kitchen</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Mulai Harga</p>
                          <p className="text-sm sm:text-base font-black text-slate-900">{priceDisplay}</p>
                        </div>
                        {!isSold ? (
                          <WhatsAppLeadButton
                            unitName={unit.name}
                            buildingType={bType}
                            projectTitle={project.title}
                            adminPhone={ADMIN_PHONE}
                          />
                        ) : (
                          <span className="text-xs text-red-500 font-bold bg-red-50 px-3 py-2 rounded-xl border border-red-100">
                            Sold Out
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Fasilitas & Bank KPR */}
        {(project.facilities && project.facilities.length > 0) || bankList.length > 0 ? (
          <div className="bg-white/80 backdrop-blur-md p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-10 my-8">
            
            {project.facilities && project.facilities.length > 0 && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-4 text-center">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Fasilitas Kawasan</h2>
                  <p className="text-xs text-slate-500 mt-1">Fasilitas eksklusif yang dirancang untuk kenyamanan hidup Anda dan keluarga</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {project.facilities.map((facility: string, idx: number) => (
                    <div key={idx} className="bg-slate-50/80 hover:bg-orange-50/40 transition-all duration-300 p-4 rounded-2xl border border-slate-100 flex items-center gap-3.5 group">
                      <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 flex items-center justify-center shrink-0 font-bold text-xs">
                        ✓
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {bankList.length > 0 && (
              <div className="space-y-6 pt-2">
                <div className="border-b border-slate-100 pb-4 text-center">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Didukung Oleh Bank KPR Terkemuka</h2>
                  <p className="text-xs text-slate-500 mt-1">Kemudahan proses KPR dengan mitra perbankan terpercaya kami</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {bankList.map((bank: string, idx: number) => (
                    <div key={idx} className="bg-slate-50/80 hover:bg-slate-100 transition-all duration-300 p-4 rounded-2xl border border-slate-100 flex items-center justify-center text-center group">
                      <span className="text-sm font-extrabold text-slate-700 tracking-wide group-hover:text-orange-600 transition-colors">{bank}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        ) : null}
      </div>

      <div className="pt-10">
        <Contact />
      </div>

      <Footer />
    </div>
  );
}
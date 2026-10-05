// src/app/projects/[id]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../component/Navbar";
import Footer from "../../component/Footer";
import Contact from "../../component/Contact";
import {
  getProjectById,
  MARKETING_HOTLINE,
  GLOBAL_LEGALITY,
  GLOBAL_BANK_KPR,
  getBankLogoUrl,
} from "../../../lib/projectService";
import WhatsAppLeadButton from "../../component/WhatsAppLeadButton";
import BankLogo from "../../component/BankLogo";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

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
  carport?: number | null;
  image?: string | null;
  gallery?: Array<string | { url: string; label?: string }> | null;
  floorInfo?: string | null;
  floor_info?: string | null;
  isSoldOut?: boolean;
  is_sold_out?: boolean;
}

interface SpecsSummary {
  konsep_cluster?: string;
  konsep?: string;
  cluster?: string;
}

interface ProjectType {
  id: string;
  title: string;
  description: string;
  category: string;
  statusBadge?: string;
  status_badge?: string;
  imageCover?: string;
  image_cover?: string;
  location: string;
  mapsUrl?: string;
  maps_url?: string;
  specsSummary?: SpecsSummary;
  specs_summary?: SpecsSummary;
  unitTypes?: UnitType[];
  unit_types?: UnitType[];
  facilities?: string[];
  access?: string[];
}

/* ---------------- helpers (normalisasi camelCase / snake_case) ---------------- */

function parsePriceToNumber(priceStr?: string | null): number {
  if (!priceStr) return 0;
  const numbers = priceStr.replace(/[^0-9]/g, "");
  return numbers ? parseInt(numbers, 10) : 0;
}

const isCommercial = (c?: string) => {
  const t = (c || "").toLowerCase();
  return t.includes("komersil") || t.includes("komersial");
};

function getStatusClass(status: string): string {
  if (/sold/i.test(status)) return "bg-red-500";
  if (/coming|soon/i.test(status)) return "bg-amber-500";
  return "bg-emerald-600";
}

const fmtCount = (v: number | null | undefined, label: string) =>
  v !== null && v !== undefined ? `${v} ${label}` : "-";

interface NormalizedUnit extends UnitType {
  bType: string;
  price: string;
  fInfo: string;
  isSold: boolean;
  galleryCount: number;
}

// Satu-satunya tempat fallback field unit — JSX di bawah memakai hasil ini.
function normalizeUnit(u: UnitType): NormalizedUnit {
  const gallery = Array.isArray(u.gallery) ? u.gallery : [];
  return {
    ...u,
    bType: u.buildingType || u.building_type || "",
    price: u.priceStarting || u.price_starting || u.pricestarting || "Hubungi Kami",
    fInfo: u.floorInfo || u.floor_info || "",
    isSold: u.isSoldOut ?? u.is_sold_out ?? false,
    galleryCount: gallery.length,
  };
}

// "5 Menit ke Gerbang Tol Pakis" -> { time: "5 Menit", place: "Gerbang Tol Pakis" }
function parseAccess(raw: string): { time: string | null; place: string } {
  const match = raw.match(/^\s*(\d+\s*menit)\s*(?:ke\s+)?(.*)$/i);
  if (!match || !(match[2] || "").trim()) return { time: null, place: raw.trim() };
  return { time: match[1].trim(), place: match[2].trim().replace(/^./, (c) => c.toUpperCase()) };
}

/* ---------------- ikon (satu sumber path SVG outline) ---------------- */

const ACCESS_ICONS = {
  campus: "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222",
  school: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  airport: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8",
  road: "M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0",
  shop: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
  health: "M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z",
  office: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  pin: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z",
};

const ACCESS_RULES: Array<[RegExp, string]> = [
  [/kampus|universitas|univ\b|institut|politeknik|akademi/, ACCESS_ICONS.campus],
  [/smk|sma\b|sd\b|smp|sekolah|pesantren|kursus/, ACCESS_ICONS.school],
  [/bandara|airport/, ACCESS_ICONS.airport],
  [/tol|exit|gerbang|terminal|stasiun|pelabuhan/, ACCESS_ICONS.road],
  [/pasar|mall|plaza|supermarket|toko|city point/, ACCESS_ICONS.shop],
  [/rumah sakit|klinik|puskesmas/, ACCESS_ICONS.health],
  [/pabrik|industri|kantor/, ACCESS_ICONS.office],
];

function getAccessIcon(place: string): string {
  const t = place.toLowerCase();
  return ACCESS_RULES.find(([re]) => re.test(t))?.[1] ?? ACCESS_ICONS.pin;
}

const SPEC_ICONS = {
  bed: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  bath: "M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z",
  kitchen: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
  spark: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
  shield: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  badge: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
  map: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
};

/* ---------------- komponen kecil (ganti blok JSX berulang) ---------------- */

function OutlineIcon({ d, className = "h-5 w-5", sw = 1.8 }: { d: string; className?: string; sw?: number }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={sw} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

function SpecItem({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
        <OutlineIcon d={icon} className="h-4 w-4" />
      </span>
      <span className="truncate text-xs font-bold text-slate-700">{text}</span>
    </div>
  );
}

/* ---------------- page ---------------- */

export default async function ProjectDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const project = (await getProjectById(resolvedParams.id)) as ProjectType | null;

  if (!project) {
    notFound();
  }

  // Normalisasi sekali di sini — JSX di bawah tanpa fallback ganda.
  const cover = project.imageCover || project.image_cover || "/images/placeholder.svg";
  const statusLabel = project.statusBadge || project.status_badge || "Available";
  const mapsUrl = project.mapsUrl || project.maps_url;
  const specs = project.specsSummary || project.specs_summary || {};
  const clusterConcept = specs.konsep_cluster || specs.konsep || specs.cluster || "-";
  const facilityList = project.facilities || [];
  const accessList = project.access || [];

  const sortedUnitTypes = [...(project.unitTypes || project.unit_types || [])]
    .map(normalizeUnit)
    .sort((a, b) => {
      if (a.isSold !== b.isSold) return a.isSold ? 1 : -1;
      const aCom = isCommercial(a.category);
      const bCom = isCommercial(b.category);
      if (aCom !== bCom) return aCom ? -1 : 1;
      return parsePriceToNumber(b.priceStarting || b.price_starting) - parsePriceToNumber(a.priceStarting || a.price_starting);
    });

  // Disclaimer statis: harga tercantum belum termasuk biaya-biaya berikut.
  // Angka besaran bersifat kisaran/estimasi umum — nilai pasti mengikuti
  // ketentuan masing-masing bank, notaris/PPAT, dan peraturan pajak yang berlaku.
  const PRICE_ICONS = {
    bank: "M3 21h18M4 18h16M6 18v-7m4 7v-7m4 7v-7m4 7v-7M2 10l10-6 10 6",
    cash: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5h.01",
    clipboard: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
    doc: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    receipt: "M9 14l2 2 4-4M5 3h14a1 1 0 011 1v16l-2.5-1.5L15 20l-2.5-1.5L10 20l-2.5-1.5L5 20V4a1 1 0 011-1z",
  };

  const PRICE_EXCLUSIONS: Array<{ name: string; estimate: string; scope: "Khusus KPR" | "Cash & KPR"; icon: string }> = [
    { name: "Provisi Bank", estimate: "±1% dari plafon kredit", scope: "Khusus KPR", icon: PRICE_ICONS.bank },
    { name: "Administrasi Bank", estimate: "±Rp 500 rb – Rp 1 jt", scope: "Khusus KPR", icon: PRICE_ICONS.cash },
    { name: "Appraisal (penilaian agunan)", estimate: "±Rp 500 rb – Rp 1,5 jt", scope: "Khusus KPR", icon: PRICE_ICONS.clipboard },
    { name: "Asuransi Jiwa & Kebakaran", estimate: "Mengikuti tarif penanggung, plafon & tenor", scope: "Khusus KPR", icon: SPEC_ICONS.shield },
    { name: "Notaris & Legalitas (AJB, APHT, SKMHT)", estimate: "±1–2% dari nilai transaksi + PNBP", scope: "Cash & KPR", icon: PRICE_ICONS.doc },
    { name: "Pajak BPHTB", estimate: "5% × (NPOP – NPOPTKP)", scope: "Cash & KPR", icon: PRICE_ICONS.receipt },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-slate-50 pb-20 font-sans selection:bg-orange-500 selection:text-white">
      <div className="sticky top-0 z-50 border-b border-slate-100 bg-white/85 shadow-sm backdrop-blur-md">
        <Navbar />
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden bg-slate-950 px-4 pb-32 pt-16 text-white sm:px-6 sm:pb-40 sm:pt-24 lg:px-8">
        <div className="absolute inset-0 z-0 scale-105 opacity-40 transition-transform duration-1000 hover:scale-110">
          <Image src={cover} alt={project.title} fill sizes="100vw" className="object-cover object-center brightness-90 transition-all duration-700" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl space-y-6 animate-fadeIn">
          <div className="flex items-center gap-2.5 text-xs font-medium tracking-wide text-slate-300">
            <Link href="/" className="transition-colors hover:text-orange-400">Skyland Property</Link>
            <span className="font-bold text-orange-500">›</span>
            <Link href="/projects" className="transition-colors hover:text-orange-400">Proyek</Link>
            <span className="font-bold text-orange-500">›</span>
            <span className="font-semibold text-orange-400">{project.title}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="rounded-full bg-orange-500 px-3.5 py-1.5 text-xs font-bold tracking-wide text-white shadow-sm shadow-orange-500/30">
              {project.category}
            </span>
            <span className={`rounded-full px-3.5 py-1.5 text-xs font-bold tracking-wide text-white shadow-sm ${getStatusClass(statusLabel)}`}>
              {statusLabel}
            </span>
          </div>

          <div className="max-w-3xl space-y-3">
            <h1 className="text-4xl font-black leading-tight tracking-tight text-white drop-shadow-sm sm:text-6xl">
              {project.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <p className="flex items-center gap-2 text-sm font-medium text-slate-300 sm:text-base">
                <span className="shrink-0 rounded-lg border border-orange-500/30 bg-orange-500/25 p-1.5 text-orange-400">
                  <OutlineIcon d={ACCESS_ICONS.pin} className="h-4 w-4" sw={2} />
                </span>
                <span>{project.location}</span>
              </p>
              {mapsUrl && (
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-orange-500/20 transition-all duration-300 hover:scale-105 hover:bg-orange-600">
                  <OutlineIcon d={SPEC_ICONS.map} className="h-4 w-4" sw={2} />
                  <span>Buka Google Maps</span>
                </a>
              )}
            </div>
          </div>

          <p className="max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-5 text-sm font-normal leading-relaxed text-slate-300 backdrop-blur-md sm:text-base">
            {project.description}
          </p>
        </div>
      </div>

      {/* Main */}
      <div className="relative z-20 mx-auto -mt-16 max-w-6xl space-y-12 px-4 sm:-mt-20 sm:px-6 lg:px-8">
        {/* Identitas proyek — posisi summary sebelumnya, style tile baru + shape putih */}
        <div className="rounded-2xl border border-slate-100 bg-white p-2 shadow-[0_24px_70px_-28px_rgba(15,23,42,0.15)] sm:rounded-[2rem] sm:p-4">
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <div className="group flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/80 p-2.5 transition-all duration-300 hover:border-orange-200 hover:bg-orange-50/60 sm:gap-3.5 sm:rounded-[1.5rem] sm:p-5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 transition-all duration-300 group-hover:scale-105 group-hover:bg-orange-500 group-hover:text-white sm:h-11 sm:w-11">
                <OutlineIcon d={SPEC_ICONS.spark} className="h-4 w-4 sm:h-5 sm:w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[8px] font-bold uppercase tracking-[0.12em] text-slate-400 sm:text-[10px] sm:tracking-[0.14em]">Konsep Cluster</span>
                <span className="mt-0.5 block truncate text-xs font-extrabold leading-tight text-slate-900 sm:text-lg">{clusterConcept}</span>
              </span>
            </div>
          <div className="group relative flex items-center gap-2 overflow-hidden rounded-xl border border-orange-500/30 bg-slate-950 p-2.5 shadow-[0_24px_70px_-28px_rgba(15,23,42,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/25 sm:gap-3.5 sm:rounded-[1.5rem] sm:p-5">
            <div className="pointer-events-none absolute -right-8 -top-10 h-24 w-24 rounded-full bg-orange-500/25 blur-2xl" />
            <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white shadow-[0_8px_20px_-6px_rgba(249,115,22,0.6)] sm:h-11 sm:w-11">
              <OutlineIcon d={SPEC_ICONS.badge} className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <span className="relative min-w-0">
              <span className="block text-[8px] font-bold uppercase tracking-[0.12em] text-orange-400 sm:text-[10px] sm:tracking-[0.14em]">Legalitas Terjamin</span>
              <span className="mt-0.5 block text-sm font-black leading-none tracking-tight text-white sm:text-2xl">{GLOBAL_LEGALITY}</span>
            </span>
            {/* <span className="relative ml-auto hidden shrink-0 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/90 sm:inline-block">
              Certified
            </span> */}
          </div>
          </div>
        </div>

        {/* Unit types */}
        {sortedUnitTypes.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-end justify-between border-b border-slate-200/60 pb-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-black tracking-tight text-slate-900">Pilihan Tipe Unit</h2>
                <p className="text-xs text-slate-500">Pilih hunian impian yang sesuai dengan kebutuhan keluarga Anda</p>
              </div>
              <span className="hidden shrink-0 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm sm:inline-block">
                {sortedUnitTypes.length} Tipe Tersedia
              </span>
            </div>
            {sortedUnitTypes.length > 1 && (
              <p className="-mt-5 text-[11px] font-medium text-slate-400 md:hidden">
                ← Geser untuk lihat {sortedUnitTypes.length} tipe lainnya →
              </p>
            )}

            <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3 md:gap-8 [&::-webkit-scrollbar]:hidden">
              {sortedUnitTypes.map((unit) => {
                const unitSpecs = [
                  { icon: SPEC_ICONS.bed, text: fmtCount(unit.bedrooms, "Bedroom") },
                  { icon: SPEC_ICONS.bath, text: fmtCount(unit.bathrooms, "Bathroom") },
                  { icon: SPEC_ICONS.kitchen, text: `${unit.kitchen ?? 1} Kitchen` },
                  { icon: ACCESS_ICONS.road, text: fmtCount(unit.carport, "Carport") },
                ];
                return (
                  <article
                    key={unit.id}
                    className={`group relative flex w-[85vw] max-w-[340px] shrink-0 snap-center flex-col overflow-hidden rounded-[2rem] border bg-white text-left transition-all duration-500 md:w-auto md:max-w-none md:snap-align-none md:hover:-translate-y-2 ${
                      unit.isSold ? "border-red-100" : "border-slate-100"
                    } shadow-[0_16px_45px_-24px_rgba(15,23,42,0.28)] hover:shadow-[0_25px_60px_-25px_rgba(15,23,42,0.35)]`}
                  >
                    {unit.isSold && (
                      <div className="absolute right-4 top-4 z-30">
                        <span className="rounded-full bg-red-600 px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-white shadow-lg">
                          Sold Out
                        </span>
                      </div>
                    )}

                    {/* Image — klik masuk ke halaman detail tipe (galeri POV + denah) */}
                    <Link
                      href={`/projects/${project.id}/tipe/${unit.id}`}
                      className={`relative block aspect-[4/3] w-full overflow-hidden ${unit.isSold ? "bg-slate-700" : "bg-slate-900"}`}
                    >
                      <Image
                        src={unit.image || "/images/placeholder.svg"}
                        alt={unit.name}
                        fill
                        sizes="(max-width: 768px) 85vw, (max-width: 1200px) 50vw, 380px"
                        className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07] ${unit.isSold ? "opacity-50" : "opacity-100"}`}
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/5 to-transparent" />
                      <div className="absolute left-4 top-4 z-10">
                        <span className="inline-flex items-center rounded-xl border border-white/15 bg-slate-950/65 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-md">
                          {unit.category || "Standard"}
                        </span>
                      </div>
                      {unit.bType && (
                        <div className="absolute bottom-4 right-4 z-10">
                          <span className="rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                            Tipe {unit.bType}
                          </span>
                        </div>
                      )}
                      <div className="absolute bottom-4 left-4 z-10">
                        <span className="rounded-xl bg-orange-500 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                          {/* 📷 {unit.galleryCount + 1} foto •  */}
                          Lihat Detail
                        </span>
                      </div>
                    </Link>

                    {/* Body */}
                    <div className={`flex flex-1 flex-col justify-between p-5 sm:p-6 ${unit.isSold ? "opacity-70" : "opacity-100"}`}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Link href={`/projects/${project.id}/tipe/${unit.id}`}>
                            <h3 className="text-xl font-black tracking-tight text-slate-900 transition-colors duration-300 hover:text-orange-600">
                              {unit.name}
                            </h3>
                          </Link>
                          <p className="line-clamp-2 text-xs leading-relaxed text-slate-500">{unit.specs}</p>
                          {/* <Link
                            href={`/projects/${project.id}/tipe/${unit.id}`}
                            className="inline-block text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline"
                          >
                            Lihat galeri & denah →
                          </Link> */}
                        </div>

                        {unit.fInfo && (
                          <div className="relative overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-slate-50 px-4 py-3.5 shadow-[0_8px_24px_-16px_rgba(249,115,22,0.35)]">
                            <div className="pointer-events-none absolute -right-6 -top-8 h-20 w-20 rounded-full bg-orange-100/60 blur-2xl" />
                            <div className="absolute bottom-3 left-0 top-3 w-1 rounded-r-full bg-orange-500" />
                            <div className="relative flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-orange-500 shadow-sm ring-1 ring-orange-100">
                                <OutlineIcon d={ACCESS_ICONS.office} className="h-[18px] w-[18px]" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-orange-500">Tipe Bangunan</p>
                                <p className="mt-0.5 text-sm font-black text-slate-900">{unit.fInfo}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5">
                          <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                            {unitSpecs.map((s) => (
                              <SpecItem key={s.text} icon={s.icon} text={s.text} />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
                        <div className="min-w-0">
                          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">Harga Unit</p>
                          <p className="mt-0.5 truncate text-base font-black text-slate-900 sm:text-lg">{unit.price}</p>
                        </div>
                        {!unit.isSold ? (
                          <WhatsAppLeadButton
                            unitName={unit.name}
                            buildingType={unit.bType}
                            projectTitle={project.title}
                            adminPhone={MARKETING_HOTLINE}
                          />
                        ) : (
                          <span className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-bold text-red-500">
                            Sold Out
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* Catatan harga: belum termasuk biaya KPR & legalitas */}
        <details className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <summary className="flex cursor-pointer list-none items-center gap-3 [&::-webkit-details-marker]:hidden">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold text-slate-900 sm:text-base">
                Harga belum termasuk biaya KPR & legalitas
              </span>
              <span className="mt-0.5 block text-xs text-slate-500">
                6 pos biaya &middot; klik untuk lihat rincian
              </span>
            </span>
            <svg className="h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>

          <ul className="mt-4 grid grid-cols-1 gap-x-6 border-t border-slate-100 pt-2 sm:grid-cols-2">
            {PRICE_EXCLUSIONS.map((item) => (
              <li key={item.name} className="flex items-baseline justify-between gap-3 border-b border-slate-50 py-2.5 last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0">
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-slate-800">{item.name}</span>
                  <span className="block text-xs text-slate-500">{item.estimate} &middot; {item.scope}</span>
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
            * Kisaran estimasi; nilai pasti mengikuti ketentuan bank ({GLOBAL_BANK_KPR.join(", ")}),
            notaris/PPAT, dan pajak daerah. Hubungi marketing untuk simulasi total biaya.
          </p>
        </details>

        {/* Facility + Access + Bank */}
        <div className="my-8 space-y-10 rounded-[2.5rem] border border-slate-100 bg-white/80 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-md sm:p-10">
          {facilityList.length > 0 && (
            <div className="space-y-6">
              <div className="border-b border-orange-100 pb-4 text-center">
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">Fasilitas Kawasan</h2>
                <p className="mt-1 text-xs text-slate-500">Fasilitas eksklusif yang dirancang untuk kenyamanan hidup Anda dan keluarga</p>
              </div>
              {/* Mobile: chips melipat */}
              <div className="flex flex-wrap justify-center gap-2 md:hidden">
                {facilityList.map((facility: string, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-[11px] font-bold text-orange-700"
                  >
                    <svg className="h-3 w-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.28 3.94a1 1 0 00.95.69h4.14c.97 0 1.37 1.24.59 1.81l-3.35 2.44a1 1 0 00-.36 1.12l1.28 3.93c.3.93-.75 1.7-1.54 1.13l-3.35-2.44a1 1 0 00-1.18 0l-3.35 2.44c-.78.57-1.84-.2-1.54-1.13l1.28-3.93a1 1 0 00-.36-1.12L2.09 8.37c-.78-.57-.38-1.81.6-1.81h4.13a1 1 0 00.95-.69l1.28-3.94z" />
                    </svg>
                    {facility}
                  </span>
                ))}
              </div>
              {/* Desktop: kartu grid */}
              <div className="hidden grid-cols-1 gap-4 sm:grid-cols-2 md:grid lg:grid-cols-3">
                {facilityList.map((facility: string, idx: number) => (
                  <div
                    key={idx}
                    className="group flex items-center gap-3.5 rounded-2xl border border-orange-100 bg-orange-50/60 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-500 hover:shadow-lg hover:shadow-orange-500/20"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white transition-colors duration-300 group-hover:bg-white group-hover:text-orange-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.28 3.94a1 1 0 00.95.69h4.14c.97 0 1.37 1.24.59 1.81l-3.35 2.44a1 1 0 00-.36 1.12l1.28 3.93c.3.93-.75 1.7-1.54 1.13l-3.35-2.44a1 1 0 00-1.18 0l-3.35 2.44c-.78.57-1.84-.2-1.54-1.13l1.28-3.93a1 1 0 00-.36-1.12L2.09 8.37c-.78-.57-.38-1.81.6-1.81h4.13a1 1 0 00.95-.69l1.28-3.94z" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold leading-snug text-slate-800 transition-colors duration-300 group-hover:text-white sm:text-sm">
                      {facility}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {accessList.length > 0 && (
            <div className="pt-4">
              <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:gap-10">
                <div className="flex items-start gap-4 lg:w-[300px] lg:shrink-0 xl:w-[340px]">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 sm:h-14 sm:w-14">
                    <OutlineIcon d={ACCESS_ICONS.pin} className="h-6 w-6 sm:h-7 sm:w-7" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">Akses Strategis</h2>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-500 sm:text-sm">
                      Lokasi yang mudah dijangkau, dekat dengan berbagai fasilitas penting di Malang.
                    </p>
                  </div>
                </div>
                <div aria-hidden="true" className="h-px w-full shrink-0 bg-slate-100 lg:h-auto lg:w-px lg:self-stretch" />
                <ul className="grid flex-1 grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-3 sm:gap-y-6">
                  {accessList.map((acc: string, idx: number) => {
                    const { time, place } = parseAccess(acc);
                    return (
                      <li key={idx} className="group flex items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-500 ring-1 ring-orange-100 transition-colors duration-300 group-hover:bg-orange-500 group-hover:text-white group-hover:ring-orange-500">
                          <OutlineIcon d={getAccessIcon(place)} />
                        </span>
                        <span className="min-w-0">
                          {time && (
                            <span className="block text-[11px] font-bold uppercase tracking-wider text-orange-600">{time}</span>
                          )}
                          <span className="mt-0.5 block text-sm font-bold leading-snug text-slate-900">{place}</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}

          <div className="space-y-6 pt-4">
            <div className="border-b border-slate-100 pb-4 text-center">
              <h2 className="text-2xl font-black tracking-tight text-slate-900">Didukung Oleh Bank KPR Terkemuka</h2>
              <p className="mt-1 text-xs text-slate-500">Kemudahan proses KPR dengan mitra perbankan terpercaya kami</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 py-2 sm:gap-6">
              {GLOBAL_BANK_KPR.map((bank: string) => (
                <BankLogo key={bank} name={bank} logo={getBankLogoUrl(bank)} className="h-6 w-auto max-w-[80px] object-contain transition-transform duration-300 hover:scale-105 sm:h-9 sm:max-w-[110px]" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-10">
        <Contact />
      </div>
      <Footer />
    </div>
  );
}

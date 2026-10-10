// src/app/projects/[id]/tipe/[unitId]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../../../component/Navbar";
import Footer from "../../../../component/Footer";
import Contact from "../../../../component/Contact";
import WhatsAppLeadButton from "../../../../component/WhatsAppLeadButton";
import TrackViewContent from "../../../../component/TrackViewContent";
import {
  getProjectById,
  MARKETING_HOTLINE,
  type UnitType,
  type UnitGalleryImage,
} from "../../../../../lib/projectService";
import UnitGallery from "./UnitGallery";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string; unitId: string }>;
}

export default async function UnitDetailPage({ params }: PageProps) {
  const { id, unitId } = await params;
  const project = await getProjectById(id);

  if (!project) notFound();

  const units: UnitType[] = project.unitTypes || project.unit_types || [];
  const unit: UnitType | undefined = units.find((u: UnitType) => u.id === unitId);

  if (!unit) notFound();

  const cover = unit.image || "/images/placeholder.svg";
  const bType = unit.buildingType || unit.building_type || "";
  const price = unit.priceStarting || unit.price_starting || "Hubungi Kami";
  const fInfo = unit.floorInfo || unit.floor_info || "";
  const rawGallery: Array<string | UnitGalleryImage> = Array.isArray(unit.gallery) ? unit.gallery : [];
  const galleryPhotos: Array<{ url: string; label?: string }> = [
    { url: cover, label: "Tampak Depan" },
    ...rawGallery.map((g: string | UnitGalleryImage) =>
      typeof g === "string" ? { url: g } : { url: g.url, label: g.label }
    ),
  ].filter((p, i, arr) => p.url && arr.findIndex((x) => x.url === p.url) === i);

  const others: UnitType[] = units.filter((u: UnitType) => u.id !== unitId).slice(0, 3);

  const specs = [
    { label: "Kamar Tidur", value: unit.bedrooms != null ? `${unit.bedrooms}` : "-" },
    { label: "Kamar Mandi", value: unit.bathrooms != null ? `${unit.bathrooms}` : "-" },
    { label: "Dapur", value: `${unit.kitchen ?? 1}` },
    { label: "Carport", value: unit.carport != null ? `${unit.carport}` : "-" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      <TrackViewContent contentName={unit.name} contentCategory={project.title} />
      <div className="sticky top-0 z-50 border-b border-slate-100 bg-white/85 shadow-sm backdrop-blur-md">
        <Navbar />
      </div>

      <div className="mx-auto max-w-6xl space-y-8 px-4 pt-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
          <Link href="/" className="hover:text-orange-500">Skyland Property</Link>
          <span className="font-bold text-orange-500">›</span>
          <Link href="/projects" className="hover:text-orange-500">Proyek</Link>
          <span className="font-bold text-orange-500">›</span>
          <Link href={`/projects/${project.id}`} className="hover:text-orange-500">{project.title}</Link>
          <span className="font-bold text-orange-500">›</span>
          <span className="font-semibold text-orange-500">{unit.name}</span>
        </div>

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">
                {unit.category || "Standard"}
              </span>
              {bType && (
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700">
                  Tipe {bType}
                </span>
              )}
              {(unit.isSoldOut ?? unit.is_sold_out) && (
                <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">Sold Out</span>
              )}
            </div>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
              {unit.name}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {project.title} • {project.location}
            </p>
          </div>
          <Link
            href={`/projects/${project.id}`}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            &larr; Kembali ke {project.title}
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Galeri */}
          <div className="lg:col-span-3">
            <UnitGallery photos={galleryPhotos} unitName={unit.name} />
            <p className="mt-2 text-[11px] text-slate-400">
              {galleryPhotos.length} foto • geser / klik thumbnail untuk lihat POV kanan-kiri, denah, dan interior
            </p>
          </div>

          {/* Info */}
          <div className="lg:col-span-2">
            <div className="space-y-5 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Harga Unit</p>
                <p className="mt-1 text-3xl font-black text-slate-900">{price}</p>
                <p className="mt-1 text-[11px] text-slate-400">* Belum termasuk biaya KPR & legalitas</p>
              </div>

              {fInfo && (
                <div className="rounded-2xl border border-orange-100 bg-orange-50/60 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-orange-500">Tipe Bangunan</p>
                  <p className="mt-0.5 text-sm font-black text-slate-900">{fInfo}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {specs.map((s) => (
                  <div key={s.label} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 text-center">
                    <p className="text-2xl font-black text-slate-900">{s.value}</p>
                    <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">{s.label}</p>
                  </div>
                ))}
              </div>

              {unit.specs && (
                <p className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-xs leading-relaxed text-slate-600">
                  {unit.specs}
                </p>
              )}

              {!(unit.isSoldOut ?? unit.is_sold_out) ? (
                <WhatsAppLeadButton
                  unitName={unit.name}
                  buildingType={bType}
                  projectTitle={project.title}
                  adminPhone={MARKETING_HOTLINE}
                />
              ) : (
                <span className="inline-block rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-500">
                  Unit Sold Out
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tipe lain */}
        {others.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900">Tipe lain di {project.title}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {others.map((o: UnitType) => (
                <Link
                  key={o.id}
                  href={`/projects/${project.id}/tipe/${o.id}`}
                  className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <p className="font-black text-slate-900">{o.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{o.priceStarting || o.price_starting || "Hubungi Kami"}</p>
                  <p className="mt-2 text-xs font-bold text-orange-600">Lihat Detail →</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* <div className="pt-10">
        <Contact />
      </div> */}
      <br />
      <Footer />
    </div>
  );
}

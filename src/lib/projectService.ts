// src/lib/projectService.ts
import { supabase } from "./supabase";

export interface UnitGalleryImage {
  url: string;
  label?: string;
}

export interface UnitType {
  id: string;
  name: string;
  buildingType?: string;
  building_type?: string;
  category?: string;
  bedrooms?: number;
  bathrooms?: number;
  kitchen?: number;
  carport?: number;
  specs?: string;
  priceStarting?: string;
  price_starting?: string;
  image?: string;
  gallery?: UnitGalleryImage[] | string[];
  floorInfo?: string;
  floor_info?: string;
  isSoldOut?: boolean;
  is_sold_out?: boolean;
}

export const UNIT_GALLERY_BUCKET = "tipe-detail";

export interface Project {
  id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  imageCover?: string;
  image_cover?: string;
  image?: string;
  statusBadge?: string;
  status_badge?: string;
  subBadge?: string;
  sub_badge?: string;
  totalUnits?: string;
  total_units?: string;
  specsSummary?: Record<string, unknown>;
  specs_summary?: Record<string, unknown>;
  
  // Revisi Kolom Fasilitas & Akses
  facilities?: string[]; // Fasilitas Kawasan (Baru)
  access?: string[];     // Akses Strategis (Eks-facilities lama)
  access_text?: string[]; // Cadangan jika dari DB menggunakan snake_case

  mapsUrl?: string;
  maps_url?: string;
  unitTypes?: UnitType[];
  unit_types?: UnitType[];
  // Penanda waktu untuk pengurutan "update terbaru paling atas".
  updated_at?: string;
  created_at?: string;
}

// Nomor hotline kini tinggal di companyData (bebas Supabase).
export { MARKETING_HOTLINE } from "./companyData";

// Data Statis Global untuk Keamanan, Legalitas, dan Bank KPR
export const GLOBAL_SECURITY = "One Gate System dengan CCTV 24 Jam";
export const GLOBAL_LEGALITY = "SHGB";

export const GLOBAL_BANK_KPR = [
  "BTN",
  "BSI",
  "Mandiri",
  "BCA",
  "BRI",
  "BNI",
  "BSN"
];

// Logo bank KPR dari folder public/images/bank_kpr.
// Jika file belum tersedia, kartu logo disembunyikan (lihat BankLogo).
const BANK_KPR_LOGO_FILES: Record<string, string> = {
  BTN: "Group 73.png",
  BSI: "BSI Logo.png",
  Mandiri: "Mandiri Logo.png",
  BCA: "Group 77.png",
  BRI: "BRI Logo.png",
  BNI: "BNI Logo.png",
  BSN: "BSN Logo.png",
};

export function getBankLogoUrl(bankName: string): string {
  const file = BANK_KPR_LOGO_FILES[bankName] ?? `${bankName}.png`;
  return encodeURI(`/images/bank_kpr/${file}`);
}

// Fungsi pembantu untuk membuat slug otomatis dari nama
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function normalizeGallery(raw: unknown): UnitGalleryImage[] {
  if (!raw) return [];
  const arr = Array.isArray(raw) ? raw : [];
  return arr
    .map((item) => {
      if (typeof item === "string") return { url: item };
      if (item && typeof item === "object") {
        const obj = item as Record<string, unknown>;
        const url = typeof obj.url === "string" ? obj.url : "";
        if (!url) return null;
        return {
          url,
          label: typeof obj.label === "string" ? obj.label : undefined,
        };
      }
      return null;
    })
    .filter((x): x is UnitGalleryImage => x !== null && !!x.url);
}

function mapProjectData(item: Project): Project {
  if (!item) return item;
  return {
    ...item,
    imageCover: item.imageCover || item.image_cover || item.image || "/images/placeholder.svg",
    statusBadge: item.statusBadge || item.status_badge || "Available",
    subBadge: item.subBadge || item.sub_badge,
    totalUnits: item.totalUnits || item.total_units,
    specsSummary: item.specsSummary || item.specs_summary,
    
    // Mapping untuk Fasilitas dan Akses agar aman dari format database (camelCase / snake_case)
    facilities: item.facilities || [],
    access: item.access || item.access_text || [],

    mapsUrl: item.mapsUrl || item.maps_url,
    unitTypes: (item.unitTypes || item.unit_types || []).map((u: UnitType) => ({
      ...u,
      buildingType: u.buildingType || u.building_type,
      priceStarting: u.priceStarting || u.price_starting,
      floorInfo: (u as UnitType).floorInfo || (u as UnitType).floor_info,
      gallery: normalizeGallery((u as UnitType).gallery),
      kitchen: u.kitchen ?? 1,
      carport: u.carport ?? undefined,
      isSoldOut: u.isSoldOut ?? u.is_sold_out ?? false,
    }))
  };
}

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*, unit_types(*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  // Urutan tampil: update terbaru paling atas (updated_at, fallback created_at).
  // Sorting client-side agar tetap benar baik sebelum maupun sesudah
  // kolom updated_at tersedia di database.
  return sortByRecentUpdate((data || []).map(mapProjectData));
}

/**
 * Urutkan daftar proyek: yang terakhir diupdate paling atas.
 * Memakai updated_at bila ada, fallback ke created_at.
 */
export function sortByRecentUpdate<T extends { updated_at?: string; created_at?: string }>(
  items: T[]
): T[] {
  return [...items].sort((a, b) => recencyOf(b) - recencyOf(a));
}

function recencyOf(item: { updated_at?: string; created_at?: string }): number {
  const t = Date.parse(item.updated_at || item.created_at || "");
  return Number.isNaN(t) ? 0 : t;
}

/**
 * Best-effort: sentuh updated_at proyek induk agar naik ke urutan teratas
 * (dipakai saat tipe rumah/denah dibuat atau diubah).
 * Kegagalan diabaikan (mis. kolom belum ada) — tidak menggagalkan alur utama.
 */
export async function touchProjectUpdatedAt(projectId: string): Promise<void> {
  if (!projectId) return;
  try {
    const { error } = await supabase
      .from("projects")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", projectId);
    if (error) throw new Error(error.message);
  } catch (err) {
    console.warn("touchProjectUpdatedAt diabaikan:", err);
  }
}

export async function getAllProjects(): Promise<Project[]> {
  return getProjects();
}

export async function getProjectById(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from("projects")
    .select("*, unit_types(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching project by id:", error);
    return null;
  }
  
  return mapProjectData(data);
}

export async function getUnitTypeById(unitId: string): Promise<(UnitType & { project_id?: string }) | null> {
  const { data, error } = await supabase
    .from("unit_types")
    .select("*")
    .eq("id", unitId)
    .single();

  if (error) {
    console.error("Error fetching unit type by id:", error);
    return null;
  }

  const raw = data as UnitType & { project_id?: string };
  return {
    ...raw,
    buildingType: raw.buildingType || raw.building_type,
    priceStarting: raw.priceStarting || raw.price_starting,
    floorInfo: raw.floorInfo || raw.floor_info,
    gallery: normalizeGallery(raw.gallery),
    isSoldOut: raw.isSoldOut ?? raw.is_sold_out ?? false,
  };
}

export async function upsertUnitType(payload: UnitType, unitId?: string) {
  if (unitId) {
    const { data, error } = await supabase
      .from("unit_types")
      .update(payload)
      .eq("id", unitId);
    if (error) throw error;
    return data;
  } else {
    const customId = payload.id || (payload.name ? generateSlug(payload.name) : undefined);
    
    const insertPayload = {
      ...payload,
      ...(customId ? { id: customId } : {}),
    };

    const { data, error } = await supabase
      .from("unit_types")
      .insert([insertPayload]);
      
    if (error) throw error;
    return data;
  }
}
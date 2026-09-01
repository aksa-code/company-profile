// src/lib/projectService.ts
import { supabase } from "./supabase";

export interface UnitType {
  id: string;
  name: string;
  buildingType?: string;
  building_type?: string;
  category?: string;
  bedrooms?: number;
  bathrooms?: number;
  kitchen?: number; // Ditambahkan di sini
  specs?: string;
  priceStarting?: string;
  price_starting?: string;
  image?: string;
  isSoldOut?: boolean;
  is_sold_out?: boolean;
}

// src/lib/projectService.ts

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
  specsSummary?: Record<string, any>; 
  specs_summary?: any;
  facilities?: string[];
  bankKPR?: string;
  bank_kpr?: string;
  mapsUrl?: string;
  maps_url?: string;
  unitTypes?: UnitType[];
  unit_types?: UnitType[];
}

export const MARKETING_HOTLINE = "6282145200700";

// Fungsi pembantu untuk membuat slug otomatis dari nama (Contoh: "Sky Light" -> "sky-light")
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function mapProjectData(item: any): Project {
  if (!item) return item;
  return {
    ...item,
    imageCover: item.imageCover || item.image_cover || item.image || "/images/placeholder.png",
    statusBadge: item.statusBadge || item.status_badge || "Available",
    subBadge: item.subBadge || item.sub_badge,
    totalUnits: item.totalUnits || item.total_units,
    specsSummary: item.specsSummary || item.specs_summary,
    bankKPR: item.bankKPR || item.bank_kpr,
    mapsUrl: item.mapsUrl || item.maps_url,
    unitTypes: (item.unitTypes || item.unit_types || []).map((u: any) => ({
      ...u,
      buildingType: u.buildingType || u.building_type,
      priceStarting: u.priceStarting || u.price_starting,
      kitchen: u.kitchen ?? 1, // Mengatur default fallback 1 jika datanya kosong dari database
      isSoldOut: u.isSoldOut ?? u.is_sold_out ?? false,
    }))
  };
}

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*, unit_types(*)");
  
  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
  
  return (data || []).map(mapProjectData);
}

// Menambahkan alias getAllProjects yang mengarah ke getProjects agar kompatibel dengan Footer.tsx
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

export async function upsertUnitType(payload: any, unitId?: string) {
  if (unitId) {
    // Jika sedang edit, update berdasarkan unitId yang sudah ada
    const { data, error } = await supabase
      .from("unit_types")
      .update(payload)
      .eq("id", unitId);
    if (error) throw error;
    return data;
  } else {
    // Jika data baru, buat custom ID (slug) otomatis dari 'name' jika payload memiliki nama
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
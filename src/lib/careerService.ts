// src/lib/careerService.ts
import { createClient } from "@supabase/supabase-js";

// Inisialisasi client Supabase (sesuaikan dengan setup project Anda)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
export const supabase = createClient(supabaseUrl, supabaseKey);

export interface CareerItem {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary?: string; // Kolom Gaji baru
  postedDate: string;
  isClosed: boolean;
  description: string;
  requirements: string[];
  responsibilities: string[];
  glintsUrl?: string;
}

// Tipe data yang merepresentasikan struktur baris data langsung dari tabel database Supabase
export interface CareerRow {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary?: string;
  posted_date: string;
  is_closed: boolean;
  description: string;
  requirements: string[] | null;
  responsibilities: string[] | null;
  glints_url?: string;
}

// Nomor WhatsApp HRD
export const hrdNumber = "6282111235001";

// Fungsi helper untuk menghitung tanggal relatif (misal: "2 hari yang lalu")
export function getRelativeDate(dateString: string): string {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return "Kemarin";
  } else if (diffDays < 7) {
    return `${diffDays} hari yang lalu`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} minggu yang lalu`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} bulan yang lalu`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} tahun yang lalu`;
  }
}

// Data Hero untuk Section Career
export const careerHeroData = {
  titleMain: "Bangun Masa Depan Bersama",
  titleHighlight: "Skyland Property",
  description: "Bergabunglah dengan tim profesional PT Griya Mapan Alami. Kami menawarkan skema gaji kompetitif, insentif menarik, serta peluang jenjang karier cepat di industri properti.",
  benefits: [
    "Gaji Kompetitif & Insentif Menarik",
    "Peluang Jenjang Karier Cepat",
    "Pelatihan Digital & Sales Marketing",
    "Lingkungan Kerja yang Kolaboratif",
    "Dukungan Event & Pameran Rutin",
    "Bonus & Reward Pencapaian Target"
  ],
  viewAllText: "Lihat Lowongan & Detail Posisi",
  viewAllLink: "/career",
  footerText: "Jadilah bagian dari kesuksesan ekspansi properti eksklusif kami."
};

// Mapping helper dari database row ke CareerItem TypeScript
const mapRowToCareer = (row: CareerRow): CareerItem => ({
  id: row.id,
  title: row.title,
  department: row.department,
  location: row.location,
  type: row.type,
  salary: row.salary,          // <--- Pastikan baris ini ada! (atau row.gaji jika kolom di Supabase bernama 'gaji')
  postedDate: row.posted_date,
  isClosed: row.is_closed,
  description: row.description,
  requirements: row.requirements || [],
  responsibilities: row.responsibilities || [],
  glintsUrl: row.glints_url,
});

// Mapping helper dari CareerItem ke format database row (snake_case)
const mapCareerToRow = (item: CareerItem): CareerRow => ({
  id: item.id,
  title: item.title,
  department: item.department,
  location: item.location,
  type: item.type,
  salary: item.salary,
  posted_date: item.postedDate,
  is_closed: item.isClosed,
  description: item.description,
  requirements: item.requirements,
  responsibilities: item.responsibilities,
  glints_url: item.glintsUrl,
});

// 1. Ambil semua data karier
export async function getCareers(): Promise<CareerItem[]> {
  const { data, error } = await supabase
    .from("career")
    .select("*")
    .order("posted_date", { ascending: false });

  if (error) {
    console.error("Error fetching careers:", error.message);
    throw new Error(error.message);
  }

  const rows = (data as CareerRow[]) || [];
  return rows.map(mapRowToCareer);
}

// 2. Ambil data karier berdasarkan ID (Digunakan di halaman Edit)
export async function getCareerById(id: string): Promise<CareerItem | null> {
  const { data, error } = await supabase
    .from("career")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching career with id ${id}:`, error.message);
    return null;
  }

  return data ? mapRowToCareer(data as CareerRow) : null;
}

// 3. Tambah data karier baru (Digunakan di halaman Create)
export async function createCareer(item: CareerItem): Promise<void> {
  const { error } = await supabase
    .from("career")
    .insert([mapCareerToRow(item)]);

  if (error) {
    console.error("Error creating career:", error.message);
    throw new Error(error.message);
  }
}

// 4. Perbarui data karier berdasarkan ID (Digunakan di halaman Edit)
export async function updateCareer(id: string, item: CareerItem): Promise<void> {
  const { error } = await supabase
    .from("career")
    .update(mapCareerToRow(item))
    .eq("id", id);

  if (error) {
    console.error(`Error updating career with id ${id}:`, error.message);
    throw new Error(error.message);
  }
}

// 5. Hapus data karier berdasarkan ID
export async function deleteCareer(id: string): Promise<void> {
  const { error } = await supabase
    .from("career")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Error deleting career with id ${id}:`, error.message);
    throw new Error(error.message);
  }
}

// Fungsi untuk memformat angka ke format Rupiah
export function formatRupiah(value: string | number): string {
  if (!value) return "";
  // Hapus semua karakter selain angka
  const numberString = value.toString().replace(/[^,\d]/g, "");
  const split = numberString.split(",");
  const sisa = split[0].length % 3;
  let rupiah = split[0].substr(0, sisa);
  const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  if (ribuan) {
    const separator = sisa ? "." : "";
    rupiah += separator + ribuan.join(".");
  }

  rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
  return rupiah ? "Rp " + rupiah : "";
}
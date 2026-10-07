// src/lib/galleryStorage.ts
// Satu-satunya tempat logika Storage untuk galeri unit (bucket tipe-detail).
// Prinsip: DATABASE GALLERY dan SUPABASE STORAGE harus selalu sinkron.
//
// - remove() Supabase TIDAK throw saat gagal (RLS/policy/not-found) — error
//   dikembalikan sebagai { error }, jadi WAJIB diperiksa, jangan try/catch saja.
// - remove() butuh object path relatif terhadap bucket (mis. "unit123/1700000_0_ab12cd.jpg"),
//   BUKAN full public URL. Jangan menebak path jika tidak bisa di-resolve.

import { UNIT_GALLERY_BUCKET } from "./projectService";

/** Bucket galeri unit — sama dengan yang sudah dipakai (jangan diganti). */
export const GALLERY_BUCKET = UNIT_GALLERY_BUCKET;

/** Interface struktural minimal agar bisa dipakai browser client mana pun. */
interface StorageBucket {
  upload(
    path: string,
    file: File,
    options?: { contentType?: string; cacheControl?: string; upsert?: boolean }
  ): Promise<{ data: unknown; error: { message: string } | null }>;
  remove(paths: string[]): Promise<{ data: unknown; error: { message: string } | null }>;
  getPublicUrl(path: string): { data: { publicUrl: string } };
}

export interface StorageLike {
  storage: { from(bucket: string): StorageBucket };
}

export interface GalleryUploadItem {
  file: File;
  label: string;
}

export interface UploadedGalleryImage {
  url: string;
  label: string;
  /** Object path di bucket (untuk rollback / verifikasi). */
  path: string;
}

function randomSuffix(): string {
  try {
    return crypto.randomUUID().slice(0, 8);
  } catch {
    return Math.random().toString(36).slice(2, 10);
  }
}

/**
 * Ambil object path bucket dari public URL Supabase Storage.
 * Mengembalikan null jika tidak bisa di-resolve — pemanggil DILARANG menebak
 * (mis. pakai filename saja) karena object tersimpan di bawah prefix unitId/.
 */
export function getStoragePathFromPublicUrl(
  publicUrl: string,
  bucket: string = GALLERY_BUCKET
): string | null {
  if (!publicUrl || typeof publicUrl !== "string") return null;
  const clean = publicUrl.split("?")[0];
  const markers = [
    `/storage/v1/object/public/${bucket}/`,
    `/storage/v1/object/authenticated/${bucket}/`,
  ];
  for (const marker of markers) {
    const idx = clean.indexOf(marker);
    if (idx !== -1) {
      const path = clean.slice(idx + marker.length).replace(/^\/+/, "");
      return path || null;
    }
  }
  return null;
}

/**
 * Upload banyak file galeri (hasil compressForUpload = WebP) dengan path anti-tabrakan:
 * `${unitId}/${timestamp}_${index}_${random}.webp`.
 * Header hemat-egress: contentType image/webp + cacheControl 1 tahun + upsert false.
 * Per-file try/catch (bukan fail-fast): file yang gagal dilaporkan,
 * file yang berhasil tetap dikembalikan — pemanggil yang memutuskan
 * commit atau rollback, tidak ada state setengah-setengah yang diam-diam.
 */
export async function uploadGalleryFiles(
  supabase: StorageLike,
  unitId: string,
  items: GalleryUploadItem[]
): Promise<{
  uploaded: UploadedGalleryImage[];
  failed: { index: number; name: string; message: string }[];
}> {
  const uploaded: UploadedGalleryImage[] = [];
  const failed: { index: number; name: string; message: string }[] = [];
  const batch = Date.now();

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const path = `${unitId}/${batch}_${i}_${randomSuffix()}.webp`;
    try {
      const { error } = await supabase.storage
        .from(GALLERY_BUCKET)
        .upload(path, item.file, {
          contentType: "image/webp",
          cacheControl: "31536000",
          upsert: false,
        });
      if (error) throw new Error(error.message);
      const { data } = supabase.storage.from(GALLERY_BUCKET).getPublicUrl(path);
      uploaded.push({ url: data.publicUrl, label: item.label.trim(), path });
    } catch (err) {
      failed.push({
        index: i,
        name: item.file.name,
        message: err instanceof Error ? err.message : "Upload gagal",
      });
    }
  }

  return { uploaded, failed };
}

/**
 * Hapus object fisik dari bucket. Error DIPERIKSA dan dikembalikan
 * (remove() tidak throw) — pemanggil wajib menampilkannya ke user,
 * jangan diam-diam menganggap berhasil.
 */
export async function removeGalleryPaths(
  supabase: StorageLike,
  paths: string[]
): Promise<{ error: string | null }> {
  const valid = paths.filter((p) => !!p);
  if (valid.length === 0) return { error: null };
  try {
    const { error } = await supabase.storage.from(GALLERY_BUCKET).remove(valid);
    return { error: error ? error.message : null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Gagal menghapus file Storage" };
  }
}

/**
 * Best-effort rollback: hapus file yang sudah ter-upload saat proses
 * keseluruhan dibatalkan (agar tidak menjadi orphan). Error rollback
 * tidak di-throw — pemanggil melaporkannya bersama error utama.
 */
export async function rollbackUploadedFiles(
  supabase: StorageLike,
  bucket: string,
  paths: string[]
): Promise<{ error: string | null }> {
  const valid = paths.filter((p) => !!p);
  if (valid.length === 0) return { error: null };
  try {
    const { error } = await supabase.storage.from(bucket).remove(valid);
    return { error: error ? error.message : null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Rollback Storage gagal" };
  }
}

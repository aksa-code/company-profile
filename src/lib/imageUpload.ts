// src/lib/imageUpload.ts
// Kompresi gambar client-side sebelum upload ke Supabase Storage.
// Tujuan: hemat Egress/Bandwidth + hemat kuota Storage 1GB, tampilan tetap tajam.
// - Output dipaksa WebP (fileType: 'image/webp', ekstensi .webp)
// - Target < ~300KB per file (maxSizeMB: 0.3)
// - Max sisi panjang 1600px (denah/rumah tetap tajam, namun kecil)
// - Upload memakai cacheControl lama agar browser/CDN caching menekan egress berulang.

import imageCompression from "browser-image-compression";

/** Batas input mentah (foto HP 10-15MB masih boleh, nanti dikompres). */
export const MAX_INPUT_MB = 15;

/** Batas akhir setelah kompresi (guardrail; target aktual ~0.3MB via maxSizeMB). */
export const MAX_OUTPUT_MB = 1;

/** Target ukuran hasil kompresi (library: best-effort di bawah nilai ini). */
export const WEBP_MAX_SIZE_MB = 0.3;

/** Dimensi maksimal sisi panjang — 1600px cukup tajam untuk denah di web. */
export const WEBP_MAX_WIDTH_OR_HEIGHT = 1600;

/** Header caching Supabase Storage (detik, string). 31536000 = 1 tahun. */
export const STORAGE_CACHE_CONTROL = "31536000";

/** Content-Type yang selalu dipakai untuk hasil kompresi. */
export const STORAGE_CONTENT_TYPE = "image/webp";

/** Di bawah ukuran ini file WebP dianggap sudah cukup kecil, tidak dikompres ulang. */
const SKIP_BELOW_BYTES = 300 * 1024;

function toWebpName(originalName: string): string {
  const base = originalName.replace(/\.[^.]+$/, "").trim() || "image";
  const safe = base
    .toLowerCase()
    .replace(/[^\w\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || "image";
  return `${safe}.webp`;
}

/**
 * Kompres + konversi gambar ke WebP untuk upload.
 * - Input: JPEG/PNG/GIF/BMP/WebP (harus image/*)
 * - Output: File .webp (image/webp), max 1600px, target <300KB
 */
export async function compressForUpload(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) {
    throw new Error("File harus berformat gambar (JPG/PNG/WebP).");
  }

  if (file.size > MAX_INPUT_MB * 1024 * 1024) {
    throw new Error(
      `Ukuran file ${(file.size / 1048576).toFixed(1)}MB melebihi batas ${MAX_INPUT_MB}MB. Kecilkan / crop dulu sebelum upload.`
    );
  }

  // File WebP kecil sudah optimal — lewati tanpa kompresi ulang agar tidak turun kualitas.
  if (file.type === "image/webp" && file.size <= SKIP_BELOW_BYTES) return file;

  let compressed: File;
  try {
    compressed = await imageCompression(file, {
      maxWidthOrHeight: WEBP_MAX_WIDTH_OR_HEIGHT,
      maxSizeMB: WEBP_MAX_SIZE_MB,
      initialQuality: 0.8,
      useWebWorker: true,
      fileType: "image/webp",
    });
  } catch {
    // Fallback: sebagian browser gagal konversi WebP untuk format tertentu —
    // coba kompresi tanpa konversi paksa, lalu tetap beri nama .webp hanya jika hasilnya webp.
    compressed = await imageCompression(file, {
      maxWidthOrHeight: WEBP_MAX_WIDTH_OR_HEIGHT,
      maxSizeMB: WEBP_MAX_SIZE_MB,
      initialQuality: 0.8,
      useWebWorker: true,
    });
  }

  if (compressed.size > MAX_OUTPUT_MB * 1024 * 1024) {
    throw new Error(
      `Hasil kompresi masih ${(compressed.size / 1048576).toFixed(1)}MB (batas ${MAX_OUTPUT_MB}MB). Coba foto dengan resolusi lebih kecil.`
    );
  }

  const type = compressed.type === "image/webp" ? "image/webp" : compressed.type;
  const name =
    type === "image/webp"
      ? toWebpName(file.name)
      : file.name;
  return new File([compressed], name, { type });
}

/** Interface struktural minimal agar helper bisa dipakai client Supabase mana pun. */
interface UploadBucket {
  upload(
    path: string,
    file: File,
    options?: { contentType?: string; cacheControl?: string; upsert?: boolean }
  ): Promise<{ data: unknown; error: { message: string } | null }>;
  getPublicUrl(path: string): { data: { publicUrl: string } };
}

export interface StorageClientLike {
  storage: { from(bucket: string): UploadBucket };
}

/**
 * Upload satu file gambar (yang sudah dikompres ke WebP) ke Supabase Storage
 * dengan header hemat-egress yang konsisten:
 * - contentType: 'image/webp'
 * - cacheControl: '31536000' (browser/CDN cache 1 tahun)
 * - upsert: false (hindari timpa tak sengaja; path selalu unik via timestamp)
 *
 * Mengembalikan { path, publicUrl }.
 */
export async function uploadImageFile(
  supabase: StorageClientLike,
  bucket: string,
  file: File,
  prefix = ""
): Promise<{ path: string; publicUrl: string }> {
  const baseName = file.type === "image/webp" ? file.name : toWebpName(file.name);
  const stem = baseName.replace(/\.webp$/i, "") || "image";
  const path = prefix
    ? `${prefix}_${Date.now()}.webp`
    : `${stem}_${Date.now()}.webp`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: STORAGE_CONTENT_TYPE,
    cacheControl: STORAGE_CACHE_CONTROL,
    upsert: false,
  });
  if (error) throw new Error(`Gagal upload gambar: ${error.message}`);

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

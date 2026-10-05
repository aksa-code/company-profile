// src/lib/imageUpload.ts
// Kompresi gambar di browser sebelum upload ke Supabase Storage.
// Target: hemat kuota free 1GB tapi tampilan tetap tajam di website.
// - Max sisi panjang 1920px (cukup untuk layar full-HD / retina mobile)
// - Target < ~0.9MB per file (JPEG quality 0.82)
// - File kecil (<=900KB) dilewati tanpa kompresi agar tidak turun kualitas

import imageCompression from "browser-image-compression";

/** Batas input mentah (foto HP 10-15MB masih boleh, nanti dikompres). */
export const MAX_INPUT_MB = 15;

/** Batas akhir setelah kompresi. */
export const MAX_OUTPUT_MB = 2;

/** Di bawah ukuran ini file dianggap sudah cukup kecil, tidak dikompres ulang. */
const SKIP_BELOW_BYTES = 900 * 1024;

export async function compressForUpload(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) {
    throw new Error("File harus berformat gambar (JPG/PNG/WebP).");
  }

  if (file.size > MAX_INPUT_MB * 1024 * 1024) {
    throw new Error(
      `Ukuran file ${(file.size / 1048576).toFixed(1)}MB melebihi batas ${MAX_INPUT_MB}MB. Kecilkan / crop dulu sebelum upload.`
    );
  }

  if (file.size <= SKIP_BELOW_BYTES) return file;

  const compressed = await imageCompression(file, {
    maxWidthOrHeight: 1920,
    maxSizeMB: 0.9,
    initialQuality: 0.82,
    useWebWorker: true,
    fileType: "image/jpeg",
  });

  if (compressed.size > MAX_OUTPUT_MB * 1024 * 1024) {
    throw new Error(
      `Hasil kompresi masih ${(compressed.size / 1048576).toFixed(1)}MB (batas ${MAX_OUTPUT_MB}MB). Coba foto dengan resolusi lebih kecil.`
    );
  }

  const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
  return new File([compressed], `${baseName}.jpg`, { type: "image/jpeg" });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

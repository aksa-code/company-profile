// src/lib/newsService.ts (atau sesuaikan jalur foldernya)
import { supabase } from '../lib/supabase';

export interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  image?: string;
  excerpt: string;
  content: string[];
}

// Fungsi helper untuk membuat slug otomatis dari judul
export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")     // Ganti spasi dengan tanda hubung (-)
    .replace(/[^\w\-]+/g, "") // Hapus karakter spesial
    .replace(/\-\-+/g, "-");  // Ganti tanda hubung ganda dengan satu
}

export async function fetchNews() {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchNewsById(id: string) {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// Tambah Berita Baru dengan ID otomatis berupa slug dari title
export async function createNews(item: Omit<NewsItem, "id"> & { id?: string }): Promise<void> {
  const generatedId = item.id ? generateSlug(item.id) : generateSlug(item.title);

  const { error } = await supabase
    .from('news')
    .insert([
      {
        id: generatedId,
        title: item.title,
        category: item.category,
        date: item.date,
        image: item.image,
        excerpt: item.excerpt,
        content: item.content,
      },
    ]);

  if (error) {
    console.error("Error creating news:", error.message);
    throw new Error(error.message);
  }
}

// Update Berita (Opsional jika dibutuhkan nanti)
export async function updateNews(id: string, item: Partial<NewsItem>): Promise<void> {
  const { error } = await supabase
    .from('news')
    .update(item)
    .eq('id', id);

  if (error) {
    console.error("Error updating news:", error.message);
    throw new Error(error.message);
  }
}

// Hapus Berita
export async function deleteNews(id: string): Promise<void> {
  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting news:", error.message);
    throw new Error(error.message);
  }
}
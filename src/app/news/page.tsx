// src/app/news/page.tsx
import { fetchNews } from "../../lib/newsService";
import NewsPageClient from "./NewsPageClient";

export const revalidate = 0; // Agar data selalu baru

export default async function NewsPage() {
  let newsData = [];
  try {
    // Read Supabase via service; kolom image berisi public URL Supabase Storage
    newsData = await fetchNews();
  } catch (error) {
    console.error("Error fetching news list:", error);
  }

  return <NewsPageClient newsData={newsData || []} />;
}

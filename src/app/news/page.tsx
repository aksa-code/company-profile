// src/app/news/page.tsx
import { supabase } from "../../lib/supabase";
import NewsPageClient from "./NewsPageClient";

export const revalidate = 0; // Agar data selalu baru

export default async function NewsPage() {
  const { data: newsData, error } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching news list:", error);
  }

  return <NewsPageClient newsData={newsData || []} />;
}
// src/app/hero/News.tsx
import { supabase } from "../../lib/supabase";
import NewsClientHero from "./NewsClientHero";

export default async function News() {
  // Ambil data langsung dari Supabase
  const { data: newsData, error } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3); // Ambil 3 berita terbaru untuk bagian hero

  if (error) {
    console.error("Error fetching hero news:", error);
  }

  const items = newsData || [];

  const newsHeroHeader = {
    titleMain: "Berita &",
    titleHighlight: "Artikel Terbaru",
    viewAllText: "Lihat Semua",
    viewAllLink: "/news",
  };

  return <NewsClientHero initialNews={items} header={newsHeroHeader} />;
}
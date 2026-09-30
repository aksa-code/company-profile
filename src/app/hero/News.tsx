// src/app/hero/News.tsx
import { fetchNews } from "../../lib/newsService";
import NewsClientHero from "./NewsClientHero";

export default async function News() {
  // Ambil data via service (Supabase; image = public URL Supabase Storage)
  let items = [];
  try {
    const all = await fetchNews();
    items = all.slice(0, 3); // Ambil 3 berita terbaru untuk bagian hero
  } catch (error) {
    console.error("Error fetching hero news:", error);
  }

  const newsHeroHeader = {
    titleMain: "Berita &",
    titleHighlight: "Artikel Terbaru",
    viewAllText: "Lihat Semua",
    viewAllLink: "/news",
  };

  return <NewsClientHero initialNews={items} header={newsHeroHeader} />;
}

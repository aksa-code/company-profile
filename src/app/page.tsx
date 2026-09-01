// src/app/page.tsx
import type { Metadata } from 'next'; // 1. Import tipe Metadata
import Navbar from "../app/component/Navbar";
import Hero from "./hero/Hero";
import About from "./hero/About";
import ProjectGrid from "./hero/ProjectGrid";
import VideoSection from "./hero/VideoSection";
import News from "./hero/News";
import Career from "./hero/Career";
import Contact from "../app/component/Contact";
import Footer from "../app/component/Footer";
import { getProjects } from "../lib/projectService";
import { getCompanyInfo } from "../lib/companyService";

export const revalidate = 0; 

// 2. Tambahkan Metadata SEO di sini
export const metadata: Metadata = {
  title: 'Skyland Property - Properti & Perumahan Eksklusif Terbaik',
  description: 'Temukan hunian modern dan properti impian pilihan terbaik bersama Skyland Property. Cek daftar perumahan terbaru kami sekarang.',
  keywords: ['skyland property', 'perumahan eksklusif', 'properti pilihan', 'jual beli properti'],
  openGraph: {
    title: 'Skyland Property - Properti & Perumahan Eksklusif Terbaik',
    description: 'Temukan hunian modern dan properti impian pilihan terbaik bersama Skyland Property.',
    url: 'https://domain-bosmu.com', // Ganti dengan domain asli dari Hostinger nanti
    siteName: 'Skyland Property',
    locale: 'id_ID',
    type: 'website',
  },
};

export default async function Home() {
  const projectsData = await getProjects();
  const companyData = await getCompanyInfo();

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <Hero projects={projectsData} companyInfo={companyData} />
      <About />
      <ProjectGrid />
      <VideoSection />
      <News />
      <Career />
      <Contact /> 
      <Footer />
    </main>
  );
}
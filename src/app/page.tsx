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

// 2. Tambahkan Metadata SEO yang Dioptimalkan untuk Malang
export const metadata: Metadata = {
  title: 'Skyland Property - Perumahan Eksklusif & Properti Terbaik di Malang',
  description: 'Temukan hunian modern, perumahan eksklusif, dan properti pilihan terbaik di Malang bersama Skyland Property. Cek daftar perumahan terbaru kami sekarang.',
  keywords: [
    'skyland property', 
    'skyland malang', 
    'perumahan skyland', 
    'perumahan di malang', 
    'properti malang', 
    'perumahan mewah malang',
    'jual rumah malang'
  ],
  openGraph: {
    title: 'Skyland Property - Perumahan Eksklusif & Properti Terbaik di Malang',
    description: 'Temukan hunian modern, perumahan eksklusif, dan properti pilihan terbaik di Malang bersama Skyland Property.',
    url: 'https://domain-bosmu.com', // Ganti dengan domain asli dari Hostinger nanti
    siteName: 'Skyland Property',
    locale: 'id_ID',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
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
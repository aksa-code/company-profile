// src/app/page.tsx
import type { Metadata } from 'next'; // 1. Import tipe Metadata
import dynamic from 'next/dynamic';
import Navbar from "../app/component/Navbar";
import Hero from "./hero/Hero";
import { getProjects } from "../lib/projectService";
import { getCompanyInfo } from "../lib/companyService";

// Section bawah difold di-split dari bundle awal (next/dynamic) agar
// Total Blocking Time & First Contentful Paint turun. Hero + Navbar
// tetap eager karena above the fold / LCP.
const About = dynamic(() => import("./hero/About"));
const ProjectGrid = dynamic(() => import("./hero/ProjectGrid"));
const VideoSection = dynamic(() => import("./hero/VideoSection"));
const News = dynamic(() => import("./hero/News"));
const Career = dynamic(() => import("./hero/Career"));
const Contact = dynamic(() => import("../app/component/Contact"));
const Footer = dynamic(() => import("../app/component/Footer"));

// Cache 5 menit di server: sebelumnya revalidate=0 sehingga tiap
// kunjungan menghantam Supabase 2x beruntun (lambat + mahal).
export const revalidate = 300;

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
    url: 'https://skylandnusantara.com',
    siteName: 'Skyland Property',
    images: [
      {
        url: '/images/preview.jpg',
        width: 1200,
        height: 572,
        alt: 'Skyland Property Nusantara Banner',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skyland Property - Perumahan Eksklusif & Properti Terbaik di Malang',
    description: 'Temukan hunian modern, perumahan eksklusif, dan properti pilihan terbaik di Malang bersama Skyland Property.',
    images: ['/images/preview.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function Home() {
  // Satu query proyek dipakai bersama (Hero, ProjectGrid, Footer,
  // companyInfo) — sebelumnya ter-fetch 4x per kunjungan homepage.
  const projectsData = await getProjects();
  const companyData = await getCompanyInfo(projectsData);

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <Hero projects={projectsData} companyInfo={companyData} />
      <About />
      <ProjectGrid initialProjects={projectsData} />
      <VideoSection />
      <News />
      <Career />
      <Contact /> 
      <Footer initialProjects={projectsData} />
    </main>
  );
}

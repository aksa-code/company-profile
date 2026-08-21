// src/app/page.tsx
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
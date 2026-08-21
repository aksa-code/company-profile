// src/app/projects/page.tsx
import { getProjects } from "../../lib/projectService";
import ProjectsPageClient from "./ProjectPageClient";

export const revalidate = 0; // Memastikan data selalu segar dari database

export default async function ProjectsPage() {
  // Mengambil data proyek langsung dari Supabase
  const projectsData = await getProjects();

  return <ProjectsPageClient projectsData={projectsData} />;
}
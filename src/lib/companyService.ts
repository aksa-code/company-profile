// src/lib/companyService.ts
import { getProjects, type Project } from "./projectService";
import { companyInfo } from "./companyData";

// Kompatibilitas mundur: data statis kini tinggal di ./companyData yang
// bebas Supabase. Client Components disarankan impor langsung dari sana
// agar supabase-js tidak masuk bundle awal.
export { companyInfo } from "./companyData";

export async function getCompanyInfo(projects?: Project[]) {
  // Homepage sudah mengambil daftar proyek sekali — pakai ulang agar
  // tidak ada query Supabase ganda per request.
  const list = projects ?? await getProjects();

  return {
    ...companyInfo,
    hero: {
      ...companyInfo.hero,
      stats: [
        {
          value: `${list.length}+`,
          label: "Active Projects"
        },
        ...companyInfo.hero.stats.slice(1),
      ],
    },
  };
}

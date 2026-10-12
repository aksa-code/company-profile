// src/lib/companyData.ts
// Data statis perusahaan — SENGAJA tanpa dependensi (tanpa Supabase)
// agar aman diimpor langsung oleh Client Components above-the-fold
// (Navbar, dsb) tanpa menyeret supabase-js ke bundle awal.

export const MARKETING_HOTLINE = "6282145200700";

// Nomor WhatsApp HRD
export const hrdNumber = "6282111235001";

export const companyInfo = {
  name: "Skyland",
  fullName: "Skyland Property Nusantara",
  companyName: "PT Griya Mapan Alami",
  description: "PT Griya Mapan Alami — Premium residential developer in Malang, East Java since 2018. Building homes, building futures.",
  address: "Jl. Doktor Sutomo No.26 Kav A4, Klojen, Malang City, East Java 65111",
  mapsUrl: "https://maps.app.goo.gl/nWdwiuLsdVFazzXw9?g_st=ic",
  youtubeVideoId: "nI556MObdSE",
  slogan: "Grow Smarter and Faster",

  contact: {
    heading: "Hubungi Kantor Kami",
    description: "Jangan ragu untuk menghubungi kami melalui saluran berikut untuk informasi lebih lanjut.",
    addressTitle: "Kantor Pemasaran",
    phoneTitle: "Marketing Hotline",
    phone: MARKETING_HOTLINE,
    hrdPhoneTitle: "Recruitment Contact",
    hrdPhone: hrdNumber,
    emailTitle: "Email Resmi Perusahaan",
    email: "griyamapanalami@gmail.com",
  },

  hero: {
    titlePrefix: "BUILD YOUR ",
    titleHighlight: "DREAM HOME",
    titleSuffix: " WITH US",
    description: "Miliki rumah hunian impian dan investasi properti dengan kualitas terbaik di kelasnya. Bersama Skyland Nusantara, wujudkan impian Anda dan keluarga sekarang juga!",
    stats: [
      { value: "10+", label: "Active Projects" },
      { value: "500+", label: "Families Served" },
      { value: "2018", label: "Est. Malang" },
    ],
  },
  values: [
    {
      title: "Reliable & Honest",
      description: "Berkomitmen terhadap good corporate morality serta dapat diandalkan."
    },
    {
      title: "Modern & Competent",
      description: "Menyediakan hunian landed dengan fasilitas modern dan terbaik."
    },
    {
      title: "Best Quality, Services & Price",
      description: "Memberikan kualitas, pelayanan, dan harga terbaik untuk masyarakat."
    }
  ]
};

// Data Hero untuk Section Career
export const careerHeroData = {
  titleMain: "Bangun Masa Depan Bersama",
  titleHighlight: "Skyland Property",
  description: "Bergabunglah dengan tim profesional PT Griya Mapan Alami. Kami menawarkan skema gaji kompetitif, insentif menarik, serta peluang jenjang karier cepat di industri properti.",
  benefits: [
    "Gaji Kompetitif & Insentif Menarik",
    "Peluang Jenjang Karier Cepat",
    "Pelatihan Digital & Sales Marketing",
    "Lingkungan Kerja yang Kolaboratif",
    "Dukungan Event & Pameran Rutin",
    "Bonus & Reward Pencapaian Target"
  ],
  viewAllText: "Lihat Lowongan & Detail Posisi",
  viewAllLink: "/career",
  footerText: "Jadilah bagian dari kesuksesan ekspansi properti eksklusif kami."
};

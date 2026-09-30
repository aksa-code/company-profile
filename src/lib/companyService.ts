// src/lib/companyService.ts
import { getProjects } from "./projectService";
import { hrdNumber } from "./careerService";

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
    phone: "6282145200700",
    hrdPhoneTitle: "Recruitment Contact",
    hrdPhone: hrdNumber || "089876543210",
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
  leadership: [
    {
      name: "Bambang Agustiono",
      role: "Director",
      quote: "A great leader are not those who can do anything by themselves, but those who can lead them to the glory"
    },
    {
      name: "Nadia Aprellya",
      role: "Commissary",
      quote: "Do not hesitate on what you do. Do your best and you will see what's the right path for you"
    }
  ],
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

export async function getCompanyInfo() {
  const projects = await getProjects();
  
  return {
    ...companyInfo,
    hero: {
      ...companyInfo.hero,
      stats: [
        { 
          value: `${projects.length}+`, 
          label: "Active Projects" 
        },
        ...companyInfo.hero.stats.slice(1),
      ],
    },
  };
}
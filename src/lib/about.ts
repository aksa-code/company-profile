// src/app/data/about.ts

export interface BusinessConcept {
  title: string;
  description: string;
}

export interface AboutCard {
  title: string;
  description: string;
  iconType: string;
}

export interface VisionPoint {
  title: string;
  points: string[];
}

export interface MissionData {
  title: string;
  text: string;
}

export interface CoreValue {
  title: string;
  description: string;
  iconType: string;
}

export const businessConcept: BusinessConcept[] = [
  {
    title: "SMART",
    description: "Bekerja dengan cermat untuk terus memberikan inovasi terbaik & terkini demi hasil yang maksimal."
  },
  {
    title: "FAST",
    description: "Kecepatan dan ketepatan kerja tim untuk selalu berperan aktif dalam membangun hunian yang nyaman dan aman."
  },
  {
    title: "BEST",
    description: "Berpegang teguh pada komitmen untuk memberikan produk dan fasilitas layanan terbaik untuk Anda dan keluarga."
  }
];

export const aboutData = {
  // Data untuk Section About di Beranda (Landing Page / Hero view)
  homeSection: {
    image: "/images/about/Office 1.png",
    experienceBadge: {
      years: "7+",
      label: "Tahun Pengalaman",
    },
    titlePrefix: "Membangun Rumah,",
    titleHighlight: "Membangun Masa Depan",
    paragraphs: [
      "PT. Griya Mapan Alami Group merupakan perusahaan property yang didirikan pada tanggal 22 November 2018 di kota Malang & telah memperoleh pengesahan Menteri Kehakiman serta SIUP. Kami telah berhasil mendirikan beberapa project residential antara lain adalah Pakis Hasanah, Skyland Sekarpuro, Skyland Pandanlandung, Skyland Arjuna, Skyland Savana dan Skybriza Pakis. Dengan semangat dan komitmen yang tinggi PT. Griya Mapan Alami akan terus berkembang dan berinovasi untuk menciptakan hunian terbaik untuk masyarakat.",
      "Di bawah brand Skyland, kami mengembangkan kawasan hunian modern yang strategis, berkualitas, dan terjangkau. Bermitra dengan BTN Syariah untuk kemudahan pembiayaan KPR.",
    ],
    cards: [
      {
        title: "Visi",
        description: "Developer terpercaya hunian berkualitas.",
        iconType: "vision",
      },
      {
        title: "Misi",
        description: "Hunian modern, strategis & terjangkau.",
        iconType: "mission",
      },
      {
        title: "Komitmen",
        description: "Konstruksi standar tinggi & kepuasan.",
        iconType: "commitment",
      },
    ] as AboutCard[],
    linkText: "Lihat Selengkapnya",
    linkUrl: "/about",
  },

  // Data untuk Halaman Lengkap (/about)
  page: {
    banner: {
      breadcrumb: "Tentang Kami",
      titlePrefix: "Mengenal Lebih Dekat",
      titleHighlight: "Skyland",
      description: "Pengembang properti terpercaya yang berkomitmen menghadirkan hunian berkualitas tinggi dan bernilai investasi terbaik di Malang, Jawa Timur.",
      image: "/images/Banner.png",
    },
    visionMissionSection: {
      title: "Membangun Hunian Modern dengan Standar Kualitas Tertinggi",
      description: "Sejak berdiri pada tanggal 22 November 2018, PT Griya Mapan Alami terus berinovasi dalam menyediakan kawasan perumahan yang asri, strategis, dan memiliki legalitas hukum yang terjamin (SHM) bagi keluarga Indonesia.",
      image: "/images/about/office.png",
      vision: {
        title: "Visi",
        points: [
          "Memberikan kontribusi yang berkualitas serta menghormati seluruh rekan kerja & stakeholders.",
          "Menjadi aset berharga & bernilai sebagai estate management yang baik serta memberi dampak positif untuk sekitar.",
          "Menyediakan hunian landed dengan fasilitas modern dan terbaik.",
          "Berkomitmen terhadap good corporate morality."
        ],
      } as VisionPoint,
      mission: {
        title: "Misi",
        text: "Menciptakan sebuah hunian dengan lingkungan terbaik dan menciptakan pengalaman baru untuk meningkatkan kualitas hidup yang nyaman untuk Anda dan keluarga.",
      } as MissionData,
    },
    coreValuesHeader: {
      title: "Prinsip yang Kami Pegang Teguh",
      subtitle: "Komitmen integritas dan profesionalisme di setiap lini kerja untuk memberikan yang terbaik bagi konsumen.",
    },
    values: [
      {
        title: "Legalitas Terjamin",
        description: "Setiap unit properti yang kami kembangkan memiliki sertifikat (SHM) yang sah dan aman secara hukum.",
        iconType: "legal",
      },
      {
        title: "Kualitas Prima",
        description: "Menggunakan material bangunan pilihan dengan pengawasan ketat oleh tenaga ahli teknik sipil berpengalaman.",
        iconType: "quality",
      },
      {
        title: "Kepercayaan Klien",
        description: "Pelayanan transparan dan purna jual yang responsif demi kepuasan jangka panjang para penghuni.",
        iconType: "trust",
      },
    ] as CoreValue[],
  },
};
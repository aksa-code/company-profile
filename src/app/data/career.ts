// export interface CareerItem {
//   id: string;
//   title: string;
//   department: string;
//   location: string;
//   type: string;
//   postedDate: string; // Format: YYYY-MM-DD
//   isClosed?: boolean; // Status lowongan
//   description: string;
//   requirements: string[];
//   responsibilities: string[];
//   glintsUrl?: string;
// }

// // Nomor WhatsApp HRD Khusus Karier
// export const hrdNumber = "6282111235001";

// // Helper function untuk menghitung selisih hari dari hari ini (2026-08-07)
// export const getRelativeDate = (dateString: string) => {
//   const today = new Date("2026-08-07");
//   const postDate = new Date(dateString);
//   const diffTime = today.getTime() - postDate.getTime();
//   const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
//   if (diffDays <= 0) return "Hari ini";
//   if (diffDays === 1) return "1 hari lalu";
//   return `${diffDays} hari lalu`;
// };

// // Konfigurasi Header untuk Halaman Utama Karier (/career)
// export const careerPageHeader = {
//   breadcrumb: "Karier",
//   titlePrefix: "Karier di",
//   titleHighlight: "Skyland",
//   titleSuffix: "Property",
//   description: "Kembangkan potensi terbaik Anda dan berkontribusi membangun masa depan industri properti bersama tim profesional kami di Malang.",
//   bannerImage: "/images/Banner.png",
//   departments: ["Semua", "Sales & Marketing", "Engineering & Project", "Management", "Data & Technology"],
// };

// // Konfigurasi untuk Section Hero Karier di Beranda
// export const careerHeroData = {
//   titleMain: "Bergabung dengan",
//   titleHighlight: "Tim Kami",
//   description: "Jadilah bagian dari tim yang membangun hunian impian ribuan keluarga Indonesia. PT Griya Mapan Alami membuka peluang karir bagi talenta-talenta terbaik yang bersemangat dan berintegritas.",
//   benefits: [
//     "Lingkungan kerja profesional & kolaboratif",
//     "Training & pengembangan karir",
//     "Benefit kompetitif & asuransi",
//     "Kesempatan tumbuh bersama",
//   ],
//   stats: [
//     { value: "50+", label: "Tim Profesional" },
//     { value: "7+", label: "Tahun Berdiri" },
//     { value: "4", label: "Proyek Aktif" },
//     { value: "500+", label: "Keluarga Puas" },
//   ],
//   footerText: "Bergabung dan jadilah bagian dari kisah sukses Skyland Property Nusantara",
//   viewAllText: "View Open Positions",
//   viewAllLink: "/career",
// };

// // Data Daftar Lowongan Pekerjaan
// export const careerData: CareerItem[] = [
//   {
//     id: "sales-marketing-developer-property",
//     title: "Sales Marketing Developer Property",
//     department: "Sales & Marketing",
//     location: "Malang, Jawa Timur (On-site)",
//     type: "Contract",
//     postedDate: "2026-08-04",
//     isClosed: false,
//     description: "Sales Marketing bertanggung jawab dalam melakukan aktivitas pemasaran dan penjualan produk properti PT Griya Mapan Alami, mulai dari mencari prospek secara online dan offline, membangun hubungan dengan calon konsumen, melakukan presentasi produk, mendampingi proses pembelian, hingga memastikan tercapainya target penjualan yang telah ditetapkan perusahaan.",
//     requirements: [
//       "Pria/Wanita usia maksimal 40 tahun",
//       "Pendidikan minimal SMA/SMK",
//       "Minimal memiliki kendaraan motor dengan SIM C",
//       "Berorientasi pada target dan memiliki semangat tinggi dalam dunia penjualan",
//       "Memiliki kemampuan komunikasi, presentasi, negosiasi, dan membangun relasi yang baik",
//       "Percaya diri, disiplin, jujur, bertanggung jawab, serta memiliki integritas tinggi",
//       "Mampu bekerja secara individu maupun dalam tim",
//       "Kreatif dalam mencari peluang penjualan dan memanfaatkan media digital sebagai sarana pemasaran",
//       "Bersedia bekerja secara mobile dan ditempatkan di seluruh proyek perusahaan",
//       "Aktif menggunakan media sosial sebagai sarana pemasaran dan personal branding (diutamakan)"
//     ],
//     responsibilities: [
//       "Melakukan pemasaran dan penjualan unit rumah sesuai dengan target perusahaan",
//       "Mencari dan mengembangkan prospek (leads) melalui berbagai media dan jaringan yang dimiliki",
//       "Melakukan follow up kepada calon konsumen hingga proses transaksi selesai",
//       "Melakukan presentasi produk serta memberikan penjelasan mengenai spesifikasi, fasilitas, legalitas, skema pembayaran, dan promo yang berlaku",
//       "Mendampingi calon konsumen pada saat survey lokasi proyek hingga proses pembelian",
//       "Membangun serta menjaga hubungan baik dengan calon konsumen maupun pelanggan",
//       "Memastikan seluruh data dan aktivitas penjualan terdokumentasi dengan baik dalam laporan harian, mingguan, dan bulanan",
//       "Mengikuti kegiatan promosi perusahaan, seperti pameran, open house, gathering, maupun event pemasaran lainnya",
//       "Menyusun rencana kerja dan strategi penjualan untuk mencapai target yang telah ditetapkan"
//     ],
//     glintsUrl: "https://glints.com/jobs/3b5db383-598f-433c-ad02-a9b49fd4d733?utm_medium=share&utm_campaign=employers"
//   },
//   {
//     id: "manajer-teknik-developer-property",
//     title: "Manajer Teknik Developer Property",
//     department: "Engineering & Project",
//     location: "Malang, Jawa Timur (On-site)",
//     type: "Full-Time",
//     postedDate: "2026-08-04",
//     isClosed: false,
//     description: "Mengelola dan mengendalikan seluruh aktivitas teknik dan konstruksi seluruh proyek untuk memastikan pembangunan berjalan sesuai target waktu, biaya, dan standar kualitas yang ditetapkan.",
//     requirements: [
//       "Pendidikan minimal S1 Teknik Sipil / Arsitektur",
//       "Pengalaman minimal 5 tahun atau lebih di proyek properti (perumahan/developer)",
//       "Memiliki pengalaman sebagai Site Manager / Project Manager",
//       "Terbiasa menangani banyak unit / multi proyek secara paralel",
//       "Memahami alur pembangunan dari awal hingga serah terima unit",
//       "Menguasai penyusunan & kontrol RAB, time schedule, dan progress proyek",
//       "Mampu membaca dan mengevaluasi gambar kerja (arsitektur & struktur)",
//       "Memiliki kemampuan leadership dalam mengelola tim lapangan & subkontraktor",
//       "Tegas, disiplin, dan terbiasa bekerja dengan target waktu",
//       "Memiliki kemampuan problem solving yang cepat dan tepat di lapangan",
//       "Bersedia mobile / monitoring proyek secara rutin"
//     ],
//     responsibilities: [
//       "Mengelola dan mengawasi seluruh aktivitas teknis proyek di lapangan",
//       "Memastikan pekerjaan berjalan sesuai gambar kerja, spesifikasi, dan standar kualitas",
//       "Mengontrol progres proyek agar sesuai dengan timeline yang ditetapkan",
//       "Mengelola dan mengarahkan tim pengawas/pelaksana di masing-masing proyek",
//       "Melakukan evaluasi terhadap kinerja subkontraktor dan tenaga kerja",
//       "Mengidentifikasi dan menyelesaikan kendala teknis secara cepat dan efektif",
//       "Mengontrol penggunaan material agar sesuai dengan RAB",
//       "Berkoordinasi dengan tim arsitek/perencanaan terkait revisi desain",
//       "Menyusun laporan progress proyek secara berkala kepada manajemen",
//       "Memastikan penerapan standar K3 di seluruh area proyek",
//       "Mengawal proses finishing hingga serah terima unit ke konsumen"
//     ],
//     glintsUrl: "https://glints.com/jobs/55d5ce69-443a-41de-a02c-240e90468ddc?utm_medium=share&utm_campaign=employers"
//   },
//   {
//     id: "general-manager-developer-property",
//     title: "General Manager Developer Property",
//     department: "Management",
//     location: "Malang, Jawa Timur (On-site)",
//     type: "Full-Time",
//     postedDate: "2026-07-25",
//     isClosed: false,
//     description: "General Manager Developer Property bertanggung jawab memimpin, mengoordinasikan, dan mengendalikan aktivitas operasional perusahaan agar berjalan efektif, efisien, dan selaras dengan strategi bisnis yang telah ditetapkan Direksi. General Manager berperan sebagai penghubung antar divisi dalam memastikan pencapaian target perusahaan, meningkatkan produktivitas organisasi, serta mendukung pertumbuhan bisnis secara berkelanjutan.",
//     requirements: [
//       "Minimal S1 Manajemen, Teknik Industri, Ekonomi, Bisnis, atau bidang terkait",
//       "Minimal 5-10 tahun pada posisi manajerial senior atau General Manager",
//       "Berpengalaman di perusahaan developer properti, konstruksi, atau real estate (diutamakan)",
//       "Memiliki pengalaman mengelola berbagai fungsi bisnis secara bersamaan",
//       "Memiliki soft skill Strategic Planning, Business Management, Project Management, Budgeting & Cost Control, SOP Development",
//       "Memahami penggunaan dashboard bisnis dan laporan manajemen"
//     ],
//     responsibilities: [
//       "Menerjemahkan visi, misi, dan strategi perusahaan ke dalam rencana kerja operasional yang dapat dijalankan oleh seluruh divisi",
//       "Memastikan aktivitas operasional berjalan sesuai target perusahaan",
//       "Menjadi penghubung antara Direksi dengan seluruh kepala divisi",
//       "Memberikan rekomendasi strategis kepada Direksi berdasarkan hasil evaluasi operasional dan kinerja perusahaan",
//       "Memastikan setiap divisi bekerja sesuai SOP, kebijakan, dan target perusahaan",
//       "Mengidentifikasi hambatan operasional serta mengambil langkah penyelesaian secara cepat dan tepat",
//       "Mengoptimalkan efektivitas proses bisnis di seluruh unit kerja",
//       "Mengevaluasi pencapaian target perusahaan secara berkala",
//       "Mengawasi koordinasi lintas divisi dalam proses penjualan hingga serah terima unit kepada pelanggan",
//       "Memastikan penggunaan sumber daya perusahaan berjalan efektif dan efisien",
//       "Mengawasi pelaksanaan anggaran operasional sesuai rencana perusahaan",
//       "Mengidentifikasi potensi risiko operasional dan menyusun langkah mitigasinya"
//     ],
//     glintsUrl: "https://glints.com/jobs/fdbaf679-4ed9-4c95-902c-018917840be0?utm_medium=share&utm_campaign=employers"
//   },
//   {
//     id: "data-analyst-developer-property",
//     title: "Data Analyst Developer Property",
//     department: "Data & Technology",
//     location: "Malang, Jawa Timur (On-site)",
//     type: "Full-Time",
//     postedDate: "2026-07-25",
//     isClosed: false,
//     description: "Data Analyst Developer Property bertanggung jawab dalam mengintegrasikan, mengolah, dan menyajikan data dari seluruh divisi menjadi informasi yang ringkas, akurat, dan mudah dipahami oleh manajemen sebagai dasar pengambilan keputusan strategis. Posisi ini berperan memastikan data perusahaan tersaji dalam bentuk dashboard, laporan, dan analisis yang efektif sehingga Direksi dapat memonitor performa bisnis secara cepat dan tepat.",
//     requirements: [
//       "Minimal S1 Statistika, Sistem Informasi, Informatika, Matematika, Teknik Industri, Data Science, atau jurusan terkait",
//       "Minimal 1-3 tahun sebagai Data Analyst, Business Analyst, MIS Analyst, atau posisi serupa",
//       "Berpengalaman membuat dashboard manajemen menjadi nilai tambah",
//       "Pengalaman di perusahaan developer atau konstruksi lebih disukai",
//       "Mahir Microsoft Excel tingkat lanjut (Pivot Table, Power Query, XLOOKUP, Power Pivot)",
//       "Menguasai SQL menjadi nilai tambah",
//       "Memiliki kemampuan membuat dashboard eksekutif",
//       "Memahami data visualization and storytelling",
//       "Komunikasi yang baik",
//       "Mampu menjelaskan data kepada orang non-teknis",
//       "Teliti dan mampu bekerja dengan target"
//     ],
//     responsibilities: [
//       "Mengumpulkan data dari seluruh divisi perusahaan",
//       "Mengintegrasikan data dari berbagai sumber menjadi database yang terstruktur",
//       "Melakukan validasi, pembersihan data, dan standarisasi data untuk memastikan akurasi informasi",
//       "Menjaga konsistensi dan keamanan data perusahaan",
//       "Menyusun dan monitoring dashboard interaktif yang menampilkan indikator utama untuk kebutuhan perusahaan",
//       "Mengubah data yang kompleks menjadi laporan visual yang mudah dipahami oleh Direksi dan Manajemen",
//       "Menyusun laporan harian, mingguan, dan bulanan dalam format yang ringkas dan informatif",
//       "Mengembangkan sistem pelaporan yang lebih otomatis untuk mengurangi pekerjaan manual",
//       "Menganalisis tren penjualan, progres proyek, kondisi keuangan, dan operasional perusahaan",
//       "Mengidentifikasi peluang peningkatan kinerja dan efisiensi berdasarkan hasil analisis data",
//       "Memberikan insight dan rekomendasi yang dapat digunakan sebagai dasar pengambilan keputusan",
//       "Berkoordinasi dengan seluruh divisi dalam penyediaan data yang akurat dan tepat waktu",
//       "Memberikan masukan terkait format pelaporan agar lebih efektif dan mudah dipahami",
//       "Mendukung Direksi dan Manajemen dalam penyediaan data untuk kebutuhan rapat maupun evaluasi bisnis"
//     ],
//     glintsUrl: "https://glints.com/jobs/71741ab0-7352-417f-b75a-ffacd5f397b7?utm_medium=share&utm_campaign=employers"
//   }
// ];
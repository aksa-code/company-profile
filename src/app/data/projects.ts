// export interface UnitType {
//   id: string;
//   name: string;
//   category: string;
//   buildingType: string;
//   specs: string;
//   bedrooms: number;
//   bathrooms: number;
//   priceStarting: string;
//   image: string;
//   isSoldOut?: boolean;
// }

// export interface ProjectSpecs {
//   beds: string;
//   cluster: string;
//   security: string;
// }

// export interface Project {
//   id: string;
//   title: string;
//   category: string;
//   statusBadge: string;
//   subBadge?: string;    
//   totalUnits?: string; 
//   imageCover: string;   
//   bannerImage: string; 
//   location: string;
//   description: string;
//   features: string[];   
//   bankKPR: string;     
//   mapsUrl?: string;    
//   specsSummary: ProjectSpecs; 
//   unitTypes: UnitType[];      
//   facilities: string[];       
// }

// export const projectsData: Project[] = [
//   // {
//   //   id: "pakis-hasanah",
//   //   title: "Pakis Hasanah",
//   //   category: "Pakis",
//   //   statusBadge: "Sold",
//   //   subBadge: "Smart Living",
//   //   totalUnits: "100 Unit",
//   //   imageCover: "/images/projects/pakis-hasanah-cover.jpg",
//   //   bannerImage: "/images/Banner.png",
//   //   location: "Sumber Kradenan, Pakis, Malang",
//   //   description: "Design modern minimalist dengan kualitas bangunan teruji dua level atap serta dikelola oleh estate management.",
//   //   features: ["Estate Management", "Dua Level Atap", "Design Modern Minimalist"],
//   //   bankKPR: "BTN, Mandiri, BRI, BSI",
//   //   mapsUrl: "https://maps.app.goo.gl/L1juSFUuUhrTuETm6",
//   //   specsSummary: {
//   //     beds: "2 Kamar Tidur",
//   //     cluster: "Modern Minimalist",
//   //     security: "Estate Management"
//   //   },
//   //   unitTypes: [
//   //     {
//   //       id: "type-30-60",
//   //       name: "Type 30/60",
//   //       category: "Komersil",
//   //       buildingType: "1 Lantai",
//   //       specs: "Luas Bangunan 30m² / Luas Tanah 60m²",
//   //       bedrooms: 2,
//   //       bathrooms: 1,
//   //       priceStarting: "200 Jutaan",
//   //       image: "/images/units/unit-pakis.jpg",
//   //       isSoldOut: true
//   //     }
//   //   ],
//   //   facilities: ["10 Menit ke Bandara Abdurrahman Saleh", "5 Menit ke Gerbang Tol Pakis", "Estate Management"]
//   // },
//   {
//     id: "skyland-sekarpuro",
//     title: "Skyland Sekarpuro",
//     category: "Sekarpuro",
//     statusBadge: "Available",
//     subBadge: "Modern Nordic Scandinavian",
//     totalUnits: "150 Unit",
//     imageCover: "/images/project cover/Cover Sekarpuro.png",
//     bannerImage: "/images/Banner.png",
//     location: "Kec. Pakis - Malang",
//     description: "Merupakan perumahan pertama yang terletak di dekat exit tol Malang. Memiliki hunian dua tingkat dengan berbagai tipe dengan gaya modern Nordic Scandinavian. Skyland mampu meningkatkan pengalaman hidup Anda & keluarga untuk memiliki rumah impian.",
//     features: ["Dekat Exit Tol Malang", "Rooftop", "Modern Nordic Scandinavian"],
//     bankKPR: "BTN, Mandiri, BRI, BSI",
//     mapsUrl: "https://maps.app.goo.gl/WzegUktQtSabrFQP8",
//     specsSummary: {
//       beds: "2 Kamar Tidur",
//       cluster: "Modern Nordic Scandinavian",
//       security: "24 Jam + CCTV"
//     },
//     unitTypes: [
//       {
//         id: "type-36-60",
//         name: "Sky Light",
//         category: "Komersil",
//         buildingType: "2 Lantai",
//         specs: "Luas Bangunan 36m² / Luas Tanah 60m² (2 Lantai)",
//         bedrooms: 2,
//         bathrooms: 1,
//         priceStarting: "400 Jutaan",
//         image: "/images/tipe/Sekarpuro/Sky Light.png",
//         isSoldOut: false
//       },
//       {
//         id: "type-45-60",
//         name: "Sky Brown",
//         category: "Komersil",
//         buildingType: "2 Lantai",
//         specs: "Luas Bangunan 45m² / Luas Tanah 60m² (2 Lantai dengan Balkon)",
//         bedrooms: 2,
//         bathrooms: 1,
//         priceStarting: "500 Jutaan",
//         image: "/images/tipe/Sekarpuro/Sky Brown.png",
//         isSoldOut: false
//       },
//       {
//         id: "type-60-72",
//         name: "Sky Dance",
//         category: "Komersil",
//         buildingType: "2 Lantai",
//         specs: "Luas Bangunan 60m² / Luas Tanah 72m² (2 Lantai dengan Rooftop)",
//         bedrooms: 2,
//         bathrooms: 2,
//         priceStarting: "600 Jutaan",
//         image: "/images/tipe/Sekarpuro/Sky Dance.png",
//         isSoldOut: false
//       }
//     ],
//     facilities: ["5 Menit ke Gerbang Tol Pakis Kota Malang", "8 Menit ke SMK Negeri 9 Malang", "9 Menit ke Kampus 2 UM"]
//   },
//   {
//     id: "skyland-pandanlandung",
//     title: "Skyland Pandanlandung",
//     category: "Pandanlandung",
//     statusBadge: "Available",
//     subBadge: "Modern Japandi Scandinavian",
//     totalUnits: "85 Unit",
//     imageCover: "/images/project cover/Cover Pandanlandung.png",
//     bannerImage: "/images/Banner.png",
//     location: "Jl. Gunung Sari, Pandanlandung, Kec. Wagir - Malang",
//     description: "Merupakan perumahan yang terletak di jalan Gunung Sari, Pandanlandung, Malang. Menyungsung gaya modern Japandi Scandinavian. Rumah berukuran compact dua lantai ini hadir sebagai hunian yang nyaman untuk Anda dan keluarga.",
//     features: ["Compact 2 Lantai", "Japandi Style", "Lokasi Strategis Wagir"],
//     bankKPR: "BTN, BSI, Mandiri",
//     mapsUrl: "https://maps.app.goo.gl/HC2tPp2r4i4V9KbD9",
//     specsSummary: {
//       beds: "2 Kamar Tidur",
//       cluster: "Modern Japandi Scandinavian",
//       security: "One Gate System"
//     },
//     unitTypes: [
//       {
//         id: "type-36-60",
//         name: "Sky Hazel",
//         category: "Komersil",
//         buildingType: "2 Lantai",
//         specs: "Luas Bangunan 36m² / Luas Tanah 60m² (2 Lantai)",
//         bedrooms: 2,
//         bathrooms: 1,
//         priceStarting: "300 Jutaan",
//         image: "/images/tipe/Pandanlandung/Sky Hazel.png",
//         isSoldOut: true
//       },
//       {
//         id: "type-36-plus-60",
//         name: "Sky Bronze",
//         category: "Komersil",
//         buildingType: "2 Lantai + Balkon",
//         specs: "Luas Bangunan 36m² / Luas Tanah 60m²",
//         bedrooms: 2,
//         bathrooms: 1,
//         priceStarting: "300 Jutaan",
//         image: "/images/tipe/Pandanlandung/Sky Bronze.png",
//         isSoldOut: false
//       },
//       {
//         id: "type-45-60",
//         name: "Sky Pearl",
//         category: "Komersil",
//         buildingType: "2 Lantai + Balkon",
//         specs: "Luas Bangunan 45m² / Luas Tanah 60m² (2 Lantai)",
//         bedrooms: 2,
//         bathrooms: 1,
//         priceStarting: "400 Jutaan",
//         image: "/images/tipe/Pandanlandung/Sky Pearl.png",
//         isSoldOut: false
//       }
//     ],
//     facilities: ["5 Menit ke Pasar Mergan", "5 Menit ke Malang City Point", "15 Menit ke Mall Olympic Garden"]
//   },
//   {
//     id: "skyland-arjuna",
//     title: "Skyland Arjuna",
//     category: "Karangploso",
//     statusBadge: "Available",
//     subBadge: "Modern Japandi Scandinavian",
//     totalUnits: "90 Unit",
//     imageCover: "/images/project cover/Cover Arjuna.png",
//     bannerImage: "/images/Banner.png",
//     location: "Jl. Arjuna, Ngenep, Kec. Karangploso - Malang",
//     description: "Merupakan perumahan yang terletak di Jalan Arjuna, Ngenep Kecamatan Karangploso, Malang. Menyungsung gaya modern Japandi Scandinavian. Rumah berukuran compact dua lantai ini hadir sebagai hunian yang nyaman untuk Anda dan keluarga.",
//     features: ["View Gunung Arjuna", "Lokasi Strategis", "Akses Tol Singosari"],
//     bankKPR: "BTN, BSI, Mandiri",
//     mapsUrl: "https://maps.app.goo.gl/6yYZz4jqj4LyQADS7",
//     specsSummary: {
//       beds: "2 Kamar Tidur",
//       cluster: "Modern Japandi Scandinavian",
//       security: "One Gate System"
//     },
//     unitTypes: [
//       {
//         id: "type-36-60",
//         name: "Nakula",
//         category: "Subsidi",
//         buildingType: "1 Lantai",
//         specs: "Luas Bangunan 30m² / Luas Tanah 60m² (1 Lantai)",
//         bedrooms: 2,
//         bathrooms: 1,
//         priceStarting: "166 Jutaan",
//         image: "/images/tipe/Arjuna/Nakula.png",
//         isSoldOut: false
//       },
//       {
//         id: "type-36-plus-60",
//         name: "Bima",
//         category: "Komersil",
//         buildingType: "2 Lantai + Balkon",
//         specs: "Luas Bangunan 36m² / Luas Tanah 60m²",
//         bedrooms: 2,
//         bathrooms: 1,
//         priceStarting: "300 Jutaan",
//         image: "/images/tipe/Arjuna/Bima.png",
//         isSoldOut: false
//       },
//       {
//         id: "type-45-60",
//         name: "Krisna",
//         category: "Komersil",
//         buildingType: "2 Lantai + Balkon",
//         specs: "Luas Bangunan 45m² / Luas Tanah 60m² (2 Lantai)",
//         bedrooms: 2,
//         bathrooms: 1,
//         priceStarting: "400 Jutaan",
//         image: "/images/tipe/Arjuna/Krisna.png",
//         isSoldOut: false
//       },
//     ],
//     facilities: ["15 Menit ke Gerbang Tol Singosari", "15 Menit ke Pabrik Bentoel Group", "15 Menit ke SMK Negeri 2 Singosari"]
//   },
//   {
//     id: "skyland-savana",
//     title: "Skyland Savana",
//     category: "Wagir",
//     statusBadge: "Available",
//     subBadge: "Subsidi & Komersil",
//     totalUnits: "120 Unit",
//     imageCover: "/images/project cover/Cover Savana.png",
//     bannerImage: "/images/Banner.png",
//     location: "Sukodadi, Kec. Wagir - Malang",
//     description: "Merupakan perumahan yang terletak di Sukodadi, Kecamatan Wagir, Malang. Menyungsung gaya modern Japandi Scandinavian. Rumah berukuran compact dua lantai ini hadir sebagai hunian yang nyaman untuk Anda dan keluarga.",
//     features: ["Unit Subsidi & Komersil", "Japandi Style", "Lokasi Sukodadi Wagir"],
//     bankKPR: "BTN, BSI, Mandiri",
//     mapsUrl: "https://maps.app.goo.gl/YiRkkHs2Mnz1FhdM9",
//     specsSummary: {
//       beds: "2 Kamar Tidur",
//       cluster: "Modern Japandi Scandinavian",
//       security: "One Gate System"
//     },
//     unitTypes: [
//       {
//         id: "type-30-60-subsidi",
//         name: "Subsidi - Type 30/60",
//         category: "Subsidi",
//         buildingType: "1 Lantai",
//         specs: "Luas Bangunan 30m² / Luas Tanah 60m² (1 Lantai)",
//         bedrooms: 2,
//         bathrooms: 1,
//         priceStarting: "166 Jutaan",
//         image: "/images/tipe/Savana/Subsidi.png",
//         isSoldOut: false
//       },
//       {
//         id: "type-36-plus-60-komersil",
//         name: "Komersil - Type 36+/60",
//         category: "Komersil",
//         buildingType: "2 Lantai",
//         specs: "Luas Bangunan 36m² / Luas Tanah 60m² (2 Lantai)",
//         bedrooms: 2,
//         bathrooms: 1,
//         priceStarting: "300 Jutaan",
//         image: "/images/tipe/Savana/Komersil.png",
//         isSoldOut: false
//       }
//     ],
//     facilities: ["8 Menit ke SMK Negeri 11 Malang", "15 Menit ke Universitas Merdeka", "15 Menit ke Mall Olympic Garden"]
//   },
//   {
//     id: "skybriza-pakis",
//     title: "Skybriza Pakis",
//     category: "Pakis",
//     statusBadge: "Available",
//     subBadge: "Subsidi & Komersil",
//     totalUnits: "110 Unit",
//     imageCover: "/images/project cover/Cover Skybriza.png",
//     bannerImage: "/images/Banner.png",
//     location: "Sumberkradenan, Kec. Pakis - Malang",
//     description: "Merupakan perumahan yang terletak di Sumberkradenan, Kecamatan Pakis, Malang. Menyungsung gaya modern Japandi Scandinavian. Rumah berukuran compact dua lantai ini hadir sebagai hunian yang nyaman untuk Anda dan keluarga.",
//     features: ["Subsidi & Komersil", "Japandi Style", "Dekat Pakis"],
//     bankKPR: "BTN, BSI, Mandiri",
//     mapsUrl: "https://maps.app.goo.gl/DrR7PnhhteE6iaV48",
//     specsSummary: {
//       beds: "2 Kamar Tidur",
//       cluster: "Modern Japandi Scandinavian",
//       security: "One Gate System"
//     },
//     unitTypes: [
//       {
//         id: "type-30-60-subsidi",
//         name: "Sky Aero",
//         category: "Subsidi",
//         buildingType: "1 Lantai",
//         specs: "Luas Bangunan 30m² / Luas Tanah 60m² (1 Lantai)",
//         bedrooms: 2,
//         bathrooms: 1,
//         priceStarting: "166 Jutaan",
//         image: "/images/tipe/Skybriza/Sky Aero.png",
//         isSoldOut: false
//       },
//       {
//         id: "type-36-plus-60-komersil",
//         name: "Sky Velo",
//         category: "Komersil",
//         buildingType: "2 Lantai",
//         specs: "Luas Bangunan 36m² / Luas Tanah 60m² (2 Lantai)",
//         bedrooms: 2,
//         bathrooms: 1,
//         priceStarting: "300 Jutaan",
//         image: "/images/tipe/Skybriza/Sky Velo.png",
//         isSoldOut: false
//       }
//     ],
//     facilities: ["7 Menit ke SMK Negeri 9 Malang", "10 Menit ke Exit Tol Pakis", "15 Menit ke Bandara Abd. Saleh"]
//   }
// ];

// // Data Header & Statistik Dinamis yang menghitung hanya proyek dengan statusBadge selain "Sold" (atau khusus yang "Available")
// export const projectsHeaderData = {
//   badge: "Proyek Unggulan Kami",
//   titlePrefix: "Temukan Rumah",
//   titleHighlight: "Impian Anda",
//   description: "Temukan hunian impian Anda dari portofolio proyek Skyland Property Nusantara di Malang, Jawa Timur.",
//   stats: [
//     {
//       id: "stat-1",
//       value: projectsData.filter((p) => p.statusBadge !== "Sold").length.toString(), 
//       label: "Proyek Aktif",
//     },
//     {
//       id: "stat-2",
//       value: "500+",
//       label: "Unit Terjual",
//     },
//     {
//       id: "stat-3",
//       value: "100%",
//       label: "SHM Legal",
//     },
//     {
//       id: "stat-4",
//       value: "2018",
//       label: "Berdiri Sejak",
//     },
//   ],
// };
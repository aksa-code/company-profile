import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import { companyInfo } from "../../lib/companyData";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description:
    "Kebijakan Privasi Skyland Property Nusantara: data yang kami kumpulkan, tujuannya, pihak ketiga, dan hak Anda atas data pribadi.",
};

const updatedDate = "10 Oktober 2026";

const sections: { title: string; body: string[] }[] = [
  {
    title: "1. Data yang kami kumpulkan",
    body: [
      "Data yang Anda berikan langsung: nama, nomor WhatsApp/HP, alamat email, serta isi pesan atau keperluan yang Anda tulis pada form kontak, form konsultasi unit, dan form lamaran kerja di situs ini.",
      "Data otomatis: halaman yang Anda kunjungi, jenis perangkat dan browser, alamat IP, serta interaksi Anda dengan situs — sebagian dikumpulkan melalui cookies dan Meta Pixel.",
    ],
  },
  {
    title: "2. Tujuan penggunaan data",
    body: [
      "Menghubungi Anda kembali menanggapi pertanyaan, permintaan survei lokasi, atau konsultasi unit.",
      "Mencatat dan menindaklanjuti prospek (leads) serta lamaran kerja yang masuk.",
      "Mengukur kinerja situs dan iklan, termasuk retargeting di Facebook dan Instagram agar iklan yang Anda lihat lebih relevan.",
    ],
  },
  {
    title: "3. Pihak ketiga yang menerima data",
    body: [
      "Meta (Facebook/Instagram): menerima data ter-hash (tidak bisa dibalik menjadi data asli) melalui Meta Pixel untuk pencocokan audiens dan pengukuran iklan.",
      "Penyedia penyimpanan data prospek yang kami gunakan untuk operasional (misalnya database situs ini).",
      "WhatsApp: saat Anda menekan tombol kirim via WhatsApp, isi pesan diteruskan ke aplikasi WhatsApp sesuai tindakan Anda sendiri.",
      "Kami tidak menjual data pribadi Anda kepada pihak mana pun.",
    ],
  },
  {
    title: "4. Penyimpanan dan keamanan",
    body: [
      "Data prospek disimpan selama diperlukan untuk tujuan di atas, lalu dihapus atau dianonimkan.",
      "Kami berupaya melindungi data dengan akses terbatas dan praktik keamanan yang wajar. Namun tidak ada sistem yang 100% aman, dan pengiriman data melalui internet memiliki risikonya sendiri.",
    ],
  },
  {
    title: "5. Hak Anda atas data pribadi",
    body: [
      "Sesuai UU Pelindungan Data Pribadi (UU No. 27 Tahun 2022), Anda berhak meminta akses, perbaikan, penghentian penggunaan, dan penghapusan data pribadi Anda.",
      "Untuk menggunakan hak tersebut, hubungi kami melalui kontak di bawah dengan menyertakan nama dan nomor yang Anda gunakan saat mengisi form.",
    ],
  },
  {
    title: "6. Perubahan kebijakan",
    body: [
      "Halaman ini dapat diperbarui sewaktu-waktu mengikuti perubahan layanan atau ketentuan hukum. Tanggal pembaruan selalu tercantum di bawah judul.",
    ],
  },
];

export default function PrivasiPage() {
  const email = companyInfo.contact?.email ?? "";
  const phone = companyInfo.contact?.phone ?? "";

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-16">
        <p className="text-xs font-bold tracking-widest uppercase text-orange-500 mb-2">
          Legal
        </p>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
          Kebijakan Privasi
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mb-8">
          {companyInfo.fullName} — Terakhir diperbarui: {updatedDate}
        </p>

        <p className="text-sm sm:text-base leading-relaxed text-gray-700 mb-8">
          Kami menghargai privasi Anda. Halaman ini menjelaskan data apa yang
          kami kumpulkan saat Anda menggunakan situs {companyInfo.fullName},
          untuk apa data itu dipakai, kepada siapa data dibagikan, dan apa hak
          Anda atas data tersebut.
        </p>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-base sm:text-lg font-extrabold mb-3">
                {section.title}
              </h2>
              <div className="space-y-3">
                {section.body.map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-sm sm:text-base leading-relaxed text-gray-700"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}

          <section>
            <h2 className="text-base sm:text-lg font-extrabold mb-3">
              7. Hubungi kami
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-gray-700">
              Untuk pertanyaan atau permintaan terkait data pribadi, hubungi
              kami via WhatsApp di {phone} atau email di {email}. Anda juga
              dapat menghubungi kami melalui halaman{" "}
              <Link
                href="/contact"
                className="text-orange-600 font-semibold hover:text-orange-700 underline underline-offset-2"
              >
                Kontak
              </Link>
              .
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

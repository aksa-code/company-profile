// src/app/contact/page.tsx

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import { companyInfo } from "../../lib/companyService";
import { supabase } from "../../lib/supabase"; // Sesuaikan jalur import supabase Anda jika berbeda

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  // State untuk pilihan tujuan pengiriman ("admin" atau "hrd")
  const [destination, setDestination] = useState<"admin" | "hrd">("admin");

  const [isSubmitted, setIsSubmitted] = useState(false);

  // Mengambil nomor admin dari companyInfo dan format untuk URL WhatsApp
  const rawPhone = companyInfo.contact?.phone ?? "";
  const displayPhone = rawPhone.startsWith("62")
    ? "0" + rawPhone.slice(2)
    : rawPhone;

  const formattedPhone = rawPhone.startsWith("0") ? "62" + rawPhone.slice(1) : rawPhone;
  const adminWhatsAppNumber = formattedPhone.replace(/[\s+-]/g, "");

  // Mengambil nomor WhatsApp HRD dari companyInfo
  const formattedHrdNumber = companyInfo.contact.hrdPhone.replace(/[\s+-]/g, "");

  // Mengambil link Google Maps langsung dari data companyInfo
  const googleMapsUrl = companyInfo.mapsUrl;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let text = "";
    let targetNumber = "";

    if (destination === "hrd") {
      targetNumber = formattedHrdNumber;
      text = `Halo HRD Skyland Property, saya ${formData.name} ingin menyampaikan pesan/pertanyaan: "${formData.message}" (No. HP/WA: ${formData.phone})`;
    } else {
      targetNumber = adminWhatsAppNumber;
      text = `Halo Admin ${companyInfo.name}, saya ${formData.name} ingin menyampaikan pesan/pertanyaan: "${formData.message}" (No. HP/WA: ${formData.phone})`;

      // Simpan data ke tabel 'leads' Supabase khusus jika tujuannya Admin/Marketing Properti
      try {
        const { error } = await supabase.from("leads").insert([
          {
            visitor_name: formData.name,
            whatsapp_number: formData.phone,
            unit_name: formData.message, // Menyimpan isi pesan/keperluan sebagai catatan unit/pesan
            source: "Form Kontak Utama",
            status: "baru",
          },
        ]);

        if (error) {
          console.error("Gagal menyimpan lead ke Supabase:", error.message);
        }
      } catch (err) {
        console.error("Terjadi kesalahan koneksi database:", err);
      }
    }

    // Membuka jendela WhatsApp
    window.open(`https://wa.me/${targetNumber}?text=${encodeURIComponent(text)}`, "_blank");

    // Membersihkan form setelah tombol diklik
    setFormData({
      name: "",
      phone: "",
      message: "",
    });

    setIsSubmitted(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16 selection:bg-orange-500 selection:text-white">

      <Navbar />

      {/* Banner Header dengan Animasi Masuk */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative text-white pt-12 pb-16 sm:pt-20 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gray-900"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/Banner.png"
            alt="Contact Background"
            fill
            className="object-cover scale-105 transform duration-700"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/40" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 max-w-6xl mx-auto space-y-2 sm:space-y-3"
        >
          <div className="flex items-center gap-2 text-xs text-gray-300 font-medium">
            <Link href="/" className="hover:text-orange-400 transition-colors">{companyInfo.name} Property</Link>
            <span>›</span>
            <span className="text-orange-400">Hubungi Kami</span>
          </div>

          <h1 className="text-2xl sm:text-5xl font-extrabold tracking-tight">
            Mari Berdiskusi <span className="text-orange-500">Bersama Kami</span>
          </h1>
          <p className="text-gray-200 text-xs sm:text-sm max-w-xl font-normal leading-relaxed">
            Punya pertanyaan seputar unit properti, jadwal survey lokasi, kerja sama bisnis, atau informasi seputar karier? Tim dan HRD kami siap membantu Anda.
          </p>
        </motion.div>
      </motion.div>

      {/* Konten Utama Kontak */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">

          {/* Informasi Kontak & Detail Kantor dengan Animasi Masuk */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-6 space-y-5 sm:space-y-6"
          >
            <div className="space-y-2 sm:space-y-3">
              <h2 className="text-lg sm:text-2xl font-extrabold text-gray-900">
                {companyInfo.contact.heading}
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                {companyInfo.contact.description}
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">

              {/* Alamat Kantor (Mengambil mapsUrl dari companyInfo) */}
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3.5 bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-orange-300 hover:shadow-md transition-all group block"
              >
                <div className="bg-orange-50 text-orange-500 p-2.5 sm:p-3 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-gray-900 text-xs sm:text-sm mb-0.5 group-hover:text-orange-600 transition-colors">
                      {companyInfo.contact.addressTitle}
                    </h4>
                    <span className="text-[11px] text-orange-500 font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Buka Maps ↗
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    {companyInfo.address}
                  </p>
                </div>
              </a>

              {/* Telepon / WhatsApp Marketing */}
              <div className="flex items-start gap-3.5 bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="bg-orange-50 text-orange-500 p-2.5 sm:p-3 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-xs sm:text-sm mb-0.5">
                    {companyInfo.contact.phoneTitle}
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm">+{companyInfo.contact.phone}</p>
                </div>
              </div>

              {/* WhatsApp HRD */}
              <div className="flex items-start gap-3.5 bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="bg-orange-50 text-orange-500 p-2.5 sm:p-3 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-xs sm:text-sm mb-0.5">
                    {companyInfo.contact.hrdPhoneTitle}
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm">+{companyInfo.contact.hrdPhone} ({companyInfo.contact.hrdDescription})</p>
                </div>
              </div>

              {/* Email Resmi */}
              <div className="flex items-start gap-3.5 bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="bg-orange-50 text-orange-500 p-2.5 sm:p-3 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-xs sm:text-sm mb-0.5">{companyInfo.contact.emailTitle}</h4>
                  <p className="text-gray-600 text-xs sm:text-sm">{companyInfo.contact.email}</p>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Formulir Pesan dengan Chip Pilihan Tujuan dan Animasi Masuk */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-6 bg-white p-5 sm:p-8 rounded-2xl shadow-xl border border-gray-100"
          >
            {isSubmitted ? (
              <div className="text-center py-8 sm:py-10 space-y-3">
                <div className="w-14 h-14 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Pesan Dialihkan ke WhatsApp!</h3>
                <p className="text-gray-600 text-xs sm:text-sm max-w-xs mx-auto">
                  Terima kasih. Jendela WhatsApp telah dibuka agar Anda dapat langsung mengirimkan pesan.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-orange-500/20"
                >
                  Kirim Pesan Lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-gray-900 mb-1">Kirim Pesan</h3>
                  <p className="text-gray-500 text-xs sm:text-sm">Pilih tujuan pengiriman dan isi formulir di bawah ini untuk terhubung melalui WhatsApp.</p>
                </div>

                <div className="space-y-3 sm:space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Masukkan nama Anda"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 text-xs sm:text-sm transition-colors text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">Nomor WhatsApp</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="08xxxxxxxxxx"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 text-xs sm:text-sm transition-colors text-gray-900"
                    />
                  </div>

                  {/* Chip Pilihan Tujuan */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold text-gray-700">Kirim Pesan Kepada:</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setDestination("admin")}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${destination === "admin"
                          ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                          }`}
                      >
                        Admin / Marketing Properti
                      </button>
                      <button
                        type="button"
                        onClick={() => setDestination("hrd")}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${destination === "hrd"
                          ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                          }`}
                      >
                        HRD & Rekrutmen
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">Pesan / Keperluan</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={destination === "hrd" ? "Tuliskan pertanyaan seputar lowongan atau lampirkan info CV..." : "Tuliskan pertanyaan atau rencana survey lokasi Anda..."}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 text-xs sm:text-sm transition-colors text-gray-900 resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-orange-500/20 text-xs sm:text-sm flex items-center justify-center gap-2"
                >
                  <span>Kirim ke {destination === "hrd" ? "HRD" : "Admin"} via WhatsApp</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </form>
            )}
          </motion.div>

        </div>
      </div>

      <div className="mt-12 sm:mt-16">
        <Footer />
      </div>

    </div>
  );
}
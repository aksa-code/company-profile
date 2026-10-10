// src/app/hero/Contact.tsx

"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import PrivacyNote, { HoneypotField } from "./PrivacyNote";
import { isHoneypotFilled, claimSubmitSlot } from "../../lib/antispam";
import { companyInfo } from "../../lib/companyService"; 

export default function Contact() {
  const [isOpen, setIsOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [mounted, setMounted] = useState(false);
  
  const [notification, setNotification] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({
    show: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    // penanda mounted agar aman dari hydration mismatch; perilaku disengaja dan tidak diubah
    setMounted(true);
  }, []);

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const rawPhone = companyInfo.contact.phone;
  const formattedPhone = rawPhone.startsWith("0") ? "62" + rawPhone.slice(1) : rawPhone;
  const whatsappNumber = formattedPhone.replace(/[\s+-]/g, "");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setPhone(val);

    if (val.length > 0) {
      if (!val.startsWith("08")) {
        setPhoneError("Nomor WhatsApp harus diawali dengan '08'");
      } else if (val.length < 10 || val.length > 13) {
        setPhoneError("Panjang nomor HP antara 10 - 13 digit");
      } else {
        setPhoneError("");
      }
    } else {
      setPhoneError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Anti-spam: abaikan bot (honeypot) dan kiriman beruntun (<30 detik).
    const formEl = e.currentTarget as HTMLFormElement;
    if (isHoneypotFilled(formEl)) return;
    if (!claimSubmitSlot("leads:consult")) {
      setNotification({
        show: true,
        type: "error",
        message: "Terlalu cepat! Tunggu sebentar sebelum mengirim lagi.",
      });
      return;
    }
    if (!fullName.trim() || !phone.trim()) {
      setNotification({
        show: true,
        type: "error",
        message: "Mohon masukkan nama lengkap dan nomor WhatsApp Anda.",
      });
      return;
    }

    if (!phone.startsWith("08") || phone.length < 10 || phone.length > 13) {
      setPhoneError("Format nomor WhatsApp tidak valid");
      setNotification({
        show: true,
        type: "error",
        message: "Periksa kembali format nomor WhatsApp Anda.",
      });
      return;
    }

    setNotification({
      show: true,
      type: "success",
      message: "Berhasil! Mengarahkan Anda ke WhatsApp...",
    });

    const customMessage = encodeURIComponent(
      `Halo ${companyInfo.name}, perkenalkan nama saya *${fullName}*. Saya ingin berkonsultasi mengenai rumah impian (Life Starts With You).`
    );

    setTimeout(() => {
      setIsOpen(false);
      window.open(`https://wa.me/${whatsappNumber}?text=${customMessage}`, "_blank");
    }, 1000);
  };

  return (
    <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8 bg-orange-500 text-white relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-orange-400/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-orange-600/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <div className="max-w-3xl mx-auto space-y-5">
          
          {/* Tagline dijadikan sebagai penekanan poin utama (Value Proposition Copy) */}
          <div className="space-y-2">
            <p className="text-orange-200 text-xs sm:text-sm font-bold tracking-widest uppercase">
              Life Starts With You
            </p>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug">
              Siap Mewujudkan Rumah Impian Anda bersama {companyInfo.fullName}?
            </h2>
          </div>

          <p className="text-orange-100 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Karena setiap cerita besar bermula dari langkah Anda hari ini. {companyInfo.description} Konsultasikan kebutuhan hunian terbaik Anda dengan tim kami.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-3">
            {/* Tombol yang membuka modal form */}
            <button
              onClick={() => setIsOpen(true)}
              // Ekstensi browser form-filler (mis. Dashlane) menyuntik atribut
              // seperti `fdprocessedid` ke tombol ini sebelum hydration;
              // abaikan peringatan mismatch untuk atribut asing tersebut.
              suppressHydrationWarning
              className="bg-[#25D366] hover:bg-[#1DA851] text-white font-bold px-6 py-3.5 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-green-900/20 text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>Konsultasi via WhatsApp</span>
            </button>

            <Link
              href="/projects"
              className="bg-orange-600/60 hover:bg-orange-600 text-white font-semibold px-6 py-3.5 rounded-xl border border-orange-400/40 transition-all duration-300 hover:scale-105 text-xs sm:text-sm flex items-center gap-2 backdrop-blur-sm"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Lihat Proyek</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Modal Popup & Sistem Notifikasi */}
      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 relative my-auto text-left">
            
            <AnimatePresence>
              {notification.show && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-3 rounded-xl text-xs font-medium flex items-center justify-between shadow-lg backdrop-blur-md ${
                    notification.type === "success" 
                      ? "bg-emerald-500 text-white border border-emerald-400" 
                      : "bg-red-500 text-white border border-red-400"
                  }`}
                >
                  <span className="pr-2">{notification.message}</span>
                  <button 
                    type="button"
                    onClick={() => setNotification((prev) => ({ ...prev, show: false }))}
                    className="text-white/80 hover:text-white font-bold text-sm px-1"
                  >
                    ×
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <div className="inline-block bg-orange-50 border border-orange-100 text-orange-600 text-[10px] font-extrabold px-3 py-1 rounded-lg uppercase tracking-wider">
                Life Starts With You
              </div>
              <h3 className="text-xl font-black text-slate-900">Mulai Konsultasi</h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Wujudkan babak baru kehidupan Anda bersama tim expert <span className="font-semibold text-slate-800">{companyInfo.fullName}</span>. Silakan isi data di bawah ini.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <HoneypotField />
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Nomor WhatsApp</label>
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 081234567890"
                  maxLength={13}
                  value={phone}
                  onChange={handlePhoneChange}
                  className={`w-full bg-slate-50 border ${
                    phoneError ? "border-red-500" : "border-slate-200"
                  } rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium`}
                />
                {phoneError ? (
                  <p className="text-[10px] text-red-500 font-medium">{phoneError}</p>
                ) : (
                  <p className="text-[10px] text-slate-400">Harus diawali &apos;08&apos; dan terdiri dari 10 - 13 digit angka.</p>
                )}
              </div>

              <div className="flex flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-xs sm:text-sm transition text-center cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-[#25D366] hover:bg-[#1DA851] text-white font-semibold py-3 rounded-xl text-xs sm:text-sm transition shadow-lg shadow-emerald-600/20 text-center cursor-pointer flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  Lanjut ke WhatsApp
                </button>
              </div>

              <PrivacyNote />
            </form>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
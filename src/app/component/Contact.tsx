// src/app/hero/Contact.tsx

"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
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
      `Halo ${companyInfo.name}, perkenalkan nama saya *${fullName}*. Saya ingin berkonsultasi mengenai rumah impian.`
    );

    setTimeout(() => {
      setIsOpen(false);
      window.open(`https://wa.me/${whatsappNumber}?text=${customMessage}`, "_blank");
    }, 1000);
  };

  return (
    <section id="contact" className="py-12 px-4 sm:px-6 lg:px-8 bg-orange-500 text-white relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-orange-400/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-orange-600/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
            Siap Mewujudkan Rumah Impian Anda bersama {companyInfo.fullName}?
          </h2>

          <p className="text-orange-100 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            {companyInfo.description} Konsultasikan kebutuhan hunian Anda dengan tim kami.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {/* Tombol yang membuka modal form */}
            <button
              onClick={() => setIsOpen(true)}
              className="bg-white text-orange-600 hover:bg-orange-50 font-bold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-orange-900/10 text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>Hubungi Sekarang</span>
            </button>

            <Link
              href="/projects"
              className="bg-orange-600/60 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl border border-orange-400/40 transition-all duration-300 hover:scale-105 text-xs sm:text-sm flex items-center gap-2 backdrop-blur-sm"
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

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900">Mulai Konsultasi</h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Silakan isi data diri Anda sebelum terhubung langsung dengan tim marketing <span className="font-semibold text-slate-800">{companyInfo.fullName}</span>.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                  <p className="text-[10px] text-slate-400">Harus diawali '08' dan terdiri dari 10 - 13 digit angka.</p>
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
                  className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl text-xs sm:text-sm transition shadow-lg shadow-emerald-600/20 text-center cursor-pointer"
                >
                  Lanjut ke WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
// src/app/component/CareerApplyButton.tsx
"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabase";

interface CareerApplyButtonProps {
  careerId: string;
  careerTitle: string;
  whatsappNumber: string;
  waMessage: string;
}

export default function CareerApplyButton({
  careerId,
  careerTitle,
  whatsappNumber,
}: CareerApplyButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // State untuk Notifikasi / Feedback UI di dalam modal
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
    // penanda mounted untuk portal/modal agar aman dari hydration mismatch; perilaku disengaja dan tidak diubah
    setMounted(true);
  }, []);

  // Otomatis hilangkan notifikasi setelah 4 detik
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  // Handler perubahan input nomor telepon dengan filter angka & validasi awalan 08
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, ""); // Hanya izinkan angka
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      setNotification({
        show: true,
        type: "error",
        message: "Mohon masukkan nama lengkap dan nomor WhatsApp Anda.",
      });
      return;
    }

    // Validasi format nomor WhatsApp: harus diawali "08" dan panjang 10-13 digit
    if (!phone.startsWith("08") || phone.length < 10 || phone.length > 13) {
      setPhoneError("Format nomor WhatsApp tidak valid (harus 08... dan 10-13 digit)");
      setNotification({
        show: true,
        type: "error",
        message: "Periksa kembali format nomor WhatsApp Anda.",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("career_applications").insert([
        {
          career_id: careerId,
          position_title: careerTitle,
          applicant_name: fullName,
          whatsapp_number: phone,
          source: "WhatsApp Website",
          status: "baru",
        },
      ]);

      if (error) {
        console.error("Supabase Error:", error.message);
        setNotification({
          show: true,
          type: "error",
          message: "Gagal menyimpan data lamaran, namun Anda tetap diarahkan ke WhatsApp.",
        });
      } else {
        setNotification({
          show: true,
          type: "success",
          message: "Berhasil! Mengarahkan Anda ke WhatsApp HRD...",
        });
      }

      const customMessage = encodeURIComponent(
        `Halo HRD Skyland Property, perkenalkan nama saya *${fullName}*. Saya ingin melamar untuk posisi *${careerTitle}*. Berikut lampiran CV dan portofolio saya.`
      );

      // Tutup modal dan buka WhatsApp setelah jeda singkat agar notifikasi terbaca
      // Normalisasi 0 -> 62 agar link wa.me selalu valid.
      const waNumber = (whatsappNumber.startsWith("0") ? "62" + whatsappNumber.slice(1) : whatsappNumber).replace(/[\s+-]/g, "");
      setTimeout(() => {
        setIsOpen(false);
        window.open(`https://wa.me/${waNumber}?text=${customMessage}`, "_blank");
      }, 1000);

    } catch (err: unknown) {
      console.error("Terjadi kesalahan:", err);
      setNotification({
        show: true,
        type: "error",
        message: "Terjadi kesalahan koneksi database.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Tombol Utama */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl transition-all shadow-lg text-xs sm:text-sm text-center w-full sm:w-auto flex items-center justify-center gap-2"
      >
        <span>Lamar via WhatsApp</span>
      </button>

      {/* Modal Popup dengan React Portal */}
      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 relative my-auto">
            
            {/* Komponen Notifikasi / Toast Interaktif di dalam Modal */}
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
              <h3 className="text-xl font-black text-slate-900">Lengkapi Data Diri</h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Masukkan nama dan nomor WhatsApp Anda sebelum terhubung ke HRD untuk posisi <span className="font-semibold text-slate-800">{careerTitle}</span>.
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
                  <p className="text-[10px] text-slate-400">Harus diawali &apos;08&apos; dan terdiri dari 10 - 13 digit angka.</p>
                )}
              </div>

              {/* Kontainer Tombol Berdampingan */}
              <div className="flex flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-xs sm:text-sm transition text-center"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl text-xs sm:text-sm transition shadow-lg shadow-emerald-600/20 disabled:opacity-50 text-center"
                >
                  {loading ? "Memproses..." : "Lanjut ke WhatsApp"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
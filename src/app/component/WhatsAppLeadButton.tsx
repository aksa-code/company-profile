// src/app/component/WhatsAppLeadButton.tsx
"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabase";

interface WhatsAppLeadButtonProps {
  unitName: string;
  buildingType: string;
  projectTitle: string;
  adminPhone: string;
}

export default function WhatsAppLeadButton({
  unitName,
  buildingType,
  projectTitle,
  adminPhone,
}: WhatsAppLeadButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
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
    // penanda mounted agar aman dari hydration mismatch; perilaku disengaja dan tidak diubah
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

  // Handler perubahan input nomor telepon dengan validasi real-time
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setWhatsappNumber(val);

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
    if (!customerName.trim() || !whatsappNumber.trim()) {
      setNotification({
        show: true,
        type: "error",
        message: "Mohon masukkan nama dan nomor WhatsApp Anda.",
      });
      return;
    }

    if (!whatsappNumber.startsWith("08") || whatsappNumber.length < 10 || whatsappNumber.length > 13) {
      setPhoneError("Format nomor WhatsApp tidak valid");
      setNotification({
        show: true,
        type: "error",
        message: "Periksa kembali format nomor WhatsApp Anda.",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("leads").insert([
        {
          visitor_name: customerName,
          whatsapp_number: whatsappNumber,
          unit_name: `${projectTitle} - ${unitName} ${buildingType ? `(${buildingType})` : ""}`,
          source: "Tombol Tanya Unit Detail",
          status: "baru",
        },
      ]);

      if (error) {
        console.error("Gagal menyimpan lead:", error.message);
        setNotification({
          show: true,
          type: "error",
          message: "Gagal menyimpan data lead, namun Anda tetap diarahkan ke WhatsApp.",
        });
      } else {
        setNotification({
          show: true,
          type: "success",
          message: "Berhasil! Mengarahkan Anda ke WhatsApp...",
        });
      }
    } catch (err: unknown) {
      console.error("Error:", err);
      setNotification({
        show: true,
        type: "error",
        message: "Terjadi kesalahan koneksi database.",
      });
    } finally {
      setLoading(false);
    }

    const text = encodeURIComponent(
      `Halo, saya *${customerName}* tertarik dengan unit *${unitName}* ${
        buildingType ? `(${buildingType})` : ""
      } di proyek *${projectTitle}*. Mohon informasi lebih lanjut.`
    );

    let formattedPhone = adminPhone.replace(/[^0-9]/g, "");
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "62" + formattedPhone.slice(1);
    }

    setTimeout(() => {
      setIsOpen(false);
      window.open(`https://wa.me/${formattedPhone}?text=${text}`, "_blank");
    }, 1000);
  };

  return (
    <>
      {/* Tombol Utama Tanya Unit */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2.5 rounded-2xl shadow-lg shadow-orange-500/20 transition-all duration-300 hover:scale-105 flex items-center gap-2 cursor-pointer"
      >
        <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
        Tanya Unit
      </button>

      {/* Modal Popup dengan React Portal */}
      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 relative my-auto text-left">
            
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
                    className="text-white/80 hover:text-white font-bold text-sm px-1 cursor-pointer"
                  >
                    ×
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                Formulir Prospek
              </span>
              <h3 className="text-xl font-black text-slate-900 tracking-tight pt-2">
                Hubungkan ke WhatsApp
              </h3>
              <p className="text-xs text-slate-500">
                Masukkan data diri Anda untuk melanjutkan diskusi unit <span className="font-semibold text-slate-700">{unitName}</span> via WhatsApp.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Nomor WhatsApp (Aktif)</label>
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 081234567890"
                  maxLength={13}
                  value={whatsappNumber}
                  onChange={handlePhoneChange}
                  className={`w-full px-4 py-3 bg-slate-50 border ${
                    phoneError ? "border-red-500" : "border-slate-200"
                  } rounded-2xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition`}
                />
                {phoneError ? (
                  <p className="text-[10px] text-red-500 font-medium">{phoneError}</p>
                ) : (
                  <p className="text-[10px] text-slate-400">Harus diawali &apos;08&apos; dan terdiri dari 10 - 13 digit angka.</p>
                )}
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-2xl text-xs transition cursor-pointer text-center"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-2xl text-xs shadow-lg shadow-orange-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer text-center"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Lanjutkan ke WhatsApp"
                  )}
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
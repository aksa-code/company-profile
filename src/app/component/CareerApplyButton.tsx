// src/app/component/CareerApplyButton.tsx
"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
  waMessage,
}: CareerApplyButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      alert("Mohon masukkan nama lengkap dan nomor WhatsApp Anda.");
      return;
    }

    // Validasi format nomor WhatsApp: harus diawali "08"
    if (!phone.startsWith("08")) {
      alert("Nomor WhatsApp harus diawali dengan angka '08'.");
      return;
    }

    // Validasi panjang nomor WhatsApp (10 s.d 13 digit)
    if (phone.length < 10 || phone.length > 13) {
      alert("Nomor WhatsApp tidak valid! Panjang nomor harus antara 10 sampai 13 digit.");
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
      }

      const customMessage = encodeURIComponent(
        `Halo HRD Skyland Property, perkenalkan nama saya *${fullName}*. Saya ingin melamar untuk posisi *${careerTitle}*. Berikut lampiran CV dan portofolio saya.`
      );

      setIsOpen(false);
      window.open(`https://wa.me/${whatsappNumber}?text=${customMessage}`, "_blank");
    } catch (err: any) {
      alert("Terjadi kesalahan: " + err.message);
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
                  onChange={(e) => {
                    // Hanya izinkan input berupa angka
                    const numericValue = e.target.value.replace(/\D/g, "");
                    setPhone(numericValue);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                />
                <p className="text-[10px] text-slate-400">Harus diawali '08' dan terdiri dari 10 - 13 digit angka.</p>
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
// src/app/admin/career/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCareer, CareerItem, formatRupiah } from "../../../../../lib/careerService";
import NotificationModal from "../../../../component/ui/NotificationModal"; // Sesuaikan path import modal Anda

export default function CreateCareerPage() {
  const router = useRouter();

  // State terpisah untuk input angka murni minimum & maksimum
  const [minSalaryInput, setMinSalaryInput] = useState("");
  const [maxSalaryInput, setMaxSalaryInput] = useState("");

  // State untuk kontrol NotificationModal
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "success" | "danger" | "warning" | "info";
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  const [formData, setFormData] = useState<CareerItem>({
    id: "",
    title: "",
    department: "",
    location: "Malang, Jawa Timur (On-site)",
    type: "Full-Time",
    salary: "",
    postedDate: new Date().toISOString().split("T")[0],
    isClosed: false,
    description: "",
    requirements: [""],
    responsibilities: [""],
    glintsUrl: "",
  });

  // Handler otomatis format gaji minimum
  const handleMinSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    setMinSalaryInput(rawValue);
    updateFormattedSalary(rawValue, maxSalaryInput);
  };

  // Handler otomatis format gaji maksimum
  const handleMaxSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    setMaxSalaryInput(rawValue);
    updateFormattedSalary(minSalaryInput, rawValue);
  };

  const updateFormattedSalary = (min: string, max: string) => {
    const formattedMin = min ? formatRupiah(min) : "";
    const formattedMax = max ? formatRupiah(max) : "";

    let finalSalary = "";
    if (formattedMin && formattedMax) {
      finalSalary = `${formattedMin} - ${formattedMax}`;
    } else if (formattedMin) {
      finalSalary = `Mulai dari ${formattedMin}`;
    } else if (formattedMax) {
      finalSalary = `Hingga ${formattedMax}`;
    }

    setFormData((prev) => ({ ...prev, salary: finalSalary }));
  };

  const handleArrayChange = (index: number, value: string, field: "requirements" | "responsibilities") => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData({ ...formData, [field]: updated });
  };

  const addArrayField = (field: "requirements" | "responsibilities") => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const removeArrayField = (index: number, field: "requirements" | "responsibilities") => {
    const updated = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const generatedId = formData.id || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      await createCareer({ ...formData, id: generatedId });
      
      setModalConfig({
        isOpen: true,
        type: "success",
        title: "Berhasil!",
        message: "Lowongan baru berhasil ditambahkan ke sistem.",
        onConfirm: () => router.push("/admin/career"),
      });
    } catch (error: any) {
      setModalConfig({
        isOpen: true,
        type: "danger",
        title: "Gagal Menyimpan",
        message: "Terjadi kesalahan: " + error.message,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Tambah Lowongan Baru</h1>
          <p className="text-slate-500 text-sm mt-1">Buat posisi pekerjaan baru untuk ditampilkan di website utama.</p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/admin/career")}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali
        </button>
      </div>

      {/* Form Utama */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8 space-y-6">
        
        {/* Judul Posisi */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-800">Judul Posisi <span className="text-orange-500">*</span></label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full border border-slate-200 rounded-xl p-3 text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition text-sm"
            placeholder="Contoh: Sales Marketing Developer"
          />
        </div>

        {/* Departemen & Tipe Pekerjaan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-800">Departemen <span className="text-orange-500">*</span></label>
            <input
              type="text"
              required
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full border border-slate-200 rounded-xl p-3 text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition text-sm"
              placeholder="Contoh: Human Resources / Finance / dll"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-800">Tipe Pekerjaan</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full border border-slate-200 rounded-xl p-3 text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition text-sm cursor-pointer"
            >
              <option value="Full-Time">Full-Time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
        </div>

        {/* Kotak Gaji Otomatis */}
        <div className="bg-orange-50/40 p-5 rounded-2xl border border-orange-100 space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-500 text-white rounded-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-900">Kisaran Gaji</label>
              <p className="text-xs text-slate-500">Ketik angka saja, format Rupiah akan otomatis tersusun.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="block text-xs font-semibold text-slate-600 mb-1">Gaji Minimum (Contoh: 4000000)</span>
              <input
                type="text"
                value={minSalaryInput}
                onChange={handleMinSalaryChange}
                placeholder="4000000"
                className="w-full border border-slate-200 rounded-xl p-3 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition text-sm"
              />
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-600 mb-1">Gaji Maksimum (Contoh: 6000000)</span>
              <input
                type="text"
                value={maxSalaryInput}
                onChange={handleMaxSalaryChange}
                placeholder="6000000"
                className="w-full border border-slate-200 rounded-xl p-3 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition text-sm"
              />
            </div>
          </div>
          
          <div className="pt-2 border-t border-orange-200/60 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Pratinjau Tampilan Website:</span>
            <span className="font-bold text-orange-600 bg-orange-100/80 px-3 py-1 rounded-full">
              {formData.salary || "Belum diatur"}
            </span>
          </div>
        </div>

        {/* Lokasi & Tanggal Posting */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-800">Lokasi</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full border border-slate-200 rounded-xl p-3 text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-800">Tanggal Posting</label>
            <input
              type="date"
              value={formData.postedDate}
              onChange={(e) => setFormData({ ...formData, postedDate: e.target.value })}
              className="w-full border border-slate-200 rounded-xl p-3 text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition text-sm"
            />
          </div>
        </div>

        {/* URL Glints */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-800">URL Glints (Opsional)</label>
          <input
            type="text"
            value={formData.glintsUrl || ""}
            onChange={(e) => setFormData({ ...formData, glintsUrl: e.target.value })}
            placeholder="https://glints.com/id/opportunities/jobs/..."
            className="w-full border border-slate-200 rounded-xl p-3 text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition text-sm"
          />
        </div>

        {/* Deskripsi Pekerjaan */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-800">Deskripsi Pekerjaan</label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Tuliskan ringkasan atau gambaran umum mengenai peran ini..."
            className="w-full border border-slate-200 rounded-xl p-3 text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition text-sm"
          />
        </div>

        {/* Requirements Dynamic List */}
        <div className="space-y-3 pt-2">
          <label className="block text-sm font-bold text-slate-800">Kualifikasi (Requirements)</label>
          <div className="space-y-2">
            {formData.requirements.map((req, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={req}
                  onChange={(e) => handleArrayChange(idx, e.target.value, "requirements")}
                  placeholder={`Kualifikasi #${idx + 1}`}
                  className="flex-1 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                />
                <button
                  type="button"
                  onClick={() => removeArrayField(idx, "requirements")}
                  className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition border border-transparent hover:border-red-100 cursor-pointer"
                  title="Hapus kualifikasi"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => addArrayField("requirements")}
            className="inline-flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-bold bg-orange-50 hover:bg-orange-100/70 px-4 py-2 rounded-xl transition cursor-pointer"
          >
            <span>+ Tambah Kualifikasi</span>
          </button>
        </div>

        {/* Responsibilities Dynamic List */}
        <div className="space-y-3 pt-2">
          <label className="block text-sm font-bold text-slate-800">Tanggung Jawab (Responsibilities)</label>
          <div className="space-y-2">
            {formData.responsibilities.map((resp, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={resp}
                  onChange={(e) => handleArrayChange(idx, e.target.value, "responsibilities")}
                  placeholder={`Tanggung jawab #${idx + 1}`}
                  className="flex-1 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                />
                <button
                  type="button"
                  onClick={() => removeArrayField(idx, "responsibilities")}
                  className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition border border-transparent hover:border-red-100 cursor-pointer"
                  title="Hapus tanggung jawab"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => addArrayField("responsibilities")}
            className="inline-flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-bold bg-orange-50 hover:bg-orange-100/70 px-4 py-2 rounded-xl transition cursor-pointer"
          >
            <span>+ Tambah Tanggung Jawab</span>
          </button>
        </div>

        {/* Checkbox Tutup Lowongan */}
        <div className="flex items-center gap-3 pt-2 bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
          <input
            type="checkbox"
            id="isClosed"
            checked={formData.isClosed}
            onChange={(e) => setFormData({ ...formData, isClosed: e.target.checked })}
            className="h-5 w-5 text-orange-500 focus:ring-orange-400 border-slate-300 rounded cursor-pointer accent-orange-500"
          />
          <label htmlFor="isClosed" className="text-sm font-semibold text-slate-800 cursor-pointer select-none">
            Tutup Lowongan Ini <span className="text-xs font-normal text-slate-500">(Sembunyikan atau beri tanda tutup pada lowongan ini)</span>
          </label>
        </div>

        {/* Tombol Aksi Bawah */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={() => router.push("/admin/career")}
            className="px-6 py-3 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold text-sm transition text-center cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold text-sm transition shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-98 text-center cursor-pointer"
          >
            Simpan Lowongan
          </button>
        </div>

      </form>

      {/* Modal Notifikasi */}
      <NotificationModal
        isOpen={modalConfig.isOpen}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText="OK"
        onConfirm={() => {
          if (modalConfig.onConfirm) modalConfig.onConfirm();
          setModalConfig((prev) => ({ ...prev, isOpen: false }));
        }}
        onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
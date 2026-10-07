// src/app/admin/leads/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../../../lib/supabase";
import NotificationModal from "../../../component/ui/NotificationModal"; // Sesuaikan path import komponen modal Anda

export default function AdminLeadsPage() {
    interface LeadRow {
        id: number;
        unit_name?: string;
        visitor_name?: string;
        customer_name?: string;
        whatsapp_number?: string;
        marketing: string;
        source?: string;
        created_at: string;
        status?: string;
    }

    const [leads, setLeads] = useState<LeadRow[]>([]);
    const [marketingList, setMarketingList] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [marketingFilter, setMarketingFilter] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // State untuk kontrol NotificationModal
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        type: 'success' | 'danger' | 'warning' | 'info';
        title: string;
        message: string;
        confirmText?: string;
        cancelText?: string;
        onConfirm: () => void;
    }>({
        isOpen: false,
        type: 'info',
        title: '',
        message: '',
        onConfirm: () => { },
    });

    // Fetch data leads dari Supabase dan sinkronkan dengan daftar marketing
    const fetchLeads = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("leads")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;

            if (data) {
                setLeads(data);

                // Ambil daftar marketing yang pernah dihapus secara permanen dari localStorage
                const deletedMarketing: string[] = JSON.parse(localStorage.getItem("deleted_marketing_list") || "[]");

                // Ekstrak nama unik dari database, KECUALI yang sudah masuk daftar hapus (localStorage)
                const uniqueMarketing = Array.from(
                    new Set(
                        data
                            .map((lead: LeadRow) => lead.marketing)
                            .filter((mkt: string) => mkt && mkt.trim() !== "" && !deletedMarketing.includes(mkt))
                    )
                ) as string[];

                setMarketingList(uniqueMarketing);
            }
        } catch (err) {
            console.error("Error fetching leads:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // fetch-on-mount sekali saat halaman dibuka; perilaku disengaja dan tidak diubah
        void fetchLeads();
    }, [fetchLeads]);

    // Mengubah status prospek di database Supabase
    const handleStatusChange = async (id: number, newStatus: string) => {
        try {
            const { error } = await supabase
                .from("leads")
                .update({ status: newStatus })
                .eq("id", id);

            if (error) throw error;

            setLeads(leads.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
        } catch (err: unknown) {
            const errMessage = err instanceof Error ? err.message : 'Terjadi kesalahan yang tidak diketahui';
            setModalConfig({
                isOpen: true,
                type: 'danger',
                title: 'Gagal Memperbarui',
                message: `Gagal memperbarui status: ${errMessage}`,
                confirmText: 'Tutup',
                cancelText: '',
                onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false }))
            });
        }
    };

    // Mengubah penanggung jawab Marketing / PIC di database Supabase
    const handleMarketingChange = async (id: number, newMarketing: string) => {
        try {
            const { error } = await supabase
                .from("leads")
                .update({ marketing: newMarketing })
                .eq("id", id);

            if (error) throw error;

            const updatedLeads = leads.map(lead => lead.id === id ? { ...lead, marketing: newMarketing } : lead);
            setLeads(updatedLeads);
        } catch (err: unknown) {
            const errMessage = err instanceof Error ? err.message : 'Terjadi kesalahan yang tidak diketahui';
            setModalConfig({
                isOpen: true,
                type: 'danger',
                title: 'Gagal Memperbarui',
                message: `Gagal memperbarui marketing: ${errMessage}`,
                confirmText: 'Tutup',
                cancelText: '',
                onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false }))
            });
        }
    };

    // Fungsi untuk menghapus nama marketing agar "stuck" hilang dari pilihan
    const handleDeleteMarketing = (mktToDelete: string) => {
        setModalConfig({
            isOpen: true,
            type: 'danger',
            title: 'Hapus Marketing',
            message: `Apakah Anda yakin ingin menghapus "${mktToDelete}" dari daftar pilihan secara permanen? Nama ini tidak akan muncul lagi di pilihan dropdown.`,
            confirmText: 'Ya, Hapus',
            cancelText: 'Batal',
            onConfirm: () => {
                // Ambil data yang sudah pernah dihapus dari localStorage, lalu tambahkan yang baru
                const deletedMarketing: string[] = JSON.parse(localStorage.getItem("deleted_marketing_list") || "[]");
                if (!deletedMarketing.includes(mktToDelete)) {
                    deletedMarketing.push(mktToDelete);
                    localStorage.setItem("deleted_marketing_list", JSON.stringify(deletedMarketing));
                }

                // Perbarui state list lokal agar langsung hilang dari layar
                setMarketingList(marketingList.filter(mkt => mkt !== mktToDelete));

                if (marketingFilter === mktToDelete) {
                    setMarketingFilter("all");
                }

                setModalConfig({
                    isOpen: true,
                    type: 'success',
                    title: 'Berhasil',
                    message: `Marketing "${mktToDelete}" berhasil dihapus dan disembunyikan dari sistem.`,
                    confirmText: 'OK',
                    cancelText: '',
                    onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false }))
                });
            }
        });
    };

    // Fungsi untuk export ke file CSV / Spreadsheet
    const exportToCSV = () => {
        const headers = ["Proyek/Unit", "Nama Visitor", "Kontak / WhatsApp", "Marketing / PIC", "Sumber", "Waktu Masuk", "Status Prospek"];
        const rows = filteredLeads.map(lead => [
            `"${lead.unit_name || 'Tanya Unit Umum'}"`,
            `"${lead.visitor_name || lead.customer_name || 'Tanpa Nama'}"`,
            `"${lead.whatsapp_number || '-'}"`,
            `"${lead.marketing || 'Belum Ditugaskan'}"`,
            `"${lead.source || '-'}"`,
            `"${new Date(lead.created_at).toLocaleString("id-ID")}"`,
            `"${lead.status || 'baru'}"`
        ]);

        const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `data_leads_marketing_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Filter leads berdasarkan pencarian, status, marketing, dan rentang tanggal
    const filteredLeads = leads.filter((lead) => {
        const leadDate = new Date(lead.created_at).toISOString().split('T')[0];

        const matchesSearch =
            lead.unit_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.visitor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.whatsapp_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.source?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.marketing?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
        const matchesMarketing = marketingFilter === "all" || lead.marketing === marketingFilter;
        const matchesDate = (!startDate || leadDate >= startDate) && (!endDate || leadDate <= endDate);

        return matchesSearch && matchesStatus && matchesMarketing && matchesDate;
    });

    return (
        <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-12">

            {/* Header Halaman */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100 border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Kelola Leads & Distribusi Marketing</h1>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">
                        Kelola penugasan dan filter daftar marketing aktif.
                    </p>
                </div>
                <button
                    onClick={fetchLeads}
                    className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition shadow-lg flex items-center justify-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Muat Ulang
                </button>
            </div>

            {/* Bagian Manajemen Daftar Marketing (Tambah / Hapus) */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl shadow-slate-100 border border-slate-100 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Daftar Tim Marketing Aktif</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Kelola nama PIC atau tim marketing yang tersedia dalam sistem.</p>
                    </div>

                    {/* Form Tambah Marketing Inline yang Rapi */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <input
                            type="text"
                            id="inputNewMarketing"
                            placeholder="Nama marketing baru..."
                            className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 w-full sm:w-48 transition-all"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const inputEl = e.currentTarget;
                                    const trimmed = inputEl.value.trim();

                                    if (!trimmed) {
                                        setModalConfig({
                                            isOpen: true,
                                            type: 'warning',
                                            title: 'Perhatian',
                                            message: 'Nama marketing tidak boleh kosong.',
                                            confirmText: 'OK',
                                            cancelText: '',
                                            onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false }))
                                        });
                                        return;
                                    }

                                    if (!marketingList.includes(trimmed)) {
                                        setMarketingList([...marketingList, trimmed]);
                                        inputEl.value = "";
                                        setModalConfig({
                                            isOpen: true,
                                            type: 'success',
                                            title: 'Berhasil',
                                            message: `Marketing "${trimmed}" berhasil ditambahkan.`,
                                            confirmText: 'OK',
                                            cancelText: '',
                                            onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false }))
                                        });
                                    } else {
                                        setModalConfig({
                                            isOpen: true,
                                            type: 'warning',
                                            title: 'Peringatan',
                                            message: 'Marketing tersebut sudah ada dalam daftar.',
                                            confirmText: 'OK',
                                            cancelText: '',
                                            onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false }))
                                        });
                                    }
                                }
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => {
                                const inputEl = document.getElementById('inputNewMarketing') as HTMLInputElement;
                                if (inputEl) {
                                    const trimmed = inputEl.value.trim();
                                    if (!trimmed) {
                                        setModalConfig({
                                            isOpen: true,
                                            type: 'warning',
                                            title: 'Perhatian',
                                            message: 'Nama marketing tidak boleh kosong.',
                                            confirmText: 'OK',
                                            cancelText: '',
                                            onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false }))
                                        });
                                        return;
                                    }
                                    if (!marketingList.includes(trimmed)) {
                                        setMarketingList([...marketingList, trimmed]);
                                        inputEl.value = "";
                                        setModalConfig({
                                            isOpen: true,
                                            type: 'success',
                                            title: 'Berhasil',
                                            message: `Marketing "${trimmed}" berhasil ditambahkan.`,
                                            confirmText: 'OK',
                                            cancelText: '',
                                            onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false }))
                                        });
                                    } else {
                                        setModalConfig({
                                            isOpen: true,
                                            type: 'warning',
                                            title: 'Peringatan',
                                            message: 'Marketing tersebut sudah ada dalam daftar.',
                                            confirmText: 'OK',
                                            cancelText: '',
                                            onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false }))
                                        });
                                    }
                                }
                            }}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-md shadow-orange-500/20 shrink-0 flex items-center gap-1 cursor-pointer"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                            </svg>
                            Tambah
                        </button>
                    </div>
                </div>

                {/* List Badge / Pill Marketing */}
                <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
                    {marketingList.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">Belum ada marketing yang terdaftar di database.</p>
                    ) : (
                        marketingList.map((mkt) => (
                            <div
                                key={mkt}
                                className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 shadow-2xs transition-all"
                            >
                                <span>{mkt}</span>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteMarketing(mkt)}
                                    className="text-slate-400 hover:text-rose-600 transition p-0.5 rounded-md hover:bg-rose-50 cursor-pointer"
                                    title={`Hapus ${mkt}`}
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Filter, Search & Marketing Filter Bar */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl shadow-slate-100 border border-slate-100 flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="relative w-full lg:w-72">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        placeholder="Cari unit, nama, sumber..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                    />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                    {/* Filter Berdasarkan Marketing */}
                    <div className="w-full sm:w-auto flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500 shrink-0">Marketing:</span>
                        <select
                            value={marketingFilter}
                            onChange={(e) => setMarketingFilter(e.target.value)}
                            className="w-full sm:w-auto bg-slate-50 border border-slate-200 py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                        >
                            <option value="all">Semua Marketing</option>
                            {marketingList.map((mkt) => (
                                <option key={mkt} value={mkt}>{mkt}</option>
                            ))}
                        </select>
                    </div>

                    {/* Filter Status */}
                    <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                        {["all", "baru", "dihubungi", "closing", "gagal", "no respon"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-3 py-2 rounded-xl text-xs font-bold capitalize transition whitespace-nowrap ${statusFilter === status
                                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                            >
                                {status === "all" ? "Semua Status" : status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Filter Tanggal & Tombol Download Spreadsheet (CSV) */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl shadow-slate-100 border border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                        <span>Dari:</span>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                        />
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                        <span>Sampai:</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                        />
                    </div>
                    {(startDate || endDate) && (
                        <button
                            onClick={() => { setStartDate(""); setEndDate(""); }}
                            className="text-xs text-rose-500 font-bold hover:underline px-2"
                        >
                            Reset Tanggal
                        </button>
                    )}
                </div>

                <button
                    onClick={exportToCSV}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 shrink-0"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Spreadsheet (CSV)
                </button>
            </div>

            {/* Tabel Leads */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100 border border-slate-100 space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                        Data Prospek ({filteredLeads.length})
                    </h3>
                    <span className="text-xs font-semibold text-slate-400">
                        Real-time Database Sync
                    </span>
                </div>

                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-500">
                        <div className="w-6 h-6 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-xs font-medium animate-pulse">Memuat data leads...</p>
                    </div>
                ) : (
                    <div className="max-h-[500px] overflow-y-auto overflow-x-auto pr-1 custom-scrollbar rounded-2xl border border-slate-100">
                        <table className="w-full text-left border-collapse min-w-[1050px]">
                            <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-md z-10 shadow-xs">
                                <tr className="border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                                    <th className="py-3.5 px-4">Proyek / Unit</th>
                                    <th className="py-3.5 px-4">Nama Visitor</th>
                                    <th className="py-3.5 px-4">Kontak / WhatsApp</th>
                                    <th className="py-3.5 px-4">Sumber</th>
                                    <th className="py-3.5 px-4">Marketing / PIC</th>
                                    <th className="py-3.5 px-4">Waktu Masuk</th>
                                    <th className="py-3.5 px-4">Status Prospek</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-medium text-slate-700">
                                {filteredLeads.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-slate-400 italic">
                                            Tidak ada data leads yang ditemukan.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLeads.map((lead) => (
                                        <tr key={lead.id} className="hover:bg-slate-50/85 transition-colors">

                                            {/* Unit Name */}
                                            <td className="py-4 px-4">
                                                <div className="font-bold text-slate-900 flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                                                    {lead.unit_name || "Tanya Unit Umum"}
                                                </div>
                                            </td>

                                            {/* Nama Visitor */}
                                            <td className="py-4 px-4">
                                                <span className="font-semibold text-slate-800">
                                                    {lead.visitor_name || lead.customer_name || <span className="text-slate-400 italic font-normal">Tanpa Nama</span>}
                                                </span>
                                            </td>

                                            {/* WhatsApp / Phone */}
                                            <td className="py-4 px-4 font-mono text-xs text-slate-600">
                                                {lead.whatsapp_number ? (
                                                    <a
                                                        href={`https://wa.me/${lead.whatsapp_number.replace(/[^0-9]/g, '')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-200 font-bold transition"
                                                    >
                                                        {lead.whatsapp_number}
                                                    </a>
                                                ) : (
                                                    <span className="text-slate-400 italic">Tidak ada nomor</span>
                                                )}
                                            </td>

                                            {/* Sumber (Source) */}
                                            <td className="py-4 px-4 text-xs text-slate-500">
                                                <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-semibold">
                                                    {lead.source || "-"}
                                                </span>
                                            </td>

                                            {/* Dropdown Marketing / PIC */}
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <select
                                                        value={lead.marketing || ""}
                                                        onChange={(e) => handleMarketingChange(lead.id, e.target.value)}
                                                        className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                    >
                                                        {!marketingList.includes(lead.marketing) && lead.marketing && (
                                                            <option value={lead.marketing} className="text-rose-600 font-bold">
                                                                {lead.marketing} (Nonaktif)
                                                            </option>
                                                        )}

                                                        <option value="" disabled>Pilih Marketing</option>
                                                        {marketingList.map((mkt) => (
                                                            <option key={mkt} value={mkt}>{mkt}</option>
                                                        ))}
                                                    </select>

                                                    {lead.marketing && marketingList.includes(lead.marketing) && (
                                                        <button
                                                            onClick={() => handleDeleteMarketing(lead.marketing)}
                                                            className="text-slate-400 hover:text-rose-600 transition p-1 rounded-lg hover:bg-rose-50"
                                                            title={`Hapus / Nonaktifkan ${lead.marketing} dari daftar pilihan`}
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2.000 2.000 0 0116.138 21H7.862a2.000 2.000 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Created At */}
                                            <td className="py-4 px-4 text-slate-500 text-xs">
                                                {new Date(lead.created_at).toLocaleString("id-ID", {
                                                    dateStyle: "medium",
                                                    timeStyle: "short",
                                                })}
                                            </td>

                                            {/* Status Dropdown */}
                                            <td className="py-4 px-4">
                                                <select
                                                    value={lead.status || "baru"}
                                                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition cursor-pointer border ${lead.status === 'baru'
                                                        ? 'bg-orange-50 text-orange-700 border-orange-200'
                                                        : lead.status === 'dihubungi'
                                                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                            : lead.status === 'gagal'
                                                                ? 'bg-red-50 text-red-700 border-red-200'
                                                                : lead.status === 'no respon'
                                                                    ? 'bg-slate-100 text-slate-600 border-slate-200'
                                                                    : 'badge bg-emerald-50 text-emerald-700 border-emerald-200'
                                                        }`}
                                                >
                                                    <option value="baru">Baru</option>
                                                    <option value="dihubungi">Dihubungi</option>
                                                    <option value="closing">Closing</option>
                                                    <option value="gagal">Gagal</option>
                                                    <option value="no respon">No Respon</option>
                                                </select>
                                            </td>

                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Notification Modal Global */}
            <NotificationModal
                isOpen={modalConfig.isOpen}
                type={modalConfig.type}
                title={modalConfig.title}
                message={modalConfig.message}
                confirmText={modalConfig.confirmText}
                cancelText={modalConfig.cancelText}
                onConfirm={modalConfig.onConfirm}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
            />

        </div>
    );
}
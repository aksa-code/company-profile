"use client";

import { useEffect } from "react";
import { supabase } from "../../lib/supabase";

const ADMIN_EMAILS = ["skylandnusantara@gmail.com"];

// Batas tunggu cek admin. Tracking TIDAK BOLEH diblokir oleh pengecekan
// auth yang menggantung/bermasalah — kalau lewat batas ini, anggap bukan
// admin dan tetap catat (fail-open; risikonya hanya 1 baris admin kehitung).
const AUTH_CHECK_TIMEOUT_MS = 3000;

// Fungsi sederhana untuk membuat ID unik acak
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export default function VisitorTracker() {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // 1. CEK URL SAAT INI: Jika di area admin, batalkan
        if (window.location.pathname.startsWith("/admin")) {
          return;
        }

        // 2. Cek user admin yang sedang login (cadangan) — TANPA memblokir
        // tracking. getUser() dilombakan dengan timeout: kalau auth menggantung
        // atau error, anggap bukan admin dan tetap catat kunjungan.
        let isAdmin = false;
        try {
          const authCheck = supabase.auth.getUser().then(
            ({ data }) => data.user?.email ?? null,
            () => null
          );
          const timeout = new Promise<null>((resolve) =>
            setTimeout(() => resolve(null), AUTH_CHECK_TIMEOUT_MS)
          );
          const email = await Promise.race([authCheck, timeout]);
          isAdmin = !!email && ADMIN_EMAILS.includes(email);
        } catch {
          isAdmin = false;
        }

        if (isAdmin) {
          return;
        }

        // 3. Cek apakah visitor ini sudah pernah dicatat di sesi browser ini
        const hasRecordedSession = sessionStorage.getItem("visitor_recorded");
        if (hasRecordedSession) {
          // Jika sudah dicatat sebelumnya di sesi ini, hentikan (tidak insert lagi ke DB)
          return;
        }

        // 4. Cek atau Buat Visitor ID di Session Storage
        let visitorId = sessionStorage.getItem("visitor_session_id");
        
        if (!visitorId) {
          visitorId = generateUUID();
          sessionStorage.setItem("visitor_session_id", visitorId);
        }

        // 5. Catat ke database HANYA SEKALI untuk setiap sesi browser baru
        const { error } = await supabase.from("page_views").insert([
          { 
            page_url: window.location.pathname, // Menyimpan halaman pertama yang mereka buka
            visitor_id: visitorId, 
            created_at: new Date().toISOString()
          }
        ]);

        if (!error) {
          // Tandai di session storage bahwa visitor ini sudah berhasil dicatat
          sessionStorage.setItem("visitor_recorded", "true");
        }

      } catch (err) {
        console.error("Gagal mencatat traffic pengunjung:", err);
      }
    };

    trackVisitor();
  }, []);

  return null;
}
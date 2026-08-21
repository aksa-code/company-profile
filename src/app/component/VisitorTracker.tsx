// src/components/VisitorTracker.tsx
"use client";

import { useEffect } from "react";
import { supabase } from "../../lib/supabase"; // Sesuaikan path relatif lib supabase Anda

export default function VisitorTracker() {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // 1. Cek user yang sedang aktif login di Supabase Auth
        const { data: { user } } = await supabase.auth.getUser();

        // 2. Daftar email admin yang ingin dikecualikan dari perhitungan trafik
        const adminEmails = ["skylandnusantara@gmail.com"];

        // 3. Jika user yang aktif adalah admin, batalkan pencatatan
        if (user && adminEmails.includes(user.email || "")) {
          return;
        }

        // 4. Jika bukan admin (pengunjung biasa), catat trafik ke database
        await supabase.from("page_views").insert([
          { 
            page_url: window.location.pathname,
            created_at: new Date().toISOString()
          }
        ]);
      } catch (err) {
        console.error("Gagal mencatat traffic pengunjung:", err);
      }
    };

    trackVisitor();
  }, []);

  return null; // Komponen ini tidak merender elemen visual apa pun
}
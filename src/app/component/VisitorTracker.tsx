// src/components/VisitorTracker.tsx
"use client";

import { useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function VisitorTracker() {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // 1. CEK URL SAAT INI: Jika sedang berada di area admin, batalkan pencatatan mutlak!
        if (window.location.pathname.startsWith("/admin")) {
          return;
        }

        // 2. Cek user yang sedang aktif login di Supabase Auth (cadangan)
        const { data: { user } } = await supabase.auth.getUser();
        const adminEmails = ["skylandnusantara@gmail.com"];

        if (user && adminEmails.includes(user.email || "")) {
          return;
        }

        // 3. Jika bukan halaman admin dan bukan admin, catat trafik ke database
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

  return null;
}
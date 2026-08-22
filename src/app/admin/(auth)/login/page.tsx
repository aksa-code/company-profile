// src/app/admin/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../../../lib/supabase"; // Sesuaikan path relatif ke file supabase.ts Anda

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // State untuk Notifikasi / Feedback UI interaktif
  const [notification, setNotification] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({
    show: false,
    type: "success",
    message: "",
  });

  // Otomatis hilangkan notifikasi setelah 4 detik
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        // Set cookie manual agar terbaca oleh middleware Anda
        document.cookie = `sb-access-token=${data.session.access_token}; path=/; max-age=86400; SameSite=Lax`;
        
        setNotification({
          show: true,
          type: "success",
          message: "Login berhasil! Mengalihkan ke dashboard...",
        });

        // Redirect manual ke dashboard setelah jeda singkat
        setTimeout(() => {
          window.location.href = "/admin/dashboard";
        }, 1000);
      }
    } catch (err: any) {
      setLoading(false);
      setNotification({
        show: true,
        type: "error",
        message: err.message || "Gagal masuk. Periksa kembali email dan password Anda.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-700 relative overflow-hidden">
        
        {/* Komponen Notifikasi / Toast Interaktif */}
        <AnimatePresence>
          {notification.show && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 p-3 rounded-xl text-xs font-medium flex items-center justify-between shadow-lg backdrop-blur-md ${
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

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Skyland Admin</h1>
          <p className="text-slate-400 text-sm mt-1">Silakan masuk untuk mengelola konten</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
            <input
              type="email"
              required
              suppressHydrationWarning
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@skyland.com"
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              suppressHydrationWarning
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              suppressHydrationWarning
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 cursor-pointer flex items-center justify-center"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Masuk ke Dashboard"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
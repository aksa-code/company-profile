// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import VisitorTracker from "../app/component/VisitorTracker"; // Import komponen tracker yang baru dibuat

// Menggunakan font Inter dari Next.js Google Fonts
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skyland Property Nusantara | Properti & Hunian Terbaik di Malang",
  description: "Temukan hunian impian dan proyek perumahan unggulan bersama Skyland Property Nusantara di Malang, Jawa Timur.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className={`${inter.className} min-h-full flex flex-col`}>
        {/* Jalankan pelacak pengunjung secara otomatis di seluruh halaman */}
        <VisitorTracker />
        {children}
      </body>
    </html>
  );
}
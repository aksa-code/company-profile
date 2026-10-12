// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import VisitorTracker from "../app/component/VisitorTracker";
import MetaPixel from "../app/component/MetaPixel";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Domain utama website Anda
const baseUrl = "https://skylandnusantara.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),

  title: {
    default: "Skyland Property Nusantara | Properti & Hunian Terbaik di Malang",
    template: "%s | Skyland Property Nusantara",
  },

  description:
    "Temukan hunian impian dan proyek perumahan unggulan bersama Skyland Property Nusantara di Malang, Jawa Timur.",

  keywords: [
    "Skyland Property Nusantara",
    "Properti Malang",
    "Rumah Murah Malang",
    "Perumahan Malang",
    "Jual Rumah Malang",
    "Investasi Properti Malang",
  ],

  authors: [{ name: "Skyland Property Nusantara" }],

  alternates: {
    canonical: baseUrl,
  },

  openGraph: {
    title: "Skyland Property Nusantara | Properti & Hunian Terbaik di Malang",
    description:
      "Temukan hunian impian dan proyek perumahan unggulan bersama Skyland Property Nusantara di Malang, Jawa Timur.",
    url: baseUrl,
    siteName: "Skyland Property Nusantara",
    images: [
      {
        url: "/images/preview.jpg",
        width: 1200,
        height: 572,
        alt: "Skyland Property Nusantara Banner",
      },
    ],
    locale: "id_ID",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Skyland Property Nusantara | Properti & Hunian Terbaik di Malang",
    description:
      "Temukan hunian impian dan proyek perumahan unggulan bersama Skyland Property Nusantara di Malang, Jawa Timur.",
    images: ["/images/preview.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  return (
    <html lang="id">
      <body className={inter.variable}>
        <MetaPixel />
        <VisitorTracker />
        {children}
        {pixelId ? (
          <noscript>
            {/* wajib <img> mentah sesuai kode resmi Meta Pixel */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        ) : null}
      </body>
    </html>
  );
}

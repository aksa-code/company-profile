import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF/WebP jauh lebih kecil dari JPEG asli Supabase -> hemat egress.
    formats: ["image/avif", "image/webp"],
    // TTL cache optimizer Vercel: kurangi fetch ulang ke origin Supabase.
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qvxwvdzsdffpyjjqnguw.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // Menambahkan pengalihan otomatis dari URL lama ke halaman baru
  async redirects() {
    return [
      // Dialihkan semua tautan yang diawali /tag/... ke /news
      {
        source: '/tag/:path*',
        destination: '/',
        permanent: true, // Status HTTP 301 (Permanent Redirect)
      },
    ];
  },
};

export default nextConfig;
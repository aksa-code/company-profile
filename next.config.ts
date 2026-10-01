import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
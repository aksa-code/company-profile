import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Rampingkan impor barrel agar tree-shaking lebih agresif.
    optimizePackageImports: ["framer-motion"],
  },

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

  // Header keamanan baseline untuk semua route. Disengaja tanpa CSP ketat:
  // CSP penuh berisiko memblokir Meta Pixel, Supabase, dan inline script
  // Next.js tanpa pengujian ekstensif — 4 header di bawah ini aman.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  // Menambahkan pengalihan otomatis dari URL lama ke halaman baru
  async redirects() {    return [
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
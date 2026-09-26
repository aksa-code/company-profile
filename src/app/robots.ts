// src/app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // Menyembunyikan halaman admin dari Google
    },
    // Wajib sertakan https:// di depan domain
    sitemap: 'https://skylandnusantara.com/sitemap.xml', 
  }
}
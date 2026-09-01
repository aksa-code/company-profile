import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // Menyembunyikan halaman admin dari Google
    },
    sitemap: 'https://domain-bosmu.com/sitemap.xml', // Nanti ganti domainnya
  }
}
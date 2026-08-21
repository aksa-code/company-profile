import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Cek jika rute yang diakses adalah area admin (kecuali halaman login admin itu sendiri)
  const isAdminRoute = path.startsWith("/admin") && path !== "/admin/login";

  // Periksa apakah ada cookie otentikasi dari Supabase (berawalan 'sb-' dan berakhiran '-auth-token')
  const allCookies = request.cookies.getAll();
  const hasSupabaseSession = allCookies.some(
    (cookie) => cookie.name.startsWith("sb-") && cookie.name.endsWith("-auth-token")
  );

  // Jika mencoba akses halaman admin tapi belum login/tidak ada sesi Supabase, arahkan ke login
  if (isAdminRoute && !hasSupabaseSession) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

// Konfigurasi rute mana saja yang dipantau middleware
export const config = {
  matcher: "/admin/:path*",
};
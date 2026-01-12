import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  detectLocaleFromAcceptLanguage,
  getLocaleFromPath,
  normalizePath,
  removeLocaleFromPath,
} from "@/lib/i18n/utils";
import { defaultLocale, locales, type Locale } from "@/lib/i18n/config";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip localization for API routes, static files, and Next.js internals
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/sitemap") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|eot)$/i)
  ) {
    return NextResponse.next();
  }

  // Handle admin routes (preserve existing logic)
  if (pathname.startsWith("/admin")) {
    // Protect admin routes (except login)
    if (pathname !== "/admin/login") {
      const session = request.cookies.get("admin_session");

      if (!session) {
        // Redirect to login if not authenticated
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    }

    // Redirect to dashboard if already logged in and trying to access login
    if (pathname === "/admin/login") {
      const session = request.cookies.get("admin_session");
      if (session) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
    }

    // Admin routes don't need locale handling
    const response = NextResponse.next();
    response.headers.set("x-pathname", pathname);
    return response;
  }

  // Get locale from URL if present
  const localeFromPath = getLocaleFromPath(pathname);
  
  // Get locale from cookie
  const cookieLocale = request.cookies.get("locale")?.value;
  const localeFromCookie = cookieLocale && locales.includes(cookieLocale as Locale)
    ? (cookieLocale as Locale)
    : null;

  // Determine target locale
  let targetLocale: Locale;
  
  if (localeFromPath) {
    // URL already has a locale
    targetLocale = localeFromPath;
    
    // Update cookie if it doesn't match or is missing
    if (localeFromCookie !== targetLocale) {
      const response = NextResponse.next();
      response.cookies.set("locale", targetLocale, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: "/",
        sameSite: "lax",
      });
      response.headers.set("x-pathname", pathname);
      return response;
    }
  } else {
    // No locale in URL - need to determine and redirect
    // Priority: cookie → Accept-Language → default
    if (localeFromCookie) {
      targetLocale = localeFromCookie;
    } else {
      const acceptLanguage = request.headers.get("accept-language");
      targetLocale = detectLocaleFromAcceptLanguage(acceptLanguage);
    }

    // Normalize path with locale
    const normalizedPath = normalizePath(pathname, targetLocale);
    
    // Create redirect response
    const response = NextResponse.redirect(new URL(normalizedPath, request.url));
    
    // Set cookie with detected locale
    response.cookies.set("locale", targetLocale, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
      sameSite: "lax",
    });
    
    return response;
  }

  // Continue with the request
  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt, sitemap.xml (SEO files)
     * - static files (images, fonts, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap).*)",
  ],
};


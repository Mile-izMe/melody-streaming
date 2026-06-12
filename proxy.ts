import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale, type Locale } from "@/i18n/config";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (!pathnameHasLocale) {
    const cookieLocale = request.cookies.get("locale")?.value as Locale;
    const locale = locales.includes(cookieLocale)
      ? cookieLocale
      : defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }

  // Protected routes
  const token = request.cookies.get("token");
  const isProtected = ["/upload"].some((p) => pathname.includes(p));
  if (isProtected && !token) {
    const locale = pathname.split("/")[1];
    const url = new URL(`/${locale}/login`, request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};

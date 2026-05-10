import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, getPathLocale, isLocale, localeCookieName, stripLocalePrefix, type AppLocale } from "@/i18n/config";

const MEMBER_ROUTES = ["/portal/profile", "/portal/events", "/dashboard", "/profile", "/community", "/my-events"];
const ADMIN_ROUTES = ["/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/_next") || pathname.includes(".") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const prefixedLocale = getPathLocale(pathname);
  const cookieLocale = request.cookies.get(localeCookieName)?.value;
  const acceptLanguage = request.headers.get("accept-language") || "";

  if (!prefixedLocale && cookieLocale === "en") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = pathname === "/" ? "/en" : `/en${pathname}`;
    return NextResponse.redirect(redirectUrl);
  }

  if (!prefixedLocale && !isLocale(cookieLocale) && acceptLanguage.toLowerCase().startsWith("en")) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = pathname === "/" ? "/en" : `/en${pathname}`;
    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set(localeCookieName, "en", { path: "/", sameSite: "lax", maxAge: 31536000 });
    return response;
  }

  const locale: AppLocale = prefixedLocale || (isLocale(cookieLocale) ? cookieLocale : defaultLocale);
  const cleanPathname = stripLocalePrefix(pathname);
  const sessionCookie = request.cookies.get("session")?.value;

  if (!sessionCookie) {
    if (MEMBER_ROUTES.some((route) => cleanPathname.startsWith(route)) || ADMIN_ROUTES.some((route) => cleanPathname.startsWith(route))) {
      return NextResponse.redirect(new URL(locale === "en" ? "/en/login" : "/login", request.url));
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-sta-locale", locale);

  const response =
    prefixedLocale === "en"
      ? NextResponse.rewrite(new URL(`${cleanPathname}${request.nextUrl.search}`, request.url), { request: { headers: requestHeaders } })
      : NextResponse.next({ request: { headers: requestHeaders } });

  response.cookies.set(localeCookieName, locale, { path: "/", sameSite: "lax", maxAge: 31536000 });
  return response;
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"]
};

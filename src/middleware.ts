import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME, AuthUser } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve auth session cookie
  const cookie = request.cookies.get(AUTH_COOKIE_NAME);
  let user: AuthUser | null = null;

  if (cookie?.value) {
    try {
      user = JSON.parse(cookie.value);
    } catch {
      user = null;
    }
  }

  // Route: /admin (Only role 'admin' allowed)
  if (pathname.startsWith("/admin")) {
    if (!user) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname);
      url.searchParams.set("reason", "unauthorized");
      return NextResponse.redirect(url);
    }

    if (user.role !== "admin") {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname);
      url.searchParams.set("reason", "forbidden_admin");
      return NextResponse.redirect(url);
    }
  }

  // Route: /scanner (Only role 'petugas' or 'admin' allowed)
  if (pathname.startsWith("/scanner")) {
    if (!user) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname);
      url.searchParams.set("reason", "unauthorized");
      return NextResponse.redirect(url);
    }

    if (user.role !== "petugas" && user.role !== "admin") {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname);
      url.searchParams.set("reason", "forbidden_scanner");
      return NextResponse.redirect(url);
    }
  }

  // Route: /login (If already logged in, redirect to respective dashboard)
  if (pathname === "/login" && user) {
    const redirectParam = request.nextUrl.searchParams.get("redirect");
    if (redirectParam && redirectParam.startsWith("/")) {
      // Check if user has permission for that redirect
      if (redirectParam.startsWith("/admin") && user.role === "admin") {
        return NextResponse.redirect(new URL(redirectParam, request.url));
      }
      if (redirectParam.startsWith("/scanner")) {
        return NextResponse.redirect(new URL(redirectParam, request.url));
      }
    }

    // Default destination based on role
    if (user.role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    } else {
      return NextResponse.redirect(new URL("/scanner", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/scanner/:path*", "/login"],
};

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { User } from "lucia";
import { RouteForCheck } from "./lib/constant";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const origin = req.nextUrl.origin;

  const sessionCookie = req.cookies.get("auth_session");

  if (sessionCookie) {
    const verifyRequest = await fetch(`${origin}/api/lucia`, {
      headers: { Cookie: cookies().toString() },
    });

    const { user } = (await verifyRequest.json()) as { user: User | null };

    if (!user) {
      url.pathname = "/signin";
      return NextResponse.redirect(url);
    }

    // Cek akses berdasarkan ROUTES
    const currentPath = url.pathname;
    const route = RouteForCheck.find((r) => currentPath.startsWith(r.path));

    if (route && !route.roles.includes(user.role)) {
      return NextResponse.redirect(new URL("/forbidden", url));
    }
  } else {
    // Jika tidak ada session cookie, redirect ke halaman signin
    if (!url.pathname.startsWith("/signin")) {
      url.pathname = "/signin";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/signin"],
};

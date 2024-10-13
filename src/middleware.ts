import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { User } from "lucia";

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

    if (
      // url.pathname.startsWith("/app/tables") ||
      url.pathname.startsWith("/app/table") ||
      url.pathname.startsWith("/app/users")
    ) {
      if (user.role !== "ADMIN") {
        return Response.redirect(new URL("/forbidden", url), 302);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

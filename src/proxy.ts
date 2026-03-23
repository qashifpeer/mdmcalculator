import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request });
  const isLoggedIn = !!token;
  const { pathname } = request.nextUrl;

  // Public paths (login, static, api auth)
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  const protectedPaths = [
    "/meals-entry",
    "/income-received",
    "/rice-received",
    "/input-rates",
    "/meals-import",
    "/rates",
    "/",
  ];

  const isProtected = protectedPaths.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );

  if (isProtected && !isLoggedIn) {
    // Just send to /login, no callbackUrl
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
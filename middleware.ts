import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

function verifyToken(token: string): boolean {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return false;
  try {
    const expected = createHmac("sha256", secret)
      .update("admin_authenticated")
      .digest("hex");
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Dejar pasar la página de login y las rutas de API de auth
  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/api/admin/login") ||
    pathname.startsWith("/api/admin/logout")
  ) {
    return NextResponse.next();
  }

  // Proteger todo /admin
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("admin_session")?.value ?? "";
    if (!token || !verifyToken(token)) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

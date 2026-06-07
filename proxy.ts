import { NextRequest, NextResponse } from "next/server";

async function verifyToken(token: string): Promise<boolean> {
  const secret = process.env.SESSION_SECRET;
  // Fail closed: sin secreto configurado nadie puede autenticarse
  if (!secret || secret.length < 32) return false;

  // Formato del token: "{expiry}.{hmac_hex}"
  const dot = token.lastIndexOf(".");
  if (dot === -1) return false;

  const expiryStr = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expiry = Number(expiryStr);

  if (!Number.isFinite(expiry) || Date.now() > expiry) return false;

  const payload = `admin:${expiryStr}`;
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const expected = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Comparación en tiempo constante para prevenir timing attacks
  if (sig.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) {
    diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/api/admin/login") ||
    pathname.startsWith("/api/admin/logout")
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("admin_session")?.value ?? "";
    const valid = token ? await verifyToken(token) : false;
    if (!valid) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

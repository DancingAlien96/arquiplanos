import { NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

function signToken(payload: string): string {
  const secret = process.env.SESSION_SECRET!;
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function verifyToken(token: string): boolean {
  const expected = signToken("admin_authenticated");
  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  const validUser = process.env.ADMIN_USER ?? "admin";
  const validPass = process.env.ADMIN_PASSWORD ?? "";

  if (username !== validUser || password !== validPass) {
    return Response.json({ error: "Credenciales incorrectas" }, { status: 401 });
  }

  const token = signToken("admin_authenticated");

  const response = Response.json({ ok: true });
  response.headers.set(
    "Set-Cookie",
    `admin_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 8}`
  );

  return response;
}

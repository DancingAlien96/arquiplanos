import { NextRequest } from "next/server";
import { createHmac } from "crypto";

function signToken(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be set to a strong random value of at least 32 characters");
  }
  const expiry = Date.now() + 8 * 60 * 60 * 1000; // 8 horas
  const payload = `admin:${expiry}`;
  const sig = createHmac("sha256", secret).update(payload).digest("hex");
  return `${expiry}.${sig}`;
}

export async function POST(request: NextRequest) {
  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  const { username, password } = body;
  const validUser = process.env.ADMIN_USER ?? "admin";
  const validPass = process.env.ADMIN_PASSWORD ?? "";

  if (!username || !password || username !== validUser || password !== validPass) {
    return Response.json({ error: "Credenciales incorrectas" }, { status: 401 });
  }

  let token: string;
  try {
    token = signToken();
  } catch {
    return Response.json({ error: "Configuración del servidor incorrecta" }, { status: 500 });
  }

  const response = Response.json({ ok: true });
  response.headers.set(
    "Set-Cookie",
    `admin_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 8}`
  );

  return response;
}

import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, AuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get(AUTH_COOKIE_NAME);

  if (!cookie || !cookie.value) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  try {
    const user: AuthUser = JSON.parse(cookie.value);
    return NextResponse.json({ authenticated: true, user });
  } catch {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { authenticate, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username dan password wajib diisi" },
        { status: 400 }
      );
    }

    const user = authenticate(username, password);

    if (!user) {
      return NextResponse.json(
        { error: "Username atau password salah" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user,
    });

    // Store user session in cookie
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: JSON.stringify(user),
      httpOnly: false, // readable by client & middleware
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

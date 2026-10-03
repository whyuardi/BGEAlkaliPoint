import { store, generateId, generateToken } from "@/lib/store";
import type { User } from "@/lib/store";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, area } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Nama dan nomor HP wajib diisi" },
        { status: 400 }
      );
    }

    // Check if phone already registered
    const existing = store.users.find((u) => u.phone === phone);
    if (existing) {
      return NextResponse.json(
        { error: "Nomor HP sudah terdaftar", user: existing },
        { status: 409 }
      );
    }

    const user: User = {
      id: generateId(),
      name: name.trim(),
      phone: phone.trim(),
      area: (area || "").trim(),
      qrToken: generateToken(),
      createdAt: new Date().toISOString(),
    };

    store.users.push(user);

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get("phone");
  const token = searchParams.get("token");

  if (token) {
    const user = store.users.find((u) => u.qrToken === token);
    if (!user) {
      return NextResponse.json(
        { error: "Token tidak ditemukan" },
        { status: 404 }
      );
    }
    return NextResponse.json({ user });
  }

  if (phone) {
    const user = store.users.find((u) => u.phone === phone);
    if (!user) {
      return NextResponse.json(
        { error: "Pengguna tidak ditemukan" },
        { status: 404 }
      );
    }
    return NextResponse.json({ user });
  }

  // Return all users (for admin)
  return NextResponse.json({ users: store.users });
}

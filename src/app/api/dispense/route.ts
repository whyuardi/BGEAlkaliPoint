import {
  store,
  generateId,
  hasDispensedToday,
  getTodayStats,
} from "@/lib/store";
import type { DispenseLog } from "@/lib/store";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { qrToken, boothId } = body;

    if (!qrToken) {
      return NextResponse.json(
        { error: "QR Token diperlukan" },
        { status: 400 }
      );
    }

    // Find user by QR token
    const user = store.users.find((u) => u.qrToken === qrToken);
    if (!user) {
      return NextResponse.json(
        { error: "Pengguna tidak ditemukan. QR tidak valid." },
        { status: 404 }
      );
    }

    // Check if already dispensed today
    const existingLog = hasDispensedToday(user.id);
    if (existingLog) {
      const time = new Date(existingLog.timestamp).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return NextResponse.json(
        {
          error: `${user.name} sudah mengambil jatah hari ini pada pukul ${time} WIB`,
          alreadyDispensed: true,
          dispensedAt: existingLog.timestamp,
          user: { name: user.name, phone: user.phone },
        },
        { status: 409 }
      );
    }

    // Create dispense log
    const log: DispenseLog = {
      id: generateId(),
      userId: user.id,
      userName: user.name,
      userPhone: user.phone,
      liters: 2,
      boothId: boothId || "BOOTH-01",
      timestamp: new Date().toISOString(),
    };

    store.dispenseLogs.push(log);

    return NextResponse.json({
      success: true,
      message: `✅ Berhasil! ${user.name} mendapat 2 Liter air alkali`,
      log,
      user: { name: user.name, phone: user.phone },
    });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "stats") {
    const stats = getTodayStats();
    return NextResponse.json({ stats });
  }

  if (action === "check") {
    const token = searchParams.get("token");
    if (!token) {
      return NextResponse.json(
        { error: "Token diperlukan" },
        { status: 400 }
      );
    }
    const user = store.users.find((u) => u.qrToken === token);
    if (!user) {
      return NextResponse.json(
        { error: "Pengguna tidak ditemukan" },
        { status: 404 }
      );
    }
    const dispensed = hasDispensedToday(user.id);
    return NextResponse.json({
      user: { name: user.name, phone: user.phone, area: user.area },
      hasDispensedToday: !!dispensed,
      dispensedAt: dispensed?.timestamp || null,
    });
  }

  // Return all logs (for admin), newest first
  const logs = [...store.dispenseLogs].reverse();
  return NextResponse.json({ logs });
}
